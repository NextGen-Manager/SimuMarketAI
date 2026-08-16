import { ButtonLink } from "@/components/ui/Button";
import { WorkspacePage } from "@/components/layout/WorkspacePage";
import { OwnerBoundary } from "@/features/auth/PermissionBoundary";
import { TransactionHistory } from "@/features/transactions/TransactionHistory";

export default function TransactionsPage() {
  return <WorkspacePage eyebrow="Usaha" title="Transaksi" description="Riwayat transaksi tersimpan per usaha dan dapat ditelusuri satu per satu." actions={<ButtonLink href="/transaksi/catat">Catat transaksi</ButtonLink>}><OwnerBoundary><TransactionHistory /></OwnerBoundary></WorkspacePage>;
}
