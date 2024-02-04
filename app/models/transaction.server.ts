import { prisma } from "~/db.server";
import { formatDate, formatMoney } from "~/helpers/utils";

type TransactionProps = {
  options?: {
    from?: number;
    to?: number;
    skip?: number;
    take?: number;
    type?: string;
    mode?: string;
    sort?: string;
    order?: "asc" | "desc";
  };
};

export const findTransaction = async ({ options }: TransactionProps) => {
  const {
    from = 0,
    to = 0,
    skip = 0,
    take = 6,
    order = "desc",
    sort = "dot",
    type = "",
    mode = "",
  } = options || {};

  const where: any = {};

  if (type) {
    where.type = type;
  }

  if (mode) {
    where.mode = mode;
  }

  if (from) {
    where.fromId = from;
  }
  if (to) {
    where.toId = to;
  }

  const transactions = await prisma.transaction.findMany({
    where: {
      deleted: false,
      ...where,
    },
    include: {
      from: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatar: true,
        },
      },
      to: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatar: true,
        },
      },
    },
    orderBy: [
      {
        [sort]: order,
      },
      {
        id: order,
      },
    ],
    skip,
    take,
  });
  return transactions.map((transaction) => {
    let primary = { ...transaction.from };
    let secondary = { ...transaction.to };

    if (
      [
        "VENDOR_PERIODIC_INVEST",
        "VENDOR_INVEST",
        "MEMBERS_WITHDRAW",
        "MEMBERS_WITHDRAW_PROFIT",
      ].includes(transaction.mode)
    ) {
      primary = { ...transaction.to };
      secondary = { ...transaction.from };
    }
    return {
      ...transaction,
      dot$: formatDate(transaction.dot),
      createdAt$: formatDate(transaction.createdAt),
      amount$: formatMoney(transaction.amount),
      primary,
      secondary,
    };
  });
};

export const findOneTransaction = async (id: number) => {
  const transactions = await prisma.transaction.findFirst({
    where: {
      id,
      deleted: false,
    },
    include: {
      from: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatar: true,
        },
      },
      to: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatar: true,
        },
      },
    },
  });

  return transactions;
};
