import { prisma } from "~/db.server";
import { profitCalculator } from "./passbook-profit.server";

type InterLinkObject = {
  [key in string]: Boolean;
};

export const setInterLinkObject = async (
  vendorId: number,
  interLinkObject: InterLinkObject
) => {
  const upsets: any[] = [];

  Object.entries(interLinkObject).forEach(([key, value]) => {
    let memberId = Number(key);
    let includeProfit = Boolean(value);

    upsets.push({
      where: {
        vendorId_memberId: {
          vendorId,
          memberId,
        },
      },
      create: {
        includeProfit,
        vendorId,
        memberId,
      },
      update: {
        includeProfit,
      },
    });
  });

  for (let each of upsets) {
    await prisma.interLink.upsert(each);
  }

  profitCalculator();

  return true;
};

export const getInterLinkObject = async (vendorId: Number) => {
  const links = await prisma.interLink.findMany({
    where: {
      vendorId: vendorId as any,
      deleted: false,
    },
    select: {
      id: true,
      vendorId: true,
      memberId: true,
      includeProfit: true,
      member: {
        select: {
          firstName: true,
          lastName: true,
          id: true,
          deleted: true,
        },
      },
    },
  });

  const membersValue: InterLinkObject = {};

  const members = links
    .sort((a, b) => (a.member.firstName > b.member.firstName ? 1 : -1))
    .map((each) => {
      membersValue[each.member.id] = Boolean(each.includeProfit);
      return {
        ...each,
      };
    });

  return {
    membersValue,
    members,
  };
};
