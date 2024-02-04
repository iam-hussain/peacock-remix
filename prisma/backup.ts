import { PrismaClient } from "@prisma/client";
import backup from "../app/models/backup.server";

const prisma = new PrismaClient();
const filePath = `${process.cwd()}/public/peacock_backup.json`;

backup(prisma, filePath)
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(1);
  });
