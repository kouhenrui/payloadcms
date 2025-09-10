import { CollectionConfig, Field } from 'payload'
import { PUBLISHED_STATUS } from '@/utilities/key'
import { isAdminOrSelf } from '@/access/userAccess'
import { getBaseFields, getTemplateType } from '@/utilities/dynamicFields'

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: {
    singular: {
      zh: '页面',
      en: 'Page',
      ja: 'ページ',
      ko: '페이지',
      'zh-TW': '頁面',
    },
    plural: {
      zh: '页面',
      en: 'Pages',
      ja: 'ページ',
      ko: '페이지',
      'zh-TW': '頁面',
    },
  },
  versions: { drafts: true, maxPerDoc: 50 },
  admin: {
    useAsTitle: 'slug',
    defaultColumns: ['slug', 'template', 'language', 'status', 'updatedAt'],
    group: {
      zh: '内容管理',
      en: 'Content Management',
      ja: 'コンテンツ管理',
      ko: '콘텐츠 관리',
      'zh-TW': '內容管理',
    },
    description: {
      zh: '使用页面模板创建实际页面，支持多语言',
      en: 'Create actual pages using page templates, supporting multiple languages',
      ja: 'ページテンプレートを使用して実際のページを作成し、複数の言語をサポート',
      ko: '페이지 템플릿을 사용하여 실제 페이지를 생성하고 여러 언어를 지원',
      'zh-TW': '使用頁面模板創建實際頁面，支持多語言',
    },
  },
  access: {
    read: isAdminOrSelf,
    create: isAdminOrSelf,
    update: isAdminOrSelf,
    delete: isAdminOrSelf,
  },
  fields: [
    // 基础字段 - 使用 getBaseFields 函数
    ...getBaseFields(),
    getTemplateType('page'),
    // 公共动态字段
    // createDynamicField(),
  ],
  timestamps: true,
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        // 自动设置发布时间
        if (data.status === PUBLISHED_STATUS && !data.publishedAt) {
          data.publishedAt = new Date().toISOString()
        }

        // 记录修改者
        if (req.user) {
          data.updatedBy = req.user.id
        }

        // 设置作者（如果是新建且未设置作者）
        if (!data.author && req.user) {
          data.author = req.user.id
        }
        return data
      },
    ],
  },
}
