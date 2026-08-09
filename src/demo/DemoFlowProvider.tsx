"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { profilAwal, type Profil } from "./data/profile";
import { produkAwal, hariTercatatAwal, type Produk } from "./data/transactions";
import { modulWajib } from "./data/education";
import type { JourneyId } from "./journeys";

export type Varian = "normal" | "parsial";

type Ctx = {
  journey: JourneyId | null;
  pilihJourney: (j: JourneyId) => void;

  activeBusinessId: string;
  setActiveBusinessId: (id: string) => void;

  langkahSelesai: Set<string>;
  tandaiSelesai: (id: string) => void;

  profil: Profil;
  ubahProfil: (path: string, nilai: string | number) => void;
  fieldDiubah: Set<string>;

  modulSelesai: Set<string>;
  selesaikanModul: (id: string) => void;
  gerbangTerbuka: boolean;

  produk: Produk[];
  tambahProduk: (p: Produk) => void;
  hapusProduk: (id: string) => void;
  hariTercatat: number;
  tambahHari: () => void;
  transaksiHariIni: { businessId: string; produkId: string; jumlah: number; harga: number }[];
  catatTransaksi: (t: { businessId: string; produkId: string; jumlah: number; harga: number }) => void;

  varian: Varian;
  setVarian: (v: Varian) => void;

  autoplay: boolean;
  setAutoplay: (v: boolean) => void;

  reset: () => void;
};

const DemoCtx = createContext<Ctx | null>(null);

export function DemoFlowProvider({ children }: { children: ReactNode }) {
  const [journey, setJourney] = useState<JourneyId | null>(null);
  const [activeBusinessId, setActiveBusinessId] = useState("kopi-senja");
  const [langkahSelesai, setLangkahSelesai] = useState<Set<string>>(new Set());
  const [profil, setProfil] = useState<Profil>(profilAwal);
  const [fieldDiubah, setFieldDiubah] = useState<Set<string>>(new Set());
  const [modulSelesai, setModulSelesai] = useState<Set<string>>(new Set());
  const [produk, setProduk] = useState<Produk[]>(produkAwal);
  const [hariTercatat, setHariTercatat] = useState(hariTercatatAwal);
  const [transaksiHariIni, setTransaksiHariIni] = useState<
    { businessId: string; produkId: string; jumlah: number; harga: number }[]
  >([]);
  const [varian, setVarian] = useState<Varian>("normal");
  const [autoplay, setAutoplay] = useState(false);

  const pilihJourney = useCallback((j: JourneyId) => setJourney(j), []);

  const tandaiSelesai = useCallback((id: string) => {
    setLangkahSelesai((s) => new Set(s).add(id));
  }, []);

  const ubahProfil = useCallback((path: string, nilai: string | number) => {
    setProfil((prev) => {
      const next = structuredClone(prev) as Record<string, unknown>;
      const parts = path.split(".");
      let node = next;
      for (let i = 0; i < parts.length - 1; i++) {
        node = node[parts[i]] as Record<string, unknown>;
      }
      node[parts[parts.length - 1]] = nilai;
      return next as Profil;
    });
    setFieldDiubah((s) => new Set(s).add(path));
  }, []);

  const selesaikanModul = useCallback((id: string) => {
    setModulSelesai((s) => new Set(s).add(id));
  }, []);

  /** Gerbang F-09: seluruh modul wajib harus selesai. */
  const gerbangTerbuka = modulWajib.every((m) => modulSelesai.has(m));

  const tambahProduk = useCallback((p: Produk) => {
    setProduk((prev) => [...prev, p]);
  }, []);

  const hapusProduk = useCallback((id: string) => {
    setProduk((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const catatTransaksi = useCallback(
    (t: { businessId: string; produkId: string; jumlah: number; harga: number }) => {
      setTransaksiHariIni((prev) => [t, ...prev]);
    },
    [],
  );

  const tambahHari = useCallback(() => {
    setHariTercatat((h) => h + 1);
  }, []);

  const reset = useCallback(() => {
    setJourney(null);
    setActiveBusinessId("kopi-senja");
    setLangkahSelesai(new Set());
    setProfil(profilAwal);
    setFieldDiubah(new Set());
    setModulSelesai(new Set());
    setProduk(produkAwal);
    setHariTercatat(hariTercatatAwal);
    setTransaksiHariIni([]);
    setVarian("normal");
    setAutoplay(false);
  }, []);

  const value = useMemo(
    () => ({
      journey,
      pilihJourney,
      activeBusinessId,
      setActiveBusinessId,
      langkahSelesai,
      tandaiSelesai,
      profil,
      ubahProfil,
      fieldDiubah,
      modulSelesai,
      selesaikanModul,
      gerbangTerbuka,
      produk,
      tambahProduk,
      hapusProduk,
      hariTercatat,
      tambahHari,
      transaksiHariIni,
      catatTransaksi,
      varian,
      setVarian,
      autoplay,
      setAutoplay,
      reset,
    }),
    [
      journey,
      pilihJourney,
      activeBusinessId,
      langkahSelesai,
      tandaiSelesai,
      profil,
      ubahProfil,
      fieldDiubah,
      modulSelesai,
      selesaikanModul,
      gerbangTerbuka,
      produk,
      tambahProduk,
      hapusProduk,
      hariTercatat,
      tambahHari,
      transaksiHariIni,
      catatTransaksi,
      varian,
      autoplay,
      reset,
    ],
  );

  return <DemoCtx.Provider value={value}>{children}</DemoCtx.Provider>;
}

export function useDemoFlow() {
  const ctx = useContext(DemoCtx);
  if (!ctx) throw new Error("useDemoFlow harus dipakai di dalam DemoFlowProvider");
  return ctx;
}
