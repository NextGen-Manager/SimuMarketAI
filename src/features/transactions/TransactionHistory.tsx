"use client";

import { useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { DataSkeleton, EmptyState, ErrorState } from "@/components/ui/DataState";
import { BusinessSelector, useInitialBusiness } from "@/features/businesses/BusinessSelector";
import { useApiResource } from "@/lib/api/useApiResource";
import { transactionsSchema } from "@/lib/contracts/operations";
import { formatDateTime, formatIDR } from "@/lib/format";

export function TransactionHistory() {
  const initialBusiness = useInitialBusiness("owner");
  const [businessId, setBusinessId] = useState(initialBusiness);
  const { data, loading, error, reload } = useApiResource(
    businessId ? `/v1/transactions?business_id=${businessId}` : null,
    transactionsSchema,
  );

  return (
    <div className="space-y-5">
      <BusinessSelector value={businessId} onChange={setBusinessId} role="owner" />
      {!businessId ? (
        <EmptyState title="Pilih usaha" description="Riwayat transaksi ditampilkan per usaha." />
      ) : loading ? (
        <DataSkeleton />
      ) : error ? (
        <ErrorState message={error.message} correlationId={error.correlationId} retryable={error.retryable} onRetry={() => void reload()} />
      ) : data?.length ? (
        <div className="overflow-x-auto rounded-[12px] border border-line bg-surface">
          <table className="w-full min-w-[660px] text-left text-[13px]">
            <thead className="border-b border-line bg-surface-2 text-ink-500">
              <tr><th className="px-4 py-3">Waktu</th><th className="px-4 py-3">Kanal</th><th className="px-4 py-3">Produk</th><th className="px-4 py-3 text-right">Total</th></tr>
            </thead>
            <tbody className="divide-y divide-line-soft">
              {data.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-4 py-3">{formatDateTime(transaction.occurred_at)}</td>
                  <td className="px-4 py-3">{channelLabel(transaction.channel)}</td>
                  <td className="px-4 py-3 text-ink-500">{transaction.items.map((item) => `${item.product_name} × ${item.quantity}`).join(", ")}</td>
                  <td className="tnum px-4 py-3 text-right font-semibold text-ink-900">{formatIDR(transaction.gross_total_idr)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          title="Belum ada transaksi"
          description="Transaksi yang dicatat akan muncul di sini sebagai riwayat terpisah."
          action={<ButtonLink href="/transaksi/catat">Catat transaksi</ButtonLink>}
        />
      )}
    </div>
  );
}

function channelLabel(channel: string): string {
  return { dine_in: "Makan di tempat", takeaway: "Bawa pulang", delivery: "Pesan antar" }[channel] ?? channel;
}
