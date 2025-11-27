import { headers } from "next/headers";
import React from "react";

import { CreateOrganizationButton } from "./_components/create-organization-button";
import { Invites } from "./_components/invites";
import { Members } from "./_components/members";
import { OrganizationSelect } from "./_components/organization-select";
import { redirect } from "@/i18n/routing";
import { auth } from "@/lib/auth";

const OrganizationPage = async ({ params }: { params: { locale: string } }) => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    redirect({ href: "/signin", locale: params.locale });
    return null;
  }
  return (
    <div className="flex flex-col gap-4">
      <CreateOrganizationButton />
      <OrganizationSelect />
      <Members />
      <Invites />
    </div>
  );
};

export default OrganizationPage;
