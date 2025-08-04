/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  webpack: (config, { isServer }) => {
    // Ignorar arquivos de teste durante o build
    config.module.rules.push({
      test: /\.(test|spec)\.(js|jsx|ts|tsx)$/,
      loader: 'ignore-loader',
    });
    
    // Ignorar arquivo de setup de testes
    config.module.rules.push({
      test: /test-setup\.ts$/,
      loader: 'ignore-loader',
    });
    
    return config;
  },
};

export default nextConfig;
