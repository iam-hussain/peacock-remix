import type { LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { toast } from "react-toastify";
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
import { prisma } from "~/db.server";
import { responseData } from "~/helpers/utils";
import { useEffect } from "react";
import { getIsLoggedIn } from "~/session.server";
import { getUserFindFirst } from "~/models/user.server";

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

export async function action({ request }: any) {
  try {
    const formData = await request.formData();
    const id = Number(formData.get("id") || 0);

    await prisma.user.delete({
      where: {
        id,
      },
    });
    return responseData({
      success: true,
      message: "vendorDeleted",
      data: { id },
    });
  } catch (err) {
    console.error(err);
    return responseData({
      success: false,
      message: "vendorDeleteError",
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
          <Form method="post">
            <input name="id" defaultValue={user.id} className="hidden" />
            <p className="text-center font-normal text-neutral">
              Are you sure you wanna delete
              <br />
              <span className="uppercase text-secondary">
                {user.firstName} {user.lastName} - ID:{user.id}{" "}
              </span>
              ?
            </p>

            <div className="col-span-full mt-4 flex justify-between gap-2 align-middle ">
              <Link to={`/vendor`} className="btn btn-outline btn-sm px-6">
                Cancel
              </Link>
              <button type="submit" className="btn btn-error btn-sm px-6">
                Delete
              </button>
            </div>
          </Form>
        </div>
      </dialog>
    </>
  );
}
