import { WorkspacePage } from "@/components/layout/WorkspacePage";
import { BusinessSettings } from "@/features/businesses/BusinessSettings";
import { OwnerOrOnboardingBoundary } from "@/features/auth/PermissionBoundary";

export default function SettingsPage() {
  return <WorkspacePage eyebrow="Akun" title="Usaha dan akses" description="Kelola usaha milikmu atau gunakan kode undangan untuk bergabung sebagai kasir."><OwnerOrOnboardingBoundary><BusinessSettings /></OwnerOrOnboardingBoundary></WorkspacePage>;
}
