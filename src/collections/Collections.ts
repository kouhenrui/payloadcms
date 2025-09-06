import { CollectionConfig } from 'payload'
import { PUBLISHED_STATUS } from '@/utilities/key'
import { isAdminOrSelf } from '@/access/userAccess'
import { getBaseFields } from '@/utilities/dynamicFields'

export const Collections: CollectionConfig = {
  slug: 'collections',
  labels: {
    singular: {
      zh: '收藏',
      en: 'Collection',
      ja: 'コレクション',
      ko: '컬렉션',
      'zh-TW': '收藏',
    },
    plural: {
      zh: '收藏',
      en: 'Collections',
      ja: 'コレクション',
      ko: '컬렉션',
      'zh-TW': '收藏',
    },
  },
  versions: { drafts: true, maxPerDoc: 50 },
  admin: {
    useAsTitle: 'slug',
    defaultColumns: ['slug', 'template', 'language', 'status', 'updatedAt'],
    group: {
      zh: '收藏管理',
      en: 'Collection Management',
      ja: 'コレクション管理',
      ko: '컬렉션 관리',
      'zh-TW': '收藏管理',
    },
    description: {
      zh: '使用收藏模板创建收藏内容，支持多语言',
      en: 'Create collection content using collection templates, supporting multiple languages',
      ja: 'コレクションテンプレートを使用してコレクションコンテンツを作成し、複数の言語をサポート',
      ko: '컬렉션 템플릿을 사용하여 컬렉션 콘텐츠를 생성하고 여러 언어를 지원',
      'zh-TW': '使用收藏模板創建收藏內容，支持多語言',
    },
  },
  access: {
    read: isAdminOrSelf,
    create: isAdminOrSelf,
    update: isAdminOrSelf,
    delete: isAdminOrSelf,
  },
  fields: [
    // 模板字段内容
    {
      name: 'templateFields',
      type: 'blocks',
      admin: {
        description: {
          zh: '根据模板定义的字段添加内容',
          en: 'Add content based on the template defined fields',
          ja: 'テンプレート定義のフィールドに基づいて内容を追加',
          ko: '템플릿 정의된 필드에 기반한 콘텐츠 추가',
          'zh-TW': '根據模板定義的字段添加內容',
        },
        condition: (data) => data.template,
      },
      blocks: [
        // 动态字段 - 根据模板定义显示
        {
          slug: 'dynamicField',
          labels: { singular: 'Field', plural: 'Fields' },
          fields: [
            {
              name: 'fieldType',
              type: 'select',
              required: true,
              options: [
                { label: '问题', value: 'question' },
                { label: '答案', value: 'answer' },
              ],
              defaultValue: 'question',
            },
            // 问题字段配置
            {
              name: 'questionText',
              type: 'text',
              required: true,
              localized: true,
              admin: {
                condition: (data) => data.fieldType === 'question',
                description: '问题文本',
              },
            },
            {
              name: 'questionImage',
              type: 'upload',
              relationTo: 'media',
              required: false,
              admin: {
                condition: (data) => data.fieldType === 'question',
                description: '问题图片（可选）',
              },
            },
            // 答案字段配置
            {
              name: 'answerType',
              type: 'select',
              required: true,
              options: [
                { label: '文本', value: 'text' },
                { label: '富文本', value: 'richText' },
                { label: '链接', value: 'link' },
                { label: '图片', value: 'image' },
                { label: '视频', value: 'video' },
              ],
              defaultValue: 'text',
              admin: {
                condition: (data) => data.fieldType === 'answer',
                description: '答案类型',
              },
            },
            {
              name: 'answerText',
              type: 'text',
              required: true,
              localized: true,
              admin: {
                condition: (data) => data.fieldType === 'answer' && data.answerType === 'text',
                description: '答案文本',
              },
            },
            {
              name: 'answerRichText',
              type: 'richText',
              required: true,
              localized: true,
              admin: {
                condition: (data) => data.fieldType === 'answer' && data.answerType === 'richText',
                description: '答案富文本',
              },
            },
            {
              name: 'answerUrl',
              type: 'text',
              required: true,
              admin: {
                condition: (data) => data.fieldType === 'answer' && data.answerType === 'link',
                description: '链接地址',
              },
            },
            {
              name: 'answerLinkText',
              type: 'text',
              localized: true,
              admin: {
                condition: (data) => data.fieldType === 'answer' && data.answerType === 'link',
                description: '链接文本',
              },
            },
            {
              name: 'answerMedia',
              type: 'upload',
              relationTo: 'media',
              required: true,
              admin: {
                condition: (data) =>
                  data.fieldType === 'answer' &&
                  (data.answerType === 'image' || data.answerType === 'video'),
                description: '媒体文件',
              },
            },
          ],
        },
      ],
    },
    // 基础字段 - 使用 getBaseFields 函数
    ...getBaseFields(),
  ],
  timestamps: true,
  hooks: {
    beforeChange: [
      ({ data, req }) => {
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
