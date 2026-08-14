import { WorkspacePage } from "@/components/layout/WorkspacePage";
import { OwnerBoundary } from "@/features/auth/PermissionBoundary";
import { AnalyticsView } from "@/features/analytics/AnalyticsView";

export default function AnalyticsPage() {
  return <WorkspacePage eyebrow="Usaha" title="Analitik transaksi" description="Pola penjualan dihitung secara deterministik setelah data mencakup sedikitnya tujuh hari berbeda."><OwnerBoundary><AnalyticsView /></OwnerBoundary></WorkspacePage>;
}
