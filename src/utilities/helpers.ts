import crypto from 'crypto'

// 生成随机字符串
export const generateRandomString = (length: number = 32): string => {
  return crypto.randomBytes(length).toString('hex')
}

// 生成slug
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// 验证邮箱格式
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// 验证密码强度
export const validatePassword = (password: string): { isValid: boolean; message: string } => {
  if (password.length < 8) {
    return { isValid: false, message: '密码长度至少8位' }
  }

  if (!/(?=.*[a-z])/.test(password)) {
    return { isValid: false, message: '密码必须包含小写字母' }
  }

  if (!/(?=.*[A-Z])/.test(password)) {
    return { isValid: false, message: '密码必须包含大写字母' }
  }

  if (!/(?=.*\d)/.test(password)) {
    return { isValid: false, message: '密码必须包含数字' }
  }

  return { isValid: true, message: '密码格式正确' }
}

// 格式化日期
export const formatDate = (date: Date | string): string => {
  const d = new Date(date)
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// 截取文本
export const truncateText = (text: string, length: number = 100): string => {
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

// 生成分页信息
export const generatePagination = (page: number, limit: number, total: number) => {
  const totalPages = Math.ceil(total / limit)
  const hasNextPage = page < totalPages
  const hasPrevPage = page > 1

  return {
    currentPage: page,
    totalPages,
    totalItems: total,
    itemsPerPage: limit,
    hasNextPage,
    hasPrevPage,
    nextPage: hasNextPage ? page + 1 : null,
    prevPage: hasPrevPage ? page - 1 : null,
  }
}
