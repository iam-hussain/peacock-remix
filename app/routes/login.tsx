import { json } from "@vercel/remix";
import { Form, Link, useActionData } from "@remix-run/react";
import configContext from "~/config/configContext";
import { login } from "~/session.server";

export async function action({ request }: any) {
  const password = process.env.ADMIN_PASSWORD;
  const formData = await request.formData();
  if (formData.get("password") === password) {
    return await login(request);
  }
  return json({
    success: false,
    message: configContext.message.invalidPassword,
  });
}

export default function Index() {
  const data = useActionData<typeof action>();
  return (
    <div className="h-full w-full select-none bg-gradient-to-tr from-base-100 to-emerald-50">
      <div className="m-auto flex h-full w-full max-w-lg flex-col items-center justify-center gap-6 px-6 align-middle">
        <div className="flex flex-col items-center justify-center">
          <h1 className="font-brand text-4xl uppercase tracking-normal sm:text-5xl">
            Peacock Club
          </h1>
          <p className="font-core text-xs uppercase text-slate-700">
            Creating the environment for business
          </p>
        </div>

        <Form method="post" className="flex w-full flex-col">
          <div className="form-control relative mb-2 w-full">
            <input
              name="password"
              type={"password"}
              placeholder={"Enter the password"}
              className="input-bordered input w-full"
            />
            {data?.message && (
              <label className="label absolute bottom-[-28px] right-0">
                <span className="label-text-alt text-error">
                  {data?.message}
                </span>
              </label>
            )}
          </div>

          <div className="col-span-full mt-4 flex w-full flex-col justify-between gap-2 align-middle">
            <button type="submit" className="btn-primary btn-md btn px-6">
              Login
            </button>
            <Link to={"/home"} className="btn-outline btn-md btn px-6">
              Cancel
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
}
