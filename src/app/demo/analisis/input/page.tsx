"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDemoFlow } from "@/demo/DemoFlowProvider";
import { useAutoplay } from "@/demo/useAutoplay";
import { MapPicker } from "@/demo/components/MapPicker";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Metric";
import { FieldLabel } from "@/components/ui/Field";
import { PageHead } from "@/components/layout/PageHead";
import { cn, formatIDR } from "@/lib/format";

const langkahLabel = ["Lokasi", "Produk", "Modal"];

export default function InputAnalisis() {
  const router = useRouter();
  const {
    tandaiSelesai,
    gerbangTerbuka,
    profil,
    ubahProfil,
    produk,
    tambahProduk,
    hapusProduk,
  } = useDemoFlow();
  useAutoplay();

  const [langkah, setLangkah] = useState(0);
  const [alamat, setAlamat] = useState("Tebet, Jakarta Selatan");
  const [radius, setRadius] = useState(1500);

  const [nama, setNama] = useState("");
  const [harga, setHarga] = useState("");
  const [hpp, setHpp] = useState("");

  const opexKosong = profil.asumsiFinansial.biayaOperasionalBulanan === null;

  function simpanProduk() {
    const h = Number(harga.replace(/\D/g, ""));
    const c = Number(hpp.replace(/\D/g, ""));
    if (!nama.trim() || !h) return;
    tambahProduk({
      id: `p${Date.now()}`,
      nama: nama.trim(),
      harga: h,
      hpp: c,
      kategori: "Lainnya",
      aktif: true,
    });
    setNama("");
    setHarga("");
    setHpp("");
  }

  function lanjut() {
    if (langkah < 2) {
      setLangkah((l) => l + 1);
      return;
    }
    tandaiSelesai("input");
    ubahProfil("targetPelanggan.lokasi", `${alamat} (radius ${radius / 1000} km)`);
    router.push(gerbangTerbuka ? "/demo/analisis/konfirmasi" : "/demo/edukasi");
  }

  return (
    <div className="mx-auto max-w-[920px] px-6 py-12">
      <PageHead
        judul="Mulai Bisnis"
        sub="Tiga hal yang dibutuhkan simulasi: di mana usahanya, apa yang dijual, dan berapa modalnya."
      />

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
        {/* 1. Lokasi lewat peta */}
        {langkah === 0 ? (
          <div className="space-y-4">
            <MapPicker
              radius={radius}
              onRadiusChange={setRadius}
              alamat={alamat}
              onAlamatChange={setAlamat}
            />
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

        {/* 2. Produk yang akan dijual */}
        {langkah === 1 ? (
          <div className="space-y-5">
            <div>
              <h2 className="text-[16px] font-semibold text-ink-900">
                Produk yang akan dijual
              </h2>
              <p className="mt-1 text-[13.5px] leading-relaxed text-ink-500">
                Menu dan harganya ikut dianalisis, bukan hanya lokasi. Persona
                akan menilai harga tiap produk, bukan satu harga rata-rata.
              </p>
            </div>

            {produk.length ? (
              <ul className="divide-y divide-line rounded-[10px] border border-line">
                {produk.map((p) => (
                  <li
                    key={p.id}
                    className="flex flex-wrap items-center gap-3 px-4 py-3"
                  >
                    <span className="min-w-0 flex-1 text-[14.5px] font-medium text-ink-900">
                      {p.nama}
                    </span>
                    <span className="tnum text-[14px] text-ink-900">
                      {formatIDR(p.harga)}
                    </span>
                    {p.hpp > 0 ? (
                      <span className="tnum text-[12.5px] text-ink-400">
                        HPP {formatIDR(p.hpp)}
                      </span>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => hapusProduk(p.id)}
                      aria-label={`Hapus ${p.nama}`}
                      className="rounded-[6px] border border-line px-2 py-1 text-[12px] font-semibold text-ink-400 hover:bg-surface-2 hover:text-danger-600"
                    >
                      Hapus
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="rounded-[10px] border border-dashed border-line px-4 py-8 text-center">
                <p className="text-[14px] text-ink-500">
                  Belum ada produk. Tambahkan minimal satu untuk melanjutkan.
                </p>
              </div>
            )}

            <div className="rounded-[10px] border border-line bg-surface-2 p-4">
              <div className="label-eyebrow mb-2.5">Tambah produk</div>
              <div className="grid gap-2.5 sm:grid-cols-[2fr_1fr_1fr_auto]">
                <input
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Nama produk"
                  aria-label="Nama produk"
                  className="rounded-[8px] border border-line bg-surface px-3 py-2.5 text-[14px] text-ink-900"
                />
                <input
                  value={harga}
                  onChange={(e) => setHarga(e.target.value)}
                  placeholder="Harga jual"
                  aria-label="Harga jual"
                  className="tnum rounded-[8px] border border-line bg-surface px-3 py-2.5 text-[14px] text-ink-900"
                />
                <input
                  value={hpp}
                  onChange={(e) => setHpp(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && simpanProduk()}
                  placeholder="HPP (opsional)"
                  aria-label="HPP"
                  className="tnum rounded-[8px] border border-line bg-surface px-3 py-2.5 text-[14px] text-ink-900"
                />
                <Button onClick={simpanProduk}>+ Tambah</Button>
              </div>
            </div>
          </div>
        ) : null}

        {/* 3. Modal dan biaya operasional */}
        {langkah === 2 ? (
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel>Modal Awal</FieldLabel>
                <input
                  defaultValue="150.000.000"
                  aria-label="Modal awal"
                  className="tnum w-full rounded-[8px] border border-line px-3 py-2.5 text-[15px] text-ink-900"
                />
              </div>
              <div>
                <FieldLabel>Biaya Operasional / Bulan</FieldLabel>
                <input
                  placeholder="Belum diisi"
                  aria-label="Biaya operasional bulanan"
                  value={
                    opexKosong
                      ? ""
                      : profil.asumsiFinansial.biayaOperasionalBulanan!.toLocaleString(
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
                  className="tnum w-full rounded-[8px] border border-line px-3 py-2.5 text-[15px] text-ink-900 placeholder:italic placeholder:text-danger-600"
                />
              </div>
            </div>

            {/* Prediksi biaya operasional */}
            <div className="rounded-[10px] border border-line bg-surface-2 p-4">
              <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
                <span className="label-eyebrow">
                  Prediksi biaya operasional bulanan
                </span>
                <span className="tnum text-[15px] font-bold text-ink-900">
                  Rp 21 jt – Rp 28 jt
                </span>
              </div>
              <ul className="space-y-1 text-[13px] text-ink-500">
                <li>· Sewa ruko Tebet 40–60 m²: Rp 9 jt – Rp 13 jt</li>
                <li>· Dua barista + satu kasir: Rp 8 jt – Rp 10 jt</li>
                <li>· Listrik, air, internet: Rp 2 jt – Rp 3 jt</li>
                <li>· Kemasan dan lain-lain: Rp 2 jt</li>
              </ul>
              <p className="mt-2.5 text-[12px] leading-relaxed text-ink-400">
                Rentang ini estimasi berbasis rata-rata area terpilih, bukan
                kuotasi. Isi angka sebenarnya bila sudah punya. Prediksi tidak
                dipakai menghitung skor.
              </p>
              <Button
                variant="secondary"
                className="mt-3 text-[13px]"
                onClick={() =>
                  ubahProfil("asumsiFinansial.biayaOperasionalBulanan", 24_500_000)
                }
              >
                Pakai nilai tengah prediksi
              </Button>
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
                    <p className="tnum text-[19px] font-bold text-ink-900">{x.v}</p>
                    <p className="text-[11.5px] text-ink-400">porsi/hari</p>
                  </div>
                ))}
              </div>
            </div>

            {opexKosong ? (
              <Callout tone="danger">
                Biaya operasional belum diisi. Simulasi tetap bisa dijalankan,
                tetapi titik impas akan tampil sebagai rentang dan dimensi{" "}
                <em>Kesiapan Operasional</em> (bobot 40%) tidak dapat diskor.
              </Callout>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="mt-6 flex justify-between gap-3">
        <Button
          variant="ghost"
          onClick={() =>
            langkah > 0 ? setLangkah((l) => l - 1) : router.push("/demo/dashboard")
          }
        >
          ← Kembali
        </Button>
        <Button onClick={lanjut} disabled={langkah === 1 && produk.length === 0}>
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
