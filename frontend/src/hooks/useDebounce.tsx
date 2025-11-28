/**
 * Generic debounce hooks:
 * - useDebouncedValue: returns a debounced version of a value
 * - useDebouncedCallback: returns a debounced function with cancel
 *
 * Both are generic, small, and dependency-free (no external libs).
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
    // Leading behaviour: if leading is true and this is the first update, set immediately
    if (leadingRef.current) {
      setDebouncedValue(value);
      leadingRef.current = false;
      // still set up a timer to accept subsequent trailing behaviour
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

  // cancel function for consumers
  const cancel = useCallback(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  return { value: debouncedValue, cancel };
}

/**
 * Returns a debounced function with the same signature as fn.
 * Use .cancel() to cancel pending invocation.
 */
export function useDebouncedCallback<T extends (...args: unknown[]) => unknown>(
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
        fnRef.current(...args);
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
