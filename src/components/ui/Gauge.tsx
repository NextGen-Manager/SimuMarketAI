/**
 * Gauge 0–100 sesuai proposal §7.4. Setengah lingkaran, satu warna tetap.
 * Warna tidak digradasikan merah→hijau supaya skor tinggi tidak terbaca
 * sebagai "aman". Posisi jarum dan label interpretasi yang membawa makna.
 */
export function ScoreGauge({
  nilai,
  interpretasi,
  ukuran = 240,
}: {
  nilai: number;
  interpretasi: string;
  ukuran?: number;
}) {
  const v = Math.max(0, Math.min(100, nilai));
  const r = 100;
  const cx = 120;
  const cy = 120;
  const keliling = Math.PI * r; // setengah lingkaran
  const terisi = (v / 100) * keliling;

  const coordinate = (value: number) => value.toFixed(6);

  // Posisi jarum pada busur
  const sudut = Math.PI * (1 - v / 100);
  const jx = cx + r * Math.cos(sudut);
  const jy = cy - r * Math.sin(sudut);

  return (
    <figure className="m-0 flex flex-col items-center">
      <svg
        viewBox="0 0 240 150"
        style={{ width: ukuran, maxWidth: "100%", height: "auto" }}
        role="img"
        aria-label={`Launch Readiness Score ${v} dari 100. ${interpretasi}.`}
      >
        {/* busur latar */}
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke="var(--color-surface-2)"
          strokeWidth="16"
          strokeLinecap="round"
        />
        {/* busur terisi */}
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke="var(--color-amber-600)"
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray={`${terisi} ${keliling}`}
        />
        {/* penanda batas rentang proposal §5.9: 50, 65, 80 */}
        {[50, 65, 80].map((b) => {
          const s = Math.PI * (1 - b / 100);
          const x1 = cx + (r - 11) * Math.cos(s);
          const y1 = cy - (r - 11) * Math.sin(s);
          const x2 = cx + (r + 11) * Math.cos(s);
          const y2 = cy - (r + 11) * Math.sin(s);
          return (
            <line
              key={b}
              x1={coordinate(x1)}
              y1={coordinate(y1)}
              x2={coordinate(x2)}
              y2={coordinate(y2)}
              stroke="var(--color-surface)"
              strokeWidth="2"
            />
          );
        })}
        {/* jarum */}
        <circle
          cx={coordinate(jx)}
          cy={coordinate(jy)}
          r="7"
          fill="var(--color-ink-900)"
        />
        <circle
          cx={coordinate(jx)}
          cy={coordinate(jy)}
          r="3"
          fill="var(--color-surface)"
        />

        <text
          x={cx}
          y={cy - 22}
          textAnchor="middle"
          fill="var(--color-ink-900)"
          style={{ font: "700 44px var(--font-sans)" }}
        >
          {v}
        </text>
        <text
          x={cx}
          y={cy - 2}
          textAnchor="middle"
          fill="var(--color-ink-400)"
          style={{ font: "600 12px var(--font-sans)" }}
        >
          dari 100
        </text>
        <text
          x={cx - r}
          y={cy + 20}
          textAnchor="middle"
          fill="var(--color-ink-400)"
          style={{ font: "500 11px var(--font-sans)" }}
        >
          0
        </text>
        <text
          x={cx + r}
          y={cy + 20}
          textAnchor="middle"
          fill="var(--color-ink-400)"
          style={{ font: "500 11px var(--font-sans)" }}
        >
          100
        </text>
      </svg>
      <figcaption className="mt-1 text-center text-[14px] font-semibold text-amber-600">
        {interpretasi}
      </figcaption>
    </figure>
  );
}

/** Rentang interpretasi resmi dari proposal §5.9. */
export function interpretasiSkor(nilai: number): string {
  if (nilai >= 80) return "Sangat layak dilanjutkan";
  if (nilai >= 65) return "Layak dengan mitigasi";
  if (nilai >= 50) return "Perlu evaluasi ulang";
  return "Tidak disarankan di kondisi ini";
}
