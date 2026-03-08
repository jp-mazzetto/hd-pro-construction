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
