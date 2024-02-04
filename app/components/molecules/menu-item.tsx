import classNames from "classnames";
import { Link, useMatches } from "@remix-run/react";
import type { Icons } from "../svg/icon";
import Icon from "../svg/icon";

interface MenuItemProps {
  hed: string;
  pathName: string;
  iconName: keyof typeof Icons;
  onClick: Function;
  type?: string;
}

function MenuItem({
  hed,
  pathName,
  iconName,
  onClick,
  type,
  ...props
}: MenuItemProps) {
  const matches = useMatches();

  const isActive = matches.length > 2 && matches[2].pathname === pathName;

  if (type === "submit") {
    return (
      <button
        type="submit"
        className="ease-nav-brand mx-4 my-0 flex items-center whitespace-nowrap rounded-lg px-4 py-2.7 text-sm font-medium text-slate-700 transition-colors"
        onClick={() => onClick()}
        {...props}
      >
        <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white stroke-0 p-1.5 text-center shadow-soft-2xl xl:p-2">
          <Icon name={iconName} color={isActive ? "primary" : "slate"} />
        </div>
        <span
          className={classNames(
            "text-md pointer-events-none ml-1 font-medium opacity-100 duration-300 ease-soft",
            { "font-semibold text-white": isActive },
            { "text-slate-600": !isActive }
          )}
        >
          {hed}
        </span>
      </button>
    );
  }

  return (
    <Link
      className={classNames(
        "ease-nav-brand mx-4 my-0 flex items-center whitespace-nowrap rounded-lg px-4 py-2.7 text-sm text-slate-700 transition-colors",
        {
          "bg-primary font-semibold shadow-soft-xl": isActive,
        },
        { "font-medium": !isActive }
      )}
      to={{
        pathname: pathName,
      }}
      onClick={() => onClick()}
      {...props}
    >
      <div
        className={classNames(
          "mr-2 flex h-8 w-8 items-center justify-center rounded-lg stroke-0 p-1.5 text-center shadow-soft-2xl xl:p-2",
          { "bg-white": isActive },
          { "bg-white": !isActive }
        )}
      >
        <Icon name={iconName} color={isActive ? "primary" : "slate"} />
      </div>
      <span
        className={classNames(
          "text-md pointer-events-none ml-1 font-medium opacity-100 duration-300 ease-soft",
          { "font-semibold text-white": isActive },
          { "text-slate-600": !isActive }
        )}
      >
        {hed}
      </span>
    </Link>
  );
}

export default MenuItem;
