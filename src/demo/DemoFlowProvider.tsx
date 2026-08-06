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
import { stepIndex, type StepId } from "./steps";

export type Varian = "normal" | "parsial";

type Ctx = {
  /** Langkah terjauh yang sudah dicapai — mengunci stepper ke depan. */
  maxStep: number;
  capai: (id: StepId) => void;

  profil: Profil;
  ubahProfil: (path: string, nilai: string | number) => void;
  fieldDiubah: Set<string>;

  varian: Varian;
  setVarian: (v: Varian) => void;

  autoplay: boolean;
  setAutoplay: (v: boolean) => void;

  reset: () => void;
};

const DemoCtx = createContext<Ctx | null>(null);

export function DemoFlowProvider({ children }: { children: ReactNode }) {
  const [maxStep, setMaxStep] = useState(0);
  const [profil, setProfil] = useState<Profil>(profilAwal);
  const [fieldDiubah, setFieldDiubah] = useState<Set<string>>(new Set());
  const [varian, setVarian] = useState<Varian>("normal");
  const [autoplay, setAutoplay] = useState(false);

  const capai = useCallback((id: StepId) => {
    const i = stepIndex(id);
    setMaxStep((m) => (i > m ? i : m));
  }, []);

  /** Edit inline benar-benar mengubah nilai yang tampil. */
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

  const reset = useCallback(() => {
    setMaxStep(0);
    setProfil(profilAwal);
    setFieldDiubah(new Set());
    setVarian("normal");
    setAutoplay(false);
  }, []);

  const value = useMemo(
    () => ({
      maxStep,
      capai,
      profil,
      ubahProfil,
      fieldDiubah,
      varian,
      setVarian,
      autoplay,
      setAutoplay,
      reset,
    }),
    [maxStep, capai, profil, ubahProfil, fieldDiubah, varian, autoplay, reset],
  );

  return <DemoCtx.Provider value={value}>{children}</DemoCtx.Provider>;
}

export function useDemoFlow() {
  const ctx = useContext(DemoCtx);
  if (!ctx) throw new Error("useDemoFlow harus dipakai di dalam DemoFlowProvider");
  return ctx;
}
