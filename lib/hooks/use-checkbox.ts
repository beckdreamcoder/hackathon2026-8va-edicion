"use client";

import { useCallback, useState, type ChangeEvent } from "react";

/**
 * Estado controlado para <input type="checkbox">.
 * Uso: `const aviso = useCheckbox(false)` y en JSX `<input type="checkbox" {...aviso.props} />`.
 */
export function useCheckbox(initial = false) {
  const [checked, setChecked] = useState(initial);

  const onChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  }, []);

  return {
    checked,
    setChecked,
    props: { checked, onChange },
  };
}
