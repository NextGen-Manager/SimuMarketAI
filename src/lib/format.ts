/**
 * Frontend hanya memformat. Seluruh angka otoritatif datang jadi dari backend;
 * tidak ada penjumlahan uang di sini.
 */

const idr = new Intl.NumberFormat("id-ID", {
  style: "decimal",
  maximumFractionDigits: 0,
});

/** Uang selalu integer rupiah. */
export function formatIDR(value: number | null | undefined): string {
  if (value === null || value === undefined) return "Tidak tersedia";
  return `Rp ${idr.format(value)}`;
}

/** Bentuk ringkas untuk kartu metrik: Rp 18,5 jt */
export function formatIDRShort(value: number | null | undefined): string {
  if (value === null || value === undefined) return "Tidak tersedia";
  if (value >= 1_000_000_000) {
    return `Rp ${(value / 1_000_000_000).toLocaleString("id-ID", {
      maximumFractionDigits: 1,
    })} M`;
  }
  if (value >= 1_000_000) {
    return `Rp ${(value / 1_000_000).toLocaleString("id-ID", {
      maximumFractionDigits: 1,
    })} jt`;
  }
  return formatIDR(value);
}

export function formatPersen(value: number, digits = 0): string {
  return `${value.toLocaleString("id-ID", { maximumFractionDigits: digits })}%`;
}

/**
 * Rasio marjin datang sebagai basis point supaya backend tidak pernah
 * mengirim float di jalur uang. Di sini hanya diubah satuannya.
 */
export function formatBasisPoints(value: number | null | undefined): string {
  if (value === null || value === undefined) return "Tidak terdefinisi";
  return `${(value / 100).toLocaleString("id-ID", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}%`;
}

/** Angka apa pun yang boleh tidak terdefinisi ditulis apa adanya. */
export function formatSatuan(
  value: number | null | undefined,
  satuan: string,
): string {
  if (value === null || value === undefined) return "Tidak terdefinisi";
  return `${value.toLocaleString("id-ID")} ${satuan}`;
}

export function formatKeyakinan(value: number | null | undefined): string {
  if (value === null || value === undefined) return "Tidak tersedia";
  return value.toLocaleString("id-ID", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "Asia/Jakarta",
});

const dateTimeFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Jakarta",
});

export function formatDate(value: string): string {
  return dateFormatter.format(new Date(value));
}

export function formatDateTime(value: string): string {
  return `${dateTimeFormatter.format(new Date(value))} WIB`;
}

/** Waktu relatif sejak run mulai, untuk lini masa simulasi. */
export function formatDetik(ms: number): string {
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
