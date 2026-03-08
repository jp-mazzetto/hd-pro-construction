import { useEffect, useState } from "react";

/**
 * Retorna `true` quando a rolagem vertical da janela ultrapassa um limite.
 *
 * @param threshold Limite de pixels para considerar a pagina "rolada".
 * @returns Estado booleano indicando se o limite foi ultrapassado.
 *
 * @example
 * ```tsx
 * const scrolled = useScrollThreshold(80);
 *
 * return (
 *   <header className={scrolled ? "bg-white shadow" : "bg-transparent"}>
 *     ...
 *   </header>
 * );
 * ```
 */
const useScrollThreshold = (threshold = 50): boolean => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > threshold);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [threshold]);

  return isScrolled;
};

export default useScrollThreshold;
