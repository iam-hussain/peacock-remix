import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import configContext from "~/config/configContext";
import { prisma } from "~/db.server";
import backup from "~/models/backup.server";
import { commitSession, getSession } from "~/session.server";

const filePath = `${process.cwd()}/public/peacock_backup.json`;

export const action = async ({ request }: ActionArgs) => {
  const session = await getSession(request);
  const backupDone = session.get("backupDome");
  const isBackupSuccess =
    backupDone === "true" ? false : await backup(prisma, filePath);

  let toastMessage = isBackupSuccess
    ? configContext.message.backupSuccess
    : configContext.message.backupError;

  if (backupDone === "true") {
    toastMessage = configContext.message.backupDone;
  }

  session.flash("toastMessage", toastMessage);
  session.flash("toastType", isBackupSuccess ? "success" : "error");
  session.set("backupDome", "true");

  return new Response(null, {
    status: 201,
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

export const loader = async () => redirect("/home");
