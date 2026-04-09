import type { ReactNode } from "react";

export default function Para({ children }: { children: ReactNode }) {
  return <p className="mb-3 text-sm leading-relaxed text-gray-300">{children}</p>;
}
