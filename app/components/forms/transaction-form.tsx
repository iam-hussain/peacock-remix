import { Link, Form } from "@remix-run/react";
import { useRemixForm } from "remix-hook-form";
import classNames from "classnames";
import configContext from "~/config/configContext";
import { yupResolver } from "@hookform/resolvers/yup";
import type * as yup from "yup";

import { TextInput, SelectInput, DatePickerInput } from "../inputs";
import { useEffect, useState } from "react";
import type { getUserSelect } from "~/models/user.server";
import type { findOneTransaction } from "~/models/transaction.server";

const { transaction: transactionConfig, schema } = configContext;

type FormData = yup.InferType<typeof schema.transaction>;

const key = {
  sender: "Person sending money",
  receiver: "Person receiving money",
  exit: "Person going out of club",
};

function TransactionForm({
  className,
  userSelect,
  transaction,
  cancelPath,
}: {
  className: string;
  userSelect: Awaited<ReturnType<typeof getUserSelect>>;
  transaction?: Awaited<ReturnType<typeof findOneTransaction>>;
  cancelPath?: string;
}) {
  const id = transaction?.id || 0;
  const usersOptions = userSelect
    .filter((e) => !e.deleted)
    .map((e) => [e.id, `${e.firstName} ${e.lastName}`, e.type]);

  const memberOptions = usersOptions.filter((e) => e[2] === "MEMBER");
  const vendorOptions = usersOptions.filter((e) => e[2] === "VENDOR");

  const [fromToOptions, setFromToOptions] = useState([
    usersOptions,
    usersOptions,
  ]);
  const [fromToNote, setFromToNote] = useState([key.sender, key.receiver]);
  const isEditMode = transaction && Object.values(transaction).length;

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
    setValue,
  } = useRemixForm<FormData | any>({
    resolver: yupResolver(schema.transaction),
    mode: "onSubmit",
    defaultValues: isEditMode ? transaction : { dot: new Date() },
  });

  const selectedMode = watch("mode");
  const selectedFrom = watch("from");
  const selectedTo = watch("to");

  useEffect(() => {
    if (isEditMode && selectedMode === transaction.mode) {
      setValue("from", transaction.from);
      setValue("to", transaction.to);
    } else {
      const fromExist = fromToOptions[0].find(
        ([key]) => key === Number(selectedFrom)
      );
      const toExist = fromToOptions[1].find(
        ([key]) => key === Number(selectedTo)
      );

      if (!fromExist) {
        setValue("from", fromToOptions[0][0][0]);
      }

      if (!toExist) {
        setValue("to", fromToOptions[1][0][0]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromToOptions, isEditMode, transaction]);

  useEffect(() => {
    if (
      [
        "MEMBERS_PERIODIC_DEPOSIT",
        "MEMBERS_WITHDRAW",
        "NEW_MEMBER_PAST_TALLY",
        "INTER_CASH_TRANSFER",
        "MEMBERS_WITHDRAW_PROFIT",
        "MEMBERS_REPAY_PROFIT",
      ].includes(selectedMode)
    ) {
      setFromToOptions([memberOptions, memberOptions]);
    } else if (
      ["OTHER_EXPENDITURE", "VENDOR_PERIODIC_INVEST", "VENDOR_INVEST"].includes(
        selectedMode
      )
    ) {
      setFromToOptions([memberOptions, vendorOptions]);
    } else if (
      ["VENDOR_PERIODIC_RETURN", "VENDOR_RETURN"].includes(selectedMode)
    ) {
      setFromToOptions([vendorOptions, memberOptions]);
    } else {
      setFromToOptions([usersOptions, usersOptions]);
    }

    if (["MEMBERS_WITHDRAW_PROFIT"].includes(selectedMode)) {
      setFromToNote([key.sender, key.exit]);
    } else {
      setFromToNote([key.sender, key.receiver]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMode]);

  return (
    <div
      className={classNames(
        "relative flex min-w-0 flex-col break-words rounded-md bg-white bg-clip-border",
        {
          [className]: Boolean(className),
        }
      )}
    >
      <div className="bg-white pb-0">
        <div className="mb-2 flex items-center justify-between align-middle">
          <h6 className="text-neutral">
            {id ? "Edit" : "Add"} Transaction{" "}
            <span className="text-secondary">{id ? ` - ID:${id}` : ""}</span>
          </h6>
        </div>
      </div>

      <Form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 items-center justify-center gap-4 px-0 pb-2 pt-0 align-middle lg:grid-cols-6"
      >
        <input
          name="id"
          className="hidden"
          defaultValue={transaction?.id || 0}
        />

        <SelectInput
          title="Transaction Mode"
          className="col-span-1 lg:col-span-4"
          options={Object.entries(transactionConfig.mode)}
          register={register}
          name="mode"
          errors={errors}
        />

        <DatePickerInput
          title="Date of Transaction"
          className="col-span-1 lg:col-span-2"
          name="dot"
          errors={errors}
          control={control}
          register={undefined}
        />

        <SelectInput
          title={`Transaction From <span class="text-xs text-slate-500">(${fromToNote[0]})</span>`}
          className="col-span-1 lg:col-span-3"
          options={fromToOptions[0] as [string, string][]}
          register={register}
          {...register("from")}
          name="from"
          errors={errors}
        />

        <SelectInput
          title={`Transaction To <span class="text-xs text-slate-500">(${fromToNote[1]})</span>`}
          className="col-span-1 lg:col-span-3"
          options={fromToOptions[1] as [string, string][]}
          register={register}
          name="to"
          errors={errors}
        />

        <TextInput
          title="Amount"
          className="col-span-1 lg:col-span-3"
          placeholder="1000"
          register={register}
          name="amount"
          type="string"
          errors={errors}
        />

        <SelectInput
          title="Method"
          className="col-span-1 lg:col-span-3"
          options={Object.entries(transactionConfig.method).sort((a, b) =>
            a[1] > b[1] ? 1 : -1
          )}
          register={register}
          name="method"
          errors={errors}
        />

        <TextInput
          title="Note"
          className="col-span-1 lg:col-span-6"
          placeholder="Some message..."
          register={register}
          name="note"
          errors={errors}
        />

        <div className="col-span-full mt-4 flex justify-between gap-2 align-middle">
          <Link
            to={cancelPath ? cancelPath : "/transaction"}
            className="btn btn-outline btn-sm px-6"
          >
            Cancel
          </Link>
          <button type="submit" className="btn btn-primary btn-sm px-6">
            Submit
          </button>
        </div>
      </Form>
    </div>
  );
}

export default TransactionForm;
