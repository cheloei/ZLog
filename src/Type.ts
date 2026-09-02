/**
 * @file Core type definitions for ZTracer.
 * Defines callback signatures, group configurations, options, and config structure.
 */

/**
 * Callback function type for logging events.
 * @template T - String literal type for group names.
 * @param data - The data being logged (any type).
 * @param group - Optional group name associated with the log.
 * @returns void or Promise<void> for async support.
 */
export type ZTracerCallBack<T extends string = string> = (
  data: unknown,
  group?: T
) => void | Promise<void>;

/**
 * Configuration for a specific log group.
 * @template T - String literal type for group names.
 * @property background - CSS background color (hex, rgb, etc.) for browser.
 * @property color - CSS text color.
 * @property callBack - Optional callback specific to this group.
 */
export interface ZTracerGroup<T extends string = string> {
  background?: string;
  color?: string;
  callBack?: ZTracerCallBack<T>;
}

/**
 * Record mapping group names to their configurations.
 * @template T - String literal type for group names.
 */
export type ZTracerGroups<T extends string = string> = Record<T, ZTracerGroup<T>>;

/**
 * Per-log options that can be passed to logging methods.
 * @template T - String literal type for group names.
 * @property group - The group name to associate with this log.
 * @property suffix - Optional suffix appended to the group label for disambiguation.
 * @property callBack - Optional callback specific to this log entry.
 */
export interface ZTracerOptions<T extends string = string> {
  group?: T;
  suffix?: string;
  callBack?: ZTracerCallBack<T>;
}

/**
 * Main configuration interface for ZTracer.
 * @template T - String literal type for group names.
 * @property global - Global settings.
 * @property global.debug - Enable/disable console output.
 * @property global.callBack - Optional global callback for all logs.
 * @property groups - Optional mapping of group names to their configurations.
 */
export interface ZTracerConfig<T extends string = string> {
  global: {
    debug: boolean;
    callBack?: ZTracerCallBack<T>;
  };
  groups?: ZTracerGroups<T>;
}