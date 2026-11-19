/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Включает генерацию статических файлов в папку out/
  images: {
    unoptimized: true // Отключает серверную оптимизацию изображений
  },
  // Обязательно добавьте, если сайт будет открываться по адресу username.github.io/orientir/
  basePath: '/orientir',
  assetPrefix: '/orientir/'
};

export default nextConfig;