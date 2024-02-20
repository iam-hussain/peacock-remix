import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@vercel/remix";
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
import { getIsLoggedIn } from "~/session.server";
import { getUserFindFirst } from "~/models/user.server";
import { responseData } from "~/helpers/utils";
import { useRemixForm } from "remix-hook-form";
import {
  getInterLinkObject,
  setInterLinkObject,
} from "~/models/inter-link.server";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import classNames from "classnames";

export const loader = async ({ request, params }: LoaderArgs) => {
  const isLoggedIn = await getIsLoggedIn(request);
  if (!isLoggedIn) {
    return redirect("/vendor");
  }
  const id = Number(params.id || 0);

  const vendor = await getUserFindFirst(id, "VENDOR");
  if (!vendor) {
    return redirect("/vendor");
  }

  const { membersValue, members } = await getInterLinkObject(id);

  return json({
    vendor,
    members,
    membersValue,
  });
};

export const action = async ({ request, params }: ActionArgs) => {
  try {
    const id = Number(params.id) || 0;
    const formData = await request.formData();
    const data = formData.get("formData");

    const parsedData = JSON.parse(data as any);

    await setInterLinkObject(id, parsedData as any);

    return responseData({
      success: true,
      message: "transactionEdited",
      data: { id },
    });
  } catch (err) {
    console.error(err);
    return responseData({
      success: false,
      message: "transactionEditError",
    });
  }
};

export default function TransactionAddPage() {
  const [fetchDeleted, setFetchDeleted] = useState(false);
  const { members, vendor, membersValue } = useLoaderData<typeof loader>();

  const data = useActionData<typeof action>();
  const navigate = useNavigate();

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

  const { register, handleSubmit } = useRemixForm<FormData | any>({
    mode: "onSubmit",
    defaultValues: membersValue,
  });

  return (
    <>
      <dialog id="my_modal_1" className="modal bg-[#97acc1a3]" open>
        <div className="modal-box bg-white">
          <h6 className="text-center font-normal text-slate-500">
            Select users are included to the vendor profit
          </h6>
          <div className="mx-3 mb-5 flex justify-between border-b-2 border-primary">
            <h5 className="text-center text-primary">
              {vendor.firstName} {vendor.lastName}{" "}
              <span className="text-slate-600">({vendor.id})</span>
            </h5>
            <label className="label cursor-pointer justify-center gap-2">
              <span className="label-text">With Deleted</span>
              <input
                type="checkbox"
                className="toggle-primary toggle"
                onChange={(e: any) => setFetchDeleted(e.target.checked)}
              />
            </label>
          </div>

          <Form
            method="post"
            className="flex h-full w-full flex-col px-2"
            onSubmit={handleSubmit}
          >
            <div className="grid w-full grow grid-cols-1 gap-x-4 gap-y-2 lg:grid-cols-2">
              {members.map((e, i) => (
                <div
                  className={classNames("form-control col-span-1 border-b-2", {
                    hidden: !fetchDeleted && Boolean(e.member.deleted),
                  })}
                  key={i}
                >
                  <label className="label flex cursor-pointer gap-3">
                    <span
                      className={classNames("label-text", {
                        "text-error": e.member.deleted,
                      })}
                    >
                      {e.member.id} - {e.member.firstName} {e.member.lastName}
                    </span>
                    <input
                      type="checkbox"
                      // name={e.id.toString()}
                      className="toggle-secondary toggle"
                      {...register(e.member.id.toString())}
                    />
                  </label>
                </div>
              ))}
            </div>
            <div className="col-span-full mt-4 flex justify-between gap-2 align-middle">
              <Link to={"/vendor"} className="btn-outline btn-sm btn px-6">
                Cancel
              </Link>
              <button type="submit" className="btn-primary btn-sm btn px-6">
                Submit
              </button>
            </div>
          </Form>
        </div>
      </dialog>
    </>
  );
}
