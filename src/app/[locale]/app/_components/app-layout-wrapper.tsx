"use client";

import AppMainSidebar from "./app-main-sidebar";
import Header from "@/components/header/header";
import { SidebarProvider } from "@/contexts/sidebar-context";

export default function AppLayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-card">
        <AppMainSidebar />
        <main className="flex-1 ml-6 mr-6 my-6 md:ml-0 rounded-lg overflow-y-auto bg-background pt-14 md:pt-0">
          <Header />
          <div className="mx-auto max-w-7xl p-6 md:p-10">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
