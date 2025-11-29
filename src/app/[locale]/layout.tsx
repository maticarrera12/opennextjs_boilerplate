import "../globals.css";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "sonner";

import { AppProviders } from "../../../app-providers";
import { StopImpersonatingBanner } from "@/components/ui/stop-impersonation";
import { loadMessages } from "@/lib/load-messages";
import MessagesProvider from "@/providers/message-provider";

export default async function LocaleLayout({ children, params }: any) {
  const { locale } = params;
  const messages = await loadMessages(locale);

  return (
    <html lang={locale}>
      <body>
        <MessagesProvider locale={locale} messages={messages}>
          <AppProviders>
            {children}
            <StopImpersonatingBanner />
            <Toaster position="top-right" richColors />
            <Analytics />
            <SpeedInsights />
          </AppProviders>
        </MessagesProvider>
      </body>
    </html>
  );
}
