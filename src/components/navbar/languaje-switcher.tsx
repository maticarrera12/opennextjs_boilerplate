"use client";

import { LanguageSquareIcon } from "hugeicons-react";
import React from "react";

import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { useLocaleRouting } from "@/hooks/useLocaleRouting";
import { cn } from "@/lib/utils";

const languages = [
  { value: "en", label: "English", flag: "🇬🇧" },
  { value: "es", label: "Español", flag: "🇪🇸" },
];

interface LanguageSwitcherProps {
  variant?: "default" | "sidebar";
  onOpenChange?: (isOpen: boolean) => void;
}

export function LanguageSwitcher({ variant = "default", onOpenChange }: LanguageSwitcherProps) {
  const { router, pathname, locale } = useLocaleRouting();

  const handleChange = (nextLocale: string) => {
    router.replace(pathname, { locale: nextLocale });
  };

  const currentLang = languages.find((l) => l.value === locale) || languages[0];

  return (
    <Select value={locale} onValueChange={handleChange} onOpenChange={onOpenChange}>
      <SelectTrigger
        className={cn(
          "relative flex items-center gap-2 transition-all duration-200 outline-none focus:ring-0 ring-0 focus:ring-offset-0",
          "h-9 rounded-lg px-2 text-sm font-medium",
          variant === "sidebar"
            ? cn(
                "bg-transparent border border-transparent",
                "text-muted-foreground hover:text-foreground",
                "hover:bg-muted/60"
              )
            : cn(
                "bg-background border border-border/40 shadow-sm",
                "text-foreground hover:bg-muted/40"
              )
        )}
        aria-label="Select language"
      >
        <LanguageSquareIcon size={20} className="shrink-0" />

        <span
          className={cn("truncate", variant === "sidebar" ? "text-current" : "text-foreground/80")}
        >
          {currentLang.label}
        </span>
      </SelectTrigger>

      <SelectContent
        align={variant === "sidebar" ? "start" : "end"}
        className={cn(
          "min-w-[150px] overflow-hidden rounded-xl border border-border p-1 shadow-lg backdrop-blur-xl z-50",
          "bg-popover/95 text-popover-foreground",
          "animate-in fade-in zoom-in-95 duration-200"
        )}
      >
        {languages.map((lang) => (
          <SelectItem
            key={lang.value}
            value={lang.value}
            className="cursor-pointer rounded-lg focus:bg-accent focus:text-accent-foreground pl-8"
          >
            <span className="flex items-center gap-2">
              <span className="text-base leading-none">{lang.flag}</span>
              <span>{lang.label}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
