"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { DataSkeleton, ErrorState, UnauthorizedState } from "@/components/ui/DataState";
import { FormField, SelectField } from "@/components/ui/FormControls";
import { Callout } from "@/components/ui/Metric";
import { apiFetch, ApiError } from "@/lib/api/client";
import { useApiResource } from "@/lib/api/useApiResource";
import {
  analysisAcceptedSchema,
  channelLabels,
  salesChannelSchema,
  type SalesChannel,
} from "@/lib/contracts/analysis";
import {
  businessTypeLabels,
  businessTypeSchema,
  educationPrerequisitesSchema,
  type BusinessType,
} from "@/lib/contracts/education";

type NumericField =
  | "latitude"
  | "longitude"
  | "analysis_radius_m"
  | "average_selling_price_idr"
  | "variable_cost_per_unit_idr"
  | "initial_investment_idr"
  | "fixed_cost_month_idr"
  | "operating_days_month"
  | "capacity_units_day"
  | "volume_min"
  | "volume_base"
  | "volume_max";

const initialNumbers: Record<NumericField, string> = {
  latitude: "-6.2",
  longitude: "106.8",
  analysis_radius_m: "1500",
  average_selling_price_idr: "",
  variable_cost_per_unit_idr: "",
  initial_investment_idr: "",
  fixed_cost_month_idr: "",
  operating_days_month: "26",
  capacity_units_day: "",
  volume_min: "",
  volume_base: "",
  volume_max: "",
};

export function AnalysisForm() {
  const router = useRouter();
  const [businessType, setBusinessType] = useState<BusinessType>("food_stall");
  const [conceptName, setConceptName] = useState("");
  const [areaId, setAreaId] = useState("");
  const [areaName, setAreaName] = useState("");
  const [valueProposition, setValueProposition] = useState("");
  const [channels, setChannels] = useState<SalesChannel[]>(["takeaway"]);
  const [numbers, setNumbers] = useState(initialNumbers);
  const [submitError, setSubmitError] = useState<ApiError | null>(null);
  const [submitting, setSubmitting] = useState(false);
  // One key per form instance so a double submit or a reconnect cannot create
  // two runs from the same draft.
  const [idempotencyKey] = useState(() => crypto.randomUUID());

  const gate = useApiResource(
    `/v1/education/prerequisites?business_type=${businessType}`,
    educationPrerequisitesSchema,
  );

  const missingRequired =
    conceptName.trim().length < 2 ||
    areaId.trim().length < 2 ||
    channels.length === 0 ||
    (
      [
        "average_selling_price_idr",
        "variable_cost_per_unit_idr",
        "initial_investment_idr",
        "fixed_cost_month_idr",
        "capacity_units_day",
        "volume_min",
        "volume_base",
        "volume_max",
      ] as NumericField[]
    ).some((field) => numbers[field].trim() === "");

  const volumeOutOfOrder =
    numbers.volume_min !== "" &&
    numbers.volume_base !== "" &&
    numbers.volume_max !== "" &&
    !(
      Number(numbers.volume_min) <= Number(numbers.volume_base) &&
      Number(numbers.volume_base) <= Number(numbers.volume_max)
    );

  function setNumber(field: NumericField, value: string) {
    setNumbers((current) => ({ ...current, [field]: value }));
  }

  function toggleChannel(channel: SalesChannel) {
    setChannels((current) =>
      current.includes(channel)
        ? current.filter((item) => item !== channel)
        : [...current, channel],
    );
  }

  async function submit() {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const accepted = await apiFetch("/v1/analyses", analysisAcceptedSchema, {
        method: "POST",
        headers: { "Idempotency-Key": idempotencyKey },
        body: JSON.stringify({
          business_type: businessType,
          concept_name: conceptName.trim(),
          location: {
            area_id: areaId.trim(),
            area_name: areaName.trim() === "" ? null : areaName.trim(),
            latitude: Number(numbers.latitude),
            longitude: Number(numbers.longitude),
            analysis_radius_m: Number(numbers.analysis_radius_m),
          },
          pricing: {
            average_selling_price_idr: Number(numbers.average_selling_price_idr),
            variable_cost_per_unit_idr: Number(numbers.variable_cost_per_unit_idr),
          },
          operations: {
            initial_investment_idr: Number(numbers.initial_investment_idr),
            fixed_cost_month_idr: Number(numbers.fixed_cost_month_idr),
            operating_days_month: Number(numbers.operating_days_month),
            capacity_units_day: Number(numbers.capacity_units_day),
            volume_units_day: {
              min: Number(numbers.volume_min),
              base: Number(numbers.volume_base),
              max: Number(numbers.volume_max),
            },
          },
          channels,
          value_proposition: valueProposition.trim(),
        }),
      });
      // The run is queued, not finished: go to the live progress screen, which
      // renders the report itself once the server says the run is done.
      router.push(`/analisis/${accepted.analysis_id}`);
    } catch (caught) {
      setSubmitError(caught instanceof ApiError ? caught : null);
    } finally {
      setSubmitting(false);
    }
  }

  if (gate.error?.status === 401) return <UnauthorizedState next="/analisis" />;

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader title="Konsep usaha" />
        <CardBody className="grid gap-4 sm:grid-cols-2">
          <SelectField
            label="Jenis usaha"
            name="business_type"
            value={businessType}
            onChange={(event) =>
              setBusinessType(businessTypeSchema.parse(event.target.value))
            }
          >
            {businessTypeSchema.options.map((option) => (
              <option key={option} value={option}>
                {businessTypeLabels[option]}
              </option>
            ))}
          </SelectField>
          <FormField
            label="Nama konsep"
            name="concept_name"
            value={conceptName}
            onChange={(event) => setConceptName(event.target.value)}
            placeholder="Rice Bowl Sambal"
          />
          <FormField
            label="Kode area Jabodetabek"
            name="area_id"
            value={areaId}
            onChange={(event) => setAreaId(event.target.value)}
            placeholder="jabodetabek-tebet"
            hint="Kode area dipakai untuk mencocokkan bukti pasar."
          />
          <FormField
            label="Nama area (opsional)"
            name="area_name"
            value={areaName}
            onChange={(event) => setAreaName(event.target.value)}
            placeholder="Tebet, Jakarta Selatan"
          />
          <FormField
            label="Nilai jual utama (opsional)"
            name="value_proposition"
            value={valueProposition}
            onChange={(event) => setValueProposition(event.target.value)}
            placeholder="Makan siang cepat dengan pilihan sambal"
            className="sm:col-span-2"
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Lokasi dan radius analisis" />
        <CardBody className="grid gap-4 sm:grid-cols-3">
          <FormField
            label="Lintang"
            name="latitude"
            type="number"
            step="0.000001"
            value={numbers.latitude}
            onChange={(event) => setNumber("latitude", event.target.value)}
          />
          <FormField
            label="Bujur"
            name="longitude"
            type="number"
            step="0.000001"
            value={numbers.longitude}
            onChange={(event) => setNumber("longitude", event.target.value)}
          />
          <FormField
            label="Radius analisis (meter)"
            name="analysis_radius_m"
            type="number"
            min={100}
            max={10000}
            step={100}
            value={numbers.analysis_radius_m}
            onChange={(event) => setNumber("analysis_radius_m", event.target.value)}
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Harga dan biaya" />
        <CardBody className="grid gap-4 sm:grid-cols-2">
          <FormField
            label="Harga jual rata-rata (Rp/unit)"
            name="average_selling_price_idr"
            type="number"
            min={0}
            step={1}
            value={numbers.average_selling_price_idr}
            onChange={(event) => setNumber("average_selling_price_idr", event.target.value)}
            hint="Isi dalam rupiah utuh tanpa titik."
          />
          <FormField
            label="Biaya variabel per unit (Rp/unit)"
            name="variable_cost_per_unit_idr"
            type="number"
            min={0}
            step={1}
            value={numbers.variable_cost_per_unit_idr}
            onChange={(event) => setNumber("variable_cost_per_unit_idr", event.target.value)}
          />
          <FormField
            label="Modal awal (Rp)"
            name="initial_investment_idr"
            type="number"
            min={0}
            step={1}
            value={numbers.initial_investment_idr}
            onChange={(event) => setNumber("initial_investment_idr", event.target.value)}
          />
          <FormField
            label="Biaya tetap per bulan (Rp)"
            name="fixed_cost_month_idr"
            type="number"
            min={0}
            step={1}
            value={numbers.fixed_cost_month_idr}
            onChange={(event) => setNumber("fixed_cost_month_idr", event.target.value)}
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Operasional" />
        <CardBody className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="Hari operasi per bulan"
              name="operating_days_month"
              type="number"
              min={1}
              max={31}
              step={1}
              value={numbers.operating_days_month}
              onChange={(event) => setNumber("operating_days_month", event.target.value)}
            />
            <FormField
              label="Kapasitas per hari (unit)"
              name="capacity_units_day"
              type="number"
              min={0}
              step={1}
              value={numbers.capacity_units_day}
              onChange={(event) => setNumber("capacity_units_day", event.target.value)}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <FormField
              label="Volume harian minimum"
              name="volume_min"
              type="number"
              min={0}
              step={1}
              value={numbers.volume_min}
              onChange={(event) => setNumber("volume_min", event.target.value)}
            />
            <FormField
              label="Volume harian dasar"
              name="volume_base"
              type="number"
              min={0}
              step={1}
              value={numbers.volume_base}
              onChange={(event) => setNumber("volume_base", event.target.value)}
            />
            <FormField
              label="Volume harian maksimum"
              name="volume_max"
              type="number"
              min={0}
              step={1}
              value={numbers.volume_max}
              onChange={(event) => setNumber("volume_max", event.target.value)}
              error={
                volumeOutOfOrder
                  ? "Urutan harus minimum lebih kecil atau sama dengan dasar, lalu maksimum."
                  : undefined
              }
            />
          </div>
          <fieldset className="border-0 p-0">
            <legend className="label-eyebrow mb-2">Kanal penjualan</legend>
            <div className="flex flex-wrap gap-4">
              {salesChannelSchema.options.map((channel) => (
                <label key={channel} className="flex items-center gap-2 text-[14px] text-ink-700">
                  <input
                    type="checkbox"
                    checked={channels.includes(channel)}
                    onChange={() => toggleChannel(channel)}
                  />
                  {channelLabels[channel]}
                </label>
              ))}
            </div>
          </fieldset>
        </CardBody>
      </Card>

      {gate.loading ? (
        <DataSkeleton rows={1} />
      ) : gate.error ? (
        <ErrorState
          message={gate.error.message}
          correlationId={gate.error.correlationId}
          retryable={gate.error.retryable}
          onRetry={() => void gate.reload()}
        />
      ) : gate.data && !gate.data.content_available ? (
        <Callout tone="warn">
          <p className="font-semibold text-ink-900">Materi prasyarat belum tersedia</p>
          <p className="mt-1">
            {gate.data.note ??
              "Analisis belum dapat dijalankan sampai modul edukasi yang ditinjau tersedia."}
          </p>
        </Callout>
      ) : gate.data && !gate.data.satisfied ? (
        <Callout tone="warn">
          <p className="font-semibold text-ink-900">Selesaikan modul edukasi dulu</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {gate.data.outstanding.map((module) => (
              <li key={module.id}>
                {module.title} · sekitar {module.estimated_minutes} menit
              </li>
            ))}
          </ul>
          <p className="mt-2 font-mono text-[10px] text-ink-400">{gate.data.rule_version}</p>
        </Callout>
      ) : null}

      {/*
        Sesi yang berakhir saat submit tidak boleh membuang isian. Form tetap
        terpasang di bawah pesan ini, jadi seluruh draft masih ada saat pengguna
        kembali dari halaman masuk.
      */}
      {submitError?.status === 401 ? (
        <UnauthorizedState next="/analisis" />
      ) : submitError ? (
        <ErrorState
          message={submitError.message}
          correlationId={submitError.correlationId}
          retryable={submitError.retryable}
          onRetry={() => void submit()}
        />
      ) : null}

      <Callout tone="neutral">
        Skor, BEP, marjin, dan payback dihitung server. Halaman ini hanya mengirim isian dan
        menampilkan hasilnya.
      </Callout>

      <div className="flex flex-wrap gap-3">
        {gate.data && !gate.data.content_available ? (
          <Button disabled>Analisis belum tersedia</Button>
        ) : gate.data && !gate.data.satisfied ? (
          <ButtonLink href="/edukasi">Selesaikan modul dulu</ButtonLink>
        ) : (
          <Button
            onClick={() => void submit()}
            disabled={submitting || missingRequired || volumeOutOfOrder || gate.loading}
          >
            {submitting ? "Menjalankan analisis..." : "Jalankan analisis"}
          </Button>
        )}
        <ButtonLink href="/analisis/riwayat" variant="secondary">
          Lihat riwayat analisis
        </ButtonLink>
      </div>
    </div>
  );
}
