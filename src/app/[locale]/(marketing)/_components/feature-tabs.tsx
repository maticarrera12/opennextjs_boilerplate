"use client";

import { motion } from "framer-motion";
import {
  CloudUploadIcon,
  CreditCardIcon,
  DashboardSquare02Icon,
  SecurityValidationIcon,
  Tick01Icon,
} from "hugeicons-react";
import { useTranslations } from "next-intl";
import React from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export function FeatureTabs() {
  const t = useTranslations("featureTabs");

  const tabsData = [
    { value: "auth", label: t("tabs.auth"), icon: SecurityValidationIcon },
    { value: "payments", label: t("tabs.payments"), icon: CreditCardIcon },
    { value: "storage", label: t("tabs.storage"), icon: CloudUploadIcon },
    { value: "admin", label: t("tabs.admin"), icon: DashboardSquare02Icon },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:px-6 py-24 space-y-10">
      <Tabs defaultValue="auth" className="w-full flex flex-col items-center">
        <TabsList className="h-auto p-1.5 bg-muted/50 backdrop-blur-xl border border-white/10 rounded-full flex flex-wrap justify-center gap-1 w-fit mb-12">
          {tabsData.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className={cn(
                  "rounded-full px-6 py-3 text-sm font-medium transition-all duration-300 ease-out flex items-center gap-2",
                  "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-[0_4px_20px_-2px_rgba(0,0,0,0.1)]",
                  "hover:bg-background/50 hover:text-foreground text-muted-foreground"
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <div className="w-full min-h-[400px]">
          {tabsData.map((tab) => (
            <TabsContent
              key={tab.value}
              value={tab.value}
              className="w-full mt-0 focus-visible:ring-0"
            >
              <FeatureCard
                value={tab.value}
                icon={tab.icon}
                title={t(`${tab.value}.title`)}
                items={t.raw(`${tab.value}.items`) as string[]}
              />
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  items,
  value,
}: {
  icon: React.ComponentType<{ className?: string; size?: number }>;
  title: string;
  items: string[];
  value: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.98 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="grid md:grid-cols-2 gap-8 md:gap-12 items-center p-8 md:p-12 rounded-[2.5rem] bg-white dark:bg-white/5 border border-border shadow-sm"
    >
      <div className="space-y-8 order-2 md:order-1">
        <div className="space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
            <Icon size={28} />
          </div>
          <h3 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight leading-[1.1]">
            {title}
          </h3>
          <div className="h-1 w-20 bg-linear-to-r from-primary to-transparent rounded-full" />
        </div>

        <ul className="space-y-4">
          {items.map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-3 text-base md:text-lg text-muted-foreground"
            >
              <div className="mt-1 shrink-0 w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center text-green-600">
                <Tick01Icon size={12} strokeWidth={3} />
              </div>
              <span className="leading-tight">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="order-1 md:order-2 w-full aspect-4/3 bg-muted/30 rounded-4xl border border-border/50 overflow-hidden relative flex items-center justify-center">
        <TabVisual type={value} />
      </div>
    </motion.div>
  );
}

const TabVisual = ({ type }: { type: string }) => {
  switch (type) {
    case "auth":
      return (
        <div className="relative flex flex-col items-center gap-4">
          <div
            className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin"
            style={{ animationDuration: "3s" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <SecurityValidationIcon className="w-8 h-8 text-primary" />
          </div>
          <div className="bg-white dark:bg-neutral-800 shadow-xl rounded-xl p-4 flex items-center gap-3 absolute -bottom-12 animate-bounce-slow">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-xs font-mono">Authenticated</span>
          </div>
        </div>
      );
    case "payments":
      return (
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="w-48 h-32 bg-foreground rounded-xl shadow-2xl rotate-6 absolute z-10" />
          <div className="w-48 h-32 bg-primary rounded-xl shadow-xl -rotate-6 absolute z-0 opacity-80 flex items-center justify-center">
            <CreditCardIcon className="text-white/50 w-12 h-12" />
          </div>
          <div className="absolute top-10 right-10 bg-white dark:bg-neutral-900 px-3 py-1 rounded-full shadow-lg text-sm font-bold">
            $4,200.00
          </div>
        </div>
      );
    case "storage":
      return (
        <div className="relative w-full h-full flex items-end justify-center pb-10 px-10">
          <div className="w-full h-32 bg-neutral-200 dark:bg-neutral-800 rounded-t-2xl border-t-4 border-primary/50 relative overflow-hidden group">
            <div className="absolute inset-0 bg-primary/5 translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
            <div className="absolute top-4 left-4 flex gap-2">
              <div className="w-2 h-2 rounded-full bg-neutral-400" />
              <div className="w-2 h-2 rounded-full bg-neutral-400" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <CloudUploadIcon className="w-10 h-10 text-muted-foreground" />
            </div>
          </div>
          <div className="absolute top-10 left-20 w-10 h-12 bg-white dark:bg-neutral-700 shadow-md rounded border border-border -rotate-12" />
          <div className="absolute top-8 right-20 w-10 h-12 bg-white dark:bg-neutral-700 shadow-md rounded border border-border rotate-12" />
        </div>
      );
    case "admin":
      return (
        <div className="w-[80%] h-[60%] bg-white dark:bg-neutral-900 rounded-xl shadow-lg border border-border flex flex-col p-3 gap-2">
          <div className="flex gap-2 mb-2">
            <div className="w-1/3 h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full" />
          </div>
          <div className="flex-1 flex items-end gap-2 px-2 pb-2">
            <div className="w-full bg-primary/20 rounded-t-sm h-[40%]" />
            <div className="w-full bg-primary/40 rounded-t-sm h-[70%]" />
            <div className="w-full bg-primary rounded-t-sm h-[55%]" />
            <div className="w-full bg-primary/60 rounded-t-sm h-[90%]" />
          </div>
        </div>
      );
    default:
      return null;
  }
};
