import { prisma } from "~/db.server";

function getFromDB() {
  return Promise.all([
    prisma.user.findMany({
      where: {
        type: "VENDOR",
        deleted: false,
      },
      select: {
        vendorInterLinks: {
          select: {
            id: true,
            memberId: true,
            includeProfit: true,
            member: {
              select: {
                deleted: true,
                passbook: {
                  select: {
                    id: true,
                  },
                },
              },
            },
          },
        },
        passbook: {
          select: {
            id: true,
            profit: true,
          },
        },
      },
    }),
    prisma.passbook.findFirst({
      where: {
        entryOf: "CLUB",
      },
    }),
  ]);
}

function getVendorMembersLink({ vendorInterLinks, passbook }: any) {
  return {
    includeCount: vendorInterLinks
      .filter((e: any) => e.includeProfit)
      .map((e: any) => ({
        memberId: e.memberId,
        passbookId: e.member.passbook.id,
      })).length,
    activeExcludeCount: vendorInterLinks
      .filter((e: any) => !e.includeProfit && !e.member.deleted)
      .map((e: any) => ({
        memberId: e.memberId,
        passbookId: e.member.passbook.id,
      })).length,
  };
}

export async function profitCalculator() {
  const [vendors, club] = await getFromDB();

  const passbooks: Map<any, any> = new Map();

  let overallExcludeTallyAmount = 0;

  for (let vendor of vendors) {
    const { vendorInterLinks, passbook } = vendor;
    const { includeCount, activeExcludeCount } = getVendorMembersLink(vendor);

    const eachMemberProfit = Math.round(passbook.profit / includeCount) || 0;
    const excludeTallyAmount =
      Math.round(eachMemberProfit * activeExcludeCount) || 0;

    overallExcludeTallyAmount = overallExcludeTallyAmount + excludeTallyAmount;

    for (let { member, includeProfit } of vendorInterLinks) {
      const memberPassbookId = member.passbook.id;

      if (!passbooks.has(memberPassbookId)) {
        passbooks.set(memberPassbookId, {
          tallyBalance: 0,
          profit: 0,
        });
      }

      const memberPassbookEntry = passbooks.get(memberPassbookId);

      if (includeProfit) {
        passbooks.set(memberPassbookId, {
          ...memberPassbookEntry,
          profit: memberPassbookEntry.profit + eachMemberProfit,
        });
      } else {
        passbooks.set(memberPassbookId, {
          ...memberPassbookEntry,
          tallyBalance: memberPassbookEntry.tallyBalance + eachMemberProfit,
        });
      }
    }
  }

  const passbookQueries = Array.from(passbooks, ([id, data]) => ({
    where: { id },
    data,
  })).map((each) => prisma.passbook.update(each));

  await prisma.$transaction(passbookQueries);

  await prisma.passbook.update({
    where: {
      id: club?.id,
    },
    data: {
      tallyProfit: overallExcludeTallyAmount,
    },
  });

  return;
}
