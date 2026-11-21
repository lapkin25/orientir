/** @type {import('next').NextConfig} */


const nextConfig = {
  output: 'export',            // вместо сервера — экспорт статики в папку out/
  basePath: '/orientir',       // префикс Pages-адреса: /lapkin25.github.io/orientir
  images: { unoptimized: true }, // оптимизация картинок требует сервера — отключаем
  trailingSlash: true,         // чтобы навигация по Pages не отдавала 404
};
export default nextConfig;
