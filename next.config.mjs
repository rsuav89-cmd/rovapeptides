/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Local product renders are served through the Next image pipeline so each
    // breakpoint gets an AVIF/WebP variant instead of the full-size JPEG.
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 480, 640, 828, 1080, 1280, 1600],
    imageSizes: [96, 160, 240, 320, 420],
  },
  async redirects() {
    return [
      { source: "/coa-lookup", destination: "/coas", permanent: true },
      { source: "/coa-lookup/:batch", destination: "/coas/:batch", permanent: true },
      { source: "/collections", destination: "/shop", permanent: true },
      { source: "/collections/:slug", destination: "/shop/collections/:slug", permanent: true },
      { source: "/product/:slug", destination: "/shop/:slug", permanent: true },
    ];
  },
  experimental: {
    // Barrel-file tree shaking: lucide-react alone ships ~1,500 icon modules.
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
};

export default nextConfig;
