export const getNextCarouselIndex = (
  currentIndex: number,
  totalItems: number,
): number => {
  if (totalItems <= 0) {
    return 0;
  }

  return (currentIndex + 1) % totalItems;
};

export const getPreviousCarouselIndex = (
  currentIndex: number,
  totalItems: number,
): number => {
  if (totalItems <= 0) {
    return 0;
  }

  return (currentIndex - 1 + totalItems) % totalItems;
};

export const clampCarouselIndex = (
  nextIndex: number,
  totalItems: number,
): number => {
  if (totalItems <= 0) {
    return 0;
  }

  return Math.min(Math.max(nextIndex, 0), totalItems - 1);
};
