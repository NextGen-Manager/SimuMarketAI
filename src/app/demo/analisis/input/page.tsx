"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDemoFlow } from "@/demo/DemoFlowProvider";
import { useAutoplay } from "@/demo/useAutoplay";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Metric";
import { FieldLabel } from "@/components/ui/Field";
import { PageHead } from "@/components/layout/PageHead";
import { cn, formatIDR } from "@/lib/format";

const langkahLabel = ["Lokasi", "Harga", "Modal"];

const sumberBukti = [
  { nama: "Kompetitor (OpenStreetMap)", status: "ok", nilai: "18 POI · radius 1,5 km" },
  { nama: "Populasi (BPS)", status: "degraded", nilai: "hanya sampai kecamatan" },
  { nama: "Harga pembanding", status: "degraded", nilai: "4 observasi · di bawah ambang" },
  { nama: "Traffic pejalan kaki", status: "missing", nilai: "tidak tersedia" },
];

const statusMeta = {
  ok: { label: "Tersedia", cls: "text-success-600" },
  degraded: { label: "Terbatas", cls: "text-warn-600" },
  missing: { label: "Kosong", cls: "text-danger-600" },
} as const;

export default function InputAnalisis() {
  const router = useRouter();
  const { tandaiSelesai, gerbangTerbuka, profil, ubahProfil } = useDemoFlow();
  useAutoplay();

  const [langkah, setLangkah] = useState(0);
  const [kota, setKota] = useState("Jakarta Selatan");
  const [kecamatan, setKecamatan] = useState("Tebet");
  const [radius, setRadius] = useState(1500);

  function lanjut() {
    if (langkah < 2) {
      setLangkah((l) => l + 1);
      return;
    }
    tandaiSelesai("input");
    ubahProfil("targetPelanggan.lokasi", `${kecamatan}, ${kota} (radius ${radius / 1000} km)`);
    router.push(gerbangTerbuka ? "/demo/analisis/konfirmasi" : "/demo/edukasi");
  }

  return (
    <div className="mx-auto max-w-[880px] px-6 py-12">
      <PageHead
        judul="Analisis Pasar"
        sub="Isi tiga hal: di mana, berapa harganya, dan berapa modalnya."
      />

      {/* Progres wizard */}
      <div className="mb-8 flex items-center gap-2">
        {langkahLabel.map((l, i) => (
          <div key={l} className="flex flex-1 items-center gap-2">
            <button
              type="button"
              onClick={() => i <= langkah && setLangkah(i)}
              disabled={i > langkah}
              className={cn(
                "flex items-center gap-2 rounded-full px-3 py-1.5 text-[13px] font-semibold transition-colors",
                i === langkah
                  ? "bg-teal-50 text-teal-700"
                  : i < langkah
                    ? "text-ink-500 hover:bg-surface-2"
                    : "text-ink-400/60",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "grid h-5 w-5 place-items-center rounded-full text-[10px] font-bold",
                  i === langkah
                    ? "bg-teal-700 text-white"
                    : i < langkah
                      ? "bg-success-600 text-white"
                      : "border border-line text-ink-400",
                )}
              >
                {i < langkah ? "✓" : i + 1}
              </span>
              {l}
            </button>
            {i < 2 ? <span className="h-px flex-1 bg-line" /> : null}
          </div>
        ))}
      </div>

      <div className="rounded-[12px] border border-line bg-surface p-6">
        {langkah === 0 ? (
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel>Wilayah</FieldLabel>
                <select
                  value={kota}
                  onChange={(e) => setKota(e.target.value)}
                  className="w-full rounded-[8px] border border-line bg-surface px-3 py-2.5 text-[15px] text-ink-900"
                >
                  {[
                    "Jakarta Selatan",
                    "Jakarta Pusat",
                    "Kota Depok",
                    "Kota Bogor",
                    "Kota Tangerang",
                    "Kota Bekasi",
                  ].map((k) => (
                    <option key={k}>{k}</option>
                  ))}
                </select>
              </div>
              <div>
                <FieldLabel>Kecamatan</FieldLabel>
                <select
                  value={kecamatan}
                  onChange={(e) => setKecamatan(e.target.value)}
                  className="w-full rounded-[8px] border border-line bg-surface px-3 py-2.5 text-[15px] text-ink-900"
                >
                  {["Tebet", "Setiabudi", "Mampang Prapatan", "Pancoran"].map(
                    (k) => (
                      <option key={k}>{k}</option>
                    ),
                  )}
                </select>
              </div>
            </div>

            <div>
              <FieldLabel>Radius Analisis</FieldLabel>
              <div className="flex gap-2">
                {[1000, 1500, 3000].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRadius(r)}
                    className={cn(
                      "tnum rounded-[8px] border px-4 py-2 text-[14px] font-semibold transition-colors",
                      radius === r
                        ? "border-teal-700 bg-teal-700 text-white"
                        : "border-line bg-surface text-ink-500 hover:bg-surface-2",
                    )}
                  >
                    {r / 1000} km
                  </button>
                ))}
              </div>
            </div>

            {/* Pratinjau bukti sebelum pengguna mengisi sisanya */}
            <div className="rounded-[10px] border border-line bg-surface-2 p-4">
              <div className="mb-3 flex items-baseline justify-between">
                <span className="label-eyebrow">Bukti pada radius ini</span>
                <span className="tnum text-[13px] font-bold text-amber-600">
                  keyakinan 0,58 · Sedang
                </span>
              </div>
              <ul className="space-y-1.5">
                {sumberBukti.map((s) => {
                  const m = statusMeta[s.status as keyof typeof statusMeta];
                  return (
                    <li
                      key={s.nama}
                      className="flex flex-wrap items-baseline justify-between gap-x-3 text-[13px]"
                    >
                      <span className="text-ink-700">{s.nama}</span>
                      <span className="text-ink-400">{s.nilai}</span>
                      <span className={cn("font-semibold", m.cls)}>{m.label}</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <p className="text-[13px] text-ink-400">
              Punya proposal atau rencana usaha?{" "}
              <Link
                href="/demo/upload"
                className="font-semibold text-teal-700 underline underline-offset-2"
              >
                Unggah untuk mengisi otomatis
              </Link>
            </p>
          </div>
        ) : null}

        {langkah === 1 ? (
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel>Rentang Harga Produk</FieldLabel>
                <div className="flex items-center gap-2">
                  <input
                    defaultValue="18.000"
                    className="tnum w-full rounded-[8px] border border-line px-3 py-2.5 text-[15px] text-ink-900"
                  />
                  <span className="text-ink-400">–</span>
                  <input
                    defaultValue="30.000"
                    className="tnum w-full rounded-[8px] border border-line px-3 py-2.5 text-[15px] text-ink-900"
                  />
                </div>
              </div>
              <div>
                <FieldLabel>HPP per Porsi</FieldLabel>
                <input
                  defaultValue="8.500"
                  className="tnum w-full rounded-[8px] border border-line px-3 py-2.5 text-[15px] text-ink-900"
                />
              </div>
            </div>

            <Callout tone="info">
              Marjin kontribusi pada harga tengah Rp 24.000 adalah{" "}
              <strong className="font-semibold text-ink-900">
                {formatIDR(24000 - 8500)}
              </strong>{" "}
              per porsi. Angka ini yang menutup biaya tetap — dihitung
              deterministik, bukan oleh model bahasa.
            </Callout>
          </div>
        ) : null}

        {langkah === 2 ? (
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel>Modal Awal</FieldLabel>
                <input
                  defaultValue="150.000.000"
                  className="tnum w-full rounded-[8px] border border-line px-3 py-2.5 text-[15px] text-ink-900"
                />
              </div>
              <div>
                <FieldLabel>Biaya Operasional / Bulan</FieldLabel>
                <input
                  placeholder="Belum diisi"
                  value={
                    profil.asumsiFinansial.biayaOperasionalBulanan === null
                      ? ""
                      : profil.asumsiFinansial.biayaOperasionalBulanan.toLocaleString(
                          "id-ID",
                        )
                  }
                  onChange={(e) => {
                    const n = Number(e.target.value.replace(/\D/g, ""));
                    ubahProfil(
                      "asumsiFinansial.biayaOperasionalBulanan",
                      n > 0 ? n : 0,
                    );
                  }}
                  className="tnum w-full rounded-[8px] border border-line px-3 py-2.5 text-[15px] text-ink-900 placeholder:text-danger-600 placeholder:italic"
                />
              </div>
            </div>

            <div>
              <FieldLabel>Volume Harian (rentang, bukan angka tunggal)</FieldLabel>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { l: "Minimum", v: 40 },
                  { l: "Base", v: 60 },
                  { l: "Maksimum", v: 75 },
                ].map((x) => (
                  <div
                    key={x.l}
                    className="rounded-[10px] border border-line bg-surface-2 px-3 py-2.5 text-center"
                  >
                    <div className="label-eyebrow mb-1">{x.l}</div>
                    <p className="tnum text-[19px] font-bold text-ink-900">
                      {x.v}
                    </p>
                    <p className="text-[11.5px] text-ink-400">porsi/hari</p>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-[12.5px] text-ink-400">
                Finance Council memerlukan batas bawah dan atas untuk menyusun
                skenario konservatif dan optimis.
              </p>
            </div>

            {profil.asumsiFinansial.biayaOperasionalBulanan === null ? (
              <Callout tone="danger">
                Biaya operasional belum diisi. Simulasi tetap bisa dijalankan,
                tetapi titik impas akan tampil sebagai rentang dan dimensi{" "}
                <em>Kesiapan Operasional</em> (bobot 20%) tidak dapat diskor.
              </Callout>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="mt-6 flex justify-between gap-3">
        <Button
          variant="ghost"
          onClick={() => (langkah > 0 ? setLangkah((l) => l - 1) : router.push("/demo/dashboard"))}
        >
          ← Kembali
        </Button>
        <Button onClick={lanjut}>
          {langkah < 2
            ? "Lanjut"
            : gerbangTerbuka
              ? "Lanjut ke Konfirmasi"
              : "Lanjut ke Modul Edukasi"}
          <span aria-hidden>→</span>
        </Button>
      </div>
    </div>
  );
}
