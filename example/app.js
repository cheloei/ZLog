/**
 * @file ZTracer example for Node.js environment.
 * Run with: npm run node
 */
import zt from "./config.js";

(async () => {
  console.log("=== ZTracer Node.js Example ===\n");

  // 1. Simple log with group and suffix
  await zt.log("Hello from Node.js!", { group: "test", suffix: "node" });

  // 2. Log object data using fromJson (console.dir)
  await zt.fromJson({ user: "John", age: 30, email: "john@example.com" }, {
    group: "api",
    suffix: "user-data",
  });

  // 3. Log array data using fromJson (console.table)
  await zt.fromJson([
    { id: 1, name: "Alice", role: "admin" },
    { id: 2, name: "Bob", role: "user" },
    { id: 3, name: "Charlie", role: "guest" },
  ], { group: "db", suffix: "users" });

  // 4. Measure execution time of a callback
  await zt.time(async () => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    console.log("  Timer callback executed after 200ms");
  }, { group: "api", suffix: "timer-example" });

  // 5. Log with a custom per-log callback
  await zt.log("Custom callback example", {
    group: "test",
    callBack: async (data) => {
      console.log(`  Custom callback received: ${data}`);
    },
  });

  console.log("\n=== Example completed ===");
})();