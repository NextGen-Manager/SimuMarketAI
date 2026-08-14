import { Suspense } from "react";
import { AuthPage } from "@/components/layout/AuthPage";
import { AuthForm } from "@/features/auth/AuthForm";

export default function LoginPage() {
  return (
    <AuthPage title="Masuk ke akunmu" description="Lanjutkan pengelolaan usaha dan catatan penjualanmu.">
      <Suspense fallback={<div className="mt-8 h-72 animate-pulse rounded-[12px] bg-line-soft" />}>
        <AuthForm mode="login" />
      </Suspense>
    </AuthPage>
  );
}
