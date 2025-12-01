/**
 * Generic debounce hooks:
 * - useDebouncedValue: returns a debounced version of a value
 * - useDebouncedCallback: returns a debounced function with cancel
 *
 * Both are generic and dependency-free.
 *
 * NOTE: the callback generic uses `any` for the parameter list to avoid a
 * problematic constraint with `unknown[]` when callers provide concrete
 * parameter types (e.g. `(val: string) => void`). This is safe for this hook:
 * it only proxies arguments to the original function.
 */

import { useCallback, useEffect, useRef, useState } from "react";

type UseDebouncedValueOptions = {
  delay?: number;
  leading?: boolean; // if true, invoke immediately on first call
};

export function useDebouncedValue<T>(
  value: T,
  { delay = 500, leading = false }: UseDebouncedValueOptions = {}
) {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const timerRef = useRef<number | null>(null);
  const leadingRef = useRef<boolean>(leading);

  useEffect(() => {
    if (leadingRef.current) {
      setDebouncedValue(value);
      leadingRef.current = false;
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => {
        timerRef.current = null;
      }, delay);
      return;
    }

    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }

    timerRef.current = window.setTimeout(() => {
      setDebouncedValue(value);
      timerRef.current = null;
    }, delay);

    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [value, delay]);

  const cancel = useCallback(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  return { value: debouncedValue, cancel };
}

/**
 * Returns a debounced function mirroring the signature of `fn`.
 * Use .cancel() to cancel pending invocation.
 *
 * IMPORTANT: the generic constraint uses `any` for the args list so callers can
 * pass concrete function types such as `(val: string) => void` without TS errors.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  fn: T,
  delay = 500
) {
  const timerRef = useRef<number | null>(null);
  const fnRef = useRef<T>(fn);
  fnRef.current = fn;

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  const callback = useCallback(
    (...args: Parameters<T>) => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
      timerRef.current = window.setTimeout(() => {
        timerRef.current = null;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (fnRef.current as unknown as (...a: any[]) => any)(...args);
      }, delay);
    },
    [delay]
  );

  const cancel = useCallback(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  return { callback, cancel };
}
