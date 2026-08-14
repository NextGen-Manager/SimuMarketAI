"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { FormField } from "@/components/ui/FormControls";
import { useSession } from "@/features/auth/SessionProvider";
import { apiFetch, ApiError } from "@/lib/api/client";
import { businessSchema, inviteSchema, membershipResultSchema, type Invite } from "@/lib/contracts/auth";
import { formatDateTime } from "@/lib/format";

export function BusinessSettings() {
  const { session, reload } = useSession();
  const [error, setError] = useState<ApiError | null>(null);
  const [invite, setInvite] = useState<Invite | null>(null);

  async function createBusiness(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setError(null);
    try {
      await apiFetch("/v1/businesses", businessSchema, {
        method: "POST",
        body: JSON.stringify({ name: String(form.get("name")), location_name: String(form.get("location_name")) }),
      });
      event.currentTarget.reset();
      await reload();
    } catch (caught) {
      setError(caught instanceof ApiError ? caught : null);
    }
  }

  async function createInvite(businessId: string) {
    setError(null);
    try {
      setInvite(await apiFetch(`/v1/businesses/${businessId}/invites`, inviteSchema, { method: "POST" }));
    } catch (caught) {
      setError(caught instanceof ApiError ? caught : null);
    }
  }

  async function redeemInvite(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setError(null);
    try {
      await apiFetch("/v1/invites/redeem", membershipResultSchema, {
        method: "POST",
        body: JSON.stringify({ code: String(form.get("code")).toUpperCase() }),
      });
      event.currentTarget.reset();
      await reload();
    } catch (caught) {
      setError(caught instanceof ApiError ? caught : null);
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Card>
        <CardHeader title="Tambah usaha" />
        <CardBody>
          <form onSubmit={createBusiness} className="space-y-4">
            <FormField label="Nama usaha" name="name" minLength={2} required />
            <FormField label="Lokasi" name="location_name" minLength={2} required placeholder="Kelurahan, kota" />
            <Button type="submit">Simpan usaha</Button>
          </form>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Gabung sebagai kasir" />
        <CardBody>
          <form onSubmit={redeemInvite} className="space-y-4">
            <FormField label="Kode undangan" name="code" minLength={8} maxLength={8} required />
            <Button type="submit" variant="secondary">Gunakan kode</Button>
          </form>
        </CardBody>
      </Card>

      {error ? (
        <div className="rounded-[12px] border border-danger-600/40 bg-danger-50 p-4 text-[13px] text-danger-600 lg:col-span-2" role="alert">
          {error.message} · ID korelasi {error.correlationId}
        </div>
      ) : null}

      <Card className="lg:col-span-2">
        <CardHeader title="Keanggotaan usaha" />
        <CardBody className="space-y-3">
          {session?.memberships.length ? session.memberships.map((membership) => (
            <div key={`${membership.business_id}-${membership.role}`} className="flex flex-col justify-between gap-3 rounded-[9px] border border-line-soft p-4 sm:flex-row sm:items-center">
              <div><p className="font-semibold text-ink-900">{membership.business_name}</p><p className="mt-1 text-[12px] text-ink-500">{membership.location_name} · {membership.role === "owner" ? "Pemilik" : "Kasir"}</p></div>
              {membership.role === "owner" ? <Button variant="secondary" onClick={() => void createInvite(membership.business_id)}>Buat kode kasir</Button> : null}
            </div>
          )) : <p className="text-[13px] text-ink-500">Belum ada keanggotaan usaha.</p>}
        </CardBody>
      </Card>

      {invite ? (
        <Card tone="key" className="lg:col-span-2">
          <CardHeader title="Kode kasir baru" />
          <CardBody>
            <p className="font-mono text-[28px] font-bold tracking-[0.16em] text-teal-700">{invite.code}</p>
            <p className="mt-2 text-[12px] text-ink-500">Berlaku hingga {formatDateTime(invite.expires_at)} dan hanya dapat digunakan satu kali.</p>
          </CardBody>
        </Card>
      ) : null}
    </div>
  );
}
