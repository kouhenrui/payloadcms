'use client'

import { useState } from 'react'
import { useTranslation } from '@/hooks/useTranslation'

export default function LoginPage() {
  const { t, locale, changeLocale, languageOptions } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false) // false = 默认隐藏密码

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // 重要: 保留 Payload 的 session cookie
      })

      const data = await res.json()

      if (!res.ok) {
        // 登录失败，显示错误信息并保持在当前页面
        throw new Error(data?.errors?.[0]?.message)
      }

      // 登录成功
      console.log(t('auth.loginSuccess'), data)

      // 清除表单数据
      setEmail('')
      setPassword('')

      // 直接跳转到管理面板
      window.location.href = '/admin'
    } catch (err: unknown) {
      // 登录失败，显示错误信息
      setError(err instanceof Error ? err.message : '登录失败')
      // 保持在当前页面，不清除表单数据，让用户可以修改后重试
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1a1a1a',
        color: '#ffffff',
      }}
    >
      <form
        onSubmit={handleLogin}
        style={{
          width: '100%',
          maxWidth: '400px',
          padding: '40px',
          borderRadius: '12px',
          backgroundColor: '#2d2d2d',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          border: '1px solid #404040',
        }}
      >
        <div style={{ position: 'relative' }}>
          <h2
            style={{
              textAlign: 'center',
              marginBottom: '20px',
              fontSize: '28px',
              fontWeight: '600',
              color: '#ffffff',
            }}
          >
            {t('system.title')}
          </h2>

          {/* 语言选择器 */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '20px',
            }}
          >
            <select
              value={locale}
              onChange={(e) => changeLocale(e.target.value as 'zh' | 'en' | 'ja' | 'ko' | 'zh-TW')}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #404040',
                backgroundColor: '#1a1a1a',
                color: '#ffffff',
                fontSize: '14px',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              {languageOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: '#dc3545',
              color: '#ffffff',
              padding: '12px',
              borderRadius: '6px',
              marginBottom: '20px',
              fontSize: '14px',
              textAlign: 'center',
            }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            style={{
              backgroundColor: '#28a745',
              color: '#ffffff',
              padding: '12px',
              borderRadius: '6px',
              marginBottom: '20px',
              fontSize: '14px',
              textAlign: 'center',
            }}
          >
            {success}
          </div>
        )}

        <div style={{ marginBottom: '20px' }}>
          <label
            style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#e0e0e0',
            }}
          >
            {t('auth.email')}
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '8px',
              border: '1px solid #404040',
              backgroundColor: '#1a1a1a',
              color: '#ffffff',
              fontSize: '16px',
              outline: 'none',
              transition: 'border-color 0.2s ease',
            }}
            onFocus={(e) => {
              ;(e.target as HTMLInputElement).style.borderColor = '#007bff'
            }}
            onBlur={(e) => {
              ;(e.target as HTMLInputElement).style.borderColor = '#404040'
            }}
          />
        </div>

        <div style={{ marginBottom: '30px' }}>
          <label
            style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#e0e0e0',
            }}
          >
            {t('auth.password')}
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                paddingRight: '50px',
                borderRadius: '8px',
                border: '1px solid #404040',
                backgroundColor: '#1a1a1a',
                color: '#ffffff',
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.2s ease',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => {
                ;(e.target as HTMLInputElement).style.borderColor = '#007bff'
              }}
              onBlur={(e) => {
                ;(e.target as HTMLInputElement).style.borderColor = '#404040'
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: '#888888',
                cursor: 'pointer',
                fontSize: '18px',
                padding: '4px',
                borderRadius: '4px',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
              }}
              onMouseEnter={(e) => {
                ;(e.target as HTMLButtonElement).style.color = '#ffffff'
                ;(e.target as HTMLButtonElement).style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
              }}
              onMouseLeave={(e) => {
                ;(e.target as HTMLButtonElement).style.color = '#888888'
                ;(e.target as HTMLButtonElement).style.backgroundColor = 'transparent'
              }}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: loading ? '#666666' : '#007bff',
            color: '#ffffff',
            fontSize: '16px',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s ease',
            opacity: loading ? 0.7 : 1,
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              ;(e.target as HTMLButtonElement).style.backgroundColor = '#0056b3'
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              ;(e.target as HTMLButtonElement).style.backgroundColor = '#007bff'
            }
          }}
        >
          {loading ? t('common.loading') : t('auth.login')}
        </button>

        {/* 忘记密码链接 */}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <a
            href="/forgot-password"
            style={{
              color: '#007bff',
              textDecoration: 'none',
              fontSize: '14px',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => {
              ;(e.target as HTMLAnchorElement).style.color = '#0056b3'
            }}
            onMouseLeave={(e) => {
              ;(e.target as HTMLAnchorElement).style.color = '#007bff'
            }}
          >
            {t('auth.forgotPassword')}
          </a>
        </div>
      </form>
    </div>
  )
}
