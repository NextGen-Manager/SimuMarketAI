"use client";

import { useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { DataSkeleton, EmptyState, ErrorState } from "@/components/ui/DataState";
import { BusinessSelector, useInitialBusiness } from "@/features/businesses/BusinessSelector";
import { useApiResource } from "@/lib/api/useApiResource";
import { analyticsSchema } from "@/lib/contracts/operations";
import { formatDate, formatIDR } from "@/lib/format";

export function AnalyticsView() {
  const initialBusiness = useInitialBusiness("owner");
  const [businessId, setBusinessId] = useState(initialBusiness);
  const { data, loading, error, reload } = useApiResource(
    businessId ? `/v1/transaction-analytics?business_id=${businessId}` : null,
    analyticsSchema,
  );

  return (
    <div className="space-y-5">
      <BusinessSelector value={businessId} onChange={setBusinessId} role="owner" />
      {!businessId ? (
        <EmptyState title="Pilih usaha" description="Analitik dihitung terpisah untuk setiap usaha." />
      ) : loading ? (
        <DataSkeleton rows={4} />
      ) : error ? (
        <ErrorState message={error.message} correlationId={error.correlationId} retryable={error.retryable} onRetry={() => void reload()} />
      ) : data?.status === "collecting" ? (
        <EmptyState
          title={`Data terkumpul ${data.days_recorded} dari ${data.threshold_days} hari`}
          description="Catat transaksi pada tujuh hari berbeda agar pola penjualan tidak ditarik dari observasi yang terlalu singkat."
          action={<ButtonLink href="/transaksi/catat">Catat transaksi</ButtonLink>}
        />
      ) : data ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <SalesCard title="Produk terlaris" name={data.top_product?.product_name} value={data.top_product ? `${data.top_product.quantity} terjual` : undefined} />
            <SalesCard title="Produk penjualan terendah" name={data.bottom_product?.product_name} value={data.bottom_product ? `${data.bottom_product.quantity} terjual` : undefined} />
          </div>
          <Card>
            <CardHeader title="Penjualan harian" aside={<span className="text-[11px] text-ink-400">Asia/Jakarta</span>} />
            <CardBody className="space-y-3">
              {data.daily_sales.map((day) => (
                <div key={day.date} className="grid grid-cols-[1fr_auto] gap-4 border-b border-line-soft pb-3 last:border-0 last:pb-0">
                  <div><p className="text-[13px] font-semibold text-ink-900">{formatDate(day.date)}</p><p className="text-[11px] text-ink-500">{day.transaction_count} transaksi</p></div>
                  <p className="tnum text-[13px] font-semibold text-ink-900">{formatIDR(day.revenue_idr)}</p>
                </div>
              ))}
            </CardBody>
          </Card>
          <Card tone="key">
            <CardHeader title="Rekomendasi operasional" />
            <CardBody className="space-y-3">
              {data.insights.length ? data.insights.map((insight, index) => (
                <div key={`${insight.rule_version}-${index}`}>
                  <p className="text-[13px] leading-relaxed text-ink-700">{insight.message}</p>
                  <p className="mt-1 font-mono text-[10px] text-ink-400">{insight.rule_version} · {insight.observation_window.start} sampai {insight.observation_window.end}</p>
                </div>
              )) : <p className="text-[13px] text-ink-500">Belum ada rekomendasi untuk jendela observasi ini.</p>}
            </CardBody>
          </Card>
          <Card tone="muted">
            <CardHeader title="Batasan data" />
            <CardBody>
              <ul className="list-disc space-y-2 pl-5 text-[12px] leading-relaxed text-ink-500">
                {data.limitations.map((limitation) => <li key={limitation}>{limitation}</li>)}
              </ul>
            </CardBody>
          </Card>
        </>
      ) : null}
    </div>
  );
}

function SalesCard({ title, name, value }: { title: string; name?: string; value?: string }) {
  return (
    <Card>
      <CardBody className="pt-5">
        <p className="label-eyebrow">{title}</p>
        <p className="mt-2 text-[18px] font-bold text-ink-900">{name ?? "Tidak tersedia"}</p>
        <p className="tnum mt-1 text-[12px] text-ink-500">{value ?? "Tidak tersedia"}</p>
      </CardBody>
    </Card>
  );
}
