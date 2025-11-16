"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { AuthShell } from "../_components/auth-shell";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { useLocaleRouting } from "@/hooks/useLocaleRouting";
import { authClient } from "@/lib/auth-client";
import { forgotPasswordSchema, ForgotPasswordInput } from "@/lib/schemas/auth.schema";

function ForgotPassword() {
  const { push, locale } = useLocaleRouting();
  const t = useTranslations("auth.forgotPassword");
  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const { isSubmitting } = form.formState;

  async function handleForgotPassword(data: ForgotPasswordInput) {
    await authClient.requestPasswordReset(
      {
        ...data,
        redirectTo: `/${locale}/reset-password`,
      },
      {
        onError: (error) => {
          toast.error(error.error.message || t("error"));
        },
        onSuccess: () => {
          toast.success(t("success"));
        },
      }
    );
  }

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(handleForgotPassword)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("email")}</FormLabel>
              <FormControl>
                <Input type="email" placeholder={t("email")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => push("/signin")}>
            {t("backToSignIn")}
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <LoadingSwap isLoading={isSubmitting}>{t("submit")}</LoadingSwap>
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default function ForgotPasswordPage() {
  const t = useTranslations("auth.forgotPassword");

  return (
    <AuthShell
      title="Don't worry it happens! Resetting your password is quick and easy."
      subtitle="Just enter your registered email address below, and we'll send you a secure link to reset your password. Follow the instructions in the email, and you'll be back in your account in no time!"
      cardTitle="Follow the instructions"
      cardSubtitle="If you don't see the email in your inbox, be sure to check your spam or junk folder."
    >
      <div className="flex items-center justify-center bg-background px-4">
        <div className=" w-full space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-primary">{t("title")}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{t("subtitle")}</p>
          </div>

          <div>
            <ForgotPassword />
          </div>
        </div>
      </div>
    </AuthShell>
  );
}
