import { useCallback, useState } from "react";

interface UseToggleReturn {
  value: boolean;
  toggle: () => void;
  setTrue: () => void;
  setFalse: () => void;
}

/**
 * Gerencia um estado booleano com helpers para alternar, ligar e desligar.
 *
 * @param initialValue Valor inicial do estado.
 * @returns Objeto com `value`, `toggle`, `setTrue` e `setFalse`.
 *
 * @example
 * ```tsx
 * const { value: isOpen, toggle, setFalse } = useToggle(false);
 *
 * return (
 *   <>
 *     <button onClick={toggle}>Menu</button>
 *     {isOpen && <aside onMouseLeave={setFalse}>...</aside>}
 *   </>
 * );
 * ```
 */
const useToggle = (initialValue = false): UseToggleReturn => {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue((previousValue) => !previousValue);
  }, []);

  const setTrue = useCallback(() => {
    setValue(true);
  }, []);

  const setFalse = useCallback(() => {
    setValue(false);
  }, []);

  return { value, toggle, setTrue, setFalse };
};

export default useToggle;
