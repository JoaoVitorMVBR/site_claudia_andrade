/** @type {import('next').NextConfig} */
const nextConfig = {
    // ← ADICIONE AQUI
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'firebasestorage.googleapis.com',
          // cobre URLs como: /v0/b/…/o/clothing/… ?alt=media&token=…
          pathname: '/v0/b/**',
        },
      ],
    },
    // ← FIM DA ALTERAÇÃO
  };
  
  export default nextConfig;