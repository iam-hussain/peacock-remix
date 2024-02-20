import type { LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@vercel/remix";
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";
import { useEffect } from "react";
import { prisma } from "~/db.server";
import { responseData } from "~/helpers/utils";
import { toast } from "react-toastify";
import { getIsLoggedIn } from "~/session.server";

export const loader = async ({ request, params }: LoaderArgs) => {
  const isLoggedIn = await getIsLoggedIn(request);
  if (!isLoggedIn) {
    return redirect("/transaction");
  }
  const id = Number(params.id || 0);
  if (!id || id === 0) {
    return redirect("/transaction");
  }
  return json({
    id: Number(params.id || 0),
  });
};

export async function action({ request }: any) {
  try {
    const formData = await request.formData();
    const id = Number(formData.get("id") || 0);

    await prisma.transaction.delete({
      where: {
        id,
      },
    });
    return responseData({
      success: true,
      message: "transactionDeleted",
      data: { id },
    });
  } catch (err) {
    console.error(err);
    return responseData({
      success: false,
      message: "transactionDeleteError",
    });
  }
}

export default function TransactionPage() {
  const [searchParams] = useSearchParams({});
  const navigate = useNavigate();

  const { id } = useLoaderData<typeof loader>();
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
      navigate(`/transaction?${searchParams.toString()}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <>
      <dialog id="my_modal_1" className="modal bg-[#97acc1a3]" open>
        <div className="modal-box bg-white">
          <Form method="post">
            <input name="id" defaultValue={id} className="hidden" />
            <p className="text-center font-normal text-neutral">
              Are you sure you wanna delete the transaction <br />
              <span className="text-secondary">ID:{id}</span>?
            </p>

            <div className="col-span-full mt-4 flex justify-between gap-2 align-middle ">
              <Link
                to={`/transaction?${searchParams.toString()}`}
                className="btn btn-outline btn-sm px-6"
              >
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
