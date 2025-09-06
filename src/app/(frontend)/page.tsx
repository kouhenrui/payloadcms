'use client'

import React, { useEffect, useState } from 'react'

// 主页面组件 - 重定向到 Payload CMS 原生登录页面
export default function HomePage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      try {
        // 检查是否有有效的认证状态
        const response = await fetch('/api/users/me', {
          credentials: 'include', // 包含cookies
        })

        if (response.ok) {
          // 有有效的用户会话，直接跳转到管理面板
          window.location.href = '/admin'
        } else {
          // 没有有效会话，跳转到自定义登录页面
          window.location.href = '/login'
        }
      } catch (error) {
        console.error('认证检查失败:', error)
        // 出错时跳转到自定义登录页面
        window.location.href = '/login'
      } finally {
        setLoading(false)
      }
    }

    // 立即执行认证检查
    checkAuthAndRedirect()
  }, [])

  // 显示加载状态
  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1a1a1a',
        color: '#ffffff',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      <div
        style={{
          fontSize: '24px',
          fontWeight: '600',
        }}
      >
        Payload CMS
      </div>
      <div
        style={{
          fontSize: '16px',
          color: '#888888',
        }}
      >
        {loading ? '检查认证状态...' : '正在跳转...'}
      </div>
    </div>
  )
}
