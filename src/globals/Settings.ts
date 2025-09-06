import { GlobalConfig } from 'payload'
import { isAdminOrSelf } from '@/access/userAccess'

export const Settings: GlobalConfig = {
  slug: 'settings',
  access: {
    read: () => true, // 允许前端读取
    update: isAdminOrSelf, // 只有管理员可以修改
  },
  admin: {
    group: {
      zh: '系统设置',
      en: 'System Settings',
      ja: 'システム設定',
      ko: '시스템 설정',
      'zh-TW': '系統設置',
    },
  },
  fields: [
    // 只保留核心配置
    {
      name: 'site',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          localized: true,
          defaultValue: '我的网站',
        },
        {
          name: 'description',
          type: 'textarea',
          localized: true,
        },
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
  ],
}
