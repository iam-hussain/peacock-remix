import { yupResolver } from "@hookform/resolvers/yup";
import type * as yup from "yup";
import type { LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@vercel/remix";
import { toast } from "react-toastify";
import {
  useActionData,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";
import { getValidatedFormData } from "remix-hook-form";
import TransactionForm from "~/components/forms/transaction-form";
import { prisma } from "~/db.server";
import { getValidDate, responseData } from "~/helpers/utils";
import { getUserSelect } from "~/models/user.server";
import configContext from "~/config/configContext";
import type { Transaction } from "@prisma/client";
import { useEffect } from "react";
import { getIsLoggedIn } from "~/session.server";

const { schema } = configContext;
type FormData = yup.InferType<typeof schema.transaction>;

export const loader = async ({ request }: LoaderArgs) => {
  const isLoggedIn = await getIsLoggedIn(request);
  if (!isLoggedIn) {
    return redirect("/transaction");
  }
  const userSelect = await getUserSelect();
  return json({
    userSelect,
  });
};

export async function action({ request }: any) {
  try {
    const { errors, data } = await getValidatedFormData<FormData>(
      request,
      yupResolver(schema.transaction) as any
    );

    if (errors) {
      return responseData({ errors, success: false, message: "default" });
    }

    let type = "DEPOSIT";

    if (data.mode === "INTER_CASH_TRANSFER") {
      type = "TRANSFER";
    }

    if (
      [
        "MEMBERS_WITHDRAW",
        "MEMBERS_WITHDRAW_PROFIT",
        "VENDOR_PERIODIC_INVEST",
        "VENDOR_INVEST",
        "OTHER_EXPENDITURE",
      ].includes(data.mode)
    ) {
      type = "WITHDRAWAL";
    }

    const transaction = {
      mode: data.mode,
      dot: getValidDate(data.dot),
      fromId: Number(data.from),
      toId: Number(data.to),
      amount: Number(data.amount) || 0,
      method: data.method || "ACCOUNT",
      note: data.note || "",
      type,
    } as unknown as Transaction;

    const created = await prisma.transaction.create({
      data: {
        ...transaction,
      },
    });
    return responseData({
      success: true,
      message: "transactionCreated",
      data: created,
    });
  } catch (err) {
    console.error(err);
    return responseData({
      success: false,
      message: "transactionCreateError",
    });
  }
}

export default function TransactionAddPage() {
  const [searchParams] = useSearchParams({});
  const navigate = useNavigate();

  const { userSelect } = useLoaderData<typeof loader>();
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
          <TransactionForm
            className="z-990 p-0"
            userSelect={userSelect}
            cancelPath={`/transaction?${searchParams.toString()}`}
          />
        </div>
      </dialog>
    </>
  );
}
