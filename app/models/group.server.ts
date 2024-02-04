/* eslint-disable array-callback-return */
import type { Group, Passbook } from "@prisma/client";
import type { GroupSlugs } from "~/config/configContext";
import configContext from "~/config/configContext";
import { prisma } from "~/db.server";

export const commuteGroup = (
  group:
    | Group & {
        passbook?: Passbook;
      },
  membersCount: number = 0
) => {
  return {
    ...group,
    ...configContext.group(membersCount)[group.slug as GroupSlugs],
  };
};

export async function getGroups() {
  return await prisma.group
    .findMany({ where: { deleted: false } })
    .then((groups) => groups.map(commuteGroup));
}

export async function getGroupById(id: Group["id"]) {
  const group = await prisma.group.findUnique({ where: { id } });
  return group ? commuteGroup(group) : group;
}
