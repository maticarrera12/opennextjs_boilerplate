import { headers } from "next/headers";

import AppLayoutWrapper from "./_components/app-layout-wrapper";
import { redirect } from "@/i18n/routing";
import { auth } from "@/lib/auth";

const layout = async ({ children, params }: any) => {
  const { locale } = await params;
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect({ href: "/signin", locale });
    return null;
  }
  return <AppLayoutWrapper>{children}</AppLayoutWrapper>;
};
export default layout;
