import type { Prisma } from "@prisma/client";
import { type Passbook, type Transaction } from "@prisma/client";
import type { Passbook_Settings_Keys } from "~/config/passbookConfig";
import configContext from "~/config/configContext";
import { prisma } from "~/db.server";
import { profitCalculator } from "./passbook-profit.server";

const getUserPassbooks = async (from: number, to: number) => {
  return await prisma.passbook
    .findMany({
      where: {
        OR: [
          {
            user: {
              id: {
                in: [from, to],
              },
            },
          },
          { entryOf: "CLUB" },
        ],
      },
      include: {
        user: {
          select: {
            id: true,
          },
        },
      },
    })
    .then((data) => ({
      FROM: data.find((e) => e.user?.id === from),
      TO: data.find((e) => e.user?.id === to),
      CLUB: data.find((e) => e.entryOf === "CLUB"),
    }));
};

function getPassbookUpdateQuery(
  passbook: any,
  values: any,
  add: { [key in Passbook_Settings_Keys]?: number } = {},
  sub: { [key in Passbook_Settings_Keys]?: number } = {}
) {
  return {
    where: {
      id: passbook.id,
    },
    data: {
      ...Object.fromEntries(
        Object.entries(add).map(([key, value]) => [
          key,
          Number(passbook[key]) + values[value],
        ])
      ),
      ...Object.fromEntries(
        Object.entries(sub).map(([key, value]) => [
          key,
          Number(passbook[key]) - values[value],
        ])
      ),
    },
  };
}

const passbookEntry = async (
  transaction: Transaction,
  shouldReverse: boolean = false
) => {
  const { mode, fromId, toId } = transaction;

  const passbooks: any = await getUserPassbooks(fromId, toId);

  const values: any = {
    amount: transaction.amount,
    profit: 0,
    onePlus: 1,
  };

  if (transaction.mode === "VENDOR_RETURN") {
    const from = passbooks.FROM;
    if (from) {
      const returns = from.totalReturns + transaction.amount;
      values.profit = returns - from.totalInvest - from.profit;

      if (shouldReverse) {
        const returns = from.totalReturns - transaction.amount;
        values.profit = from.profit - (returns - from.totalInvest);
        if (returns <= 0) {
          values.profit = from.totalReturns - from.totalInvest;
        }
      }
    }
  }

  if (transaction.mode === "VENDOR_PERIODIC_RETURN") {
    values.profit = transaction.amount;
  }

  const passbooksForUpdate: {
    where: Partial<Passbook>;
    data: Partial<Passbook>;
  }[] = [];

  const settings = configContext.passbook.settings;

  Object.entries(settings).forEach(([key, value]) => {
    if (mode === key) {
      Object.entries(value).forEach(([pbKey, pbValue]: any[]) => {
        const currentPassbook = passbooks[pbKey];
        if (currentPassbook) {
          if (shouldReverse) {
            passbooksForUpdate.push(
              getPassbookUpdateQuery(
                passbooks[pbKey],
                values,
                pbValue?.SUB,
                pbValue?.ADD
              )
            );
          } else {
            passbooksForUpdate.push(
              getPassbookUpdateQuery(
                passbooks[pbKey],
                values,
                pbValue?.ADD,
                pbValue?.SUB
              )
            );
          }
        }
      });
    }
  });

  const passbookUpdates = passbooksForUpdate.map((each) => {
    return prisma.passbook.update({
      where: each.where,
      data: each.data,
    });
  });

  await prisma.$transaction(passbookUpdates);

  return;
};

export const usePassbookMiddleware: Prisma.Middleware = async (param, next) => {
  const { action, model } = param;
  const isTransaction = model === "Transaction";

  let previousData;

  if (isTransaction && action === "update") {
    if (param?.args?.where) {
      previousData = await prisma.transaction.findFirst({
        where: param?.args?.where,
      });
    }
  }

  // Run the DB process
  const newData = await next(param);

  if (isTransaction) {
    if (action === "create" && !newData?.deleted) {
      await passbookEntry(newData, false);
    }

    if (action === "update" && previousData) {
      await passbookEntry(previousData, true);
      await passbookEntry(newData, false);
    }

    if (action === "delete") {
      await passbookEntry(newData, true);
    }

    if (
      (newData &&
        ["VENDOR_RETURN", "VENDOR_PERIODIC_RETURN"].includes(newData?.mode)) ||
      (previousData &&
        ["VENDOR_RETURN", "VENDOR_PERIODIC_RETURN"].includes(
          previousData?.mode
        ))
    ) {
      await profitCalculator();
    }
  }

  if (model === "User" && ["create", "delete"].includes(action)) {
    await profitCalculator();
  }

  if (model === "InterLink") {
    await profitCalculator();
  }

  return newData;
};
