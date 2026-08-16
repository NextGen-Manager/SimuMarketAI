import { WorkspacePage } from "@/components/layout/WorkspacePage";
import { OwnerOrOnboardingBoundary } from "@/features/auth/PermissionBoundary";
import { ReportView } from "@/features/analysis/ReportView";

export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <WorkspacePage
      eyebrow="Analisis"
      title="Laporan analisis"
      description="Seluruh angka pada halaman ini dihitung engine deterministik di server dan hanya diformat di sini."
    >
      <OwnerOrOnboardingBoundary>
        <ReportView analysisId={id} />
      </OwnerOrOnboardingBoundary>
    </WorkspacePage>
  );
}
