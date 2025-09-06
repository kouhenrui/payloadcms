import { CollectionConfig } from 'payload'
import { isAdminOrSelf, isAdminIdentity } from '@/access/userAccess'
import { ADMIN_IDENTITY, USER_IDENTITY, VIP_IDENTITY } from '@/utilities/key'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: {
      zh: '用户',
      en: 'User',
      ja: 'ユーザー',
      ko: '사용자',
      'zh-TW': '用戶',
    },
    plural: {
      zh: '用户',
      en: 'Users',
      ja: 'ユーザー',
      ko: '사용자',
      'zh-TW': '用戶',
    },
  },
  versions: { maxPerDoc: 50 },
  auth: {
    useAPIKey: false, // 不使用 API Key 登录
    useSessions: true, // 启用会话管理，支持原生登录页面
    verify: false,
    tokenExpiration: 7200, // 2小时
    cookies: {
      secure: false, // 开发环境设为false
      sameSite: 'Lax',
    },
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'identity', 'isActive', 'createdAt', 'updatedAt'],
    group: {
      zh: '用户与权限',
      en: 'Users & Permissions',
      ja: 'ユーザーと権限',
      ko: '사용자 및 권한',
      'zh-TW': '用戶與權限',
    },
    description: {
      zh: '管理系统用户和权限',
      en: 'Manage system users and permissions',
      ja: 'システムユーザーと権限を管理',
      ko: '시스템 사용자와 권한 관리',
      'zh-TW': '管理系統用戶和權限',
    },
  },
  access: {
    create: () => true, // 允许注册
    read: isAdminOrSelf,
    update: isAdminOrSelf,
    delete: isAdminIdentity,
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      unique: true,
      saveToJWT: true,
      admin: {
        description: {
          zh: '用户邮箱地址',
          en: 'User email address',
          ja: 'ユーザーメールアドレス',
          ko: '사용자 이메일 주소',
          'zh-TW': '用戶郵箱地址',
        },
      },
    },
    {
      name: 'password',
      type: 'text',
      required: true,
      admin: {
        description: {
          zh: '密码将自动使用 bcrypt 加密',
          en: 'Password will be automatically encrypted with bcrypt',
          ja: 'パスワードはbcryptで自動的に暗号化されます',
          ko: '비밀번호는 bcrypt로 자동 암호화됩니다',
          'zh-TW': '密碼將自動使用 bcrypt 加密',
        },
        hidden: true, // 在管理面板中隐藏密码字段
        disableListColumn: true,
        disableListFilter: true,
      },
    },
    {
      name: 'identity',
      type: 'select',
      saveToJWT: true,
      required: true,
      options: [
        {
          label: {
            zh: '管理员',
            en: 'Administrator',
            ja: '管理者',
            ko: '관리자',
            'zh-TW': '管理員',
          },
          value: ADMIN_IDENTITY,
        },
        {
          label: {
            zh: '普通用户',
            en: 'Normal User',
            ja: '一般ユーザー',
            ko: '일반 사용자',
            'zh-TW': '普通用戶',
          },
          value: USER_IDENTITY,
        },
        {
          label: {
            zh: 'VIP 用户',
            en: 'VIP User',
            ja: 'VIP ユーザー',
            ko: 'VIP 사용자',
            'zh-TW': 'VIP 用戶',
          },
          value: VIP_IDENTITY,
        },
      ],
      defaultValue: USER_IDENTITY,
      admin: {
        description: {
          zh: '用户身份类型',
          en: 'User identity type',
          ja: 'ユーザーアイデンティティタイプ',
          ko: '사용자 신원 유형',
          'zh-TW': '用戶身份類型',
        },
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: {
          zh: '用户是否激活',
          en: 'Whether the user is active',
          ja: 'ユーザーがアクティブかどうか',
          ko: '사용자가 활성화되었는지 여부',
          'zh-TW': '用戶是否激活',
        },
      },
    },
  ],
  timestamps: true, //自动生成
  hooks: {
    beforeDelete: [
      ({ req, id }) => {
        if (isAdminOrSelf({ req, id })) {
          return true
        }
        return false
      },
    ],
  },
}
