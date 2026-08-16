import { WorkspacePage } from "@/components/layout/WorkspacePage";
import { OwnerOrOnboardingBoundary } from "@/features/auth/PermissionBoundary";
import { AnalysisForm } from "@/features/analysis/AnalysisForm";

export default function AnalysisPage() {
  return (
    <WorkspacePage
      eyebrow="Analisis"
      title="Analisis pasar baru"
      description="Isi rencana usaha, lalu jalankan analisis deterministik. Analisis tidak perlu terikat usaha yang sudah berjalan."
    >
      <OwnerOrOnboardingBoundary>
        <AnalysisForm />
      </OwnerOrOnboardingBoundary>
    </WorkspacePage>
  );
}
