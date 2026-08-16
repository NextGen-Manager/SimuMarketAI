import { WorkspacePage } from "@/components/layout/WorkspacePage";
import { OwnerOrOnboardingBoundary } from "@/features/auth/PermissionBoundary";
import { AnalysisHistory } from "@/features/analysis/AnalysisHistory";

export default function AnalysisHistoryPage() {
  return (
    <WorkspacePage
      eyebrow="Analisis"
      title="Riwayat analisis"
      description="Seluruh analisis yang pernah kamu jalankan, lengkap dengan status dan versi rule yang dipakai."
    >
      <OwnerOrOnboardingBoundary>
        <AnalysisHistory basePath="/analisis/riwayat" />
      </OwnerOrOnboardingBoundary>
    </WorkspacePage>
  );
}
