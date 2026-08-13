"use client";

import { useState } from "react";
import {
  subscriptionSeed,
  type SubscriptionPlan,
  type SubscriptionPlanId,
} from "@/demo/data/subscriptions";
import { cn } from "@/lib/format";

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="size-4 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden
    >
      <path d="m4 10 4 4 8-9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PlanCard({
  plan,
  selected,
  onSelect,
}: {
  plan: SubscriptionPlan;
  selected: boolean;
  onSelect: (id: SubscriptionPlanId) => void;
}) {
  return (
    <label
      className={cn(
        "relative flex cursor-pointer flex-col rounded-[16px] border bg-surface p-5 transition-colors sm:p-6",
        selected
          ? "border-teal-700 bg-teal-50/40"
          : "border-line hover:border-teal-700/40",
      )}
    >
      <input
        type="radio"
        name="subscription-plan"
        value={plan.id}
        checked={selected}
        onChange={() => onSelect(plan.id)}
        className="sr-only"
      />

      <div className="flex min-h-7 items-start justify-between gap-3">
        {plan.featured ? (
          <span className="rounded-full bg-teal-700 px-2.5 py-1 text-[9.5px] font-bold uppercase tracking-[0.1em] text-surface">
            Paling sesuai
          </span>
        ) : (
          <span />
        )}
        <span
          className={cn(
            "grid size-5 place-items-center rounded-full border",
            selected
              ? "border-teal-700 bg-teal-700 text-surface"
              : "border-line bg-surface text-transparent",
          )}
          aria-hidden
        >
          <CheckIcon />
        </span>
      </div>

      <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.11em] text-ink-400">
        {plan.audience}
      </p>
      <h2 className="mt-2 text-[30px] font-bold tracking-[-0.035em] text-ink-900 sm:text-[34px]">
        {plan.name}
      </h2>
      <div className="mt-4 flex items-baseline gap-2">
        <span className="tnum text-[24px] font-bold tracking-[-0.025em] text-ink-900">
          {plan.priceLabel}
        </span>
        <span className="text-[11px] font-semibold text-ink-400">
          {plan.billingLabel}
        </span>
      </div>
      <p className="mt-4 min-h-16 text-[12.5px] leading-5 text-ink-500">
        {plan.description}
      </p>

      <div className="my-5 h-px bg-line" />
      <ul className="flex-1 space-y-3">
        {plan.features.map((feature) => (
          <li
            key={feature}
            className="flex items-start gap-2.5 text-[12px] leading-5 text-ink-700"
          >
            <span className="mt-0.5 text-teal-700">
              <CheckIcon />
            </span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <span
        className={cn(
          "mt-6 inline-flex h-10 items-center justify-center rounded-[9px] border px-4 text-[12px] font-bold",
          selected
            ? "border-teal-700 bg-teal-700 text-surface"
            : "border-line bg-surface text-ink-700",
        )}
      >
        {selected ? "Paket dipilih" : plan.actionLabel}
      </span>
    </label>
  );
}

export default function SubscriptionPage() {
  const [selectedPlanId, setSelectedPlanId] =
    useState<SubscriptionPlanId>("premium");
  const [confirmedPlanId, setConfirmedPlanId] =
    useState<SubscriptionPlanId | null>(null);
  const selectedPlan = subscriptionSeed.plans.find(
    (plan) => plan.id === selectedPlanId,
  );

  return (
    <main className="mx-auto max-w-[1280px] px-4 py-6 sm:px-6 xl:px-8 xl:py-8">
      <header className="mx-auto max-w-3xl text-center">
        <p className="text-[10.5px] font-bold uppercase tracking-[0.13em] text-teal-700">
          Paket SimuMarket AI
        </p>
        <h1 className="mt-2 text-[28px] font-bold tracking-[-0.03em] text-ink-900 sm:text-[34px]">
          Pilih dukungan yang sesuai dengan tahap usahamu
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-[13.5px] leading-6 text-ink-500">
          Mulai gratis untuk mencatat usaha, gunakan analisis lengkap saat
          membutuhkan keputusan yang lebih dalam, atau dampingi banyak UMKM
          melalui paket institusi.
        </p>
      </header>

      <fieldset className="mt-8">
        <legend className="sr-only">Pilih paket langganan</legend>
        <div className="grid gap-4 lg:grid-cols-3">
          {subscriptionSeed.plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              selected={selectedPlanId === plan.id}
              onSelect={(id) => {
                setSelectedPlanId(id);
                setConfirmedPlanId(null);
              }}
            />
          ))}
        </div>
      </fieldset>

      <section className="mt-5 rounded-[14px] border border-line bg-surface p-5 sm:flex sm:items-center sm:justify-between sm:gap-5">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.11em] text-ink-400">
            Pilihan saat ini
          </p>
          <p className="mt-1 text-[15px] font-bold text-ink-900">
            {selectedPlan?.name} · {selectedPlan?.priceLabel}
          </p>
          <p className="mt-1 text-[11px] leading-5 text-ink-400">
            Pemilihan paket ini hanya simulasi dan tidak memproses pembayaran.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setConfirmedPlanId(selectedPlanId)}
          className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-[9px] bg-teal-700 px-5 text-[12px] font-bold text-surface hover:bg-teal-600 sm:mt-0 sm:w-auto"
        >
          {selectedPlanId === "institutional"
            ? "Ajukan konsultasi"
            : "Lanjutkan dengan paket ini"}
        </button>
      </section>

      <div aria-live="polite">
        {confirmedPlanId ? (
          <p className="mt-4 rounded-[10px] border border-success-600/30 bg-success-50 px-4 py-3 text-center text-[11.5px] font-semibold text-success-600">
            Pilihan {selectedPlan?.name} tersimpan untuk demo. Checkout dan
            aktivasi akun akan tersedia setelah integrasi backend.
          </p>
        ) : null}
      </div>

      <p className="mx-auto mt-5 max-w-3xl text-center text-[10.5px] leading-5 text-ink-400">
        {subscriptionSeed.meta.source} · {subscriptionSeed.meta.observedAt} ·{" "}
        {subscriptionSeed.meta.confidence}. Harga dan cakupan paket dapat berubah
        setelah validasi pengguna.
      </p>
    </main>
  );
}
