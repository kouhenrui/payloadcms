import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 启用 standalone 输出用于 Docker
  output: 'standalone',

  // 禁用前端路由，只保留API
  async rewrites() {
    return [
      {
        source: '/((?!api|admin).*)',
        destination: '/api/404',
      },
    ]
  },

  // 实验性功能
  experimental: {
    // 启用 App Router
    appDir: true,
  },

  // Webpack 配置
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },

  // ESLint 配置
  eslint: {
    // 在构建时忽略 ESLint 错误
    ignoreDuringBuilds: true,
  },

  // TypeScript 配置
  typescript: {
    // 在构建时忽略 TypeScript 错误
    ignoreBuildErrors: true,
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
