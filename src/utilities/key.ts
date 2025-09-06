// 操作
export type Action = 'read' | 'create' | 'update' | 'delete'

// 身份
export type Identity = 'admin' | 'vip' | 'user'

// 状态
export type Status = 'draft' | 'published' | 'archived'

// 权限
export type Permission = {
  collection: string
  actions: Action[]
}
export interface Role {
  id: string
  name: string
  status: boolean
  permissions: Permission[]
}
// 常量定义
export const SUPER_ADMIN_IDENTITY = 'super'
export const ADMIN_IDENTITY: Identity = 'admin'
export const VIP_IDENTITY: Identity = 'vip'
export const USER_IDENTITY: Identity = 'user'
export const ADMIN_VIP_IDENTITIES: Identity[] = [ADMIN_IDENTITY, VIP_IDENTITY]

// 内容状态
export const DRAFT_STATUS: Status = 'draft' //草稿
export const PUBLISHED_STATUS: Status = 'published' //上架
export const ARCHIVED_STATUS: Status = 'archived' //归档

// 系统配置
export const SYSTEM_CONFIG = {
  // 系统配置
  SYSTEM_NAME: process.env.SYSTEM_NAME || 'SaaS Payload',
  SYSTEM_VERSION: process.env.SYSTEM_VERSION || '1.0.0',
  MONGO_URI:
    process.env.DATABASE_URI || 'mongodb://root:123456@127.0.0.1:27017/payload?authSource=admin',
  FALLBACK_LANGUAGE: process.env.FALLBACK_LANGUAGE || 'zh',
  // 文件上传配置
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'],
  MAX_VERSIONS_PER_DOC: 50,
  JWT_SECRET: process.env.JWT_SECRET || 'changeme@123',
  USER_COLLECTION: process.env.USER_COLLECTION || 'users',
  SUPER_USER_PASSWORD: process.env.SUPER_USER_PASSWORD || 'changeme123',
  SUPER_USER_EMAIL: process.env.SUPER_USER_EMAIL || 'admin@admin.com',
  // 跨域配置
  CORS_CONFIG: {
    headers: process.env.CORS_HEADERS
      ? process.env.CORS_HEADERS.split(',').map((h) => h.trim())
      : [],
    origins:
      process.env.CORS_ORIGINS === '*'
        ? '*'
        : (process.env.CORS_ORIGINS || '')
            .split(',')
            .map((o) => o.trim())
            .filter(Boolean),
  },
  //自动登录帐密
  AUTH_LOGIN: {
    email: 'admin@admin.com',
    password: '123456',
  },
} as const
