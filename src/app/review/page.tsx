"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDemoFlow } from "@/demo/DemoFlowProvider";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { StatusBadge, type FieldStatus } from "@/components/ui/StatusBadge";
import { FieldEditable, FieldStatic } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Metric";
import { PageHead } from "@/components/layout/PageHead";
import { formatIDR } from "@/lib/format";

export default function Review() {
  const router = useRouter();
  const { capai, profil, ubahProfil, fieldDiubah } = useDemoFlow();

  useEffect(() => {
    capai("review");
  }, [capai]);

  const biayaKosong = profil.asumsiFinansial.biayaOperasionalBulanan === null;

  // Status naik menjadi terkonfirmasi begitu pengguna menyunting isinya.
  const statusTarget: FieldStatus = [...fieldDiubah].some((f) =>
    f.startsWith("targetPelanggan"),
  )
    ? "terdeteksi"
    : profil.targetPelanggan.status;

  const statusFinansial: FieldStatus = biayaKosong
    ? "perlu-dilengkapi"
    : "terdeteksi";

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-12">
      <PageHead
        judul="Cek Ringkasan Bisnis"
        sub="Periksa hasil pemahaman AI sebelum simulasi dijalankan. Kamu dapat mengubah data yang kurang tepat."
        tengah
      />

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Ringkasan Usaha */}
        <Card>
          <CardHeader
            title="Ringkasan Usaha"
            icon={<span aria-hidden>▦</span>}
            aside={<StatusBadge status={profil.ringkasanUsaha.status} />}
          />
          <CardBody className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FieldEditable
                label="Nama Ide"
                value={profil.ringkasanUsaha.namaIde}
                edited={fieldDiubah.has("ringkasanUsaha.namaIde")}
                onChange={(v) => ubahProfil("ringkasanUsaha.namaIde", v)}
              />
              <FieldStatic
                label="Jenis Bisnis"
                value={profil.ringkasanUsaha.jenisBisnis}
              />
            </div>
            <FieldEditable
              label="Deskripsi"
              multiline
              value={profil.ringkasanUsaha.deskripsi}
              edited={fieldDiubah.has("ringkasanUsaha.deskripsi")}
              onChange={(v) => ubahProfil("ringkasanUsaha.deskripsi", v)}
            />
            <FieldEditable
              label="Keunikan (USP)"
              multiline
              value={profil.ringkasanUsaha.usp}
              edited={fieldDiubah.has("ringkasanUsaha.usp")}
              onChange={(v) => ubahProfil("ringkasanUsaha.usp", v)}
            />
          </CardBody>
        </Card>

        {/* Target Pelanggan */}
        <Card>
          <CardHeader
            title="Target Pelanggan"
            icon={<span aria-hidden>◍</span>}
            aside={<StatusBadge status={statusTarget} />}
          />
          <CardBody className="space-y-4">
            <FieldEditable
              label="Segmen"
              value={profil.targetPelanggan.segmen}
              edited={fieldDiubah.has("targetPelanggan.segmen")}
              onChange={(v) => ubahProfil("targetPelanggan.segmen", v)}
            />
            <FieldEditable
              label="Lokasi"
              value={profil.targetPelanggan.lokasi}
              edited={fieldDiubah.has("targetPelanggan.lokasi")}
              onChange={(v) => ubahProfil("targetPelanggan.lokasi", v)}
            />
            <FieldEditable
              label="Kebiasaan"
              multiline
              value={profil.targetPelanggan.kebiasaan}
              edited={fieldDiubah.has("targetPelanggan.kebiasaan")}
              onChange={(v) => ubahProfil("targetPelanggan.kebiasaan", v)}
            />
          </CardBody>
        </Card>

        {/* Produk & Harga */}
        <Card>
          <CardHeader
            title="Produk & Harga"
            icon={<span aria-hidden>▤</span>}
            aside={<StatusBadge status={profil.produkHarga.status} />}
          />
          <CardBody>
            <div className="overflow-x-auto">
              <table className="w-full text-[14px]">
                <thead>
                  <tr className="border-b border-line">
                    <th className="label-eyebrow pb-2 text-left">Produk Utama</th>
                    <th className="label-eyebrow pb-2 text-left">Varian</th>
                    <th className="label-eyebrow pb-2 text-right">Range Harga</th>
                  </tr>
                </thead>
                <tbody>
                  {profil.produkHarga.items.map((p) => (
                    <tr key={p.nama} className="border-b border-line-soft last:border-0">
                      <td className="py-2.5 pr-3 font-medium text-ink-900">
                        {p.nama}
                      </td>
                      <td className="py-2.5 pr-3 text-ink-500">{p.varian}</td>
                      <td className="tnum whitespace-nowrap py-2.5 text-right text-ink-900">
                        {formatIDR(p.hargaMin)} – {formatIDR(p.hargaMaks)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>

        {/* Asumsi Finansial */}
        <Card tone={biayaKosong ? "invalid" : "default"}>
          <CardHeader
            title="Asumsi Finansial"
            icon={<span aria-hidden>▥</span>}
            aside={<StatusBadge status={statusFinansial} />}
          />
          <CardBody className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FieldStatic
                label="Modal Awal"
                value={formatIDR(profil.asumsiFinansial.modalAwal)}
              />
              <FieldStatic
                label="HPP per Cup"
                value={formatIDR(profil.asumsiFinansial.hppPerCup)}
              />
            </div>

            <div
              className={
                biayaKosong
                  ? "rounded-[8px] border border-danger-600/30 bg-danger-50/60 px-3 py-2.5"
                  : "rounded-[8px] border border-line bg-surface-2 px-3 py-2.5"
              }
            >
              <FieldEditable
                label="Biaya Operasional (Bulanan)"
                placeholder="Belum terdefinisi detail"
                value={
                  profil.asumsiFinansial.biayaOperasionalBulanan === null
                    ? ""
                    : String(profil.asumsiFinansial.biayaOperasionalBulanan)
                }
                edited={fieldDiubah.has(
                  "asumsiFinansial.biayaOperasionalBulanan",
                )}
                onChange={(v) => {
                  const angka = Number(v.replace(/\D/g, ""));
                  ubahProfil(
                    "asumsiFinansial.biayaOperasionalBulanan",
                    Number.isFinite(angka) && angka > 0 ? angka : 0,
                  );
                }}
              />
            </div>

            <FieldStatic
              label="Target Penjualan (Harian)"
              value={profil.asumsiFinansial.targetHarian}
            />
          </CardBody>
        </Card>
      </div>

      {/* Kompetitor */}
      <Card className="mt-5">
        <CardHeader
          title="Kompetitor Terdekat"
          icon={<span aria-hidden>◎</span>}
          aside={
            <div className="flex items-center gap-2">
              <span className="hidden text-[12px] text-ink-400 sm:inline">
                {profil.kompetitor.sumber} · {profil.kompetitor.diambil}
              </span>
              <StatusBadge status={profil.kompetitor.status} />
            </div>
          }
        />
        <CardBody>
          <div className="grid gap-3 sm:grid-cols-3">
            {profil.kompetitor.items.map((k) => (
              <div
                key={k.nama}
                className="rounded-[10px] border border-line bg-surface-2 px-4 py-3"
              >
                <p className="text-[14px] font-semibold text-ink-900">{k.nama}</p>
                <p className="mt-1 text-[12.5px] leading-relaxed text-ink-500">
                  {k.catatan}
                </p>
              </div>
            ))}
            <button className="rounded-[10px] border border-dashed border-line px-4 py-3 text-[13px] font-medium text-ink-400 hover:border-ink-400 hover:text-ink-700">
              + Tambah Kompetitor Lain
            </button>
          </div>
        </CardBody>
      </Card>

      {/* Blok kesiapan data — wajib, menerjemahkan lubang data jadi konsekuensi */}
      <div className="mt-5">
        {biayaKosong ? (
          <Callout tone="danger">
            <strong className="font-semibold text-ink-900">
              2 dari 3 input finansial wajib terisi.
            </strong>{" "}
            Tanpa biaya operasional bulanan, titik impas akan tampil sebagai
            rentang, dan dimensi <em>Kesiapan Operasional</em> (bobot 20%) tidak
            dapat diskor. Simulasi tetap bisa dijalankan.
          </Callout>
        ) : (
          <Callout tone="info">
            <strong className="font-semibold text-ink-900">
              Seluruh input finansial wajib sudah terisi.
            </strong>{" "}
            Titik impas dapat dihitung sebagai angka tunggal dan seluruh dimensi
            skor dapat dinilai.
          </Callout>
        )}
      </div>

      <div className="mt-8 flex flex-wrap justify-end gap-3">
        {biayaKosong ? (
          <Button
            variant="secondary"
            onClick={() =>
              ubahProfil("asumsiFinansial.biayaOperasionalBulanan", 24_500_000)
            }
          >
            Lengkapi Data yang Kurang
          </Button>
        ) : null}
        <Button
          onClick={() => {
            capai("pasar");
            router.push("/pasar");
          }}
        >
          Lanjut ke Simulasi Pasar
          <span aria-hidden>→</span>
        </Button>
      </div>
    </div>
  );
}
