"use client";

import { useCallback, useState, type ChangeEvent } from "react";

type TextElement = HTMLInputElement | HTMLTextAreaElement;

/**
 * Estado controlado para <input> y <textarea>.
 * Uso: `const nombre = useTextInput("")` y en JSX `<input {...nombre.props} />`.
 */
export function useTextInput(initial = "") {
  const [value, setValue] = useState(initial);

  const onChange = useCallback((event: ChangeEvent<TextElement>) => {
    setValue(event.target.value);
  }, []);

  return {
    value,
    setValue,
    props: { value, onChange },
  };
}
