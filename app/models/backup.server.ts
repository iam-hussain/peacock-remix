import fs from "fs-extra";
import type { PrismaClient } from "@prisma/client";

async function backup(prisma: PrismaClient, filePath: string) {
  return await Promise.all([
    prisma.group.findMany(),
    prisma.interLink.findMany(),
    prisma.passbook.findMany(),
    prisma.transaction.findMany(),
    prisma.user.findMany(),
  ])
    .then(([group, interLink, passbook, transaction, user]) => ({
      group,
      interLink,
      passbook,
      transaction,
      user,
    }))
    .then((data) => fs.writeJson(filePath, data))
    .then(() => ({ success: true }))
    .catch((error) => {
      console.error(error);
      return { success: false };
    });
}

export default backup;
