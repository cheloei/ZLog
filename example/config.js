/**
 * @file Shared configuration for ZTracer examples.
 * This file is used by both Node.js and browser examples.
 */
import ZTracer from "z-tracer-kit";

/**
 * Create a ZTracer instance with global configuration.
 * - Debug mode is enabled to show styled console groups.
 * - Three groups are defined: 'api' (blue), 'db' (green), and 'test' (red).
 */
const zt = new ZTracer({
  global: {
    debug: true,
    callBack: async (data, group) => {
      // This callback runs for every log entry
      console.info(`[${group || "global"}] Log entry processed`);
    },
  },
  groups: {
    api: {
      background: "#0d6efd",
      color: "#fff",
      callBack: async (data, group) => {
        // Group-specific callback for API logs
        console.info(`API request: ${data}`);
      },
    },
    db: {
      background: "#198754",
      color: "#fff",
    },
    test: {
      background: "#dc3545",
      color: "#fff",
    },
  },
});

export default zt;