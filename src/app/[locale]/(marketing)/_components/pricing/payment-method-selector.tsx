"use client";

import { motion } from "framer-motion";
import { ArrowRight01Icon } from "hugeicons-react";
import { useTranslations } from "next-intl";

interface PaymentMethodSelectorProps {
  onSelectStripe: () => void;
  onSelectLemon: () => void;
}

export function PaymentMethodSelector({
  onSelectStripe,
  onSelectLemon,
}: PaymentMethodSelectorProps) {
  const t = useTranslations("pricing.paymentModal");

  return (
    <div className="w-full max-w-md mx-auto p-2">
      <div className="text-center mb-8 space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          {t("title")}
        </h2>
        <p className="text-muted-foreground text-sm">{t("subtitle")}</p>
      </div>

      <div className="space-y-3">
        <PaymentOption
          onClick={onSelectStripe}
          brandColor="#635BFF"
          title="Stripe"
          subtitle="Credit & Debit Cards"
          icon={
            <svg viewBox="0 0 60 25" fill="currentColor" className="w-full h-full">
              <path d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a8.33 8.33 0 0 1-4.56 1.1c-4.01 0-6.83-2.5-6.83-7.48 0-4.19 2.39-7.52 6.3-7.52 3.92 0 5.96 3.28 5.96 7.5 0 .4-.04 1.26-.06 1.48zm-5.92-5.62c-1.03 0-2.17.73-2.17 2.58h4.25c0-1.85-1.07-2.58-2.08-2.58zM40.95 20.3c-1.44 0-2.32-.6-2.9-1.04l-.02 4.63-4.12.87V5.57h3.76l.08 1.02a4.7 4.7 0 0 1 3.23-1.29c2.9 0 5.62 2.6 5.62 7.4 0 5.23-2.7 7.6-5.65 7.6zM40 8.95c-.95 0-1.54.34-1.97.81l.02 6.12c.4.44.98.78 1.95.78 1.52 0 2.54-1.65 2.54-3.87 0-2.15-1.04-3.84-2.54-3.84zM28.24 5.57h4.13v14.44h-4.13V5.57zm0-4.7L32.37 0v3.36l-4.13.88V.88zm-4.32 9.35v9.79H19.8V5.57h3.7l.12 1.22c1-1.77 3.07-1.41 3.62-1.22v3.79c-.52-.17-2.29-.43-3.32.86zm-8.55 4.72c0 2.43 2.6 1.68 3.12 1.46v3.36c-.55.3-1.54.54-2.89.54a4.15 4.15 0 0 1-4.27-4.24l.01-13.17 4.02-.86v3.54h3.14V9.1h-3.13v5.85zm-4.91.7c0 2.97-2.31 4.66-5.73 4.66a11.2 11.2 0 0 1-4.46-.93v-3.93c1.38.75 3.1 1.31 4.46 1.31.92 0 1.53-.24 1.53-1C6.26 13.77 0 14.51 0 9.95 0 7.04 2.28 5.3 5.62 5.3c1.36 0 2.72.2 4.09.75v3.88a9.23 9.23 0 0 0-4.1-1.06c-.86 0-1.44.25-1.44.93 0 1.85 6.29.97 6.29 5.88z" />
            </svg>
          }
        />

        <PaymentOption
          onClick={onSelectLemon}
          brandColor="#FFC233"
          title="Lemon Squeezy"
          subtitle="Global Payments"
          badge={t("comingSoon") || "Coming Soon"}
          icon={<span className="text-xl">🍋</span>}
        />
      </div>

      <div className="mt-8 flex items-center justify-center gap-2 text-xs text-muted-foreground opacity-70">
        <div className="w-2 h-2 rounded-full bg-green-500" />
        <span>256-bit SSL Secured Payment</span>
      </div>
    </div>
  );
}

function PaymentOption({
  onClick,
  brandColor,
  title,
  subtitle,
  icon,
  badge,
}: {
  onClick: () => void;
  brandColor: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  badge?: string;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group w-full flex items-center justify-between p-4 rounded-[1.25rem] bg-white dark:bg-white/5 border border-border shadow-sm hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-center gap-4">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 p-3"
          style={{ backgroundColor: `${brandColor}15` }}
        >
          <div
            style={{ color: brandColor }}
            className="w-full h-full flex items-center justify-center"
          >
            {icon}
          </div>
        </div>

        <div className="text-left space-y-0.5">
          <div className="font-bold text-foreground flex items-center gap-2">
            {title}
            {badge && (
              <span className="px-2 py-0.5 rounded-full bg-muted text-[10px] font-bold uppercase tracking-wider text-muted-foreground border border-border/50">
                {badge}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground font-medium">{subtitle}</p>
        </div>
      </div>

      <div className="pr-2 text-muted-foreground/50 group-hover:text-foreground group-hover:translate-x-1 transition-all duration-300">
        <ArrowRight01Icon className="w-6 h-6" />
      </div>
    </motion.button>
  );
}
