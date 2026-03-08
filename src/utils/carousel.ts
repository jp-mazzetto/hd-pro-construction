/**
 * Calcula o proximo indice de um carrossel de forma circular.
 *
 * @param currentIndex Indice atual.
 * @param totalItems Total de itens disponiveis.
 * @returns Proximo indice valido.
 *
 * @example
 * ```ts
 * const next = getNextCarouselIndex(2, 5); // 3
 * const loop = getNextCarouselIndex(4, 5); // 0
 * ```
 */
export const getNextCarouselIndex = (
  currentIndex: number,
  totalItems: number,
): number => {
  if (totalItems <= 0) {
    return 0;
  }

  return (currentIndex + 1) % totalItems;
};

/**
 * Calcula o indice anterior de um carrossel de forma circular.
 *
 * @param currentIndex Indice atual.
 * @param totalItems Total de itens disponiveis.
 * @returns Indice anterior valido.
 *
 * @example
 * ```ts
 * const prev = getPreviousCarouselIndex(2, 5); // 1
 * const loop = getPreviousCarouselIndex(0, 5); // 4
 * ```
 */
export const getPreviousCarouselIndex = (
  currentIndex: number,
  totalItems: number,
): number => {
  if (totalItems <= 0) {
    return 0;
  }

  return (currentIndex - 1 + totalItems) % totalItems;
};

/**
 * Garante que um indice fique dentro do intervalo valido do carrossel.
 *
 * @param nextIndex Indice desejado.
 * @param totalItems Total de itens disponiveis.
 * @returns Indice ajustado para o intervalo `0..totalItems-1`.
 *
 * @example
 * ```ts
 * const safeA = clampCarouselIndex(10, 5); // 4
 * const safeB = clampCarouselIndex(-3, 5); // 0
 * ```
 */
export const clampCarouselIndex = (
  nextIndex: number,
  totalItems: number,
): number => {
  if (totalItems <= 0) {
    return 0;
  }

  return Math.min(Math.max(nextIndex, 0), totalItems - 1);
};
