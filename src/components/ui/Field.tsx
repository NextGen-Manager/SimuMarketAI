"use client";

import { useState } from "react";
import { cn } from "@/lib/format";

export function FieldLabel({ children }: { children: string }) {
  return <div className="label-eyebrow mb-1">{children}</div>;
}

export function FieldStatic({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <FieldLabel>{label}</FieldLabel>
      <p className="text-[15px] leading-relaxed text-ink-900">{value}</p>
    </div>
  );
}

/**
 * Edit inline yang benar-benar mengubah nilai. Menyimpan menaikkan
 * status field menjadi terkonfirmasi di layar Review.
 */
export function FieldEditable({
  label,
  value,
  onChange,
  multiline = false,
  placeholder,
  edited,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
  multiline?: boolean;
  placeholder?: string;
  edited?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  function simpan() {
    onChange(draft.trim());
    setEditing(false);
  }

  function batal() {
    setDraft(value);
    setEditing(false);
  }

  if (editing) {
    return (
      <div>
        <FieldLabel>{label}</FieldLabel>
        {multiline ? (
          <textarea
            autoFocus
            rows={3}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="w-full rounded-[8px] border border-teal-500 bg-surface px-3 py-2 text-[15px] text-ink-900"
          />
        ) : (
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") simpan();
              if (e.key === "Escape") batal();
            }}
            className="w-full rounded-[8px] border border-teal-500 bg-surface px-3 py-2 text-[15px] text-ink-900"
          />
        )}
        <div className="mt-2 flex gap-2">
          <button
            onClick={simpan}
            className="rounded-[8px] bg-teal-700 px-3 py-1.5 text-[13px] font-semibold text-white hover:bg-teal-600"
          >
            Simpan
          </button>
          <button
            onClick={batal}
            className="rounded-[8px] border border-line px-3 py-1.5 text-[13px] font-semibold text-ink-500 hover:bg-surface-2"
          >
            Batal
          </button>
        </div>
      </div>
    );
  }

  const kosong = value.trim().length === 0;

  return (
    <div className="group">
      <FieldLabel>{label}</FieldLabel>
      <div className="flex items-start justify-between gap-3">
        <p
          className={cn(
            "text-[15px] leading-relaxed",
            kosong ? "italic text-danger-600" : "text-ink-900",
          )}
        >
          {kosong ? (placeholder ?? "Belum terdefinisi") : value}
          {edited ? (
            <span className="ml-2 align-middle text-[11px] font-semibold text-teal-700">
              diubah
            </span>
          ) : null}
        </p>
        <button
          onClick={() => {
            setDraft(value);
            setEditing(true);
          }}
          aria-label={`Ubah ${label}`}
          className="shrink-0 rounded-[6px] border border-line px-2 py-1 text-[12px] font-semibold text-ink-500 opacity-0 transition-opacity hover:bg-surface-2 hover:text-ink-900 focus-visible:opacity-100 group-hover:opacity-100"
        >
          Ubah
        </button>
      </div>
    </div>
  );
}
