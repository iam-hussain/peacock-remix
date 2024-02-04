import { cssBundleHref } from "@remix-run/css-bundle";
import type { V2_MetaFunction } from "@remix-run/node";
import type { LinksFunction } from "@remix-run/node";
import { Links, LiveReload, Meta, Outlet, Scripts } from "@remix-run/react";
import "react-datepicker/dist/react-datepicker.css";

import stylesheet from "~/tailwind.css";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Peacock Club" },
    {
      property: "og:title",
      content: "Peacock Club",
    },
    {
      name: "description",
      content: "Creating the environment for business",
    },
  ];
};

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export default function App() {
  return (
    <html lang="en" className="h-full w-full" data-theme="myTheme">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full w-full bg-base-100 bg-transparent font-body text-base font-normal leading-default text-neutral-500 antialiased">
        <Outlet />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
