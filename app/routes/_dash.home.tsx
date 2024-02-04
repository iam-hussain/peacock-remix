import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import GroupCard from "~/components/molecules/group";
import UpdateCard from "~/components/molecules/update";
import { getClubGroupPassbook } from "~/models/passbook.server";
import { findTransaction } from "~/models/transaction.server";
import Stats from "~/components/molecules/stats";
import { getActiveVendorsWithSummary } from "~/models/user.server";
import VendorCard from "~/components/molecules/vendor-card";

export const loader = async ({ request }: LoaderArgs) => {
  const passbookData = await getClubGroupPassbook();
  const transactions = await findTransaction({});
  const vendors = await getActiveVendorsWithSummary();
  return json({ passbookData, transactions, vendors });
};

export default function IndexPage() {
  const { passbookData, transactions, vendors } =
    useLoaderData<typeof loader>();
  const { club, groups } = passbookData;

  return (
    <>
      <Stats club={club} />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="col-span-1 flex flex-col gap-4 lg:col-span-4">
          {groups?.map((each, key) => (
            <GroupCard key={key} {...each} />
          ))}
        </div>
        <div className="col-span-1 flex flex-col gap-4 lg:col-span-4">
          <VendorCard vendors={vendors as any} />
        </div>
        <div className="col-span-1 flex flex-col gap-4 lg:col-span-4">
          <UpdateCard transactions={transactions as any} />
        </div>
      </div>
    </>
  );
}
