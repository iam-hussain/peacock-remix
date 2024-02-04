import type { TRANSACTION_MODE } from "@prisma/client";

export type PassbookConfig = {
  settings: {
    [key in TRANSACTION_MODE]?: {
      [key in "FROM" | "TO" | "GROUP" | "CLUB"]?: {
        [key in "ADD" | "SUB"]?: {
          [key in Passbook_Settings_Keys]?:
            | "amount"
            | "balance"
            | "profit"
            | "onePlus";
        };
      };
    };
  };
};

export type Passbook_Settings_Keys =
  | "termDeposit"
  | "deposit"
  | "tallyDeposit"
  | "totalDeposit"
  | "withdraw"
  | "profitWithdraw"
  | "totalWithdraw"
  | "tallyBalance"
  | "termInvest"
  | "invest"
  | "totalInvest"
  | "termReturns"
  | "returns"
  | "totalReturns"
  | "accountBalance"
  | "holdingAmount"
  | "profit"
  | "tallyProfit"
  | "totalProfit"
  | "calcProfit"
  | "depositMonths"
  | "withdrawMonths"
  | "investMonths"
  | "returnsMonths";

export const passbookConfig: PassbookConfig = {
  settings: {
    INTER_CASH_TRANSFER: {
      FROM: {
        SUB: {
          holdingAmount: "amount",
        },
      },
      TO: {
        ADD: {
          holdingAmount: "amount",
        },
      },
    },
    MEMBERS_PERIODIC_DEPOSIT: {
      FROM: {
        ADD: {
          termDeposit: "amount",
          totalDeposit: "amount",
          accountBalance: "amount",
        },
      },
      TO: {
        ADD: {
          holdingAmount: "amount",
        },
      },
      CLUB: {
        ADD: {
          termDeposit: "amount",
          totalDeposit: "amount",
          accountBalance: "amount",
          holdingAmount: "amount",
        },
      },
    },
    NEW_MEMBER_PAST_TALLY: {
      FROM: {
        ADD: {
          tallyDeposit: "amount",
          totalDeposit: "amount",
          accountBalance: "amount",
        },
      },
      TO: {
        ADD: {
          holdingAmount: "amount",
        },
      },
      CLUB: {
        ADD: {
          tallyDeposit: "amount",
          totalDeposit: "amount",
          accountBalance: "amount",
          holdingAmount: "amount",
        },
      },
    },
    VENDOR_PERIODIC_INVEST: {
      FROM: {
        SUB: {
          holdingAmount: "amount",
        },
      },
      TO: {
        ADD: {
          termInvest: "amount",
          totalInvest: "amount",
          investMonths: "onePlus",
          holdingAmount: "amount",
        },
      },
      CLUB: {
        ADD: {
          termInvest: "amount",
          totalInvest: "amount",
          investMonths: "onePlus",
        },
        SUB: {
          holdingAmount: "amount",
        },
      },
    },
    VENDOR_INVEST: {
      FROM: {
        SUB: {
          holdingAmount: "amount",
        },
      },
      TO: {
        ADD: {
          invest: "amount",
          totalInvest: "amount",
          holdingAmount: "amount",
        },
      },
      CLUB: {
        ADD: {
          invest: "amount",
          totalInvest: "amount",
        },
        SUB: {
          holdingAmount: "amount",
        },
      },
    },
    VENDOR_PERIODIC_RETURN: {
      FROM: {
        ADD: {
          termReturns: "amount",
          totalReturns: "amount",
          holdingAmount: "amount",
          accountBalance: "amount",
          profit: "profit",
          totalProfit: "profit",
          returnsMonths: "onePlus",
        },
      },
      TO: {
        ADD: {
          holdingAmount: "amount",
        },
      },
      CLUB: {
        ADD: {
          termReturns: "amount",
          totalReturns: "amount",
          holdingAmount: "amount",
          profit: "profit",
          totalProfit: "profit",
          returnsMonths: "onePlus",
        },
      },
    },
    VENDOR_RETURN: {
      FROM: {
        ADD: {
          returns: "amount",
          totalReturns: "amount",
          holdingAmount: "amount",
          accountBalance: "amount",
          profit: "profit",
          totalProfit: "profit",
        },
      },
      TO: {
        ADD: {
          holdingAmount: "amount",
        },
      },
      CLUB: {
        ADD: {
          returns: "amount",
          totalReturns: "amount",
          holdingAmount: "amount",
          profit: "profit",
          totalProfit: "profit",
        },
      },
    },
    OTHER_EXPENDITURE: {
      FROM: {
        SUB: {
          holdingAmount: "amount",
        },
      },
      TO: {
        SUB: {
          withdraw: "amount",
          totalWithdraw: "amount",
          accountBalance: "amount",
        },
      },
      CLUB: {
        SUB: {
          withdraw: "amount",
          totalWithdraw: "amount",
          accountBalance: "amount",
          holdingAmount: "amount",
        },
      },
    },
    MEMBERS_WITHDRAW: {
      FROM: {
        SUB: {
          holdingAmount: "amount",
        },
      },
      TO: {
        ADD: {
          withdraw: "amount",
          totalWithdraw: "amount",
        },
        SUB: {
          accountBalance: "amount",
        },
      },
      CLUB: {
        ADD: {
          withdraw: "amount",
          totalWithdraw: "amount",
        },
        SUB: {
          accountBalance: "amount",
          holdingAmount: "amount",
        },
      },
    },
    MEMBERS_WITHDRAW_PROFIT: {
      FROM: {
        SUB: {
          holdingAmount: "amount",
        },
      },
      TO: {
        ADD: {
          profitWithdraw: "amount",
          totalWithdraw: "amount",
        },
        SUB: {
          accountBalance: "amount",
        },
      },
      CLUB: {
        ADD: {
          profitWithdraw: "amount",
          totalWithdraw: "amount",
        },
        SUB: {
          accountBalance: "amount",
          holdingAmount: "amount",
        },
      },
    },
    MEMBERS_REPAY_PROFIT: {
      FROM: {
        ADD: {
          accountBalance: "amount",
        },
        SUB: {
          profitWithdraw: "amount",
          totalWithdraw: "amount",
        },
      },
      TO: {
        ADD: {
          holdingAmount: "amount",
        },
      },

      CLUB: {
        ADD: {
          profitWithdraw: "amount",
          totalWithdraw: "amount",
        },
        SUB: {
          accountBalance: "amount",
          holdingAmount: "amount",
        },
      },
    },
  },
};
