import classNames from "classnames";
import type { StatProps } from "~/components/molecules/stat";
import Stat from "~/components/molecules/stat";
import configContext from "~/config/configContext";
import { getValidNumber } from "~/helpers/utils";

type StatsProps = {
  club: any;
  theme?: "default" | "ghost";
  childClass?: string;
  captureMode?: boolean;
};

function Stats({ club, childClass = "", theme, captureMode }: StatsProps) {
  const statsData: StatProps[] = [
    {
      hed: "Members / Months",
      dek: `${getValidNumber(club.membersCount)} /  ${
        configContext.club.clubAge().inMonth
      } Mth`,
      iconName: "home",
    },
    {
      hed: "Members Deposit",
      dek: club.accountBalance$,
      iconName: "archive",
      hedColor: "success",
    },
    {
      hed: "Members Balance",
      dek: club.totalBalance$,
      iconName: "transaction",
      hedColor: "error",
    },
    {
      hed: "Net Members Amount",
      dek: club.netMemberAmount$,
      iconName: "trans",
      hedColor: "info",
    },
    {
      hed: "Net Profit",
      dek: club.profit$,
      iconName: "team",
      hedColor: "success",
    },
    {
      hed: "Net Value Per Member",
      dek: club.perMemberNetValue$,
      iconName: "member",
      hedColor: "info",
    },
    {
      hed: "Net Liquidity",
      dek: club.holdingAmount$,
      iconName: "trans",
      hedColor: "secondary",
    },
    {
      hed: "Club Net Value",
      dek: club.netAmount$,
      iconName: "dash",
      hedColor: "secondary",
    },
  ];

  return (
    <>
      {club && (
        <div className="rounded-md ">
          <div
            className={classNames(
              "grid grid-flow-row-dense items-center justify-center gap-4 align-middle ",
              {
                "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4":
                  !captureMode,
                "grid-cols-4": captureMode,
              }
            )}
          >
            {statsData.map((each: any, index: any | null | undefined) => (
              <Stat
                key={index}
                hedColor="neutral"
                {...each}
                theme={theme}
                className={childClass}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default Stats;
