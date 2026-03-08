import { useCallback, useEffect, useState } from "react";

import {
  clampCarouselIndex,
  getNextCarouselIndex,
  getPreviousCarouselIndex,
} from "../utils/carousel";

interface UseCarouselOptions {
  autoPlayDelay?: number;
}

interface UseCarouselReturn {
  activeIndex: number;
  next: () => void;
  prev: () => void;
  goTo: (index: number) => void;
}

const DEFAULT_DELAY = 5000;

/**
 * Controla indice de carrossel com navegacao manual e autoplay opcional.
 *
 * @param totalItems Quantidade total de itens do carrossel.
 * @param options Configuracoes como `autoPlayDelay` em milissegundos.
 * @returns Estado e acoes para controlar o carrossel.
 *
 * @example
 * ```tsx
 * const { activeIndex, next, prev, goTo } = useCarousel(posts.length, {
 *   autoPlayDelay: 4000,
 * });
 *
 * return (
 *   <>
 *     <img src={posts[activeIndex].url} alt={posts[activeIndex].caption} />
 *     <button onClick={prev}>Anterior</button>
 *     <button onClick={next}>Proximo</button>
 *     <button onClick={() => goTo(0)}>Primeiro</button>
 *   </>
 * );
 * ```
 */
const useCarousel = (
  totalItems: number,
  options: UseCarouselOptions = {},
): UseCarouselReturn => {
  const autoPlayDelay = options.autoPlayDelay ?? DEFAULT_DELAY;
  const [activeIndex, setActiveIndex] = useState(0);

  const next = useCallback(() => {
    setActiveIndex((currentIndex) =>
      getNextCarouselIndex(currentIndex, totalItems),
    );
  }, [totalItems]);

  const prev = useCallback(() => {
    setActiveIndex((currentIndex) =>
      getPreviousCarouselIndex(currentIndex, totalItems),
    );
  }, [totalItems]);

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex(clampCarouselIndex(index, totalItems));
    },
    [totalItems],
  );

  useEffect(() => {
    if (totalItems < 2) {
      return undefined;
    }

    const intervalId = window.setInterval(next, autoPlayDelay);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [autoPlayDelay, next, totalItems]);

  return { activeIndex: clampCarouselIndex(activeIndex, totalItems), next, prev, goTo };
};

export default useCarousel;
