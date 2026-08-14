import { WorkspacePage } from "@/components/layout/WorkspacePage";
import { DashboardView } from "@/features/dashboard/DashboardView";

export default function DashboardPage() {
  return (
    <WorkspacePage
      eyebrow="Ringkasan"
      title="Beranda"
      description="Kondisi usaha dan langkah yang perlu diperhatikan hari ini."
    >
      <DashboardView />
    </WorkspacePage>
  );
}
