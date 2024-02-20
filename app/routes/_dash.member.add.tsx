import { yupResolver } from "@hookform/resolvers/yup";
import type * as yup from "yup";
import type { LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@vercel/remix";
import { toast } from "react-toastify";
import { useActionData, useNavigate } from "@remix-run/react";
import { getValidatedFormData } from "remix-hook-form";
import { prisma } from "~/db.server";
import {
  getValidateUniqueKey,
  responseData,
  getValidDate,
} from "~/helpers/utils";
import configContext from "~/config/configContext";
import { useEffect } from "react";
import { getIsLoggedIn } from "~/session.server";
import UserForm from "~/components/forms/user-form";
import { getVendors } from "~/models/user.server";

const { schema } = configContext;
type FormData = yup.InferType<typeof schema.user>;

export const loader = async ({ request }: LoaderArgs) => {
  const isLoggedIn = await getIsLoggedIn(request);
  if (!isLoggedIn) {
    return redirect("/member");
  }
  return json({});
};

export async function action({ request }: any) {
  try {
    const { errors, data } = await getValidatedFormData<FormData>(
      request,
      yupResolver(schema.user) as any
    );

    if (errors) {
      return responseData({ errors, success: false, message: "default" });
    }

    const user = {
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      email: data.email || "",
      mobileNumber: data.mobileNumber || "",
      nickName: getValidateUniqueKey(`${data.firstName}_${data.lastName}`),
      avatar: "no_image_available.jpeg",
      type: "MEMBER",
      joinedAt: getValidDate(data.joinedAt),
    } as unknown as any;

    const vendors = await getVendors();

    const created = await prisma.user.create({
      data: {
        ...user,
        passbook: {
          create: {
            entryOf: "USER",
          },
        },
        memberInterLinks: {
          createMany: {
            data: vendors.map((e) => ({
              vendorId: e.id,
              includeProfit: !e.deleted,
            })),
          },
        },
      },
    });
    return responseData({
      success: true,
      message: "memberCreated",
      data: created,
    });
  } catch (err) {
    console.error(err);
    return responseData({
      success: false,
      message: "memberCreateError",
    });
  }
}

export default function MemberAddPage() {
  const navigate = useNavigate();

  const data = useActionData<typeof action>();

  useEffect(() => {
    if (data?.message) {
      if (data?.success) {
        toast.success(data?.message);
      } else {
        toast.error(data?.message);
      }
    }
    if (data?.success) {
      navigate("/member");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <>
      <dialog id="my_modal_1" className="modal bg-[#97acc1a3]" open>
        <div className="modal-box bg-white">
          <UserForm className="z-990 p-0" />
        </div>
      </dialog>
    </>
  );
}
