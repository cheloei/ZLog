/**
 * @file Environment detection and utility functions.
 * Provides helpers for detecting Node.js vs browser, safe callback execution,
 * and adding a global footprint for external detection tools.
 */

/**
 * Adds a global `_ZTracer_` property with the library version.
 * This enables detection by tools like Wappalyzer.
 * The property is set on `globalThis` (Node.js) or `window` (browser).
 */
export const _addFootprint = (): void => {
  const version = "1.0.0";
  try {
    if (_isNode()) {
      (globalThis as any)._ZTracer_ = version;
    } else {
      (window as any)._ZTracer_ = version;
    }
  } catch (_) {
    // Silently fail in restricted environments (e.g., CSP)
  }
};

/**
 * Detects if the code is running in a Node.js environment.
 * @returns True if running in Node.js, false otherwise.
 */
export const _isNode = (): boolean => {
  return (
    typeof globalThis !== "undefined" &&
    "process" in globalThis &&
    typeof (globalThis as {
      process?: {
        versions?: {
          node?: string;
        };
      };
    }).process?.versions?.node === "string"
  );
};

/**
 * Safely executes a callback function, catching and logging errors without crashing.
 * @template F - The return type of the callback.
 * @param fn - The function to execute (sync or async).
 * @param context - A label identifying the callback source (used in error logs).
 * @param data - Optional data to include in debug logs on error.
 * @param groupName - Optional group name to include in debug logs on error.
 * @param alwaysLog - If true, errors are always logged; if false, only in debug mode.
 * @param debug - Whether debug mode is enabled.
 * @returns The result of the callback, or void if an error occurs.
 */
export const _safeCall = async <F>(
  fn: (() => Promise<F> | F) | undefined,
  context: string,
  data?: unknown,
  groupName?: string,
  alwaysLog: boolean = true,
  debug: boolean = false
): Promise<F | void> => {
  if (typeof fn !== "function") return;

  try {
    return await fn();
  } catch (err) {
    const prefix = alwaysLog ? "[ZTracer] Callback error" : "[ZTracer] Internal error";
    console.error(`${prefix} [${context}]:`, err);

    if (debug) {
      console.error(`  Data:`, data);
      if (groupName) console.error(`  Group:`, groupName);
      if (err instanceof Error) console.error(`  Stack:`, err.stack);
    }
  }
};