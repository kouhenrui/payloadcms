import { CollectionSlug, Config, Payload, Plugin } from 'payload'
import { ADMIN_IDENTITY, SYSTEM_CONFIG } from '../utilities/key'

export const initSystem: Plugin = (config: Config) => {
  // 在配置加载完成后执行初始化
  const originalOnInit = config.onInit

  config.onInit = async (payload: Payload) => {
    try {
      // 0. 系统性检查
      await checkSystemIntegrity(payload)

      // 1. 检查并创建超级管理员账号
      await createSuperAdmin(payload)
    } catch (error) {
      console.error('❌ 系统初始化失败:', error)
    }

    // 调用原始的 onInit 函数（如果存在）
    if (originalOnInit) {
      await originalOnInit(payload)
    }
  }

  return config
}

// 创建超级管理员账号
async function createSuperAdmin(payload: Payload) {
  const {
    USER_COLLECTION: userCollection,
    SUPER_USER_EMAIL: superUserEmail,
    SUPER_USER_PASSWORD: superUserPassword,
  } = SYSTEM_CONFIG

  try {
    // 检查超级管理员是否已存在：email 或 username 任一匹配即算存在
    const existingUser = await payload.find({
      collection: userCollection as CollectionSlug,
      where: {
        or: [{ email: { equals: superUserEmail } }],
      },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })

    if (existingUser.docs.length < 1) {
      await payload.create({
        collection: userCollection as CollectionSlug,
        data: {
          email: superUserEmail,
          password: superUserPassword,
          identity: ADMIN_IDENTITY,
          isActive: true,
          language: 'en-US',
        },
        depth: 0,
        overrideAccess: true,
      })
    }
  } catch (error) {
    console.error('❌ 创建超级管理员失败:', error)
  }
}

// 检查系统完整性
async function checkSystemIntegrity(payload: Payload) {
  try {
    // 检查必要的集合是否存在
    const collectionName = SYSTEM_CONFIG.USER_COLLECTION
    await payload.find({
      collection: collectionName as CollectionSlug,
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
  } catch (e: unknown) {
    console.error('❌ 系统完整性检查失败:', e)
  }
}

// 导出检查函数供外部调用
export { checkSystemIntegrity }
