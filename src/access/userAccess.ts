import { Access, FieldAccess } from 'payload'
import { ADMIN_IDENTITY, ADMIN_VIP_IDENTITIES, Identity } from '@/utilities/key'

// =====================
// 身份鉴权 (identity)
// =====================
export const isAdminIdentity: Access = ({ req }) => {
  const user = req.user
  if (!user) return false
  return user.identity === ADMIN_IDENTITY
}

// =====================
// 管理员或者VIP
// =====================
export const isVipOrAdminIdentity: Access = ({ req }) => {
  const user = req.user
  if (!user) return false
  return ADMIN_VIP_IDENTITIES.includes(user.identity as Identity)
}

// =====================
// 自己或管理员
// =====================
export const isAdminOrSelf: Access = ({ req, id }) => {
  const user = req.user
  if (!user) return false
  if (user.identity === ADMIN_IDENTITY) return true
  return user.id === id
}

// 检查用户是否激活
export const isActiveUser: Access = ({ req }) => {
  const user = req.user
  if (!user) return false
  return user.isActive === true
}

// 字段级访问
export const isAdminFieldLevel: FieldAccess = ({ req }) => {
  const user = req.user
  if (!user) return false
  return user.identity === ADMIN_IDENTITY
}

export const isAdminOrSelfFieldLevel: FieldAccess = ({ req, id }) => {
  const user = req.user
  if (!user) return false
  if (user.identity === ADMIN_IDENTITY) return true
  return user.id === id
}
