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
  experimental: {
    // Barrel-file tree shaking: lucide-react alone ships ~1,500 icon modules.
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
};

export default nextConfig;
