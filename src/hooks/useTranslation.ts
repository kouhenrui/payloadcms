'use client'

import { useState, useEffect, useCallback } from 'react'
import { selectedLanguages } from '@/utilities/languages'
import { frontendTranslations, getNestedTranslation } from '@/utilities/frontendTranslations'

// 翻译类型定义
export type Locale = 'zh' | 'en' | 'ja' | 'ko' | 'zh-TW'

// 翻译对象类型
export interface Translations {
  [key: string]: string | Translations
}

// 翻译文件 - 与 Payload CMS i18n 配置保持一致
const translations: Record<Locale, Translations> = {
  zh: {
    auth: {
      email: '邮箱',
      password: '密码',
      login: '登录',
      forgotPassword: '忘记密码？',
      loginSuccess: '登录成功',
      loginFailed: '登录失败',
      invalidCredentials: '邮箱或密码错误',
      emailRequired: '请输入邮箱',
      passwordRequired: '请输入密码',
    },
    common: {
      loading: '加载中...',
      submit: '提交',
      cancel: '取消',
      confirm: '确认',
      back: '返回',
      next: '下一步',
      previous: '上一步',
      save: '保存',
      edit: '编辑',
      delete: '删除',
      create: '创建',
      update: '更新',
      search: '搜索',
      filter: '筛选',
      sort: '排序',
      refresh: '刷新',
      close: '关闭',
      open: '打开',
      yes: '是',
      no: '否',
      ok: '确定',
      error: '错误',
      success: '成功',
      warning: '警告',
      info: '信息',
    },
    system: {
      title: 'Payload CMS',
      checkingAuth: '检查认证状态...',
      redirecting: '正在跳转...',
    },
  },
  en: {
    auth: {
      email: 'Email',
      password: 'Password',
      login: 'Login',
      forgotPassword: 'Forgot Password?',
      loginSuccess: 'Login successful',
      loginFailed: 'Login failed',
      invalidCredentials: 'Invalid email or password',
      emailRequired: 'Please enter your email',
      passwordRequired: 'Please enter your password',
    },
    common: {
      loading: 'Loading...',
      submit: 'Submit',
      cancel: 'Cancel',
      confirm: 'Confirm',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      save: 'Save',
      edit: 'Edit',
      delete: 'Delete',
      create: 'Create',
      update: 'Update',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
      refresh: 'Refresh',
      close: 'Close',
      open: 'Open',
      yes: 'Yes',
      no: 'No',
      ok: 'OK',
      error: 'Error',
      success: 'Success',
      warning: 'Warning',
      info: 'Info',
    },
    system: {
      title: 'Payload CMS',
      checkingAuth: 'Checking authentication...',
      redirecting: 'Redirecting...',
    },
  },
  ja: {
    auth: {
      email: 'メールアドレス',
      password: 'パスワード',
      login: 'ログイン',
      forgotPassword: 'パスワードを忘れましたか？',
      loginSuccess: 'ログイン成功',
      loginFailed: 'ログイン失敗',
      invalidCredentials: 'メールアドレスまたはパスワードが正しくありません',
      emailRequired: 'メールアドレスを入力してください',
      passwordRequired: 'パスワードを入力してください',
    },
    common: {
      loading: '読み込み中...',
      submit: '送信',
      cancel: 'キャンセル',
      confirm: '確認',
      back: '戻る',
      next: '次へ',
      previous: '前へ',
      save: '保存',
      edit: '編集',
      delete: '削除',
      create: '作成',
      update: '更新',
      search: '検索',
      filter: 'フィルター',
      sort: '並び替え',
      refresh: '更新',
      close: '閉じる',
      open: '開く',
      yes: 'はい',
      no: 'いいえ',
      ok: 'OK',
      error: 'エラー',
      success: '成功',
      warning: '警告',
      info: '情報',
    },
    system: {
      title: 'Payload CMS',
      checkingAuth: '認証を確認中...',
      redirecting: 'リダイレクト中...',
    },
  },
  ko: {
    auth: {
      email: '이메일',
      password: '비밀번호',
      login: '로그인',
      forgotPassword: '비밀번호를 잊으셨나요?',
      loginSuccess: '로그인 성공',
      loginFailed: '로그인 실패',
      invalidCredentials: '이메일 또는 비밀번호가 올바르지 않습니다',
      emailRequired: '이메일을 입력해주세요',
      passwordRequired: '비밀번호를 입력해주세요',
    },
    common: {
      loading: '로딩 중...',
      submit: '제출',
      cancel: '취소',
      confirm: '확인',
      back: '뒤로',
      next: '다음',
      previous: '이전',
      save: '저장',
      edit: '편집',
      delete: '삭제',
      create: '생성',
      update: '업데이트',
      search: '검색',
      filter: '필터',
      sort: '정렬',
      refresh: '새로고침',
      close: '닫기',
      open: '열기',
      yes: '예',
      no: '아니오',
      ok: '확인',
      error: '오류',
      success: '성공',
      warning: '경고',
      info: '정보',
    },
    system: {
      title: 'Payload CMS',
      checkingAuth: '인증 확인 중...',
      redirecting: '리디렉션 중...',
    },
  },
  'zh-TW': {
    auth: {
      email: '電子郵件',
      password: '密碼',
      login: '登入',
      forgotPassword: '忘記密碼？',
      loginSuccess: '登入成功',
      loginFailed: '登入失敗',
      invalidCredentials: '電子郵件或密碼錯誤',
      emailRequired: '請輸入電子郵件',
      passwordRequired: '請輸入密碼',
    },
    common: {
      loading: '載入中...',
      submit: '提交',
      cancel: '取消',
      confirm: '確認',
      back: '返回',
      next: '下一步',
      previous: '上一步',
      save: '儲存',
      edit: '編輯',
      delete: '刪除',
      create: '建立',
      update: '更新',
      search: '搜尋',
      filter: '篩選',
      sort: '排序',
      refresh: '重新整理',
      close: '關閉',
      open: '開啟',
      yes: '是',
      no: '否',
      ok: '確定',
      error: '錯誤',
      success: '成功',
      warning: '警告',
      info: '資訊',
    },
    system: {
      title: 'Payload CMS',
      checkingAuth: '檢查認證狀態...',
      redirecting: '正在跳轉...',
    },
  },
}

// 获取嵌套的翻译值
const getNestedValue = (obj: any, path: string): string => {
  return path.split('.').reduce((current, key) => current?.[key], obj) || path
}

// 语言选项 - 与 Payload CMS 配置保持一致
export const languageOptions = [
  { value: 'zh', label: '简体中文' },
  { value: 'en', label: 'English' },
  { value: 'ja', label: '日本語' },
  { value: 'ko', label: '한국어' },
  { value: 'zh-TW', label: '繁體中文' },
]

// 从 Payload CMS 配置中获取支持的语言
export const getSupportedLocales = (): Locale[] => {
  return Object.keys(selectedLanguages) as Locale[]
}

// 默认语言
const defaultLocale: Locale = 'zh'

// 从 localStorage 获取语言设置
const getStoredLocale = (): Locale => {
  if (typeof window === 'undefined') return defaultLocale
  const stored = localStorage.getItem('locale') as Locale
  return stored && translations[stored] ? stored : defaultLocale
}

// 保存语言设置到 localStorage
const setStoredLocale = (locale: Locale): void => {
  if (typeof window === 'undefined') return
  localStorage.setItem('locale', locale)
}

// 从浏览器语言检测
const detectBrowserLocale = (): Locale => {
  if (typeof window === 'undefined') return defaultLocale

  const browserLang = navigator.language.toLowerCase()

  // 精确匹配
  if (translations[browserLang as Locale]) {
    return browserLang as Locale
  }

  // 语言代码匹配
  const langCode = browserLang.split('-')[0]
  const matches: Record<string, Locale> = {
    zh: 'zh',
    en: 'en',
    ja: 'ja',
    ko: 'ko',
  }

  return matches[langCode] || defaultLocale
}

// useTranslation hook
export const useTranslation = () => {
  const [locale, setLocale] = useState<Locale>(defaultLocale)
  const [isInitialized, setIsInitialized] = useState(false)

  // 初始化语言设置
  useEffect(() => {
    const storedLocale = getStoredLocale()
    if (storedLocale) {
      setLocale(storedLocale)
    } else {
      const detectedLocale = detectBrowserLocale()
      setLocale(detectedLocale)
      setStoredLocale(detectedLocale)
    }
    setIsInitialized(true)
  }, [])

  // 翻译函数
  const t = useCallback(
    (key: string, fallback?: string): string => {
      const translation = getNestedValue(translations[locale], key)
      return translation !== key ? translation : fallback || key
    },
    [locale],
  )

  // 切换语言
  const changeLocale = useCallback((newLocale: Locale) => {
    setLocale(newLocale)
    setStoredLocale(newLocale)
  }, [])

  // 获取当前语言信息
  const currentLanguage = languageOptions.find((lang) => lang.value === locale)

  return {
    t,
    locale,
    changeLocale,
    currentLanguage,
    languageOptions,
    isInitialized,
  }
}
