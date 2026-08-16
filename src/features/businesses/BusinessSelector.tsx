"use client";

import { SelectField } from "@/components/ui/FormControls";
import { useSession } from "@/features/auth/SessionProvider";
import type { Membership } from "@/lib/contracts/auth";

export function BusinessSelector({
  value,
  onChange,
  role,
}: {
  value: string;
  onChange: (businessId: string) => void;
  role?: Membership["role"];
}) {
  const { session } = useSession();
  const memberships = session?.memberships.filter((item) => !role || item.role === role) ?? [];

  return (
    <SelectField label="Usaha" value={value} onChange={(event) => onChange(event.target.value)}>
      <option value="">Pilih usaha</option>
      {memberships.map((membership) => (
        <option key={membership.business_id} value={membership.business_id}>
          {membership.business_name} · {membership.location_name}
        </option>
      ))}
    </SelectField>
  );
}

export function useInitialBusiness(role?: Membership["role"]): string {
  const { session } = useSession();
  return (
    session?.memberships.find((membership) => !role || membership.role === role)?.business_id ?? ""
  );
}
