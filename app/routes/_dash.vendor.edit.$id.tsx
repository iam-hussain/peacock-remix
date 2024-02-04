import { yupResolver } from "@hookform/resolvers/yup";
import type * as yup from "yup";
import type { LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { toast } from "react-toastify";
import { useActionData, useLoaderData, useNavigate } from "@remix-run/react";
import { getValidatedFormData } from "remix-hook-form";
import { prisma } from "~/db.server";
import { getValidDate, responseData } from "~/helpers/utils";
import configContext from "~/config/configContext";
import { useEffect } from "react";
import { getIsLoggedIn } from "~/session.server";
import UserForm from "~/components/forms/user-form";
import { getUserFindFirst } from "~/models/user.server";

const { schema } = configContext;
type FormData = yup.InferType<typeof schema.user>;

export const loader = async ({ request, params }: LoaderArgs) => {
  const isLoggedIn = await getIsLoggedIn(request);
  if (!isLoggedIn) {
    return redirect("/vendor");
  }
  const user = await getUserFindFirst(Number(params.id || 0), "VENDOR");
  if (!user) {
    return redirect("/vendor");
  }

  return json({
    user: {
      id: user.id,
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      mobileNumber: user.mobileNumber || "",
      vendorType: user.vendorType,
      joinedAt: user.joinedAt,
      isActive: user.isActive ? "ACTIVE" : "INACTIVE",
    },
  });
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

    const id = Number(data?.id || 0);
    const user = {
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      email: data.email || "",
      mobileNumber: data.mobileNumber || "",
      vendorType: data.vendorType || "DEFAULT",
      joinedAt: getValidDate(data.joinedAt),
      isActive: data.isActive === "ACTIVE",
    } as unknown as any;

    await prisma.user.update({
      data: {
        ...user,
      },
      where: {
        id,
      },
    });
    return responseData({
      success: true,
      message: "memberCreated",
      data: { id },
    });
  } catch (err) {
    console.error(err);
    return responseData({
      success: false,
      message: "memberCreateError",
    });
  }
}

export default function TransactionAddPage() {
  const navigate = useNavigate();

  const { user } = useLoaderData<typeof loader>();
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
      navigate("/vendor");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <>
      <dialog id="my_modal_1" className="modal bg-[#97acc1a3]" open>
        <div className="modal-box bg-white">
          <UserForm className="z-990 p-0" user={user as any} type="VENDOR" />
        </div>
      </dialog>
    </>
  );
}
