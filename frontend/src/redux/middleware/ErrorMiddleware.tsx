import { isRejectedWithValue } from "@reduxjs/toolkit";
import type { Middleware, UnknownAction } from "redux";
import { globalMessage } from "../../contexts/MessageProvider";

/**
 * Safely read a nested property as unknown and attempt to return a string.
 */
function tryString(value: unknown): string | undefined {
  if (value == null) return undefined;
  if (typeof value === "string") {
    const s = value.trim();
    return s.length ? s : undefined;
  }
  return undefined;
}

/**
 * Extract a readable message from common RTK Query / fetchBaseQuery error shapes
 * and other thrown errors. Uses only typed/unknown checks (no `any`).
 */
function extractMessageFromAction(action: UnknownAction): string | undefined {
  try {
    const actionObj = action as Record<string, unknown>;
    const payload = actionObj.payload;

    const payloadStr = tryString(payload);
    if (payloadStr) return payloadStr;

    if (payload && typeof payload === "object") {
      const payloadObj = payload as Record<string, unknown>;
      const data = payloadObj.data;

      const dataStr = tryString(data);
      if (dataStr) return dataStr;

      if (data && typeof data === "object") {
        const dataObj = data as Record<string, unknown>;
        if (dataObj.detail) return String(dataObj.detail);
        if (dataObj.message) return String(dataObj.message);
        try {
          const serialized = JSON.stringify(dataObj);
          if (serialized && serialized !== "{}") return serialized;
        } catch {
          /* ignore serialization failure */
        }
      }

      if (payloadObj.message) return String(payloadObj.message);
    }

    const err = actionObj.error;
    const errStr = tryString(err);
    if (errStr) return errStr;
    if (err && typeof err === "object") {
      const errObj = err as Record<string, unknown>;
      if (errObj.message) return String(errObj.message);
      try {
        return JSON.stringify(errObj);
      } catch {
        return String(err);
      }
    }

    return undefined;
  } catch {
    return undefined;
  }
}

/**
 * Error middleware for Redux that shows a global message when RTK async actions are rejected.
 *
 * Notes:
 * - Use explicit generic types so TypeScript's middleware signatures align.
 * - The first generic is `object` (not `{}`) to avoid lint warnings about the `{}` type.
 * - `_api` is referenced with `void _api` to avoid "defined but never used" lints while keeping the full signature.
 */
export const ErrorMiddleware: Middleware = (_api) => (next) => (action) => {
  // keep the API variable referenced to satisfy "defined but never used" linters
  void _api;

  // forward the action first so reducers and other middleware run
  const result = next(action);

  try {
    if (isRejectedWithValue(action)) {
      const msg = extractMessageFromAction(action) ?? "Something went wrong";
      console.log(action);
      globalMessage.error({ content: msg, duration: 2 });
    }
  } catch {
    // swallow errors from the middleware itself - don't break app
  }

  return result;
};

export default ErrorMiddleware;
