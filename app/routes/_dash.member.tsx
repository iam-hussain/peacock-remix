import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import classNames from "classnames";
import html2canvas from "html2canvas";
import { useEffect, useMemo, useRef, useState } from "react";
import Stats from "~/components/molecules/stats";
import Icon from "~/components/svg/icon";
import { formatDateFile, formatDateTime } from "~/helpers/utils";
import { getClubStatsPassbook } from "~/models/passbook.server";
import { getMembersPassbook } from "~/models/user.server";
import { getIsLoggedIn } from "~/session.server";

export const loader = async ({ request }: LoaderArgs) => {
  const isLoggedIn = await getIsLoggedIn(request);
  const items = await getMembersPassbook();
  const activeMembers = items.filter((e) => !e.deleted);
  const club = await getClubStatsPassbook(activeMembers.length);
  return json({
    club,
    allMembers: items,
    activeMembers,
    isLoggedIn,
  });
};

export default function MemberPage() {
  const tableRef = useRef<HTMLDivElement>(null);
  const [captureMode, setCaptureMode] = useState(false);

  const [fetchDeleted, setFetchDeleted] = useState(false);
  const { allMembers, activeMembers, isLoggedIn, club } =
    useLoaderData<typeof loader>();

  const items = useMemo(() => {
    return fetchDeleted ? allMembers : activeMembers;
  }, [activeMembers, allMembers, fetchDeleted]);

  const captureTable = () => {
    if (document && tableRef && tableRef !== null) {
      setCaptureMode(true);
    }
  };

  useEffect(() => {
    if (captureMode && document && tableRef && tableRef !== null) {
      html2canvas(tableRef.current as HTMLDivElement, {
        scrollX: window.screenX,
        scrollY: window.screenY,
      }).then((canvas) => {
        setCaptureMode(false);
        const capturedLink = canvas.toDataURL("image/png");
        let downloadable = document.createElement("a");
        downloadable.download = `peacock-members-${formatDateFile()}.png`;
        downloadable.href = capturedLink;
        downloadable.click();
      });
    }
  }, [captureMode]);

  return (
    <div className="flex h-full w-full flex-col gap-3">
      <Outlet />
      <div className="flex flex-wrap" id="members-table">
        <div
          className={classNames("flex-none", {
            "w-full max-w-full": !captureMode,
            "border-8 border-stone-100": captureMode,
          })}
          ref={tableRef}
        >
          <div
            className={classNames(
              "relative flex min-w-0 flex-col break-words border-0 border-solid border-transparent bg-white bg-clip-border shadow-soft-xl",
              { "mb-0 rounded-0": captureMode, "mb-6 rounded-md": !captureMode }
            )}
          >
            <div className="border-b-solid mb-0 rounded-t-2xl border-b-0 border-b-transparent bg-white p-6 pb-0">
              <div
                className={classNames(
                  "mb-2 flex flex-wrap items-center align-middle",
                  {
                    "justify-between": !captureMode,
                    "justify-center": captureMode,
                  }
                )}
              >
                {!captureMode && (
                  <h6 className="mx-0 my-auto text-neutral">Members Table</h6>
                )}
                {captureMode && (
                  <div className="h-fit w-full pb-3 pt-2 text-center">
                    <div className="m-auto flex select-none flex-col items-center justify-center gap-4 whitespace-nowrap align-middle text-sm text-slate-700">
                      <span>
                        <h1 className="m-0 p-0 font-brand text-2xl uppercase tracking-normal text-primary">
                          Peacock Club
                        </h1>
                        <p className="m-0 p-0 text-sm text-slate-500">
                          {formatDateTime()}
                        </p>
                      </span>
                      <Stats
                        club={club}
                        captureMode={captureMode}
                        theme={"ghost"}
                        childClass={
                          "border-2 border-zinc-100 shadow-none px-4 py-3"
                        }
                      />
                      <h6 className="m-0 pt-4 text-neutral">Members Table</h6>
                    </div>
                  </div>
                )}
                {isLoggedIn && (
                  <div
                    className={classNames("flex items-center justify-center", {
                      hidden: captureMode,
                    })}
                  >
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
                    <button
                      className={classNames(
                        "btn btn-square btn-ghost stroke-slate-500 hover:bg-white hover:stroke-secondary",
                        {
                          hidden: captureMode,
                        }
                      )}
                      onClick={() => captureTable()}
                    >
                      <Icon name="screenshot" className="h-6 w-6" />
                    </button>
                    <Link
                      className="btn btn-square btn-ghost stroke-slate-500 hover:bg-white hover:stroke-secondary"
                      to={{
                        pathname: `/member/add`,
                      }}
                    >
                      <Icon name="add-box" className="h-6 w-6" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
            <div className="flex-auto px-0 pb-2 pt-0">
              <div
                className={classNames("p-0", {
                  "overflow-x-auto": !captureMode,
                })}
              >
                <table className="table mb-0 w-full items-center border-gray-200 align-top text-slate-500">
                  <thead className="px-4 align-bottom">
                    <tr>
                      <th className="border-b-solid whitespace-nowrap border-b border-gray-200 bg-transparent px-5 py-3 text-left align-middle text-xxs font-bold uppercase tracking-none text-slate-500 opacity-70 shadow-none">
                        Name
                      </th>
                      <th className="border-b-solid whitespace-nowrap border-b border-gray-200 bg-transparent px-6 py-3 text-center align-middle text-xxs font-bold uppercase tracking-none text-slate-500 opacity-70 shadow-none">
                        ID / Joined At
                      </th>
                      <th className="border-b-solid whitespace-nowrap border-b border-gray-200 bg-transparent px-6 py-3 text-center align-middle text-xxs font-bold uppercase tracking-none text-slate-500 opacity-70 shadow-none">
                        Term / Other Deposit
                      </th>
                      <th className="border-b-solid whitespace-nowrap border-b border-gray-200 bg-transparent px-6 py-3 text-center align-middle text-xxs font-bold uppercase tracking-none text-slate-500 opacity-70 shadow-none">
                        Term / Other Balance
                      </th>
                      <th className="border-b-solid whitespace-nowrap border-b border-gray-200 bg-transparent px-6 py-3 text-center align-middle text-xxs font-bold uppercase tracking-none text-slate-500 opacity-70 shadow-none">
                        Profit / Tally
                      </th>
                      <th className="border-b-solid whitespace-nowrap border-b border-gray-200 bg-transparent px-6 py-3 text-center align-middle text-xxs font-bold uppercase tracking-none text-slate-500 opacity-70 shadow-none">
                        Net Value
                      </th>
                      {isLoggedIn && !captureMode && (
                        <th className="border-b-solid whitespace-nowrap border-b border-gray-200 bg-transparent px-6 py-3 text-center align-middle text-xxs font-bold uppercase tracking-none text-slate-500 opacity-70 shadow-none">
                          Actions
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((member, index) => (
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
                              {isLoggedIn && !member.deleted ? (
                                <Link to={`/member/avatar/${member.id}`}>
                                  <img
                                    src={`/image/${member.avatar}`}
                                    className="mr-4 inline-flex h-9 w-9 items-center justify-center rounded-xl text-sm text-white transition-all duration-200 ease-in-out hover:scale-110"
                                    alt="user1"
                                  />
                                </Link>
                              ) : (
                                <img
                                  src={`/image/${member.avatar}`}
                                  className="mr-4 inline-flex h-9 w-9 items-center justify-center rounded-xl text-sm text-white transition-all duration-200 ease-soft-in-out"
                                  alt="user1"
                                />
                              )}
                            </div>
                            <div className="justify-center">
                              <h6
                                className={classNames(
                                  "mb-0 text-sm leading-normal",
                                  {
                                    "text-error": member.deleted,
                                    "text-neutral": !member.deleted,
                                  }
                                )}
                              >
                                {member.firstName} {member.lastName}
                              </h6>

                              {member.holdingAmount ? (
                                <p className="mb-0 text-xs leading-tight text-slate-500">
                                  {member.holdingAmount$}
                                </p>
                              ) : (
                                <></>
                              )}
                            </div>
                          </div>
                        </td>
                        <td
                          className={classNames(
                            "items-center justify-center whitespace-nowrap bg-transparent p-2 text-center align-middle text-sm leading-normal shadow-transparent",
                            {
                              "border-b": index !== items.length - 1,
                            }
                          )}
                        >
                          <span className="text-xs font-semibold leading-tight text-slate-500">
                            {member.id}
                          </span>
                          <p className="mb-0 text-xs leading-tight text-slate-500">
                            {member.joinedAt$}
                          </p>
                        </td>
                        <td
                          className={classNames(
                            "items-center justify-center whitespace-nowrap bg-transparent p-2 text-center align-middle text-sm leading-normal shadow-transparent",
                            {
                              "border-b": index !== items.length - 1,
                            }
                          )}
                        >
                          <span className="text-xs font-semibold leading-tight text-slate-500">
                            {member.accountBalance$}

                            {member.tallyDeposit ? (
                              <p className="mb-0 text-xs leading-tight text-slate-500">
                                {member.termDeposit$} + {member.tallyDeposit$}
                              </p>
                            ) : (
                              ""
                            )}
                          </span>
                        </td>
                        <td
                          className={classNames(
                            "items-center justify-center whitespace-nowrap bg-transparent p-2 text-center align-middle text-sm leading-normal shadow-transparent",
                            {
                              "border-b": index !== items.length - 1,
                            }
                          )}
                        >
                          <span
                            className={classNames(
                              "text-xs font-semibold leading-tight",
                              {
                                "text-error": member.totalBalance > 0,
                                "text-info": member.totalBalance <= 0,
                              }
                            )}
                          >
                            {member.totalBalance$}
                            {member.tallyBalance > 0 &&
                            !(member.profitWithdraw > 0) ? (
                              <p className="mb-0 text-xs leading-tight text-slate-500">
                                {member.termBalance$} + {member.tallyBalance$}
                              </p>
                            ) : (
                              <></>
                            )}
                            {!(member.tallyBalance > 0) &&
                            member.profitWithdraw > 0 ? (
                              <p className="mb-0 text-xs leading-tight text-slate-500">
                                {member.termBalance$} + {member.profitWithdraw$}
                              </p>
                            ) : (
                              <></>
                            )}
                            {member.tallyBalance > 0 &&
                            member.profitWithdraw > 0 ? (
                              <p className="mb-0 text-xs leading-tight text-slate-500">
                                {member.termBalance$} + {member.profitWithdraw$}{" "}
                                + {member.tallyBalance$}
                              </p>
                            ) : (
                              <></>
                            )}
                          </span>
                        </td>
                        <td
                          className={classNames(
                            "items-center justify-center whitespace-nowrap bg-transparent p-2 text-center align-middle text-sm leading-normal shadow-transparent",
                            {
                              "border-b": index !== items.length - 1,
                              "text-error": member.profit < 0,
                              "text-info": member.profit >= 0,
                            }
                          )}
                        >
                          <span className="text-xs font-semibold leading-tight text-success">
                            {member.profit$}
                          </span>
                        </td>
                        <td
                          className={classNames(
                            "items-center justify-center whitespace-nowrap bg-transparent p-2 text-center align-middle text-sm leading-normal shadow-transparent",
                            {
                              "border-b": index !== items.length - 1,
                            }
                          )}
                        >
                          <span className="text-xs font-semibold leading-tight text-info">
                            {member.netAmount$}
                          </span>
                        </td>
                        {isLoggedIn && !captureMode && (
                          <td
                            className={classNames(
                              "whitespace-nowrap bg-transparent p-2 text-center align-middle text-sm uppercase leading-normal shadow-transparent",
                              {
                                "border-b": index !== items.length - 1,
                              }
                            )}
                          >
                            {!member.deleted ? (
                              <>
                                <Link
                                  to={{
                                    pathname: `/member/edit/${member.id}`,
                                  }}
                                  className="btn btn-square btn-ghost w-auto stroke-slate-500 px-2 hover:bg-white hover:stroke-secondary"
                                >
                                  <Icon name="edit" className="h-4 w-4" />
                                </Link>
                                <Link
                                  to={{
                                    pathname: `/member/delete/${member.id}`,
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
                                    pathname: `/member/activate/${member.id}`,
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
