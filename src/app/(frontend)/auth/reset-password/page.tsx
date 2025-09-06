'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from '@/hooks/useTranslation'

export default function ResetPasswordPage() {
  const { t, locale, changeLocale, languageOptions } = useTranslation()
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // 从 URL 参数中获取 email（如果有的话）
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const emailParam = urlParams.get('email')
    if (emailParam) {
      setEmail(emailParam)
    }
  }, [])

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    // 验证密码
    if (newPassword !== confirmPassword) {
      setError(t('auth.passwordMismatch'))
      setLoading(false)
      return
    }

    if (newPassword.length < 8) {
      setError(t('auth.passwordTooShort'))
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data?.error || '重置失败')
      }

      // 成功重置密码
      setSuccess(t('auth.passwordResetSuccess'))
      setEmail('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '重置失败，请稍后重试')
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
        onSubmit={handleResetPassword}
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
            {t('auth.resetPassword')}
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

        <p
          style={{
            textAlign: 'center',
            marginBottom: '30px',
            fontSize: '14px',
            color: '#e0e0e0',
            lineHeight: '1.5',
          }}
        >
          {t('auth.enterEmailForReset')}
        </p>

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
            {t('auth.newPassword')}
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
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
            {t('auth.confirmNewPassword')}
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
              {showConfirmPassword ? '🙈' : '👁️'}
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
          {loading ? t('common.loading') : t('auth.resetPassword')}
        </button>

        {/* 返回登录链接 */}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <a
            href="/login"
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
            {t('common.back')} {t('auth.login')}
          </a>
        </div>
      </form>
    </div>
  )
}
