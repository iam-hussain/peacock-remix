import PropTypes from "prop-types";
import type { Icons } from "../svg/icon";
import Icon from "../svg/icon";
import classNames from "classnames";

export interface StatProps {
  hed: string | number;
  dek: string | number;
  highlight?: string;
  iconName: keyof typeof Icons;
  theme?: "default" | "ghost";
  iconPlacement?: "end" | "start" | "none";
  align?: "start" | "center" | "end" | "between";
  hedColor?:
    | "secondary"
    | "primary"
    | "accent"
    | "neutral"
    | "base"
    | "success"
    | "info"
    | "error";
  className?: string;
}

const Stat = ({
  hed,
  dek,
  highlight,
  iconName,
  theme = "default",
  iconPlacement = "end",
  align = "between",
  hedColor = "secondary",
  className = "",
}: StatProps) => {
  return (
    <div className="w-full max-w-full">
      <div
        className={classNames(
          "relative flex min-w-0 flex-col break-words rounded-md bg-white",
          {
            "shadow-soft-md": theme === "default",
          },
          className
        )}
      >
        <div
          className={classNames("flex gap-4", {
            "px-4 py-3": theme === "default",
            "justify-start text-left": align === "start",
            "justify-end text-right": align === "end",
            "justify-center": align === "center",
            "justify-between": align === "between",
          })}
        >
          {iconPlacement === "start" ? (
            <div
              className={`inline-flex h-12 w-12 justify-center rounded-lg bg-base-200 text-center align-middle `}
            >
              <div className="m-auto h-8 w-8">
                <Icon name={iconName} color="slate" className="h-6 w-6" />
              </div>
            </div>
          ) : (
            <></>
          )}
          <div className="w-auto flex-none">
            <div
              className={classNames({
                "text-left": align === "start",
                "text-right": align === "end",
                "text-center": align === "center",
              })}
            >
              <p className="mb-0 text-xs font-semibold leading-normal text-slate-500">
                {hed}
              </p>
              <h5 className={`text-1xl text-${hedColor} mb-0 font-bold`}>
                {dek}
                {highlight && (
                  <span className="font-weight-bolder ml-2 text-sm leading-normal text-lime-500">
                    {highlight}
                  </span>
                )}
              </h5>
            </div>
          </div>
          {iconPlacement === "end" ? (
            <div
              className={`inline-flex h-12 w-12 justify-center rounded-lg bg-base-200 text-center align-middle `}
            >
              <div className="m-auto h-8 w-8">
                <Icon name={iconName} color="slate" className="h-6 w-6" />
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

Stat.propTypes = {
  hed: PropTypes.string,
  dek: PropTypes.string,
  highlight: PropTypes.string,
  iconName: PropTypes.string,
};

export default Stat;
