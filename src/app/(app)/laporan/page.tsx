import { WorkspacePage } from "@/components/layout/WorkspacePage";
import { OwnerOrOnboardingBoundary } from "@/features/auth/PermissionBoundary";
import { AnalysisHistory } from "@/features/analysis/AnalysisHistory";

export default function ReportListPage() {
  return (
    <WorkspacePage
      eyebrow="Analisis"
      title="Laporan"
      description="Pilih satu analisis untuk membaca laporan lengkapnya beserta bukti, keterbatasan, dan disclaimer."
    >
      <OwnerOrOnboardingBoundary>
        <AnalysisHistory basePath="/laporan" />
      </OwnerOrOnboardingBoundary>
    </WorkspacePage>
  );
}
