"use client";

import { useEffect, useState } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { DataSkeleton, EmptyState, ErrorState } from "@/components/ui/DataState";
import { FormField, SelectField } from "@/components/ui/FormControls";
import { BusinessSelector, useInitialBusiness } from "@/features/businesses/BusinessSelector";
import { useSession } from "@/features/auth/SessionProvider";
import { apiFetch, ApiError } from "@/lib/api/client";
import { useApiResource } from "@/lib/api/useApiResource";
import {
  receiptConfirmSchema,
  receiptCreatedSchema,
  receiptImportSchema,
  type ReceiptDraftItem,
  type ReceiptImport,
} from "@/lib/contracts/artifacts";
import { productsSchema, type Product } from "@/lib/contracts/operations";
import { formatIDR } from "@/lib/format";

const receiptIdKey = "simumarket-receipt-import-id";
const receiptBusinessKey = "simumarket-receipt-business-id";
const processingStatuses = new Set(["queued", "preprocessing", "extracting"]);

export function ReceiptImporter() {
  const initialBusiness = useInitialBusiness();
  const { session } = useSession();
  const [businessId, setBusinessId] = useState(() => {
    if (typeof window === "undefined") return initialBusiness;
    return sessionStorage.getItem(receiptBusinessKey) ?? initialBusiness;
  });
  const [receiptId, setReceiptId] = useState(() =>
    typeof window === "undefined" ? "" : (sessionStorage.getItem(receiptIdKey) ?? ""),
  );
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<ApiError | null>(null);
  const selectedBusinessId = businessId || initialBusiness;
  const {
    data: receiptData,
    loading: receiptLoading,
    error: receiptError,
    reload: reloadReceipt,
  } = useApiResource(
    receiptId && selectedBusinessId
      ? `/v1/receipt-imports/${receiptId}?business_id=${selectedBusinessId}`
      : null,
    receiptImportSchema,
  );
  const products = useApiResource(
    selectedBusinessId ? `/v1/products?business_id=${selectedBusinessId}` : null,
    productsSchema,
  );

  useEffect(() => {
    if (!receiptData || !processingStatuses.has(receiptData.status)) return;
    const timer = window.setTimeout(() => void reloadReceipt(), 1500);
    return () => window.clearTimeout(timer);
  }, [receiptData, reloadReceipt]);

  function chooseBusiness(value: string) {
    setBusinessId(value);
    setReceiptId("");
    sessionStorage.setItem(receiptBusinessKey, value);
    sessionStorage.removeItem(receiptIdKey);
  }

  async function upload(file: File) {
    if (!selectedBusinessId) return;
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setUploadError(
        new ApiError(
          "Gunakan foto JPG atau PNG.",
          0,
          "UNSUPPORTED_RECEIPT_TYPE",
          "tidak tersedia",
          false,
        ),
      );
      return;
    }
    setUploading(true);
    setUploadError(null);
    try {
      const sha256 = await hashFile(file);
      const created = await apiFetch(
        `/v1/receipt-imports?business_id=${selectedBusinessId}`,
        receiptCreatedSchema,
        {
          method: "POST",
          body: JSON.stringify({
            file_name: file.name,
            content_type: file.type,
            size_bytes: file.size,
            sha256,
          }),
        },
      );
      const uploaded = await fetch(created.upload.url, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!uploaded.ok) throw new Error("signed upload failed");
      const queued = await apiFetch(
        `/v1/receipt-imports/${created.receipt_import_id}/complete-upload?business_id=${selectedBusinessId}`,
        receiptImportSchema,
        { method: "POST" },
      );
      setReceiptId(queued.receipt_import_id);
      sessionStorage.setItem(receiptIdKey, queued.receipt_import_id);
      await reloadReceipt();
    } catch (caught) {
      setUploadError(
        caught instanceof ApiError
          ? caught
          : new ApiError(
              "Foto belum berhasil diunggah. Periksa koneksi lalu coba lagi.",
              0,
              "UPLOAD_FAILED",
              "tidak tersedia",
              true,
            ),
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <BusinessSelector value={selectedBusinessId} onChange={chooseBusiness} />
        <FormField
          label="Foto struk"
          type="file"
          accept="image/jpeg,image/png"
          capture="environment"
          disabled={!selectedBusinessId || uploading}
          hint="JPG atau PNG, maksimum 10 MB. Foto disimpan secara privat."
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void upload(file);
          }}
        />
      </div>

      {uploadError ? (
        <ErrorState
          message={uploadError.message}
          correlationId={uploadError.correlationId}
          retryable={false}
        />
      ) : null}
      {uploading ? <DataSkeleton rows={2} /> : null}
      {!selectedBusinessId ? (
        <EmptyState
          title="Pilih usaha"
          description="Struk dan transaksi akan disimpan pada usaha yang dipilih."
        />
      ) : receiptLoading ? (
        <DataSkeleton rows={4} />
      ) : receiptError ? (
        <ErrorState
          message={receiptError.message}
          correlationId={receiptError.correlationId}
          retryable={receiptError.retryable}
          onRetry={() => void reloadReceipt()}
        />
      ) : receiptData && processingStatuses.has(receiptData.status) ? (
        <ProcessingReceipt status={receiptData.status} />
      ) : receiptData?.status === "failed" ? (
        <ErrorState
          message="Foto belum dapat dibaca. Unggah foto yang lebih terang dan pastikan seluruh struk terlihat."
          correlationId={receiptData.failure_code ?? "tidak tersedia"}
          retryable={false}
        />
      ) : receiptData?.status === "committed" && receiptData.transaction ? (
        <CommittedReceipt
          receipt={receiptData}
          onReset={() => chooseBusiness(selectedBusinessId)}
        />
      ) : receiptData?.status === "ready_for_review" && receiptData.draft ? (
        products.loading ? (
          <DataSkeleton rows={4} />
        ) : products.error ? (
          <ErrorState
            message={products.error.message}
            correlationId={products.error.correlationId}
            retryable={products.error.retryable}
            onRetry={() => void products.reload()}
          />
        ) : (
          <ReceiptReview
            key={`${receiptData.receipt_import_id}:${receiptData.draft.version}`}
            receipt={receiptData}
            products={products.data ?? []}
            canManageProducts={
              session?.memberships.some(
                (membership) =>
                  membership.business_id === selectedBusinessId && membership.role === "owner",
              ) ?? false
            }
            onUpdated={() => void reloadReceipt()}
          />
        )
      ) : !receiptId ? (
        <EmptyState
          title="Unggah foto struk"
          description="Hasil OCR menjadi draft. Transaksi baru dicatat setelah kamu memeriksa dan mengonfirmasinya."
        />
      ) : null}
    </div>
  );
}

function ProcessingReceipt({ status }: { status: ReceiptImport["status"] }) {
  const label =
    status === "queued"
      ? "Menunggu proses OCR"
      : status === "preprocessing"
        ? "Menyiapkan gambar"
        : "Membaca isi struk";
  return (
    <Card tone="key">
      <CardHeader title={label} />
      <CardBody>
        <p className="text-[13px] text-ink-500" role="status" aria-live="polite">
          Halaman ini memperbarui status secara otomatis. OCR tidak akan mencatat transaksi tanpa
          konfirmasi kamu.
        </p>
      </CardBody>
    </Card>
  );
}

function ReceiptReview({
  receipt,
  products,
  canManageProducts,
  onUpdated,
}: {
  receipt: ReceiptImport;
  products: Product[];
  canManageProducts: boolean;
  onUpdated: () => void;
}) {
  const draft = receipt.draft!;
  const [merchantName, setMerchantName] = useState(String(draft.merchant_name.value ?? ""));
  const [occurredAt, setOccurredAt] = useState(toLocalInput(String(draft.occurred_at.value ?? "")));
  const [totalIdr, setTotalIdr] = useState(String(draft.total_idr.value ?? 0));
  const [items, setItems] = useState<ReceiptDraftItem[]>(draft.items);
  const [channel, setChannel] = useState("takeaway");
  const [acceptMismatch, setAcceptMismatch] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [committed, setCommitted] = useState(false);

  function changeItem(position: number, patch: Partial<ReceiptDraftItem>) {
    setItems((current) =>
      current.map((item) => (item.position === position ? { ...item, ...patch } : item)),
    );
    setDirty(true);
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const parsedDate = new Date(occurredAt);
      if (
        Number.isNaN(parsedDate.getTime()) ||
        !Number.isInteger(Number(totalIdr)) ||
        items.some(
          (item) =>
            !item.raw_name.trim() ||
            !Number.isInteger(item.quantity) ||
            item.quantity <= 0 ||
            !Number.isInteger(item.unit_price_idr) ||
            item.unit_price_idr < 0,
        )
      ) {
        throw new Error("invalid receipt draft");
      }
      await apiFetch(
        `/v1/receipt-imports/${receipt.receipt_import_id}/draft?business_id=${receipt.business_id}`,
        receiptImportSchema,
        {
          method: "PATCH",
          body: JSON.stringify({
            version: draft.version,
            merchant_name: merchantName || null,
            occurred_at: parsedDate.toISOString(),
            total_idr: Number(totalIdr),
            items: items.map((item) => ({
              raw_name: item.raw_name,
              matched_product_id: item.matched_product_id,
              quantity: item.quantity,
              unit_price_idr: item.unit_price_idr,
            })),
          }),
        },
      );
      setDirty(false);
      onUpdated();
    } catch (caught) {
      setError(
        caught instanceof ApiError
          ? caught
          : new ApiError(
              "Periksa tanggal, jumlah, harga, dan total sebelum menyimpan.",
              0,
              "INVALID_RECEIPT_DRAFT",
              "tidak tersedia",
              false,
            ),
      );
    } finally {
      setSaving(false);
    }
  }

  async function confirm() {
    setSaving(true);
    setError(null);
    try {
      await apiFetch(
        `/v1/receipt-imports/${receipt.receipt_import_id}/confirm?business_id=${receipt.business_id}`,
        receiptConfirmSchema,
        {
          method: "POST",
          body: JSON.stringify({
            version: draft.version,
            channel,
            accept_total_mismatch: acceptMismatch,
          }),
        },
      );
      setCommitted(true);
      onUpdated();
    } catch (caught) {
      setError(caught instanceof ApiError ? caught : null);
    } finally {
      setSaving(false);
    }
  }

  const firstLowConfidence = items.find((item) => (item.confidence ?? 0) < 0.8)?.position;
  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
      <Card>
        <CardHeader title="Foto sumber" />
        <CardBody>
          {receipt.image ? (
            // The signed URL is private and short-lived; it is never stored in browser storage.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={receipt.image.url}
              alt="Foto struk yang sedang diperiksa"
              className="max-h-[680px] w-full rounded-[10px] border border-line object-contain"
            />
          ) : (
            <p className="text-[13px] text-ink-500">Foto tidak tersedia.</p>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Periksa hasil OCR" />
        <CardBody className="space-y-5">
          <p className="text-[12px] leading-relaxed text-ink-500">
            Periksa seluruh field. Confidence rendah mendapat fokus pertama, tetapi semua hasil
            tetap merupakan draft sampai kamu mengonfirmasi.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="Nama merchant"
              value={merchantName}
              onChange={(event) => {
                setMerchantName(event.target.value);
                setDirty(true);
              }}
            />
            <FormField
              label="Tanggal dan waktu"
              type="datetime-local"
              required
              value={occurredAt}
              onChange={(event) => {
                setOccurredAt(event.target.value);
                setDirty(true);
              }}
            />
          </div>

          <div className="space-y-4">
            {items.map((item) => (
              <fieldset
                key={item.position}
                className="rounded-[10px] border border-line p-4"
              >
                <legend className="px-1 text-[12px] font-semibold text-ink-700">
                  Item {item.position + 1}
                  {(item.confidence ?? 0) < 0.8 ? " · Perlu diperiksa" : ""}
                </legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  <FormField
                    label="Nama pada struk"
                    autoFocus={item.position === firstLowConfidence}
                    value={item.raw_name}
                    onChange={(event) => changeItem(item.position, { raw_name: event.target.value })}
                  />
                  <SelectField
                    label="Cocokkan produk"
                    value={item.matched_product_id ?? ""}
                    onChange={(event) =>
                      changeItem(item.position, {
                        matched_product_id: event.target.value || null,
                      })
                    }
                  >
                    <option value="">Pilih produk</option>
                    {products
                      .filter((product) => product.is_active)
                      .map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name}
                        </option>
                      ))}
                  </SelectField>
                  <FormField
                    label="Jumlah"
                    type="number"
                    required
                    min={1}
                    value={item.quantity}
                    onChange={(event) =>
                      changeItem(item.position, { quantity: Number(event.target.value) })
                    }
                  />
                  <FormField
                    label="Harga satuan"
                    type="number"
                    required
                    min={0}
                    value={item.unit_price_idr}
                    onChange={(event) =>
                      changeItem(item.position, { unit_price_idr: Number(event.target.value) })
                    }
                  />
                </div>
                <p className="tnum mt-3 text-[12px] text-ink-500">
                  Total baris dari server: {formatIDR(item.line_total_idr)}
                  {dirty ? " · simpan koreksi untuk menghitung ulang" : ""}
                </p>
                <Button
                  className="mt-3"
                  variant="secondary"
                  onClick={() => {
                    setItems((current) => current.filter((entry) => entry.position !== item.position));
                    setDirty(true);
                  }}
                >
                  Hapus item
                </Button>
              </fieldset>
            ))}
            <Button
              variant="secondary"
              onClick={() => {
                const nextPosition = Math.max(-1, ...items.map((item) => item.position)) + 1;
                setItems((current) => [
                  ...current,
                  {
                    position: nextPosition,
                    raw_name: "Item baru",
                    matched_product_id: null,
                    quantity: 1,
                    unit_price_idr: 0,
                    line_total_idr: 0,
                    confidence: null,
                    corrected: true,
                  },
                ]);
                setDirty(true);
              }}
            >
              Tambah item
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="Total pada struk"
              type="number"
              required
              min={0}
              value={totalIdr}
              onChange={(event) => {
                setTotalIdr(event.target.value);
                setDirty(true);
              }}
            />
            <SelectField label="Kanal penjualan" value={channel} onChange={(event) => setChannel(event.target.value)}>
              <option value="dine_in">Makan di tempat</option>
              <option value="takeaway">Bawa pulang</option>
              <option value="delivery">Pesan antar</option>
            </SelectField>
          </div>

          <div className="rounded-[10px] border border-line bg-surface-2 p-4">
            <p className="tnum text-[13px] text-ink-700">
              Jumlah item dari server: {formatIDR(draft.calculated_items_total_idr)}
            </p>
            {!draft.total_matches_items ? (
              <label className="mt-3 flex items-start gap-2 text-[13px] leading-relaxed text-warn-600">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={acceptMismatch}
                  onChange={(event) => setAcceptMismatch(event.target.checked)}
                />
                Saya sudah memeriksa selisih antara jumlah item dan total struk dan tetap ingin
                mencatat jumlah item yang ditampilkan.
              </label>
            ) : null}
          </div>

          {receipt.warnings.map((warning) => (
            <p key={warning} className="text-[12px] text-warn-600" role="status">
              {warning}
            </p>
          ))}
          {error ? (
            <ErrorState
              message={error.message}
              correlationId={error.correlationId}
              retryable={false}
            />
          ) : null}
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => void save()} disabled={saving || !dirty || items.length === 0}>
              {saving ? "Menyimpan..." : "Simpan koreksi"}
            </Button>
            <Button
              variant="secondary"
              onClick={() => void confirm()}
              disabled={saving || dirty || committed || items.length === 0 || (!draft.total_matches_items && !acceptMismatch)}
            >
              Konfirmasi dan catat transaksi
            </Button>
            {canManageProducts ? (
              <ButtonLink href="/produk" variant="secondary">
                Buat atau kelola produk
              </ButtonLink>
            ) : (
              <p className="self-center text-[12px] text-ink-500">
                Item baru perlu ditambahkan ke katalog oleh pemilik usaha.
              </p>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

function CommittedReceipt({ receipt, onReset }: { receipt: ReceiptImport; onReset: () => void }) {
  return (
    <Card tone="key">
      <CardHeader title="Transaksi berhasil dicatat" />
      <CardBody>
        <p className="tnum text-[24px] font-bold text-success-600">
          {receipt.transaction ? formatIDR(receipt.transaction.gross_total_idr) : "Tidak tersedia"}
        </p>
        <p className="mt-2 text-[12px] text-ink-500">
          Total dihitung backend dari item yang telah kamu konfirmasi.
        </p>
        <Button className="mt-5" onClick={onReset}>
          Unggah struk berikutnya
        </Button>
      </CardBody>
    </Card>
  );
}

async function hashFile(file: File): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", await file.arrayBuffer());
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function toLocalInput(value: string): string {
  if (!value) return new Date().toISOString().slice(0, 16);
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return new Date().toISOString().slice(0, 16);
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}
