// Resolver hooks so plain `node --experimental-strip-types` can load the app's
// TypeScript modules directly: adds the extension Node's ESM resolver requires
// and understands the `@/` path alias from tsconfig.json.
import { existsSync } from "node:fs";

const ROOT = new URL("../", import.meta.url);

export async function resolve(specifier, context, next) {
  let spec = specifier;
  if (spec.startsWith("@/")) spec = new URL(spec.slice(2), ROOT).href;

  if (spec.startsWith("file:") || spec.startsWith(".") || spec.startsWith("/")) {
    const url = spec.startsWith("file:")
      ? new URL(spec)
      : new URL(spec, context.parentURL ?? ROOT);
    if (!/\.[a-z]+$/i.test(url.pathname)) {
      for (const ext of [".ts", ".tsx", "/index.ts", "/index.tsx"]) {
        const candidate = new URL(url.href + ext);
        if (existsSync(candidate)) return next(candidate.href, context);
      }
    }
    return next(url.href, context);
  }
  return next(specifier, context);
}
