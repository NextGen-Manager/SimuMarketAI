"use client";

import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { DataSkeleton, EmptyState, ErrorState } from "@/components/ui/DataState";
import { SelectField } from "@/components/ui/FormControls";
import { BusinessSelector, useInitialBusiness } from "@/features/businesses/BusinessSelector";
import { apiFetch, ApiError } from "@/lib/api/client";
import { useApiResource } from "@/lib/api/useApiResource";
import { productsSchema, transactionSchema, type Transaction } from "@/lib/contracts/operations";
import { formatIDR } from "@/lib/format";

type QuantityMap = Record<string, number>;
const draftKey = "simumarket-transaction-draft";
const draftSchema = z.object({ quantities: z.record(z.string(), z.number().int().nonnegative()) });

function readDraft(): QuantityMap {
  if (typeof window === "undefined") return {};
  const saved = sessionStorage.getItem(draftKey);
  if (!saved) return {};
  try {
    const parsed = draftSchema.safeParse(JSON.parse(saved));
    return parsed.success ? parsed.data.quantities : {};
  } catch {
    return {};
  }
}

export function TransactionRecorder() {
  const initialBusiness = useInitialBusiness();
  const [businessId, setBusinessId] = useState(initialBusiness);
  const [quantities, setQuantities] = useState<QuantityMap>(readDraft);
  const [channel, setChannel] = useState("dine_in");
  const [result, setResult] = useState<Transaction | null>(null);
  const [submitError, setSubmitError] = useState<ApiError | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { data, loading, error, reload } = useApiResource(
    businessId ? `/v1/products?business_id=${businessId}` : null,
    productsSchema,
  );

  useEffect(() => {
    sessionStorage.setItem(draftKey, JSON.stringify({ quantities }));
  }, [quantities]);

  const selectedItems = useMemo(
    () =>
      (data ?? [])
        .filter((product) => (quantities[product.id] ?? 0) > 0)
        .map((product) => ({
          product_id: product.id,
          quantity: quantities[product.id],
          unit_price_idr: product.selling_price_idr,
        })),
    [data, quantities],
  );

  async function submit() {
    if (!businessId || selectedItems.length === 0) return;
    setSubmitting(true);
    setSubmitError(null);
    setResult(null);
    try {
      const transaction = await apiFetch("/v1/transactions", transactionSchema, {
        method: "POST",
        body: JSON.stringify({
          business_id: businessId,
          occurred_at: new Date().toISOString(),
          channel,
          client_reference: crypto.randomUUID(),
          items: selectedItems,
        }),
      });
      setResult(transaction);
      setQuantities({});
      sessionStorage.removeItem(draftKey);
    } catch (caught) {
      setSubmitError(caught instanceof ApiError ? caught : null);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <BusinessSelector value={businessId} onChange={(id) => { setBusinessId(id); setQuantities({}); }} />
        <SelectField label="Kanal penjualan" value={channel} onChange={(event) => setChannel(event.target.value)}>
          <option value="dine_in">Makan di tempat</option>
          <option value="takeaway">Bawa pulang</option>
          <option value="delivery">Pesan antar</option>
        </SelectField>
      </div>

      {!businessId ? (
        <EmptyState title="Pilih usaha" description="Transaksi akan dicatat pada usaha yang dipilih." />
      ) : loading ? (
        <DataSkeleton rows={4} />
      ) : error ? (
        <ErrorState message={error.message} correlationId={error.correlationId} retryable={error.retryable} onRetry={() => void reload()} />
      ) : data?.filter((product) => product.is_active).length ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {data.filter((product) => product.is_active).map((product) => {
            const quantity = quantities[product.id] ?? 0;
            return (
              <Card key={product.id} tone={quantity > 0 ? "key" : "default"}>
                <CardBody className="pt-5">
                  <p className="font-semibold text-ink-900">{product.name}</p>
                  <p className="tnum mt-1 text-[13px] text-ink-500">{formatIDR(product.selling_price_idr)}</p>
                  <div className="mt-4 flex items-center gap-3">
                    <Button variant="secondary" aria-label={`Kurangi ${product.name}`} onClick={() => setQuantities((current) => ({ ...current, [product.id]: Math.max(0, quantity - 1) }))}>−</Button>
                    <span className="tnum min-w-8 text-center font-bold text-ink-900">{quantity}</span>
                    <Button variant="secondary" aria-label={`Tambah ${product.name}`} onClick={() => setQuantities((current) => ({ ...current, [product.id]: quantity + 1 }))}>+</Button>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState title="Belum ada produk aktif" description="Minta pemilik usaha menambahkan produk terlebih dahulu." />
      )}

      {submitError ? (
        <ErrorState message={submitError.message} correlationId={submitError.correlationId} retryable={submitError.retryable} onRetry={() => void submit()} />
      ) : null}
      {result ? (
        <div className="rounded-[12px] border border-success-600/30 bg-success-50 p-5" role="status">
          <p className="font-semibold text-ink-900">Transaksi berhasil dicatat</p>
          <p className="tnum mt-1 text-[20px] font-bold text-success-600">{formatIDR(result.gross_total_idr)}</p>
          <p className="mt-2 text-[11px] text-ink-500">Total dihitung dan dikonfirmasi oleh server.</p>
        </div>
      ) : null}
      <Button className="w-full sm:w-auto" onClick={() => void submit()} disabled={submitting || selectedItems.length === 0}>
        {submitting ? "Menyimpan..." : "Simpan transaksi"}
      </Button>
    </div>
  );
}
