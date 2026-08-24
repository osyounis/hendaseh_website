import { defineCloudflareConfig } from '@opennextjs/cloudflare';
import staticAssetsIncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache';

// The site is fully static: every route is prerendered at build time and there
// is no ISR, no revalidation, no server actions and no API routes. Without an
// incremental cache the Worker cannot read the prerendered payloads for the
// `/projects/[slug]` SSG route, and because that route sets
// `dynamicParams = false` the misses turn into 404s for `/projects/brent-cuda`
// and `/projects/collision-avoidance-radar`.
//
// `staticAssetsIncrementalCache` serves those payloads straight out of the
// Workers static-assets binding (read-only, no KV/R2, no extra cost) — the
// adapter's documented option for apps that only serve prerendered data.
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
});
