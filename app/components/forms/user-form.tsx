import { Link, Form } from "@remix-run/react";
import { useRemixForm } from "remix-hook-form";
import classNames from "classnames";
import configContext from "~/config/configContext";
import { yupResolver } from "@hookform/resolvers/yup";
import type * as yup from "yup";

import { DatePickerInput, SelectInput, TextInput } from "../inputs";
import type { getUserById } from "~/models/user.server";
import type { User } from "@prisma/client";

const { schema, user: userConfig } = configContext;

type FormData = yup.InferType<typeof schema.user>;

function UserForm({
  className,
  user,
  type = "MEMBER",
}: {
  className: string;
  user?: Awaited<ReturnType<typeof getUserById>>;
  type?: User["type"];
}) {
  const id = user?.id || 0;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useRemixForm<FormData | any>({
    resolver: yupResolver(schema.user),
    mode: "onSubmit",
    defaultValues: user && Object.values(user).length ? user : {},
  });
  const isMember = Boolean(type === "MEMBER");

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
            {id ? "Edit" : "Add"} {isMember ? "Member" : "Vendor"}{" "}
            <span className="text-secondary">{id ? ` - ID:${id}` : ""}</span>
          </h6>
        </div>
      </div>

      <Form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 items-center justify-center gap-4 px-0 pb-2 pt-0 align-middle lg:grid-cols-6"
      >
        <input name="id" className="hidden" defaultValue={user?.id || 0} />

        <TextInput
          title={isMember ? "First Name" : "Title"}
          className="col-span-1 lg:col-span-3"
          placeholder={isMember ? "Enter first name" : "Enter the title"}
          register={register}
          name="firstName"
          errors={errors}
        />

        <TextInput
          title={isMember ? "Last Name" : "Tag"}
          className="col-span-1 lg:col-span-3"
          placeholder={isMember ? "Enter last name" : "Enter tag name"}
          register={register}
          name="lastName"
          errors={errors}
        />

        <TextInput
          title="Email"
          className="col-span-1 lg:col-span-3"
          placeholder="Enter Email ID"
          register={register}
          name="email"
          errors={errors}
        />

        <TextInput
          title="Mobile Number"
          className="col-span-1 lg:col-span-3"
          placeholder="Enter mobile number"
          register={register}
          name="mobileNumber"
          errors={errors}
        />

        <DatePickerInput
          title="Date of Join"
          className="col-span-1 lg:col-span-3"
          name="joinedAt"
          errors={errors}
          control={control}
          register={undefined}
        />

        {!isMember && (
         <>
          <SelectInput
            title="Vendor Type"
            className="col-span-1 lg:col-span-3"
            options={Object.entries(userConfig.vendorType)}
            register={register}
            name="vendorType"
            errors={errors}
          />
          <SelectInput
            title="Vendor Status"
            className="col-span-1 lg:col-span-3"
            options={Object.entries(userConfig.isActive)}
            register={register}
            name="isActive"
            errors={errors}
          />
        </>
        )}

        <div className="col-span-full mt-4 flex justify-between gap-2 align-middle">
          <Link
            to={isMember ? "/member" : "/vendor"}
            className="btn-outline btn-sm btn px-6"
          >
            Cancel
          </Link>
          <button type="submit" className="btn-primary btn-sm btn px-6">
            Submit
          </button>
        </div>
      </Form>
    </div>
  );
}

export default UserForm;
