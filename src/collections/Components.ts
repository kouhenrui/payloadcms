import { isAdminOrSelf } from '@/access/userAccess'
import { CollectionConfig } from 'payload'
import { PUBLISHED_STATUS } from '@/utilities/key'
import { getBaseFields } from '@/utilities/dynamicFields'

export const Components: CollectionConfig = {
  slug: 'components',
  labels: {
    singular: {
      zh: '组件',
      en: 'Component',
      ja: 'コンポーネント',
      ko: '컴포넌트',
      'zh-TW': '組件',
    },
    plural: {
      zh: '组件',
      en: 'Components',
      ja: 'コンポーネント',
      ko: '컴포넌트',
      'zh-TW': '組件',
    },
  },
  versions: { drafts: true, maxPerDoc: 50 },
  admin: {
    useAsTitle: 'slug',
    defaultColumns: ['slug', 'template', 'language', 'status', 'updatedAt'],
    group: {
      zh: '组件管理',
      en: 'Component Management',
      ja: 'コンポーネント管理',
      ko: '컴포넌트 관리',
      'zh-TW': '組件管理',
    },
    description: {
      zh: '使用组件模板创建实际组件，支持多语言',
      en: 'Create actual components using component templates, supporting multiple languages',
      ja: 'コンポーネントテンプレートを使用して実際のコンポーネントを作成し、複数の言語をサポート',
      ko: '컴포넌트 템플릿을 사용하여 실제 컴포넌트를 생성하고 여러 언어를 지원',
      'zh-TW': '使用組件模板創建實際組件，支持多語言',
    },
  },
  access: {
    read: () => true,
    create: isAdminOrSelf,
    update: isAdminOrSelf,
    delete: isAdminOrSelf,
  },
  fields: [
    {
      name: 'templateFields',
      type: 'blocks',
      admin: {
        description: '根据模板定义的字段添加内容',
        condition: (data) => data.template,
      },
      blocks: [
        // 通用字段块 - 支持所有模板字段类型
        {
          slug: 'templateField',
          labels: { singular: 'Template Field', plural: 'Template Fields' },
          fields: [
            {
              name: 'fieldName',
              type: 'text',
              required: true,
              admin: {
                description: '字段名称（对应模板中的字段名）',
              },
            },
            {
              name: 'fieldType',
              type: 'select',
              required: true,
              options: [
                { label: '文本', value: 'text' },
                { label: '文本域', value: 'textarea' },
                { label: '富文本', value: 'richText' },
                { label: '数字', value: 'number' },
                { label: '邮箱', value: 'email' },
                { label: '选择', value: 'select' },
                { label: '日期', value: 'date' },
                { label: '文件上传', value: 'file' },
                { label: '图片上传', value: 'image' },
                { label: '问题', value: 'question' },
                { label: '答案', value: 'answer' },
                { label: '标题', value: 'heading' },
                { label: '说明', value: 'description' },
                { label: '按钮', value: 'button' },
                { label: '引用', value: 'quote' },
                { label: '代码', value: 'code' },
                { label: '视频', value: 'video' },
                { label: '图片画廊', value: 'gallery' },
                { label: '表格', value: 'table' },
                { label: '列表', value: 'list' },
                { label: '统计', value: 'stats' },
              ],
              admin: {
                description: '字段类型',
              },
            },
            {
              name: 'fieldValue',
              type: 'text',
              localized: true,
              admin: {
                description: '字段值',
              },
            },
            {
              name: 'richTextValue',
              type: 'richText',
              localized: true,
              admin: {
                condition: (data) => data.fieldType === 'richText',
                description: '富文本内容',
              },
            },
            {
              name: 'numberValue',
              type: 'number',
              admin: {
                condition: (data) => data.fieldType === 'number',
                description: '数字值',
              },
            },
            {
              name: 'dateValue',
              type: 'date',
              admin: {
                condition: (data) => data.fieldType === 'date',
                description: '日期值',
              },
            },
            {
              name: 'selectValue',
              type: 'text',
              admin: {
                condition: (data) => data.fieldType === 'select',
                description: '选择值',
              },
            },
            {
              name: 'fileValue',
              type: 'upload',
              relationTo: 'media',
              admin: {
                condition: (data) => data.fieldType === 'file' || data.fieldType === 'image',
                description: '文件/图片',
              },
            },
            {
              name: 'galleryValue',
              type: 'array',
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
                {
                  name: 'caption',
                  type: 'text',
                  localized: true,
                },
              ],
              admin: {
                condition: (data) => data.fieldType === 'gallery',
                description: '图片画廊',
              },
            },
            {
              name: 'tableValue',
              type: 'group',
              fields: [
                {
                  name: 'headers',
                  type: 'array',
                  fields: [
                    {
                      name: 'header',
                      type: 'text',
                      required: true,
                      localized: true,
                    },
                  ],
                },
                {
                  name: 'rows',
                  type: 'array',
                  fields: [
                    {
                      name: 'cells',
                      type: 'array',
                      fields: [
                        {
                          name: 'cell',
                          type: 'text',
                          localized: true,
                        },
                      ],
                    },
                  ],
                },
              ],
              admin: {
                condition: (data) => data.fieldType === 'table',
                description: '表格数据',
              },
            },
            {
              name: 'listValue',
              type: 'array',
              fields: [
                {
                  name: 'item',
                  type: 'text',
                  required: true,
                  localized: true,
                },
              ],
              admin: {
                condition: (data) => data.fieldType === 'list',
                description: '列表项',
              },
            },
            {
              name: 'statsValue',
              type: 'array',
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                  localized: true,
                },
                {
                  name: 'value',
                  type: 'number',
                  required: true,
                },
                {
                  name: 'unit',
                  type: 'text',
                  localized: true,
                },
              ],
              admin: {
                condition: (data) => data.fieldType === 'stats',
                description: '统计数据',
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
      async ({ data, req }) => {
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

        // 自动增加版本号
        if (data.version) {
          data.version += 1
        }

        return data
      },
    ],
  },
}
