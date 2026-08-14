"use client";

import { ButtonLink } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { DataSkeleton, EmptyState, ErrorState } from "@/components/ui/DataState";
import { useSession } from "@/features/auth/SessionProvider";
import { useApiResource } from "@/lib/api/useApiResource";
import { dashboardSchema } from "@/lib/contracts/operations";
import { formatDateTime, formatIDR } from "@/lib/format";

export function DashboardView() {
  const { session } = useSession();
  const ownerMode = session?.memberships.some((item) => item.role === "owner") ?? false;
  const cashierBusiness = session?.memberships.find((item) => item.role === "cashier")?.business_id;
  const query = !ownerMode && cashierBusiness ? `?business_id=${cashierBusiness}` : "";
  const { data, loading, error, reload } = useApiResource(`/v1/dashboard${query}`, dashboardSchema);

  if (loading) return <DataSkeleton rows={3} />;
  if (error) {
    return (
      <ErrorState
        message={error.message}
        correlationId={error.correlationId}
        retryable={error.retryable}
        onRetry={() => void reload()}
      />
    );
  }
  if (!data) return null;

  if (data.keadaan === "belum_ada_data") {
    return (
      <EmptyState
        title="Mulai dari usaha pertamamu"
        description="Tambahkan profil usaha agar produk, transaksi, dan analitik tersimpan pada ruang yang tepat."
        action={<ButtonLink href="/pengaturan">Tambah usaha</ButtonLink>}
      />
    );
  }

  if (data.keadaan === "kasir_belum_mencatat") {
    return (
      <EmptyState
        title="Belum ada transaksi hari ini"
        description="Catat produk yang terjual. Harga dan total akan diverifikasi oleh server."
        action={<ButtonLink href="/transaksi/catat">Catat transaksi</ButtonLink>}
      />
    );
  }

  if (data.keadaan === "kasir_sudah_mencatat") {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <MetricCard label="Transaksi hari ini" value={String(data.transaksi.hari_ini.jumlah)} />
        <MetricCard label="Pendapatan hari ini" value={formatIDR(data.transaksi.hari_ini.pendapatan_idr)} />
        <div className="sm:col-span-2">
          <ButtonLink href="/transaksi/catat">Catat transaksi berikutnya</ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard label="Transaksi hari ini" value={String(data.transaksi.hari_ini.jumlah)} />
        <MetricCard label="Pendapatan hari ini" value={formatIDR(data.transaksi.hari_ini.pendapatan_idr)} />
        <MetricCard label="Hari tercatat" value={`${data.transaksi.hari_tercatat} dari ${data.transaksi.ambang} hari`} />
      </div>

      {data.keadaan === "usaha_berjalan_data_kurang" ? (
        <div className="rounded-[12px] border border-info-600/30 bg-info-50 p-5">
          <h2 className="font-semibold text-ink-900">Analitik sedang mengumpulkan data</h2>
          <p className="mt-1 text-[13px] leading-relaxed text-ink-700">
            Analitik transaksi tersedia setelah data penjualan tercatat pada 7 hari berbeda.
          </p>
        </div>
      ) : null}

      {data.insight_terbaru ? (
        <Card tone="key">
          <CardHeader title="Insight operasional terbaru" />
          <CardBody>
            <p className="text-[14px] leading-relaxed text-ink-700">{data.insight_terbaru.message}</p>
            <p className="mt-3 font-mono text-[10px] text-ink-400">
              {data.insight_terbaru.rule_version} · {data.insight_terbaru.observation_window.start} sampai {data.insight_terbaru.observation_window.end}
            </p>
          </CardBody>
        </Card>
      ) : null}

      {data.analisis_terakhir ? (
        <Card>
          <CardHeader title="Analisis terakhir" />
          <CardBody className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
            <div>
              <p className="font-semibold text-ink-900">{data.analisis_terakhir.nama}</p>
              <p className="mt-1 text-[13px] text-ink-500">{data.analisis_terakhir.area}</p>
              <p className="mt-3 text-[12px] text-ink-400">{formatDateTime(data.analisis_terakhir.dibuat)}</p>
            </div>
            <div className="tnum text-left sm:text-right">
              <p className="text-[32px] font-bold text-teal-700">{data.analisis_terakhir.skor}</p>
              <p className="text-[12px] text-ink-500">{data.analisis_terakhir.interpretasi}</p>
            </div>
          </CardBody>
        </Card>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <ButtonLink href="/transaksi/catat">Catat transaksi</ButtonLink>
        <ButtonLink href="/analitik" variant="secondary">Buka analitik</ButtonLink>
      </div>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardBody className="pt-5">
        <p className="label-eyebrow">{label}</p>
        <p className="tnum mt-2 text-[22px] font-bold text-ink-900">{value}</p>
      </CardBody>
    </Card>
  );
}
