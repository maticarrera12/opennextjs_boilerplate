"use client";

import React from "react";
import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { authClient } from "@/lib/auth-client";

export const OrganizationSelect = () => {
  const { data: activeOrganizations } = authClient.useActiveOrganization();
  const { data: organizations } = authClient.useListOrganizations();

  if (organizations == null || organizations.length === 0) return null;
  function setActiveOrganization(organizationId: string) {
    authClient.organization.setActive(
      {
        organizationId,
      },
      {
        onError: (error) => {
          toast.error(error.error.message || "Failed to set active organization");
        },
      }
    );
  }
  return (
    <Select value={activeOrganizations?.id ?? ""} onValueChange={setActiveOrganization}>
      <SelectTrigger>
        <SelectValue placeholder="Select an organization" />
      </SelectTrigger>
      <SelectContent>
        {organizations.map((organization) => (
          <SelectItem key={organization.id} value={organization.id}>
            {organization.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
