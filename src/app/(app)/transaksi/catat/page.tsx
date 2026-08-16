import { WorkspacePage } from "@/components/layout/WorkspacePage";
import { TransactionRecorder } from "@/features/transactions/TransactionRecorder";

export default function RecordTransactionPage() {
  return <WorkspacePage eyebrow="Transaksi" title="Catat penjualan" description="Pilih produk dan jumlahnya. Total akhir dihitung oleh server."><TransactionRecorder /></WorkspacePage>;
}
