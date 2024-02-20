import type { LoaderArgs } from "@remix-run/node";
import { json } from "@vercel/remix";
import { Outlet, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import NavBar from "~/components/organisms/nav-bar";
import SideBar from "~/components/organisms/side-bar";
import { commitSession, getIsLoggedIn, getSession } from "~/session.server";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const loader = async ({ request }: LoaderArgs) => {
  const session = await getSession(request);
  const toastMessage = session.get("toastMessage") || null;
  const toastType = session.get("toastType") || null;
  const isLoggedIn = await getIsLoggedIn(request);

  return json(
    {
      isLoggedIn,
      toastMessage,
      toastType,
    },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  );
};

export default function DashTemplate() {
  const {
    isLoggedIn,
    toastMessage,
    toastType = "default",
  } = useLoaderData<typeof loader>();
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    if (toastMessage) {
      toast(toastMessage, { type: toastType });
    }
  }, [toastMessage, toastType]);

  return (
    <>
      <ToastContainer position="bottom-right" autoClose={8000} />
      <div className="fixed left-0 right-0 top-0 -z-100 h-full w-full bg-gradient-to-tr from-base-100 to-blue-100"></div>
      <SideBar isOpen={isOpen} setOpen={setOpen} isLoggedIn={isLoggedIn} />
      <main className="relative h-full transition-all duration-200 ease-soft-in-out md:px-6 lg:mb-0 xl:ml-[300px]">
        <NavBar isOpen={isOpen} setOpen={setOpen} />

        <div className="mx-auto flex w-full flex-col gap-8 p-6 pt-4">
          <Outlet />
        </div>
      </main>
    </>
  );
}
