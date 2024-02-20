import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { unstable_createFileUploadHandler } from "@remix-run/node";
import { json, redirect, unstable_parseMultipartFormData } from "@vercel/remix";
import { toast } from "react-toastify";
import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";
import { getIsLoggedIn } from "~/session.server";
import { getUserFindFirst, uploadAvatar } from "~/models/user.server";
import { useEffect } from "react";

export const loader = async ({ request, params }: LoaderArgs) => {
  const isLoggedIn = await getIsLoggedIn(request);
  if (!isLoggedIn) {
    return redirect("/vendor");
  }
  const id = Number(params.id || 0);

  const user = await getUserFindFirst(id, "VENDOR");
  if (!user) {
    return redirect("/vendor");
  }

  return json({
    user,
  });
};

export const action = async ({ request, params }: ActionArgs) => {
  const id = Number(params.id);
  const directory = `${process.cwd()}/public/image`;

  const uploadHandler = unstable_createFileUploadHandler({
    directory,
    file: ({ filename }) => {
      const name = filename.split(".");
      return `upload_${new Date().getTime()}.${name[name.length - 1]}`;
    },
    maxPartSize: 50_000_000,
  });

  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler
  );

  const file = formData.get("avatar") as File;

  return await uploadAvatar(id, file, directory);
};

export default function TransactionAddPage() {
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <>
      <dialog id="my_modal_1" className="modal bg-[#97acc1a3]" open>
        <div className="modal-box flex flex-col items-center justify-center gap-4 bg-white align-middle">
          <div className="flex flex-col items-center justify-center align-middle">
            <div className="mb-2 text-center">
              <p className="m-0 p-0 text-center text-sm font-normal text-neutral">
                Choose a image and upload to change the avatar image
              </p>
            </div>
            <img
              src={`/image/${user.avatar}`}
              className="m-0 inline-flex h-52 w-52 items-center justify-center rounded-xl border-2 text-sm text-white transition-all duration-200 ease-soft-in-out"
              alt="user1"
            />
            <div className="text-center">
              <p className="m-0 p-0 text-neutral">
                {user.firstName} {user.lastName} - {user.id}
              </p>
            </div>
          </div>
          <Form method="post" encType="multipart/form-data">
            <input
              type="text"
              className="hidden"
              name="existingAvatar"
              value={user.avatar || ""}
            />
            <input
              type="file"
              name="avatar"
              accept="image/*"
              className="file-input-bordered file-input-accent file-input w-full max-w-xs"
            />
            <div className="col-span-full mt-6 flex justify-between gap-2 align-middle ">
              <Link to={`/vendor`} className="btn-outline btn-sm btn px-6">
                Close
              </Link>
              <button type="submit" className="btn-success btn-sm btn px-6">
                Upload
              </button>
            </div>
          </Form>
        </div>
      </dialog>
    </>
  );
}
