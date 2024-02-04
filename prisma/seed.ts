import { PrismaClient } from "@prisma/client";
import seedData from "../public/peacock_backup.json";
import { usePassbookMiddleware } from "~/models/passbook-entry.server";

const prisma = new PrismaClient();
prisma.$use(usePassbookMiddleware);

const tables = ["Transaction", "InterLink", "Group", "User", "Passbook"];

async function cleanDB() {
  const truncateTables: any[] = [
    ...tables.map((tableName) =>
      prisma.$executeRawUnsafe(
        `TRUNCATE "${tableName}" RESTART IDENTITY CASCADE;`
      )
    ),
  ];

  await prisma.$transaction(truncateTables);
  return;
}

function createUsers() {
  return seedData.user.map(({ passbookId, id, ...each }: any) => {
    return prisma.user.create({
      data: {
        ...each,
        passbook: {
          create: {
            entryOf: "USER",
          },
        },
      },
    });
  });
}

function createGroups() {
  return seedData.group.map(({ id, ...each }: any) => {
    return prisma.group.create({
      data: {
        ...each,
      },
    });
  });
}

function createInterLink(users: Map<any, any>) {
  return seedData.interLink.map(({ id, vendorId, memberId, ...each }: any) => {
    return prisma.interLink.create({
      data: {
        ...each,
        vendorId: users.get(vendorId),
        memberId: users.get(memberId),
      },
    });
  });
}

function createTransactions(users: Map<any, any>) {
  return seedData.transaction.map(({ id, fromId, toId, ...each }: any) => {
    return prisma.transaction.create({
      data: {
        ...each,
        from: {
          connect: {
            id: users.get(fromId),
          },
        },
        to: {
          connect: {
            id: users.get(toId),
          },
        },
      },
    });
  });
}

async function getUserMap() {
  const users = new Map();

  const addedUsers = await prisma.user.findMany({
    select: {
      id: true,
      nickName: true,
      type: true,
      deleted: true,
    },
  });

  addedUsers.forEach((user) => {
    const match = seedData.user.find((le) => le.nickName === user.nickName);
    if (match) {
      users.set(match.id, user.id);
    }
  });
  return users;
}

async function seed() {
  const doCopyEntry = process.argv[2] && process.argv[2] === "copy";
  await cleanDB();

  const userTransactions = createUsers();
  const groupTransactions = createGroups();

  await prisma.$transaction([
    ...userTransactions,
    ...groupTransactions,
    prisma.passbook.create({
      data: {
        entryOf: "CLUB",
      },
    }),
  ]);

  const users = await getUserMap();

  const interLinks = createInterLink(users);
  await prisma.$transaction(interLinks);

  if (doCopyEntry) {
    const transactions = createTransactions(users);
    await prisma.$transaction(transactions);
  } else {
    for (const { id, fromId, toId, ...transaction } of seedData.transaction) {
      await prisma.transaction.create({
        data: {
          ...(transaction as any),
          from: {
            connect: {
              id: users.get(fromId),
            },
          },
          to: {
            connect: {
              id: users.get(toId),
            },
          },
        },
      });
    }
  }

  return;
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
