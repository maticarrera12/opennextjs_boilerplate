"use client";

import { Delete02Icon } from "hugeicons-react";

import BetterAuthActionButton from "@/app/[locale]/(auth)/_components/better-auth-action-button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { authClient } from "@/lib/auth-client";

export function Members() {
  const { data: activeOrganization } = authClient.useActiveOrganization();
  const { data: session } = authClient.useSession();

  function removeMember(memberId: string) {
    return authClient.organization.removeMember({
      memberIdOrEmail: memberId,
    });
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Members</h2>
      <p className="text-sm text-muted-foreground">Manage the members of your organization.</p>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activeOrganization?.members?.map((member) => (
            <TableRow key={member.id}>
              <TableCell>{member.user.name}</TableCell>
              <TableCell>{member.user.email}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    member.role === "owner"
                      ? "default"
                      : member.role === "admin"
                        ? "secondary"
                        : "outline"
                  }
                >
                  {member.role}
                </Badge>
              </TableCell>
              <TableCell>
                {member.userId !== session?.user.id && (
                  <BetterAuthActionButton
                    requireAreYouSure
                    variant="destructive"
                    size="sm"
                    action={() => removeMember(member.id)}
                  >
                    <Delete02Icon className="w-4 h-4" />
                  </BetterAuthActionButton>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
