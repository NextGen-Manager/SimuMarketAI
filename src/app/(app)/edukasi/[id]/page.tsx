import { WorkspacePage } from "@/components/layout/WorkspacePage";
import { OwnerOrOnboardingBoundary } from "@/features/auth/PermissionBoundary";
import { EducationModuleView } from "@/features/education/EducationModuleView";

export default async function EducationModulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <WorkspacePage
      eyebrow="Belajar"
      title="Modul edukasi"
      description="Baca materinya, lalu kerjakan cek pemahaman. Hasil disimpan bersama versi konten modul ini."
    >
      <OwnerOrOnboardingBoundary>
        <EducationModuleView moduleId={id} />
      </OwnerOrOnboardingBoundary>
    </WorkspacePage>
  );
}
