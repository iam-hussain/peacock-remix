import type { LoaderArgs } from "@remix-run/node";
import { json } from "@vercel/remix";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import classNames from "classnames";
import { useMemo, useState } from "react";
import Icon from "~/components/svg/icon";
import { getVendorsWithSummary } from "~/models/user.server";
import { getIsLoggedIn } from "~/session.server";

export const loader = async ({ request }: LoaderArgs) => {
  const isLoggedIn = await getIsLoggedIn(request);
  const items = await getVendorsWithSummary();
  return json({
    all: items,
    active: items.filter((e) => !e.deleted),
    isLoggedIn,
  });
};

export default function VendorPage() {
  const [fetchDeleted, setFetchDeleted] = useState(false);
  const { all, active, isLoggedIn } = useLoaderData<typeof loader>();

  const items = useMemo(() => {
    return fetchDeleted ? all : active;
  }, [all, active, fetchDeleted]);

  return (
    <div className="flex h-full w-full flex-col gap-3">
      <Outlet />
      <div className="flex flex-wrap">
        <div className="w-full max-w-full flex-none">
          <div className="relative mb-6 flex min-w-0 flex-col break-words rounded-md border-0 border-solid border-transparent bg-white bg-clip-border shadow-soft-xl">
            <div className="border-b-solid mb-0 rounded-t-2xl border-b-0 border-b-transparent bg-white p-6 pb-0">
              <div className="mb-2 flex flex-wrap items-center justify-between align-middle">
                <h6 className="mx-0 my-auto text-neutral">Vendor Table</h6>
                {isLoggedIn && (
                  <div className="flex items-center justify-center">
                    <button
                      className={classNames(
                        "btn btn-square btn-ghost hover:bg-white hover:fill-secondary",
                        {
                          "fill-red-500": fetchDeleted,
                          "fill-slate-500": !fetchDeleted,
                        }
                      )}
                      onClick={() => setFetchDeleted(!fetchDeleted)}
                    >
                      <Icon name="deleted" className="h-6 w-6" />
                    </button>
                    <Link
                      className="btn btn-square btn-ghost stroke-slate-500 hover:bg-white hover:stroke-secondary"
                      to={{
                        pathname: `/vendor/add`,
                      }}
                    >
                      <Icon name="add-box" className="h-6 w-6" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
            <div className="flex-auto px-0 pb-2 pt-0">
              <div className="overflow-x-auto p-0">
                <table className="table mb-0 w-full items-center border-gray-200 align-top text-slate-500">
                  <thead className="px-4 align-bottom">
                    <tr>
                      <th className="border-b-solid whitespace-nowrap border-b border-gray-200 bg-transparent px-5 py-3 text-left align-middle text-xxs font-bold uppercase tracking-none text-slate-500 opacity-70 shadow-none">
                        Name / ID
                      </th>
                      <th className="border-b-solid whitespace-nowrap border-b border-gray-200 bg-transparent px-6 py-3 text-center align-middle text-xxs font-bold uppercase tracking-none text-slate-500 opacity-70 shadow-none">
                        Started At
                      </th>
                      <th className="border-b-solid whitespace-nowrap border-b border-gray-200 bg-transparent px-6 py-3 text-center align-middle text-xxs font-bold uppercase tracking-none text-slate-500 opacity-70 shadow-none">
                        Due Amount / Date
                      </th>
                      <th className="border-b-solid whitespace-nowrap border-b border-gray-200 bg-transparent px-6 py-3 text-center align-middle text-xxs font-bold uppercase tracking-none text-slate-500 opacity-70 shadow-none">
                        Months
                      </th>
                      <th className="border-b-solid whitespace-nowrap border-b border-gray-200 bg-transparent px-6 py-3 text-center align-middle text-xxs font-bold uppercase tracking-none text-slate-500 opacity-70 shadow-none">
                        Total Invest
                      </th>
                      <th className="border-b-solid whitespace-nowrap border-b border-gray-200 bg-transparent px-6 py-3 text-center align-middle text-xxs font-bold uppercase tracking-none text-slate-500 opacity-70 shadow-none">
                        Total Returns
                      </th>
                      <th className="border-b-solid whitespace-nowrap border-b border-gray-200 bg-transparent px-6 py-3 text-center align-middle text-xxs font-bold uppercase tracking-none text-slate-500 opacity-70 shadow-none">
                        Profit
                      </th>
                      {isLoggedIn && (
                        <th className="border-b-solid whitespace-nowrap border-b border-gray-200 bg-transparent px-6 py-3 text-center align-middle text-xxs font-bold uppercase tracking-none text-slate-500 opacity-70 shadow-none">
                          Actions
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((vendor, index) => (
                      <tr key={index}>
                        <td
                          className={classNames(
                            "whitespace-nowrap bg-transparent p-2 align-middle shadow-transparent",
                            {
                              "border-b": index !== items.length - 1,
                            }
                          )}
                        >
                          <div className="flex px-2 py-1">
                            <div>
                              {isLoggedIn && !vendor.deleted ? (
                                <Link to={`/vendor/avatar/${vendor.id}`}>
                                  <img
                                    src={`/image/${vendor.avatar}`}
                                    className="mr-4 inline-flex h-9 w-9 items-center justify-center rounded-xl text-sm text-white transition-all duration-200 ease-in-out hover:scale-110"
                                    alt="user1"
                                  />
                                </Link>
                              ) : (
                                <img
                                  src={`/image/${vendor.avatar}`}
                                  className="mr-4 inline-flex h-9 w-9 items-center justify-center rounded-xl text-sm text-white transition-all duration-200 ease-soft-in-out"
                                  alt="user1"
                                />
                              )}
                            </div>
                            <div className="flex flex-col justify-center">
                              <h6
                                className={classNames(
                                  "mb-0 text-sm leading-normal",
                                  {
                                    "text-error": vendor.deleted,
                                    "text-neutral": !vendor.deleted,
                                  }
                                )}
                              >
                                {vendor.firstName} {vendor.lastName}
                              </h6>
                              <p className="mb-0 text-xs leading-tight text-slate-500">
                                ID: {vendor.id}
                                {vendor.isActive && (
                                  <Icon
                                    name="active"
                                    className="ml-2 h-4 w-4 fill-primary"
                                    color="primary"
                                  />
                                )}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td
                          className={classNames(
                            "whitespace-nowrap bg-transparent p-2 text-center align-middle text-sm leading-normal shadow-transparent",
                            {
                              "border-b": index !== items.length - 1,
                            }
                          )}
                        >
                          <div className="flex flex-col justify-center gap-1">
                            <span className="text-xs font-semibold leading-tight text-slate-600">
                              {vendor.joinedAt$}
                            </span>
                          </div>
                        </td>
                        <td
                          className={classNames(
                            "whitespace-nowrap bg-transparent p-2 text-center align-middle text-sm leading-normal shadow-transparent",
                            {
                              "border-b": index !== items.length - 1,
                            }
                          )}
                        >
                          {vendor.isVariant ? (
                            <div className="flex flex-col justify-center gap-1">
                              {vendor.vendorType === "LOAD_BORROWER" && (
                                <span
                                  className={classNames(
                                    "text-xs font-semibold leading-tight",
                                    {
                                      "text-slate-500":
                                        !vendor.nextDueHighlight,
                                      "text-red-500": vendor.nextDueHighlight,
                                    }
                                  )}
                                >
                                  {vendor.dueAmount$}
                                </span>
                              )}

                              <div className="flex flex-col justify-center gap-1">
                                <span className="text-xs font-semibold leading-tight text-slate-500">
                                  {vendor.nextDue}
                                </span>
                                {vendor.calenderNext &&
                                  vendor.calenderNext !== vendor.lastDue && (
                                    <span
                                      className={classNames(
                                        "text-xs font-semibold leading-tight",
                                        {
                                          "text-slate-600":
                                            !vendor.nextDueHighlight,
                                          "text-blue-500":
                                            vendor.nextDueHighlight,
                                        }
                                      )}
                                    >
                                      {vendor.calenderNext}
                                    </span>
                                  )}
                                {vendor.lastDueHighlight && (
                                  <span
                                    className={classNames(
                                      "text-xs font-semibold leading-tight",
                                      {
                                        "text-slate-500":
                                          !vendor.lastDueHighlight,
                                        "text-blue-500":
                                          vendor.lastDueHighlight,
                                      }
                                    )}
                                  >
                                    {vendor.lastDue}
                                  </span>
                                )}
                              </div>
                            </div>
                          ) : (
                            <>--</>
                          )}
                        </td>
                        <td
                          className={classNames(
                            "whitespace-nowrap bg-transparent p-2 text-center align-middle text-sm leading-normal shadow-transparent",
                            {
                              "border-b": index !== items.length - 1,
                            }
                          )}
                        >
                          <span className="text-xs font-semibold leading-tight text-slate-500">
                            {vendor.isVariant ? (
                              <div className="flex flex-col justify-center gap-1">
                                <span className="text-xs font-semibold leading-tight text-slate-500">
                                  {vendor.monthDiff}
                                </span>
                              </div>
                            ) : (
                              <>--</>
                            )}
                          </span>
                        </td>
                        <td
                          className={classNames(
                            "whitespace-nowrap bg-transparent p-2 text-center align-middle text-sm leading-normal shadow-transparent",
                            {
                              "border-b": index !== items.length - 1,
                            }
                          )}
                        >
                          <span className="text-xs font-semibold leading-tight text-slate-500">
                            {vendor.totalInvest$}
                          </span>
                        </td>
                        <td
                          className={classNames(
                            "whitespace-nowrap bg-transparent p-2 text-center align-middle text-sm leading-normal shadow-transparent",
                            {
                              "border-b": index !== items.length - 1,
                            }
                          )}
                        >
                          <span className="text-xs font-semibold leading-tight text-slate-500">
                            {vendor.totalReturns$}
                          </span>
                        </td>
                        <td
                          className={classNames(
                            "whitespace-nowrap bg-transparent p-2 text-center align-middle text-sm leading-normal shadow-transparent",
                            {
                              "border-b": index !== items.length - 1,
                            }
                          )}
                        >
                          <span className="text-xs font-semibold leading-tight text-success">
                            {vendor.profit$}
                          </span>

                          {vendor.calcProfit ? (
                            <></>
                          ) : (
                            <p className="mb-0 text-xs leading-tight text-slate-500 ">
                              Not Calculated
                            </p>
                          )}
                        </td>
                        {isLoggedIn && (
                          <td
                            className={classNames(
                              "whitespace-nowrap bg-transparent p-2 text-center align-middle text-sm uppercase leading-normal shadow-transparent",
                              {
                                "border-b": index !== items.length - 1,
                              }
                            )}
                          >
                            {!vendor.deleted ? (
                              <>
                                <Link
                                  to={{
                                    pathname: `/vendor/interlink/${vendor.id}`,
                                  }}
                                  className="btn btn-square btn-ghost w-auto fill-slate-500 px-2 hover:bg-white hover:stroke-secondary"
                                >
                                  <Icon name="archive" className="h-4 w-4" />
                                </Link>
                                <Link
                                  to={{
                                    pathname: `/vendor/edit/${vendor.id}`,
                                  }}
                                  className="btn btn-square btn-ghost w-auto stroke-slate-500 px-2 hover:bg-white hover:stroke-secondary"
                                >
                                  <Icon name="edit" className="h-4 w-4" />
                                </Link>
                                <Link
                                  to={{
                                    pathname: `/vendor/delete/${vendor.id}`,
                                  }}
                                  className="btn btn-square btn-ghost w-auto stroke-slate-500 px-2 hover:bg-white hover:stroke-secondary"
                                >
                                  <Icon name="delete" className="h-4 w-4" />
                                </Link>
                              </>
                            ) : (
                              <div className="flex items-center justify-center align-middle">
                                <span className="text-xs font-semibold leading-tight text-error">
                                  Deleted
                                </span>

                                <Link
                                  to={{
                                    pathname: `/vendor/activate/${vendor.id}`,
                                  }}
                                  className="btn btn-square btn-ghost w-auto fill-slate-400 px-2 hover:bg-white hover:stroke-secondary"
                                >
                                  <Icon name="deleted" className="h-4 w-4" />
                                </Link>
                              </div>
                            )}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
