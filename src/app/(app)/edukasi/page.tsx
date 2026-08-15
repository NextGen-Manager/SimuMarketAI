import { WorkspacePage } from "@/components/layout/WorkspacePage";
import { OwnerOrOnboardingBoundary } from "@/features/auth/PermissionBoundary";
import { EducationList } from "@/features/education/EducationList";

export default function EducationPage() {
  return (
    <WorkspacePage
      eyebrow="Belajar"
      title="Modul edukasi"
      description="Materi yang perlu diselesaikan sebelum menjalankan analisis pasar. Setiap penyelesaian menunjuk versi konten yang kamu kerjakan."
    >
      <OwnerOrOnboardingBoundary>
        <EducationList />
      </OwnerOrOnboardingBoundary>
    </WorkspacePage>
  );
}
