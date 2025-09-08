import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { Collections } from './collections/Collections'
import { Components } from './collections/Components'
import { Templates } from './collections/Templates'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Users } from './collections/Users'
// 认证端点
import { forgotPassword, resetPassword, testAuth, logout } from './endpoints/auth'

// 导入导出端点
import {
  exportData,
  importData,
  exportTemplate,
  getImportExportStatus,
} from './endpoints/importExport'

// 全局配置
// import { Settings } from './globals/Settings'

// 系统初始化插件
import { initSystem } from './plugins/initSystem'
import { selectedLanguages } from './utilities/languages'
import { SYSTEM_CONFIG } from './utilities/key'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  //管理员配置
  admin: {
    user: Users.slug,
    avatar: 'gravatar',
    autoLogin:
      SYSTEM_CONFIG.AUTH_LOGIN.email && SYSTEM_CONFIG.AUTH_LOGIN.password
        ? {
            email: SYSTEM_CONFIG.AUTH_LOGIN.email,
            password: SYSTEM_CONFIG.AUTH_LOGIN.password,
          }
        : false,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  //国际化配置
  i18n: {
    fallbackLanguage: SYSTEM_CONFIG.FALLBACK_LANGUAGE as 'zh' | 'en' | 'ja' | 'ko' | 'zh-TW', // 默认回退到简体中文
    translations: selectedLanguages,
    supportedLanguages: selectedLanguages,
  },
  //本地化配置
  // localization: {
  //   locales: locationLanguages,
  //   defaultLocale: SYSTEM_CONFIG.FALLBACK_LANGUAGE, // required
  //   fallback: true, // defaults to true
  // },
  collections: [Users, Templates, Pages, Components, Collections, Media],
  // globals: [Settings],
  endpoints: [
    // 认证端点
    forgotPassword,
    resetPassword,
    testAuth,
    logout,
    // 导入导出端点
    exportData,
    importData,
    exportTemplate,
    getImportExportStatus,
  ],
  cors: SYSTEM_CONFIG.CORS_CONFIG,
  editor: lexicalEditor(),
  secret: SYSTEM_CONFIG.JWT_SECRET,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: SYSTEM_CONFIG.MONGO_URI,
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    initSystem, // 添加系统初始化插件 创建初始账户
  ],
})
