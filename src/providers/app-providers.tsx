"use client";

import { NextIntlClientProvider } from "next-intl";

import { QueryProvider } from "./query-provider";
import { ThemeProvider } from "./theme-provider";

export function AppProviders({
  children,
  locale,
  messages,
}: {
  children: React.ReactNode;
  locale: string;
  messages: any;
}) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <QueryProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </QueryProvider>
    </NextIntlClientProvider>
  );
}
