import configContext from "~/config/configContext";
import type { Passbook, User } from "@prisma/client";
import { prisma } from "~/db.server";
import {
  formatDate,
  formatMoney,
  getMonthYear,
  getDueAmount,
  getNextDue,
  responseData,
  getMonthsDiff,
} from "~/helpers/utils";
import { formatPassbook } from "./passbook.server";
import fs from "fs-extra";
import sharp from "sharp";

export async function getMembersPassbook() {
  const members = await prisma.user.findMany({
    where: { type: "MEMBER" },
    include: {
      passbook: true,
    },
  });

  return members
    .map((member) => {
      const club = configContext.group(members.length).club;
      const passbook = formatPassbook(member.passbook);

      const fullBalance = club.totalTermAmountPerPerson + passbook.tallyBalance;
      const totalBalance = fullBalance - passbook.accountBalance;

      const termBalance =
        club.totalTermAmountPerPerson -
        (passbook.termDeposit - passbook.withdraw);

      const netAmount = passbook.accountBalance + passbook.profit;

      const tallyBalance = passbook.tallyBalance - passbook.tallyDeposit;
      const otherBalance = tallyBalance + passbook.profitWithdraw;

      return {
        ...member,
        ...passbook,
        id: member.id,
        joinedAt$: getMonthYear(member.joinedAt),
        otherBalance,
        otherBalance$: formatMoney(otherBalance),
        tallyBalance,
        tallyBalance$: formatMoney(tallyBalance),
        termBalance,
        termBalance$: formatMoney(termBalance),
        totalBalance,
        totalBalance$: formatMoney(totalBalance),
        netAmount,
        netAmount$: formatMoney(netAmount),
      };
    })
    .sort((a, b) => (a.firstName > b.firstName ? 1 : -1));
}

export function getVendorTypeData(
  vendor: User & {
    passbook: Passbook;
  }
) {
  const { vendorType, joinedAt } = vendor;
  const data = {
    ...getNextDue(vendor.joinedAt),
    dueAmount: 0,
    totalDueAmount: 0,
    isActive: vendor.isActive,
    monthDiff: Math.ceil(getMonthsDiff(joinedAt)),
  };

  const { monthDiff } = data;

  if (vendorType === "LOAD_BORROWER") {
    const everyMonthAmount = getDueAmount(vendor.passbook.totalInvest);
    const returns = everyMonthAmount * (monthDiff + 1);
    const expectedMoney = returns + vendor.passbook.totalInvest;
    data.isActive = vendor.passbook.totalInvest > vendor.passbook.totalReturns;

    if (data.isActive) {
      data.dueAmount = everyMonthAmount;
      data.totalDueAmount =
        expectedMoney -
        (vendor.passbook.totalInvest - vendor.passbook.totalReturns);
    }
  }

  if (vendorType === "CHIT_FUND_COMPANY") {
    if (monthDiff > 20) {
      data.isActive = false;
    }
  }

  return {
    ...data,
    isVariant:
      ["CHIT_FUND_COMPANY", "LOAD_BORROWER"].includes(vendorType) &&
      data.isActive,
    dueAmount$: formatMoney(data.dueAmount),
    totalDueAmount$: formatMoney(data.totalDueAmount),
  };
}

export async function getVendorsWithSummary() {
  const vendors = await prisma.user.findMany({
    where: { type: "VENDOR" },
    include: {
      passbook: true,
    },
  });

  return vendors
    .map((vendor) => {
      const passbook = formatPassbook(vendor.passbook);
      const vendorType = getVendorTypeData(vendor);

      return {
        ...vendor,
        ...passbook,
        ...vendorType,
        id: vendor.id,
        joinedAt$: formatDate(vendor.joinedAt),
        isActive: vendor.isActive,
      };
    })
    .sort((a, b) => (a.firstName > b.firstName ? 1 : -1))
    .sort((a, b) => (a.isActive === b.isActive ? 0 : a.isActive ? -1 : 1));
}

export async function getActiveVendorsWithSummary() {
  const vendors = await prisma.user.findMany({
    where: { type: "VENDOR", isActive: true, deleted: false },
    include: {
      passbook: true,
    },
  });

  return vendors
    .map((vendor) => {
      const passbook = formatPassbook(vendor.passbook);
      const vendorType = getVendorTypeData(vendor);
      return {
        ...vendor,
        ...passbook,
        ...vendorType,
        id: vendor.id,
        joinedAt$: formatDate(vendor.joinedAt),
        isActive: vendor.isActive,
      };
    })
    .sort((a, b) => (a.firstName > b.firstName ? 1 : -1))
    .sort((a, b) => (a.nextDate > b.nextDate ? 1 : -1));
}

export async function getUserSelect(withDeleted = true) {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      nickName: true,
      type: true,
      deleted: true,
    },
    where: {
      OR: [
        {
          type: "MEMBER",
        },
        {
          type: "VENDOR",
          deleted: false,
        },
      ],
    },
  });
  const members = users
    .filter((e) => e.type === "MEMBER")
    .sort((a, b) => (a.firstName > b.firstName ? 1 : -1));
  const vendor = users
    .filter((e) => e.type === "VENDOR")
    .sort((a, b) => (a.firstName > b.firstName ? 1 : -1));
  return [...members, ...vendor];
}

export async function getUserSelectMembers() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      nickName: true,
      type: true,
      deleted: true,
      avatar: true,
    },
    where: {
      type: "MEMBER",
      deleted: false,
    },
  });
  return users.sort((a, b) => (a.firstName > b.firstName ? 1 : -1));
}

export async function getMembers() {
  return prisma.user.findMany({ where: { type: "MEMBER" } });
}

export async function getVendors() {
  return prisma.user.findMany({ where: { type: "VENDOR" } });
}

export async function getMembersCount() {
  return prisma.user.count({ where: { type: "MEMBER" } });
}

export async function getUserById(id: User["id"]) {
  return prisma.user.findFirst({ where: { id } });
}

export async function getUserFindFirst(id: User["id"], type: User["type"]) {
  return prisma.user.findFirst({ where: { id, type } });
}

export async function findUserWithPassbook(id: User["id"], type: User["type"]) {
  return prisma.user.findFirst({
    where: { id, type },
    include: {
      passbook: true,
    },
  });
}

export async function uploadAvatar(id: number, file: File, directory: string) {
  try {
    const user = await prisma.user.findFirst({
      where: { id },
      select: {
        avatar: true,
      },
    });
    const existingAvatar = user?.avatar || "";

    const tempURL = `${directory}/${file.name}`;
    const fileName = `avatar_${id}_${new Date().getTime()}.webp`;
    const filePath = `${directory}/${fileName}`;
    const existingAvatarPath = `${directory}/${existingAvatar}`;

    await sharp(tempURL).resize(200, 200).webp().toFile(filePath); //webp

    await fs.remove(tempURL);

    if (existingAvatar && existingAvatar !== "no_image_available.jpeg") {
      await fs.remove(existingAvatarPath);
    }

    await prisma.user.update({
      where: {
        id: Number(id),
      },
      data: {
        avatar: fileName,
      },
    });

    return responseData({
      success: true,
      message: "avatarUpdate",
      data: { id: Number(id), filePath, fileName },
    });
  } catch (err) {
    console.error(err);
    return responseData({
      success: false,
      message: "avatarUpdateError",
    });
  }
}
