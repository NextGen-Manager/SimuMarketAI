import { WorkspacePage } from "@/components/layout/WorkspacePage";
import { ReceiptImporter } from "@/features/transactions/ReceiptImporter";

export default function ReceiptImportPage() {
  return (
    <WorkspacePage
      eyebrow="Usaha · Transaksi"
      title="Catat dari foto struk"
      description="Unggah foto, periksa hasil OCR, lalu konfirmasikan sebelum transaksi dicatat."
    >
      <ReceiptImporter />
    </WorkspacePage>
  );
}
