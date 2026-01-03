
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Permite que o Next.js gere ficheiros HTML estáticos (ideal para sites sem backend complexo)
  output: 'export',
  // Desativa a necessidade de uma imagem de carregamento de servidor
  images: {
    unoptimized: true,
  },
  env: {
    API_KEY: process.env.API_KEY,
  },
  trailingSlash: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
};

export default nextConfig;
