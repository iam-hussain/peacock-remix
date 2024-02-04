import classNames from "classnames";
import type { getActiveVendorsWithSummary } from "~/models/user.server";

function VendorCard({
  vendors,
}: {
  vendors: Awaited<ReturnType<typeof getActiveVendorsWithSummary>>;
}) {
  return (
    <div className="relative flex h-full w-full flex-col break-words rounded-md border-0 border-solid border-black/12.5 bg-white bg-clip-border shadow-soft-xl">
      <div className="mb-0 rounded-t-2xl border-b-0 border-solid border-black/12.5 bg-white p-6 pb-0">
        <h6 className="text-neutral">Monthly Dues</h6>
      </div>
      <div className="flex-auto p-6">
        {vendors.map((vendor, i) => (
          <div
            key={i}
            className={classNames("relative m-0 px-0 py-4", {
              "border-b-2 border-b-slate-100": vendors.length !== i + 1,
            })}
          >
            <div className="relative flex w-auto justify-between pt-1.4 lg:max-w-120">
              <div className="flex flex-col items-start justify-end">
                <h6 className="mb-0 flex flex-col text-sm font-semibold leading-normal text-slate-800 lg:flex-row">
                  {vendor.firstName}
                </h6>
                <span className="m-0 text-xs font-semibold leading-tight text-slate-500">
                  {vendor.lastName}
                </span>
              </div>
              <div className="flex flex-col items-end justify-end uppercase">
                <h6 className="m-0 text-xs font-semibold leading-tight text-slate-600">
                  {`${vendor.dueAmount > 0 ? `${vendor.dueAmount$} / ` : ""}${
                    vendor.monthDiff
                  } month`}
                </h6>
                <h6 className="mb-0 text-sm font-semibold leading-normal text-secondary">
                  {vendor.nextDue}
                </h6>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VendorCard;
