"use client";

import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import {
  DataSkeleton,
  ErrorState,
  UnauthorizedState,
} from "@/components/ui/DataState";
import { ScoreGauge } from "@/components/ui/Gauge";
import { Callout, MeterBar, MetricTile } from "@/components/ui/Metric";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ExportButton } from "@/features/exports/ExportButton";
import { useApiResource } from "@/lib/api/useApiResource";
import {
  analysisReadSchema,
  analysisReportSchema,
  channelLabels,
  confidenceLabels,
  metricLabels,
  statusLabels,
  type AgentReview,
  type AnalysisReport,
  type SyntheticSimulation,
} from "@/lib/contracts/analysis";
import { businessTypeLabels } from "@/lib/contracts/education";
import {
  formatBasisPoints,
  formatDate,
  formatDateTime,
  formatIDR,
  formatKeyakinan,
  formatSatuan,
} from "@/lib/format";

export function ReportView({ analysisId }: { analysisId: string }) {
  const run = useApiResource(`/v1/analyses/${analysisId}`, analysisReadSchema);
  const reportPath =
    run.data && run.data.status !== "failed" && run.data.status !== "cancelled"
      ? `/v1/analyses/${analysisId}/report`
      : null;
  const report = useApiResource(reportPath, analysisReportSchema);

  if (run.loading) return <DataSkeleton rows={5} />;
  if (run.error?.status === 401) return <UnauthorizedState next={`/laporan/${analysisId}`} />;
  if (run.error) {
    return (
      <ErrorState
        message={run.error.message}
        correlationId={run.error.correlationId}
        retryable={run.error.retryable}
        onRetry={() => void run.reload()}
      />
    );
  }
  if (!run.data) return null;

  if (run.data.status === "failed" || run.data.status === "cancelled") {
    return (
      <Card tone="invalid">
        <CardHeader title="Laporan tidak tersedia" />
        <CardBody>
          <p className="text-[14px] leading-relaxed text-ink-700">
            Analisis berstatus {statusLabels[run.data.status] ?? run.data.status} sehingga tidak
            ada laporan yang dapat ditampilkan. Tidak ada angka sementara yang diisikan
            menggantikan hasil yang gagal.
          </p>
          {run.data.failure_code ? (
            <p className="mt-3 font-mono text-[11px] text-ink-500">
              Kode kegagalan: {run.data.failure_code}
            </p>
          ) : null}
          <p className="mt-1 font-mono text-[11px] text-ink-500">
            ID korelasi: {run.data.correlation_id}
          </p>
          <div className="mt-5">
            <ButtonLink href="/analisis" variant="secondary">
              Jalankan analisis baru
            </ButtonLink>
          </div>
        </CardBody>
      </Card>
    );
  }

  if (report.loading) return <DataSkeleton rows={5} />;
  if (report.error?.status === 401) return <UnauthorizedState next={`/laporan/${analysisId}`} />;
  if (report.error) {
    return (
      <ErrorState
        message={report.error.message}
        correlationId={report.error.correlationId}
        retryable={report.error.retryable}
        onRetry={() => void report.reload()}
      />
    );
  }
  if (!report.data) return null;

  return <ReportSections report={report.data} analysisId={analysisId} />;
}

function ReportSections({ report, analysisId }: { report: AnalysisReport; analysisId: string }) {
  const partial = report.status === "partial";
  const readiness = report.readiness;
  const finance = report.finance;
  const input = report.input_snapshot;

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <ExportButton
          endpoint={`/v1/analyses/${analysisId}/exports`}
          payload={{ format: "pdf" }}
          label="Unduh laporan PDF"
        />
      </div>
      {partial ? (
        <Callout tone="warn">
          <p className="font-semibold text-ink-900">Laporan selesai sebagian</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {report.warnings.map((warning) => (
              <li key={warning.code}>{warning.message}</li>
            ))}
          </ul>
          <p className="mt-2">
            Bagian yang tidak tersedia tetap ditampilkan pada posisinya dan tidak diberi nilai
            bawaan.
          </p>
        </Callout>
      ) : null}

      <Section number="01" title="Launch Readiness Score">
        {readiness.status === "available" && readiness.score !== null ? (
          <div className="flex flex-col items-center gap-4">
            <ScoreGauge
              nilai={readiness.score}
              interpretasi={readiness.interpretation_label ?? ""}
            />
          </div>
        ) : (
          <Callout tone="warn">
            <p className="font-semibold text-ink-900">Skor tidak tersedia</p>
            <p className="mt-1">
              Skor total tidak dihitung karena sebagian dimensi belum dapat dinilai. Bobot
              dimensi yang hilang tidak dialihkan ke dimensi lain.
            </p>
            {readiness.missing_dimensions.length > 0 ? (
              <p className="mt-2">
                Dimensi yang belum dapat dinilai:{" "}
                {readiness.missing_dimensions
                  .map(
                    (key) =>
                      readiness.dimensions.find((dimension) => dimension.key === key)?.label ??
                      key,
                  )
                  .join(", ")}
                .
              </p>
            ) : null}
          </Callout>
        )}

        <div className="mt-5 space-y-4">
          {readiness.dimensions.map((dimension) => (
            <div key={dimension.key}>
              {dimension.status === "scored" && dimension.score !== null ? (
                <MeterBar
                  label={`${dimension.label} (bobot ${dimension.weight_percent}%)`}
                  value={dimension.score}
                  valueLabel={`${dimension.score} dari 100`}
                />
              ) : (
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="text-[13px] font-medium text-ink-700">
                    {dimension.label} (bobot {dimension.weight_percent}%)
                  </span>
                  <StatusBadge status="tidak-tersedia" label="Tidak dapat dinilai" />
                </div>
              )}
              <p className="mt-1 text-[12px] leading-snug text-ink-500">{dimension.rationale}</p>
              {dimension.applied_rules.length > 0 ? (
                <p className="mt-0.5 font-mono text-[10px] text-ink-400">
                  Rule: {dimension.applied_rules.join(", ")}
                </p>
              ) : null}
            </div>
          ))}
        </div>

        <p className="mt-4 font-mono text-[10px] text-ink-400">
          {readiness.rule_version} · status validasi {readiness.validation_status}
        </p>
      </Section>

      <Section number="02" title="Evidence Confidence">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-[12px] border border-line bg-surface px-4 py-3.5">
            <p className="label-eyebrow mb-1.5">Skor keyakinan bukti</p>
            <p
              className={
                report.evidence_confidence.score === null
                  ? "text-[17px] font-semibold text-ink-500"
                  : "tnum text-[22px] font-bold text-ink-900"
              }
            >
              {formatKeyakinan(report.evidence_confidence.score)}
            </p>
            <p className="mt-0.5 text-[12px] text-ink-500">
              Label{" "}
              {confidenceLabels[report.evidence_confidence.label] ??
                report.evidence_confidence.label}
            </p>
            {report.evidence_confidence.score === null ? (
              <p className="mt-1 text-[12px] leading-snug text-warn-600">
                Belum ada bukti yang berhasil diambil sehingga rata-rata tidak dapat dihitung.
              </p>
            ) : null}
          </div>
          <div className="rounded-[12px] border border-line bg-surface px-4 py-3.5">
            <p className="label-eyebrow mb-1.5">Bukti yang belum tersedia</p>
            {report.evidence_confidence.missing.length === 0 ? (
              <p className="text-[14px] text-ink-700">Tidak ada.</p>
            ) : (
              <ul className="list-disc space-y-1 pl-5 text-[13px] text-ink-700">
                {report.evidence_confidence.missing.map((metric) => (
                  <li key={metric}>{metricLabels[metric] ?? metric}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <p className="mt-3 text-[12.5px] leading-relaxed text-ink-500">
          Keyakinan bukti tampil berdampingan dengan skor dan tidak menaikkan maupun menurunkan
          skor tersebut.
        </p>
        <p className="mt-2 font-mono text-[10px] text-ink-400">
          {report.evidence_confidence.formula_version} · snapshot{" "}
          {report.evidence_snapshot_version}
        </p>
      </Section>

      <Section number="03" title="Parameter yang dianalisis">
        <dl className="grid gap-3 sm:grid-cols-2">
          <Detail label="Nama konsep" value={input.concept_name} />
          <Detail label="Jenis usaha" value={businessTypeLabels[input.business_type]} />
          <Detail
            label="Area"
            value={`${input.location.area_name ?? input.location.area_id} · radius ${input.location.analysis_radius_m} m`}
          />
          <Detail
            label="Kanal"
            value={input.channels.map((channel) => channelLabels[channel]).join(", ")}
          />
          <Detail
            label="Harga jual rata-rata"
            value={formatIDR(input.pricing.average_selling_price_idr)}
          />
          <Detail
            label="Biaya variabel per unit"
            value={formatIDR(input.pricing.variable_cost_per_unit_idr)}
          />
          <Detail
            label="Modal awal"
            value={formatIDR(input.operations.initial_investment_idr)}
          />
          <Detail
            label="Biaya tetap per bulan"
            value={formatIDR(input.operations.fixed_cost_month_idr)}
          />
          <Detail
            label="Hari operasi per bulan"
            value={formatSatuan(input.operations.operating_days_month, "hari")}
          />
          <Detail
            label="Kapasitas harian"
            value={formatSatuan(input.operations.capacity_units_day, "unit")}
          />
          <Detail
            label="Volume harian"
            value={`${input.operations.volume_units_day.min} / ${input.operations.volume_units_day.base} / ${input.operations.volume_units_day.max} unit`}
          />
          {input.value_proposition ? (
            <Detail label="Nilai jual utama" value={input.value_proposition} />
          ) : null}
        </dl>
        <p className="mt-3 text-[12.5px] text-ink-500">
          Nilai di atas adalah snapshot input yang dibekukan saat analisis dimulai.
        </p>
      </Section>

      <Section number="04" title="Analisis pasar dan kompetitor">
        <div className="grid gap-4 sm:grid-cols-2">
          <MetricTile
            label="Jumlah kompetitor"
            value={formatSatuan(report.market.competitor_count, "gerai")}
            undefinedLabel="Tidak tersedia"
            undefinedReason={
              report.market.competitor_count === null
                ? "Sumber data kompetitor belum tersedia."
                : undefined
            }
          />
          <MetricTile
            label="Populasi pada radius"
            value={formatSatuan(report.market.population_count, "jiwa")}
            undefinedLabel="Tidak tersedia"
            undefinedReason={
              report.market.population_count === null
                ? "Sumber data populasi belum tersedia."
                : undefined
            }
          />
          <MetricTile
            label="Median harga pembanding"
            value={formatIDR(report.market.comparable_price_median_idr)}
            undefinedLabel="Tidak tersedia"
            undefinedReason={
              report.market.comparable_price_median_idr === null
                ? "Observasi harga pembanding belum tersedia."
                : undefined
            }
          />
          <MetricTile
            label="Jumlah observasi harga"
            value={formatSatuan(report.market.comparable_price_sample_size, "observasi")}
            undefinedLabel="Tidak tersedia"
            undefinedReason={
              report.market.comparable_price_sample_size === null
                ? "Observasi harga pembanding belum tersedia."
                : undefined
            }
          />
        </div>
        {report.market.notes.length > 0 ? (
          <ul className="mt-4 list-disc space-y-1 pl-5 text-[13px] text-ink-500">
            {report.market.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        ) : null}
        <p className="mt-3 font-mono text-[10px] text-ink-400">
          Taksonomi kategori {report.market.category_mapping_version}
        </p>
      </Section>

      <Section number="05" title="Proyeksi finansial">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricTile
            label="Marjin kontribusi per unit"
            value={formatIDR(finance.contribution_margin_per_unit_idr)}
          />
          <MetricTile
            label="Rasio marjin kontribusi"
            value={formatBasisPoints(finance.contribution_margin_ratio_bps)}
            undefinedReason={
              finance.contribution_margin_ratio_bps === null
                ? "Harga jual nol sehingga rasio tidak terdefinisi."
                : undefined
            }
          />
          <MetricTile
            label="BEP per bulan"
            value={formatSatuan(finance.bep_units_month, "unit")}
            note={
              finance.bep_units_day === null
                ? undefined
                : `Setara ${finance.bep_units_day} unit per hari`
            }
            undefinedReason={
              finance.bep_units_month === null
                ? "Marjin kontribusi tidak positif sehingga BEP tidak terdefinisi."
                : undefined
            }
          />
          <MetricTile
            label="BEP pendapatan per bulan"
            value={formatIDR(finance.bep_revenue_month_idr)}
            undefinedReason={
              finance.bep_revenue_month_idr === null
                ? "Marjin kontribusi tidak positif sehingga BEP tidak terdefinisi."
                : undefined
            }
          />
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-[13px]">
            <caption className="sr-only">Skenario finansial deterministik</caption>
            <thead>
              <tr className="border-b border-line text-left text-ink-500">
                <th scope="col" className="py-2 pr-3 font-semibold">
                  Skenario
                </th>
                <th scope="col" className="py-2 pr-3 font-semibold">
                  Volume harian
                </th>
                <th scope="col" className="py-2 pr-3 font-semibold">
                  Pendapatan bulanan
                </th>
                <th scope="col" className="py-2 pr-3 font-semibold">
                  Laba operasional bulanan
                </th>
                <th scope="col" className="py-2 font-semibold">
                  Payback
                </th>
              </tr>
            </thead>
            <tbody className="tnum">
              {finance.scenarios.map((scenario) => (
                <tr key={scenario.name} className="border-b border-line-soft">
                  <td className="py-2 pr-3 text-ink-900">{scenario.label}</td>
                  <td className="py-2 pr-3 text-ink-700">
                    {formatSatuan(scenario.volume_units_day, "unit")}
                    {scenario.exceeds_capacity ? " · melebihi kapasitas" : ""}
                  </td>
                  <td className="py-2 pr-3 text-ink-700">
                    {formatIDR(scenario.monthly_revenue_idr)}
                  </td>
                  <td className="py-2 pr-3 text-ink-700">
                    {formatIDR(scenario.monthly_operating_profit_idr)}
                  </td>
                  <td className="py-2 text-ink-700">
                    {scenario.payback_months === null
                      ? "Tidak terdefinisi"
                      : formatSatuan(scenario.payback_months, "bulan")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {finance.warnings.length > 0 ? (
          <ul className="mt-4 list-disc space-y-1 pl-5 text-[13px] text-warn-600">
            {finance.warnings.map((warning) => (
              <li key={`${warning.code}-${warning.scenario ?? "umum"}`}>{warning.message}</li>
            ))}
          </ul>
        ) : null}

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <AssumptionList title="Termasuk dalam hitungan" items={finance.assumptions_included} />
          <AssumptionList title="Tidak termasuk" items={finance.assumptions_excluded} />
        </div>
        <p className="mt-3 font-mono text-[10px] text-ink-400">
          {finance.rule_version} · mata uang {finance.currency}
        </p>
      </Section>

      <Section number="06" title="Simulasi persona sintetis">
        <SimulationSection simulation={report.synthetic_simulation} />
      </Section>

      <Section number="07" title="Tinjauan agent">
        <AgentReviewSection review={report.agent_review} />
      </Section>

      <Section number="08" title="Peta risiko">
        {report.risks.length === 0 ? (
          <p className="text-[14px] text-ink-500">Tidak ada risiko yang terdeteksi rule.</p>
        ) : (
          <ul className="space-y-3">
            {report.risks.map((risk) => (
              <li key={risk.id} className="rounded-[10px] border border-line px-4 py-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[14px] font-semibold text-ink-900">{risk.title}</span>
                  <StatusBadge
                    status={risk.severity === "tinggi" ? "perlu-dilengkapi" : "perlu-dikonfirmasi"}
                    label={`Risiko ${risk.severity}`}
                  />
                </div>
                <p className="mt-1 text-[13px] leading-relaxed text-ink-700">{risk.detail}</p>
                <p className="mt-1 font-mono text-[10px] text-ink-400">Sumber: {risk.source}</p>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section number="09" title="Rekomendasi prioritas">
        {report.recommendations.length === 0 ? (
          <p className="text-[14px] text-ink-500">Tidak ada rekomendasi dari rule saat ini.</p>
        ) : (
          <ol className="space-y-3">
            {report.recommendations.map((recommendation) => (
              <li
                key={recommendation.id}
                className="rounded-[10px] border border-line px-4 py-3"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[14px] font-semibold text-ink-900">
                    {recommendation.title}
                  </span>
                  <span className="text-[11px] font-semibold text-ink-500">
                    Prioritas {recommendation.priority}
                  </span>
                </div>
                <p className="mt-1 text-[13px] leading-relaxed text-ink-700">
                  {recommendation.rationale}
                </p>
                <p className="mt-1 font-mono text-[10px] text-ink-400">
                  Sumber: {recommendation.source}
                </p>
              </li>
            ))}
          </ol>
        )}
      </Section>

      <Section number="10" title="Bukti dan keterbatasan">
        <h3 className="text-[14px] font-semibold text-ink-900">Bukti yang dipakai</h3>
        {report.evidence.length === 0 ? (
          <p className="mt-1 text-[13.5px] text-ink-700">
            Tidak ada bukti pasar yang berhasil diambil untuk analisis ini.
          </p>
        ) : (
          <div className="mt-2 overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-[13px]">
              <caption className="sr-only">Daftar bukti beserta provenance</caption>
              <thead>
                <tr className="border-b border-line text-left text-ink-500">
                  <th scope="col" className="py-2 pr-3 font-semibold">
                    Metrik
                  </th>
                  <th scope="col" className="py-2 pr-3 font-semibold">
                    Nilai
                  </th>
                  <th scope="col" className="py-2 pr-3 font-semibold">
                    Sumber
                  </th>
                  <th scope="col" className="py-2 pr-3 font-semibold">
                    Diamati
                  </th>
                  <th scope="col" className="py-2 font-semibold">
                    Kualitas
                  </th>
                </tr>
              </thead>
              <tbody>
                {report.evidence.map((record) => (
                  <tr key={record.metric} className="border-b border-line-soft align-top">
                    <td className="py-2 pr-3 text-ink-900">
                      {metricLabels[record.metric] ?? record.metric}
                    </td>
                    <td className="tnum py-2 pr-3 text-ink-700">
                      {record.value.toLocaleString("id-ID")} {record.unit}
                    </td>
                    <td className="py-2 pr-3 text-ink-700">{record.source}</td>
                    <td className="py-2 pr-3 text-ink-700">{formatDate(record.observed_at)}</td>
                    <td className="py-2 text-ink-700">
                      cakupan {record.quality.coverage}, kesegaran {record.quality.freshness}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <h3 className="mt-5 text-[14px] font-semibold text-ink-900">Bukti yang belum ada</h3>
        {report.missing_evidence.length === 0 ? (
          <p className="mt-1 text-[13.5px] text-ink-700">Tidak ada.</p>
        ) : (
          <ul className="mt-1 list-disc space-y-1 pl-5 text-[13px] text-ink-700">
            {report.missing_evidence.map((entry) => (
              <li key={entry.metric}>
                {metricLabels[entry.metric] ?? entry.metric}: {entry.reason}
              </li>
            ))}
          </ul>
        )}

        <h3 className="mt-5 text-[14px] font-semibold text-ink-900">Keterbatasan</h3>
        <ul className="mt-1 list-disc space-y-1 pl-5 text-[13px] text-ink-700">
          {report.limitations.map((limitation) => (
            <li key={limitation}>{limitation}</li>
          ))}
        </ul>

        {report.warnings.length > 0 ? (
          <>
            <h3 className="mt-5 text-[14px] font-semibold text-ink-900">Peringatan run</h3>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-[13px] text-ink-700">
              {report.warnings.map((warning) => (
                <li key={warning.code}>{warning.message}</li>
              ))}
            </ul>
          </>
        ) : null}

        <Callout tone="neutral">
          <p className="font-semibold text-ink-900">{report.disclaimer}</p>
        </Callout>

        <p className="mt-3 font-mono text-[10px] text-ink-400">
          {report.report_version} · {report.rule_version} · dibuat{" "}
          {formatDateTime(report.generated_at)}
        </p>
      </Section>
    </div>
  );
}

function SimulationSection({ simulation }: { simulation: SyntheticSimulation }) {
  if (simulation.status === "unavailable") {
    return (
      <>
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status="tidak-tersedia" label="Tidak tersedia" />
          <p className="text-[14px] text-ink-700">
            {simulation.reason ?? "Simulasi agent tidak dijalankan pada run ini."}
          </p>
        </div>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-[13px] text-ink-500">
          {simulation.limitations.map((limitation) => (
            <li key={limitation}>{limitation}</li>
          ))}
        </ul>
      </>
    );
  }

  const cohort = simulation.cohort_size ?? 0;
  const activated = simulation.metrics.activated_persona_count ?? 0;

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <StatusBadge status="perlu-dikonfirmasi" label="Sinyal sintetis eksploratif" />
        <p className="text-[14px] text-ink-700">
          {cohort} persona sintetis dalam {simulation.rounds ?? 0} round.
        </p>
      </div>

      {/* Hitungan, bukan persentase: pembaginya wajib terlihat. */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricTile
          label="Memilih membeli"
          value={`${simulation.metrics.purchase_intent_count ?? 0} dari ${activated}`}
          note="Persona aktif, bukan pelanggan nyata"
        />
        <MetricTile
          label="Reaksi positif"
          value={`${simulation.metrics.positive_reaction_count ?? 0} dari ${activated}`}
        />
        <MetricTile
          label="Berubah pendapat"
          value={`${simulation.metrics.opinion_shift_count ?? 0} dari ${activated}`}
          note="Setelah melihat respons persona lain"
        />
        <MetricTile
          label="Rentang harga yang diterima"
          value={
            simulation.acceptable_price_band
              ? `${formatIDR(simulation.acceptable_price_band.min_idr)} – ${formatIDR(simulation.acceptable_price_band.max_idr)}`
              : "Tidak tersedia"
          }
          note="Preferensi sintetis, bukan harga pasar"
        />
      </div>

      {simulation.segments.length > 0 ? (
        <div className="mt-5 space-y-3">
          <h3 className="text-[14px] font-semibold text-ink-900">Kecocokan per segmen</h3>
          {simulation.segments.map((segment) => (
            <div
              key={segment.archetype}
              className="flex flex-wrap items-baseline justify-between gap-2"
            >
              <span className="text-[13px] text-ink-700">{segment.label}</span>
              <span className="tnum text-[13px] font-semibold text-ink-900">
                {segment.purchase_intent_count} dari {segment.persona_count} memilih membeli
              </span>
            </div>
          ))}
        </div>
      ) : null}

      {simulation.objections.length > 0 ? (
        <div className="mt-5">
          <h3 className="text-[14px] font-semibold text-ink-900">Keberatan yang muncul</h3>
          <ul className="mt-2 space-y-1 text-[13px] text-ink-700">
            {simulation.objections.map((objection) => (
              <li key={objection.code} className="flex justify-between gap-4">
                <span>{objection.label}</span>
                <span className="tnum font-semibold">{objection.count} persona</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {simulation.quotes.length > 0 ? (
        <div className="mt-5">
          <h3 className="text-[14px] font-semibold text-ink-900">Kutipan persona</h3>
          <ul className="mt-2 space-y-3">
            {simulation.quotes.map((quote) => (
              <li key={quote.agent_id} className="rounded-[10px] border border-line px-4 py-3">
                <p className="text-[13.5px] leading-relaxed text-ink-700">“{quote.text}”</p>
                <p className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] text-ink-500">
                  <span>{quote.archetype}</span>
                  <span aria-hidden>·</span>
                  {/* Label wajib pada setiap kutipan agent. */}
                  <StatusBadge status="perlu-dikonfirmasi" label={quote.label} />
                </p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <ul className="mt-5 list-disc space-y-1 pl-5 text-[13px] text-ink-500">
        {simulation.limitations.map((limitation) => (
          <li key={limitation}>{limitation}</li>
        ))}
      </ul>
      {simulation.cohort_version ? (
        <p className="mt-3 font-mono text-[10px] text-ink-400">
          Cohort {simulation.cohort_version}
        </p>
      ) : null}
    </>
  );
}

function AgentReviewSection({ review }: { review: AgentReview }) {
  if (review.status === "unavailable") {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <StatusBadge status="tidak-tersedia" label="Tidak tersedia" />
        <p className="text-[14px] text-ink-700">
          {review.reason ?? "Tinjauan agent tidak tersedia pada run ini."}
        </p>
      </div>
    );
  }

  return (
    <>
      {review.status === "partial" ? (
        <Callout tone="warn">
          <p className="font-semibold text-ink-900">Tinjauan agent tidak lengkap</p>
          <p className="mt-1">
            {review.reason ?? "Sebagian council tidak menghasilkan artifact yang valid."}
          </p>
        </Callout>
      ) : null}

      <p className="mt-3 text-[12.5px] leading-relaxed text-ink-500">
        Bagian ini berisi penilaian kualitatif agent. Seluruh angka pada laporan tetap berasal
        dari engine deterministik, bukan dari teks di bawah ini.
      </p>

      {review.narrative_sections.length > 0 ? (
        <div className="mt-4 space-y-4">
          {review.narrative_sections.map((section) => (
            <div key={section.id}>
              <h3 className="text-[14px] font-semibold text-ink-900">{section.title}</h3>
              <p className="mt-1 text-[13.5px] leading-relaxed text-ink-700">{section.body}</p>
              <p className="mt-1 font-mono text-[10px] text-ink-400">
                Sumber artifact: {section.source_artifact_types.join(", ")}
              </p>
            </div>
          ))}
        </div>
      ) : null}

      {review.market_observations.length > 0 ? (
        <div className="mt-5">
          <h3 className="text-[14px] font-semibold text-ink-900">Catatan analis pasar</h3>
          <ul className="mt-2 space-y-2">
            {review.market_observations.map((observation) => (
              <li key={observation.id} className="rounded-[10px] border border-line px-4 py-3">
                <p className="text-[13.5px] leading-relaxed text-ink-700">{observation.claim}</p>
                <p className="mt-1 font-mono text-[10px] text-ink-400">
                  {observation.stance} · keyakinan {observation.confidence}
                  {observation.evidence_metrics.length > 0
                    ? ` · bukti: ${observation.evidence_metrics
                        .map((metric) => metricLabels[metric] ?? metric)
                        .join(", ")}`
                    : " · belum ada bukti pendukung"}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {review.finance_critiques.length > 0 ? (
        <div className="mt-5">
          <h3 className="text-[14px] font-semibold text-ink-900">Kritik asumsi finansial</h3>
          <ul className="mt-2 space-y-2">
            {review.finance_critiques.map((critique) => (
              <li key={critique.id} className="rounded-[10px] border border-line px-4 py-3">
                <p className="text-[14px] font-semibold text-ink-900">{critique.assumption}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-ink-700">
                  {critique.concern}
                </p>
                <p className="mt-1 font-mono text-[10px] text-ink-400">
                  Hasil kalkulator: {critique.tool_call_ids.join(", ")}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {review.red_team_findings.length > 0 ? (
        <div className="mt-5">
          <h3 className="text-[14px] font-semibold text-ink-900">Temuan red-team</h3>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-[13px] text-ink-700">
            {review.red_team_findings.map((finding) => (
              <li key={finding}>{finding}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {review.manifest ? (
        <p className="mt-5 font-mono text-[10px] leading-relaxed text-ink-400">
          {review.manifest.model_id} · prompt {review.manifest.prompt_version} · cohort{" "}
          {review.manifest.cohort_version} · seed {review.manifest.seed} · OASIS{" "}
          {review.manifest.oasis_version} · CAMEL {review.manifest.camel_version} ·{" "}
          {review.manifest.tokens_used} dari {review.manifest.token_budget} token
        </p>
      ) : null}
    </>
  );
}

function Section({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <Card>
      <CardHeader title={`${number} ${title}`} />
      <CardBody>{children}</CardBody>
    </Card>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="label-eyebrow">{label}</dt>
      <dd className="mt-0.5 text-[14px] text-ink-900">{value}</dd>
    </div>
  );
}

function AssumptionList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-[10px] border border-line px-4 py-3">
      <p className="label-eyebrow mb-1.5">{title}</p>
      <ul className="list-disc space-y-1 pl-5 text-[13px] text-ink-700">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
