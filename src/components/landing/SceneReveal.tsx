import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/format";

export function SceneReveal({
  aktif,
  children,
  delay = 0,
  className,
}: {
  aktif: boolean;
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const style: CSSProperties = {
    transitionDelay: `${aktif ? delay : 0}ms`,
  };

  return (
    <div
      className={cn(
        "transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none",
        aktif ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0",
        className,
      )}
      style={style}
    >
      {children}
    </div>
  );
}
