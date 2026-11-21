/** @type {import('next').NextConfig} */

// Статическая сборка для GitHub Pages включается переменной окружения
// NEXT_OUTPUT=export (сценарий build:static), обычная сборка не меняется.
const isStaticExport = process.env.NEXT_OUTPUT === "export";

// Префикс адреса сайта (например /orientir) задаётся переменной BASE_PATH.
const basePath = process.env.BASE_PATH || "";

const serverHeaders = {
  async headers() {
    return [
      {
        // Apply to all pages in the app
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            // Allow any site to embed this page in an <iframe>
            value: "frame-ancestors *;",
          },
          // NOTE: X-Frame-Options is legacy and does not support a wildcard;
          // if your platform injects X-Frame-Options: SAMEORIGIN you may need
          // to remove/override it via platform settings.
        ],
      },
    ];
  },
};

const nextConfig = {
  ...(basePath ? { basePath } : {}),
  // Для статических файлов заголовки сервера недоступны, экспорт их не
  // поддерживает — оставляем их только обычной сборке.
  ...(isStaticExport
    ? { output: "export", trailingSlash: true }
    : serverHeaders),
  images: {
    remotePatterns: [],
    ...(isStaticExport ? { unoptimized: true } : {}),
  },
};

export default nextConfig;
