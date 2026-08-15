import { WorkspacePage } from "@/components/layout/WorkspacePage";
import { AnalysisProgress } from "@/features/analysis/AnalysisProgress";
import { OwnerOrOnboardingBoundary } from "@/features/auth/PermissionBoundary";

export default async function AnalysisRunPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <WorkspacePage
      eyebrow="Analisis"
      title="Proses analisis"
      description="Tahap yang tampil di sini adalah tahap yang benar-benar dijalankan server. Laporan muncul setelah run selesai."
    >
      <OwnerOrOnboardingBoundary>
        <AnalysisProgress analysisId={id} />
      </OwnerOrOnboardingBoundary>
    </WorkspacePage>
  );
}
