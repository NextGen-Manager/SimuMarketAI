"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { DataSkeleton, EmptyState, ErrorState } from "@/components/ui/DataState";
import { FormField } from "@/components/ui/FormControls";
import { BusinessSelector, useInitialBusiness } from "@/features/businesses/BusinessSelector";
import { apiFetch, ApiError } from "@/lib/api/client";
import { useApiResource } from "@/lib/api/useApiResource";
import { productSchema, productsSchema } from "@/lib/contracts/operations";
import { formatIDR } from "@/lib/format";

export function ProductManager() {
  const initialBusiness = useInitialBusiness("owner");
  const [businessId, setBusinessId] = useState(initialBusiness);
  const [formOpen, setFormOpen] = useState(false);
  const [submitError, setSubmitError] = useState<ApiError | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const path = businessId ? `/v1/products?business_id=${businessId}` : null;
  const { data, loading, error, reload } = useApiResource(path, productsSchema);

  async function createProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSubmitting(true);
    setSubmitError(null);
    try {
      await apiFetch("/v1/products", productSchema, {
        method: "POST",
        body: JSON.stringify({
          business_id: businessId,
          name: String(form.get("name")),
          selling_price_idr: Number(form.get("selling_price_idr")),
          hpp_idr: Number(form.get("hpp_idr")),
        }),
      });
      event.currentTarget.reset();
      setFormOpen(false);
      await reload();
    } catch (caught) {
      setSubmitError(caught instanceof ApiError ? caught : null);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
        <BusinessSelector value={businessId} onChange={setBusinessId} role="owner" />
        <Button onClick={() => setFormOpen((open) => !open)} disabled={!businessId}>
          {formOpen ? "Tutup formulir" : "Tambah produk"}
        </Button>
      </div>

      {formOpen ? (
        <Card tone="key">
          <CardBody className="pt-5">
            <form onSubmit={createProduct} className="grid gap-4 sm:grid-cols-3 sm:items-end">
              <FormField label="Nama produk" name="name" required minLength={2} />
              <FormField label="Harga jual" name="selling_price_idr" type="number" min={0} step={1} required />
              <FormField label="HPP" name="hpp_idr" type="number" min={0} step={1} required />
              {submitError ? (
                <p className="text-[12px] text-danger-600 sm:col-span-3" role="alert">
                  {submitError.message} · ID {submitError.correlationId}
                </p>
              ) : null}
              <Button type="submit" disabled={submitting} className="sm:col-span-3 sm:w-fit">
                {submitting ? "Menyimpan..." : "Simpan produk"}
              </Button>
            </form>
          </CardBody>
        </Card>
      ) : null}

      {!businessId ? (
        <EmptyState title="Pilih usaha" description="Produk disimpan terpisah untuk setiap usaha." />
      ) : loading ? (
        <DataSkeleton />
      ) : error ? (
        <ErrorState message={error.message} correlationId={error.correlationId} retryable={error.retryable} onRetry={() => void reload()} />
      ) : data?.length ? (
        <div className="overflow-x-auto rounded-[12px] border border-line bg-surface">
          <table className="w-full min-w-[620px] text-left text-[13px]">
            <thead className="border-b border-line bg-surface-2 text-ink-500">
              <tr><th className="px-4 py-3">Produk</th><th className="px-4 py-3">Harga jual</th><th className="px-4 py-3">HPP</th><th className="px-4 py-3">Margin</th><th className="px-4 py-3">Status</th></tr>
            </thead>
            <tbody className="divide-y divide-line-soft">
              {data.map((product) => (
                <tr key={product.id}>
                  <td className="px-4 py-3 font-semibold text-ink-900">{product.name}</td>
                  <td className="tnum px-4 py-3">{formatIDR(product.selling_price_idr)}</td>
                  <td className="tnum px-4 py-3">{product.access === "owner" ? formatIDR(product.hpp_idr) : "Tidak tersedia"}</td>
                  <td className="tnum px-4 py-3">{product.access === "owner" ? formatIDR(product.margin_idr) : "Tidak tersedia"}</td>
                  <td className="px-4 py-3">{product.is_active ? "Aktif" : "Nonaktif"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          title="Belum ada produk"
          description="Tambahkan menu beserta harga jual dan HPP sebelum mulai mencatat transaksi."
          action={<Button onClick={() => setFormOpen(true)}>Tambah produk</Button>}
        />
      )}
    </div>
  );
}
