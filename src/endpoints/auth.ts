import { Endpoint } from 'payload'

// 忘记密码 - 直接设置默认密码为123456
export const forgotPassword: Endpoint = {
  path: '/auth/forgot-password',
  method: 'post',
  handler: async (req) => {
    try {
      if (!req.json) {
        return new Response(JSON.stringify({ error: 'Invalid request' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        })
      }

      const { email } = await req.json()
      const { user: jwtUser } = req
      if (!jwtUser)
        return new Response(JSON.stringify({ error: '未登录' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        })
      if (!email) {
        return new Response(JSON.stringify({ error: '邮箱地址不能为空' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        })
      }

      // 查找用户
      const users = await req.payload.find({
        collection: 'users',
        where: {
          email: { equals: email },
        },
        limit: 1,
        overrideAccess: true,
      })

      if (!users.docs.length) {
        return new Response(JSON.stringify({ error: '用户不存在' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        })
      }

      const user = users.docs[0]

      // 设置默认密码为123456
      // PayloadCMS 会自动处理密码加密，包括生成 salt
      await req.payload.update({
        collection: 'users',
        id: user.id,
        data: {
          password: '123456', // PayloadCMS 会自动加密
        },
        overrideAccess: true,
      })

      return new Response(
        JSON.stringify({
          message: '密码已重置为默认密码!',
          email: user.email,
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    } catch (error) {
      return new Response(
        JSON.stringify({
          error: '忘记密码处理失败',
          message: error instanceof Error ? error.message : '未知错误',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }
  },
}

// 测试认证状态 - 检查 Cookie 和 Header 中的 token
export const testAuth: Endpoint = {
  path: '/auth/test',
  method: 'get',
  handler: async (req) => {
    try {
      // 检查 Authorization 头
      const authHeader = req.headers?.get('authorization')

      // 检查 Cookie
      const cookies = req.headers?.get('cookie')

      // 检查 req.user（Payload 自动解析的结果）
      const user = req.user

      // 提取 token
      let token = null
      if (authHeader && authHeader.startsWith('JWT ')) {
        token = authHeader.substring(4)
      } else if (cookies) {
        // 从 cookies 中提取 token
        const tokenMatch = cookies.match(/payload-token=([^;]+)/)
        if (tokenMatch) {
          token = tokenMatch[1]
        }
      }

      return new Response(
        JSON.stringify({
          message: '认证测试结果',
          hasAuthHeader: !!authHeader,
          hasCookies: !!cookies,
          hasUser: !!user,
          user: user
            ? {
                id: user.id,
                email: user.email,
                identity: user.identity,
              }
            : null,
          token: token,
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    } catch (error) {
      return new Response(
        JSON.stringify({
          error: '测试失败',
          message: error instanceof Error ? error.message : '未知错误',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }
  },
}

// 登出端点
export const logout: Endpoint = {
  path: '/auth/logout',
  method: 'post',
  handler: async (req) => {
    try {
      // 清除 Payload 的 session cookie
      const response = new Response(
        JSON.stringify({
          message: '登出成功',
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      )

      // 清除 payload-token cookie
      response.headers.set(
        'Set-Cookie',
        'payload-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax',
      )

      // 清除 payload-session cookie
      response.headers.set(
        'Set-Cookie',
        'payload-session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax',
      )

      return response
    } catch (error) {
      return new Response(
        JSON.stringify({
          error: '登出失败',
          message: error instanceof Error ? error.message : '未知错误',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }
  },
}

// 重置密码 - 需要用户名和新密码
export const resetPassword: Endpoint = {
  path: '/auth/reset-password',
  method: 'post',
  handler: async (req) => {
    try {
      if (!req.json) {
        return new Response(JSON.stringify({ error: 'Invalid request' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        })
      }
      const { user: jwtUser } = req
      if (!jwtUser)
        return new Response(JSON.stringify({ error: '未登录' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        })
      const { email, newPassword } = await req.json()

      if (!email || !newPassword) {
        return new Response(JSON.stringify({ error: '邮箱和新密码不能为空' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        })
      }

      // 验证密码复杂度
      if (newPassword.length < 8) {
        return new Response(JSON.stringify({ error: '密码长度至少8位' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        })
      }

      // 查找用户
      const users = await req.payload.find({
        collection: 'users',
        where: {
          email: { equals: email },
        },
        limit: 1,
        overrideAccess: true,
      })

      if (!users.docs.length) {
        return new Response(JSON.stringify({ error: '用户不存在' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        })
      }

      const user = users.docs[0]

      // 更新用户密码
      // PayloadCMS 会自动处理密码加密，包括生成新的 salt
      await req.payload.update({
        collection: 'users',
        id: user.id,
        data: {
          password: newPassword, // PayloadCMS 会自动加密
        },
        overrideAccess: true,
      })

      return new Response(JSON.stringify({ message: '密码重置成功' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    } catch (error) {
      return new Response(
        JSON.stringify({
          error: '重置密码失败',
          message: error instanceof Error ? error.message : '未知错误',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }
  },
}
