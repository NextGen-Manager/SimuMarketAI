"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormControls";
import { apiFetch, ApiError } from "@/lib/api/client";
import { sessionSchema } from "@/lib/contracts/auth";

const loginInputSchema = z.object({
  email: z.email("Masukkan alamat email yang valid."),
  password: z.string().min(1, "Kata sandi wajib diisi."),
});

const registerInputSchema = loginInputSchema.extend({
  display_name: z.string().min(2, "Nama minimal 2 karakter.").max(120),
  password: z.string().min(10, "Kata sandi minimal 10 karakter.").max(128),
});

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<ApiError | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const isLogin = mode === "login";

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    const parsed = (isLogin ? loginInputSchema : registerInputSchema).safeParse(values);
    if (!parsed.success) {
      setFieldErrors(
        Object.fromEntries(parsed.error.issues.map((issue) => [String(issue.path[0]), issue.message])),
      );
      return;
    }

    setSubmitting(true);
    setFieldErrors({});
    setServerError(null);
    try {
      await apiFetch(`/v1/auth/${isLogin ? "login" : "register"}`, sessionSchema, {
        method: "POST",
        body: JSON.stringify(parsed.data),
      });
      const next = searchParams.get("next");
      router.replace(next?.startsWith("/") ? next : "/beranda");
    } catch (caught) {
      setServerError(caught instanceof ApiError ? caught : null);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="mt-8 space-y-4" onSubmit={submit} noValidate>
      {!isLogin ? (
        <FormField
          label="Nama"
          id="display_name"
          name="display_name"
          autoComplete="name"
          error={fieldErrors.display_name}
        />
      ) : null}
      <FormField
        label="Email"
        id="email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="nama@contoh.com"
        error={fieldErrors.email}
      />
      <FormField
        label="Kata sandi"
        id="password"
        name="password"
        type="password"
        autoComplete={isLogin ? "current-password" : "new-password"}
        hint={isLogin ? undefined : "Gunakan minimal 10 karakter."}
        error={fieldErrors.password}
      />
      {serverError ? (
        <div className="rounded-[9px] border border-danger-600/40 bg-danger-50 p-3" role="alert">
          <p className="text-[13px] text-danger-600">{serverError.message}</p>
          <p className="mt-1 font-mono text-[10px] text-ink-500">
            ID korelasi: {serverError.correlationId}
          </p>
        </div>
      ) : null}
      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? "Memproses..." : isLogin ? "Masuk" : "Buat akun"}
      </Button>
      <p className="text-center text-[13px] text-ink-500">
        {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
        <Link
          href={isLogin ? "/daftar" : "/masuk"}
          className="font-semibold text-teal-700 underline underline-offset-2"
        >
          {isLogin ? "Daftar" : "Masuk"}
        </Link>
      </p>
    </form>
  );
}
