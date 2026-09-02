<img src="https://raw.githubusercontent.com/cheloei/ZTracer/main/poster.webp" alt="ZTracer Poster" width="100%"/>

# ZTracer

> **Every log has a trail.**

**ZTracer** is a lightweight, dependency‑free logging library for JavaScript and TypeScript.

It helps you create clearer and more structured logs by organising output into configurable groups, separating logs visually, supporting a full lifecycle of callbacks, displaying structured data clearly, and providing a consistent experience across browsers and Node.js.

---

## Features

- 🎨 **Visual log grouping** with custom colours and backgrounds  
- 🏷️ **Configurable log groups** with typed names  
- 🔔 **Log lifecycle callbacks** – global, group‑level, and per‑log  
- 📦 **Structured data logging** – arrays as tables, objects as expandable trees  
- ⏱️ **Function execution timing** with unique timers  
- 🧩 **Type‑safe group names** with TypeScript generics  
- 🌐 **Browser and Node.js** support with automatic styling (CSS / ANSI)  
- 📦 **ESM and CommonJS** dual package support  
- 🚫 **Zero dependencies** – just 6.5 KB

---

## Installation

```bash
npm install z-tracer-kit
```

---

## Quick Start

### ESM

```ts
import ZTracer from "z-tracer-kit";

const logger = new ZTracer({
  global: { debug: true }
});

await logger.log("Hello, ZTracer!");
```

### CommonJS

```js
const { ZTracer } = require("z-tracer-kit");

const logger = new ZTracer({
  global: { debug: true }
});

await logger.log("Hello from CommonJS!");
```

---

## Groups

Groups visually separate different parts of your application.

```ts
import ZTracer from "z-tracer-kit";

const logger = new ZTracer({
  global: { debug: true },
  groups: {
    api: {
      background: "#0d6efd",
      color: "#ffffff"
    },
    database: {
      background: "#198754",
      color: "#ffffff"
    }
  }
});

await logger.log("Request completed", { group: "api" });
await logger.log("Data saved", { group: "database" });
```

If a group is not defined, ZTracer falls back to a default gray style so you never miss a log.

---

## Log Lifecycle Callbacks

ZTracer supports callbacks at multiple stages of the logging lifecycle:

```
Log call
    ↓
1. Console output (if debug: true)
    ↓
2. Global callback (if defined)
    ↓
3. Group callback (if the group has one)
    ↓
4. Per‑log callback (if provided in options)
```

This makes it possible to hook into every log – for telemetry, analytics, alerts, or custom formatting – without changing your application logic.

---

## Structured Data

Use `fromJson()` to display objects and arrays clearly:

```ts
await logger.fromJson({
  name: "John",
  role: "Developer",
  active: true
});
```

- **Arrays** are shown as tables (`console.table`)
- **Objects** are shown as expandable directories (`console.dir`)

---

## Timing

Measure the execution time of any synchronous or asynchronous function:

```ts
await logger.time(async () => {
  await fetchData();
}, {
  group: "api",
  suffix: "fetch-data"
});
```

Each timer gets a unique label, so multiple timers never interfere.

---

## TypeScript Support

ZTracer provides full type safety. Group names are inferred from your configuration, so you get autocomplete and compile‑time validation:

```ts
const logger = new ZTracer({
  global: { debug: true },
  groups: {
    api: {},
    db: {}
  }
});

// ✅ Valid
await logger.log("Connected", { group: "api" });

// ❌ TypeScript error – "invalid" is not in the group union
await logger.log("Connected", { group: "invalid" });
```

---

## Runtime Support

ZTracer runs in:

- Modern browsers (Chrome, Firefox, Safari, Edge, Opera)
- Node.js 18+
- ESM and CommonJS
- TypeScript
- Modern bundlers (Vite, Webpack, Rollup, esbuild)

In **browsers**, it uses CSS styling for console groups.  
In **Node.js**, it uses ANSI escape codes for terminal output.  
Detection is automatic – you don't need to configure anything.

---

## Documentation

This README covers only the essentials.  
For complete documentation, including API reference, lifecycle details, runtime behaviour, and contribution guides, please visit:

📚 **[Full Documentation](https://cheloei.github.io/ZTracer)**  
🐙 **[GitHub Repository](https://github.com/cheloei/ZTracer)**

---

## AI Assistance

Some parts of ZTracer's development were assisted by artificial intelligence tools.

AI was used as a development aid during certain stages – including brainstorming, code review, documentation, and workflow support.

All project decisions, implementation direction, testing, and final integration remain under the responsibility of the project maintainer.

---

## Contributing

Contributions, bug reports, and feature suggestions are welcome.  
Please read the [contributing guide](https://cheloei.github.io/ZTracer/development/contributing.html) before submitting a pull request.

---

## License

ZTracer is open‑source software licensed under the [MIT License](LICENSE).

---

## Author

Created and maintained by **Abolfazl Cheloei**.

---

<p align="center">
  Made with ❤️ for developers who love clean logs.
</p>
```