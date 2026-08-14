import { Suspense } from "react";
import { AuthPage } from "@/components/layout/AuthPage";
import { AuthForm } from "@/features/auth/AuthForm";

export default function RegisterPage() {
  return (
    <AuthPage title="Buat akun" description="Mulai satu ruang kerja untuk usaha F&B-mu.">
      <Suspense fallback={<div className="mt-8 h-80 animate-pulse rounded-[12px] bg-line-soft" />}>
        <AuthForm mode="register" />
      </Suspense>
    </AuthPage>
  );
}
