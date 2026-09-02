/**
 * @file Main ZTracer class implementation.
 * Provides logging methods with group styling, callbacks, and error handling.
 */

import { _addFootprint, _isNode, _safeCall } from "./modules/_env";
import { _styleBrowser, _styleNode } from "./modules/_styling";
import { ZTracerConfig, ZTracerGroup, ZTracerOptions } from "./Type";

/**
 * ZTracer - A simple typed logging library with group styling.
 * @template T - String literal type for group names (e.g., "api" | "db").
 */
export default class ZTracer<T extends string = string> {
  private _conf: ZTracerConfig<T>;

  /**
   * Creates a new ZTracer instance.
   * @param cfg - The configuration object.
   */
  constructor(cfg: ZTracerConfig<T> = { global: { debug: true } } as ZTracerConfig<T>) {
    _addFootprint(); // Add fingerprint for detection tools (Wappalyzer, etc.)
    this._conf = cfg;
  }

  /**
   * Logs arbitrary data to the console.
   * @param data - The data to log.
   * @param options - Optional per-log settings.
   * @returns Promise that resolves when logging is complete.
   */
  async log(data: unknown, options?: ZTracerOptions<T>): Promise<void> {
    await this._logger(() => console.log(data), data, options);
  }

  /**
   * Logs object/array data in a structured format.
   * - Arrays are displayed as tables.
   * - Objects are displayed using console.dir.
   * @param data - The object or array to log.
   * @param options - Optional per-log settings.
   * @returns Promise that resolves when logging is complete.
   */
  async fromJson(data: object | unknown[], options?: ZTracerOptions<T>): Promise<void> {
    await this._logger(() => {
      if (data == null) return;
      if (Array.isArray(data)) console.table(data);
      else console.dir(data);
    }, data, options);
  }

  /**
   * Measures the execution time of a callback function.
   * @param callback - The async/sync function to time.
   * @param options - Optional per-log settings.
   * @returns Promise that resolves when the callback completes.
   */
  async time(
    callback: () => Promise<void> | void,
    options?: ZTracerOptions<T>
  ): Promise<void> {
    const label = `timer-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    await this._logger(async () => {
      console.time(label);
      try {
        await callback();
      } finally {
        console.timeEnd(label);
      }
    }, null, options);
  }

  /**
   * Core logger – handles group rendering, console output, and all callbacks.
   * This method is called by all public logging methods.
   * @param logger - The function that performs the actual console logging.
   * @param data - The data being logged.
   * @param options - Per-log options.
   * @returns Promise that resolves when all operations are complete.
   */
  private async _logger(
    logger: () => Promise<void> | void,
    data: unknown,
    options?: ZTracerOptions<T>
  ): Promise<void> {
    const groupName = options?.group;
    const suffix = options?.suffix || "";
    let group: ZTracerGroup<T> | undefined = undefined;

    // Fetch group config if valid
    if (this._isValidGroup(groupName)) {
      group = this._conf.groups![groupName];
    }

    // Build display name: group + suffix (if both exist)
    let displayName: string | undefined;
    if (groupName) {
      displayName = suffix ? `${groupName} ${suffix}` : groupName;
    } else if (suffix) {
      displayName = suffix;
    }

    // Default style for invalid groups (gray background, white text)
    const defaultGroup: ZTracerGroup<T> = {
      background: "#6c757d",
      color: "#ffffff",
    };
    const effectiveGroup = group || defaultGroup;

    // Render group header (if debug enabled and displayName exists)
    if (this._conf.global.debug && displayName) {
      this._renderGroup(displayName, effectiveGroup.background, effectiveGroup.color);
    }

    try {
      // 1. Console logger (only if debug mode)
      if (this._conf.global.debug) {
        await _safeCall(logger, "console", data, groupName, false, this._conf.global.debug);
      }

      // 2. Global callback (always logged on error)
      if (typeof this._conf.global.callBack === "function") {
        await _safeCall(
          () => this._conf.global.callBack?.(data, groupName),
          "global",
          data,
          groupName,
          true,
          this._conf.global.debug
        );
      }

      // 3. Group callback (only if group exists)
      if (group && typeof group.callBack === "function") {
        await _safeCall(
          () => group.callBack?.(data, groupName),
          `group:${groupName}`,
          data,
          groupName,
          true,
          this._conf.global.debug
        );
      }

      // 4. Specific callback (per-log)
      if (typeof options?.callBack === "function") {
        await _safeCall(
          () => options.callBack?.(data, groupName),
          "specific",
          data,
          groupName,
          true,
          this._conf.global.debug
        );
      }
    } finally {
      // Always close the group if it was opened
      if (this._conf.global.debug && displayName) {
        console.groupEnd();
      }
    }
  }

  /**
   * Renders a console group with appropriate styling for the current environment.
   * @param text - The label text to display.
   * @param background - Background color (hex, rgb, etc.).
   * @param color - Text color.
   */
  private _renderGroup(text: string, background?: string, color?: string): void {
    if (_isNode()) {
      // Node.js: use ANSI escape codes
      console.group(_styleNode(` ${text}`, color, background));
      return;
    }
    // Browser: use CSS styling
    console.group(`%c ${text}`, _styleBrowser(background, color));
  }

  /**
   * Type guard to check if a group name exists in the configuration.
   * @param name - The group name to check.
   * @returns True if the group is defined, false otherwise.
   */
  private _isValidGroup(name?: T): name is T {
    return !!name && typeof this._conf.groups?.[name] === "object";
  }
}