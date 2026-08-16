import type { InputHTMLAttributes, SelectHTMLAttributes } from "react";
import { cn } from "@/lib/format";

const controlClass =
  "w-full rounded-[9px] border border-line bg-surface px-3.5 py-2.5 text-[14px] text-ink-900 placeholder:text-ink-400 disabled:cursor-not-allowed disabled:bg-surface-2";

export function FormField({
  label,
  hint,
  error,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
  error?: string;
}) {
  const id = props.id ?? props.name;
  const descriptionId = id ? `${id}-description` : undefined;
  return (
    <label className="block" htmlFor={id}>
      <span className="label-eyebrow mb-1.5 block">{label}</span>
      <input
        {...props}
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={hint || error ? descriptionId : undefined}
        className={cn(controlClass, error ? "border-danger-600" : "", props.className)}
      />
      {hint || error ? (
        <span
          id={descriptionId}
          className={cn(
            "mt-1.5 block text-[12px]",
            error ? "text-danger-600" : "text-ink-500",
          )}
        >
          {error ?? hint}
        </span>
      ) : null}
    </label>
  );
}

export function SelectField({
  label,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { label: string }) {
  const id = props.id ?? props.name;
  return (
    <label className="block" htmlFor={id}>
      <span className="label-eyebrow mb-1.5 block">{label}</span>
      <select {...props} id={id} className={cn(controlClass, props.className)}>
        {children}
      </select>
    </label>
  );
}
