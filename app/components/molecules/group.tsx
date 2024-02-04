import type { StatProps } from "./stat";
import Stat from "./stat";

function GroupCard(props: any) {
  const statsData: StatProps[] = [
    {
      hed: "Members Deposit",
      dek: props.termDeposit$,
      iconName: "trans",
      align: "start",
      hedColor: "success",
    },
    {
      hed: "Members Balance",
      dek: props.termBalance$,
      iconName: "trans",
      align: "end",
      hedColor: "error",
    },
  ];
  return (
    <div className="mb-0 mt-0 w-full max-w-full text-center lg:mb-0 lg:flex-none">
      <div className="relative z-20 flex min-w-0 flex-col break-words rounded-md bg-white bg-clip-border p-4 shadow-soft-xl">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col justify-between p-2 lg:flex-row lg:pb-4">
            <h3 className="m-0 uppercase text-neutral">
              {props.name}{" "}
              <span className="m-0 text-sm uppercase text-neutral">Scheme</span>
            </h3>
            <div className="mt-2 flex flex-row-reverse justify-between text-right lg:mt-0 lg:flex-col">
              <p className="m-0 p-0 text-sm font-semibold leading-normal text-slate-500">
                {props.currentMonthsDiff}
                {" Months"}
              </p>
              <p className="m-0 p-0 text-sm font-semibold leading-normal text-slate-500">
                {props.amount$}
                {" / Member "}
              </p>
            </div>
          </div>
          <div className="mx-auto w-full max-w-screen-2xl rounded-xl">
            <div className="flex flex-col px-2">
              <div className="flex justify-between pb-1">
                <p className="m-0 p-0 text-xs font-semibold leading-normal text-slate-500">
                  {props.startMonth}
                </p>
                <p className="m-0 p-0 text-xs font-semibold leading-normal text-slate-500">
                  {props.hasEndDate ? props.endMonth : "Now"}
                </p>
              </div>
              <progress
                className="progress progress-secondary h-3 w-full"
                value={props.termDeposit}
                max={props.totalTermAmount}
              ></progress>
              <div className="flex justify-between pt-1">
                <p className="m-0 p-0 text-sm font-semibold leading-normal text-slate-500">
                  0 ₹
                </p>
                <p className="m-0 p-0 text-sm font-semibold leading-normal text-slate-500">
                  {props.totalTermAmount$}
                </p>
              </div>
              <div className="flex flex-row gap-4 pt-6">
                {statsData.map(
                  (each: any, index: number | null | undefined) => (
                    <Stat
                      key={index}
                      {...each}
                      theme="ghost"
                      iconPlacement="none"
                    />
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GroupCard;
