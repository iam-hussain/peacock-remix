import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@vercel/remix";

import { logout } from "~/session.server";

export const action = async ({ request }: ActionArgs) => logout(request);

export const loader = async () => redirect("/");
