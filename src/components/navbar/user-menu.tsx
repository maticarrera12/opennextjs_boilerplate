"use client";
import { useQueryClient } from "@tanstack/react-query";
import { BoltIcon, BookOpenIcon, LogOutIcon, PinIcon, UserPenIcon, ShieldIcon } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAdminRoleQuery } from "@/hooks/useAdminRoleQuery";
import { useLocaleRouting } from "@/hooks/useLocaleRouting";
import { useSessionQuery } from "@/hooks/useSessionQuery";
import { authClient } from "@/lib/auth-client";

export default function UserMenu() {
  const { data: session } = useSessionQuery();
  const { data: adminData } = useAdminRoleQuery(!!session?.user);
  const { locale, push } = useLocaleRouting();
  const t = useTranslations("userMenu");
  const queryClient = useQueryClient();

  if (!session?.user) return null;
  const isAdmin = adminData?.isAdmin ?? false;
  const userPlan = (session.user as { plan?: string })?.plan || "FREE";

  const handleSignOut = async () => {
    await authClient.signOut();
    queryClient.removeQueries({ queryKey: ["session"], exact: true });
    queryClient.removeQueries({ queryKey: ["adminRole"], exact: true });
    queryClient.removeQueries({ queryKey: ["userPlan"], exact: true });
    queryClient.removeQueries({ queryKey: ["credits"], exact: true });

    queryClient.invalidateQueries();
    push("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
          <Avatar>
            <AvatarImage src={session.user.image || ""} alt="Profile" />
            <AvatarFallback>{session.user.name?.[0]?.toUpperCase() ?? "U"}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="max-w-64 min-w-56" align="end" sideOffset={8}>
        <DropdownMenuLabel className="flex flex-col gap-0.5">
          <span className="truncate text-sm font-medium">{session.user.name}</span>
          <span className="truncate text-xs text-muted-foreground">{session.user.email}</span>
          <span className="truncate text-xs font-semibold text-primary">{userPlan} Plan</span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={`/${locale}/settings/account/profile`}>
              <BoltIcon size={16} className="opacity-60" /> <span>{t("menu.option1")}</span>
            </Link>
          </DropdownMenuItem>
          {isAdmin && (
            <DropdownMenuItem asChild>
              <Link href={`/${locale}/dashboard`}>
                <ShieldIcon size={16} className="opacity-60" /> <span>{t("menu.adminPanel")}</span>
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem>
            <BookOpenIcon size={16} className="opacity-60" /> <span>{t("menu.option3")}</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem>
            <PinIcon size={16} className="opacity-60" /> <span>{t("menu.option4")}</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <UserPenIcon size={16} className="opacity-60" /> <span>{t("menu.option5")}</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOutIcon size={16} className="opacity-60" /> <span>{t("menu.logout")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
