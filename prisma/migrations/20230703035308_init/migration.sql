-- CreateEnum
CREATE TYPE "USER_TYPE" AS ENUM ('MEMBER', 'VENDOR');

-- CreateEnum
CREATE TYPE "PERIOD" AS ENUM ('DAY', 'WEEK', 'MONTH', 'YEAR');

-- CreateEnum
CREATE TYPE "TRANSACTION_TYPE" AS ENUM ('TRANSFER', 'DEPOSIT', 'WITHDRAWAL');

-- CreateEnum
CREATE TYPE "TRANSACTION_METHOD" AS ENUM ('CASH', 'ACCOUNT', 'UPI', 'BANK');

-- CreateEnum
CREATE TYPE "TRANSACTION_MODE" AS ENUM ('MEMBERS_PERIODIC_DEPOSIT', 'MEMBERS_WITHDRAW', 'MEMBERS_WITHDRAW_PROFIT', 'NEW_MEMBER_PAST_TALLY', 'INTER_CASH_TRANSFER', 'VENDOR_PERIODIC_INVEST', 'VENDOR_PERIODIC_RETURN', 'VENDOR_INVEST', 'VENDOR_RETURN', 'OTHER_EXPENDITURE');

-- CreateEnum
CREATE TYPE "PASSBOOK_ENTRY_OF" AS ENUM ('USER', 'CLUB');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "mobileNumber" TEXT NOT NULL,
    "email" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT,
    "nickName" TEXT NOT NULL,
    "avatar" TEXT,
    "type" "USER_TYPE" NOT NULL DEFAULT 'MEMBER',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "passbookId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InterLink" (
    "id" SERIAL NOT NULL,
    "vendorId" INTEGER NOT NULL,
    "memberId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "InterLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Group" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "period" "PERIOD" NOT NULL DEFAULT 'MONTH',
    "startAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "type" "TRANSACTION_TYPE" NOT NULL DEFAULT 'DEPOSIT',
    "method" "TRANSACTION_METHOD" NOT NULL DEFAULT 'ACCOUNT',
    "mode" "TRANSACTION_MODE" NOT NULL DEFAULT 'MEMBERS_PERIODIC_DEPOSIT',
    "dot" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "note" TEXT,
    "fromId" INTEGER NOT NULL,
    "toId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Passbook" (
    "id" SERIAL NOT NULL,
    "entryOf" "PASSBOOK_ENTRY_OF" NOT NULL DEFAULT 'CLUB',
    "termDeposit" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "deposit" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "tallyDeposit" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalDeposit" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "withdraw" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "profitWithdraw" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalWithdraw" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "tallyBalance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "accountBalance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "termInvest" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "invest" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalInvest" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "termReturns" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "returns" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalReturns" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "profit" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "tallyProfit" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalProfit" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "calcProfit" BOOLEAN NOT NULL DEFAULT true,
    "holdingAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "depositMonths" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "withdrawMonths" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "investMonths" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "returnsMonths" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "Passbook_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_nickName_key" ON "User"("nickName");

-- CreateIndex
CREATE UNIQUE INDEX "User_passbookId_key" ON "User"("passbookId");

-- CreateIndex
CREATE UNIQUE INDEX "InterLink_vendorId_memberId_key" ON "InterLink"("vendorId", "memberId");

-- CreateIndex
CREATE UNIQUE INDEX "Group_slug_key" ON "Group"("slug");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_passbookId_fkey" FOREIGN KEY ("passbookId") REFERENCES "Passbook"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterLink" ADD CONSTRAINT "InterLink_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterLink" ADD CONSTRAINT "InterLink_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_toId_fkey" FOREIGN KEY ("toId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
