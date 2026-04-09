import type { ReactNode } from "react";

export default function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-3 font-['Bebas_Neue'] text-2xl tracking-[0.06em] text-orange-300">
      {children}
    </h2>
  );
}
