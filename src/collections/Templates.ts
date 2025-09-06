import type { CollectionConfig } from 'payload'
import { PUBLISHED_STATUS } from '@/utilities/key'
import { isAdminOrSelf } from '@/access/userAccess'
import { getBaseFields } from '@/utilities/dynamicFields'

export const Templates: CollectionConfig = {
  slug: 'templates',
  labels: {
    singular: {
      zh: '模板',
      en: 'Template',
      ja: 'テンプレート',
      ko: '템플릿',
      'zh-TW': '模板',
    },
    plural: {
      zh: '模板',
      en: 'Templates',
      ja: 'テンプレート',
      ko: '템플릿',
      'zh-TW': '模板',
    },
  },
  versions: { drafts: true, maxPerDoc: 50 },
  admin: {
    useAsTitle: 'slug',
    defaultColumns: ['slug', 'templateType', 'status', 'updatedAt', 'author'],
    group: {
      zh: '模板管理',
      en: 'Template Management',
      ja: 'テンプレート管理',
      ko: '템플릿 관리',
      'zh-TW': '模板管理',
    },
    description: {
      zh: '创建和管理模板，支持页面、组件、收藏三种类型',
      en: 'Create and manage templates, supporting page, component, and collection types',
      ja: 'ページ、コンポーネント、コレクションの3種類のテンプレートを作成・管理',
      ko: '페이지, 컴포넌트, 컬렉션 세 가지 유형을 지원하는 템플릿 생성 및 관리',
      'zh-TW': '創建和管理模板，支持頁面、組件、收藏三種類型',
    },
  },
  access: {
    read: () => true,
    update: isAdminOrSelf,
    delete: isAdminOrSelf,
    create: isAdminOrSelf,
  },
  fields: [
    // 基础字段 - 使用 getBaseFields 函数
    ...getBaseFields(),
    {
      name: 'fields',
      type: 'array',
      required: true,
      admin: {
        description: {
          zh: '选择模板字段类型，构建模板结构',
          en: 'Select Template Field Type, Build Template Structure',
          ja: 'テンプレートフィールドタイプを選択し、テンプレート構造を構築',
          ko: '템플릿 필드 유형을 선택하여 템플릿 구조를 구축',
          'zh-TW': '選擇模板字段類型，構建模板結構',
        },
      },
      fields: [
        {
          name: 'fieldType',
          type: 'select',
          required: true,
          options: [
            // 基础字段类型
            {
              label: {
                zh: '文本字段',
                en: 'Text Field',
                ja: 'テキストフィールド',
                ko: '텍스트 필드',
                'zh-TW': '文本字段',
              },
              value: 'text',
            },
            { label: '文本域', value: 'textarea' },
            { label: '富文本', value: 'richText' },
            { label: '数字字段', value: 'number' },
            { label: '邮箱字段', value: 'email' },
            { label: '电话字段', value: 'tel' },
            { label: '密码字段', value: 'password' },
            { label: '选择字段', value: 'select' },
            { label: '单选按钮', value: 'radio' },
            { label: '复选框', value: 'checkbox' },
            { label: '复选框组', value: 'checkboxGroup' },
            { label: '日期字段', value: 'date' },
            { label: '时间字段', value: 'time' },
            { label: '日期时间', value: 'datetime' },
            { label: '文件上传', value: 'file' },
            { label: '图片上传', value: 'image' },
            { label: '颜色选择', value: 'color' },
            { label: '范围滑块', value: 'range' },
            { label: '评分字段', value: 'rating' },
            { label: '隐藏字段', value: 'hidden' },
            // 问答字段类型
            { label: '问题字段', value: 'question' },
            { label: '答案字段', value: 'answer' },
            // 布局字段类型
            { label: '分隔符', value: 'divider' },
            { label: '标题', value: 'heading' },
            { label: '说明文本', value: 'description' },
            // 特殊字段类型
            { label: '联系表单', value: 'contactForm' },
            { label: '统计数字', value: 'stats' },
            { label: '表格', value: 'table' },
            { label: '列表', value: 'list' },
            { label: '引用', value: 'quote' },
            { label: '按钮', value: 'button' },
            { label: '代码块', value: 'code' },
            { label: '视频', value: 'video' },
            { label: '嵌入内容', value: 'embed' },
            { label: '图片画廊', value: 'gallery' },
          ],
          admin: {
            description: '选择字段类型',
          },
        },
        {
          name: 'fieldName',
          type: 'text',
          required: true,
          admin: {
            description: '字段名称（用于数据存储）',
          },
        },
        {
          name: 'fieldLabel',
          type: 'text',
          required: true,
          localized: true,
          admin: {
            description: '字段标签（显示给用户）',
          },
        },
        // 所有其他配置都放在折叠的组中
        {
          name: 'fieldConfig',
          type: 'group',
          required: false,
          admin: {
            description: '字段配置（点击展开）',
          },
          fields: [
            {
              name: 'required',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: '是否必填',
              },
            },
            {
              name: 'defaultValue',
              type: 'text',
              admin: {
                description: '默认值',
              },
            },
            {
              name: 'placeholder',
              type: 'text',
              localized: true,
              admin: {
                description: '占位符文本',
              },
            },
            {
              name: 'description',
              type: 'text',
              localized: true,
              admin: {
                description: '字段说明',
              },
            },
            // 字段特定配置
            {
              name: 'advancedConfig',
              type: 'group',
              required: false,
              admin: {
                description: '高级配置（可选）',
              },
              fields: [
                // 文本字段配置
                {
                  name: 'maxLength',
                  type: 'number',
                  required: false,
                  admin: {
                    condition: (data) =>
                      data.fieldType === 'text' ||
                      data.fieldType === 'textarea' ||
                      data.fieldType === 'password',
                    description: '最大长度（可选）',
                  },
                },
                {
                  name: 'minLength',
                  type: 'number',
                  required: false,
                  admin: {
                    condition: (data) =>
                      data.fieldType === 'text' ||
                      data.fieldType === 'textarea' ||
                      data.fieldType === 'password',
                    description: '最小长度（可选）',
                  },
                },
                {
                  name: 'rows',
                  type: 'number',
                  required: false,
                  defaultValue: 4,
                  admin: {
                    condition: (data) => data.fieldType === 'textarea',
                    description: '文本域行数（可选）',
                  },
                },
                // 数字字段配置
                {
                  name: 'min',
                  type: 'number',
                  required: false,
                  admin: {
                    condition: (data) => data.fieldType === 'number' || data.fieldType === 'range',
                    description: '最小值（可选）',
                  },
                },
                {
                  name: 'max',
                  type: 'number',
                  required: false,
                  admin: {
                    condition: (data) => data.fieldType === 'number' || data.fieldType === 'range',
                    description: '最大值（可选）',
                  },
                },
                {
                  name: 'step',
                  type: 'number',
                  required: false,
                  defaultValue: 1,
                  admin: {
                    condition: (data) => data.fieldType === 'number' || data.fieldType === 'range',
                    description: '步长（可选）',
                  },
                },
                // 选择字段配置
                {
                  name: 'options',
                  type: 'array',
                  required: false,
                  admin: {
                    condition: (data) =>
                      data.fieldType === 'select' ||
                      data.fieldType === 'radio' ||
                      data.fieldType === 'checkboxGroup',
                    description: '选项列表（可选）',
                  },
                  fields: [
                    {
                      name: 'label',
                      type: 'text',
                      required: true,
                      localized: true,
                    },
                    {
                      name: 'value',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'defaultSelected',
                      type: 'checkbox',
                      defaultValue: false,
                    },
                  ],
                },
                {
                  name: 'multiple',
                  type: 'checkbox',
                  required: false,
                  defaultValue: false,
                  admin: {
                    condition: (data) => data.fieldType === 'select',
                    description: '是否多选（可选）',
                  },
                },
                // 文件上传配置
                {
                  name: 'accept',
                  type: 'text',
                  required: false,
                  admin: {
                    condition: (data) => data.fieldType === 'file' || data.fieldType === 'image',
                    description: '接受的文件类型（可选）',
                  },
                },
                {
                  name: 'fileMultiple',
                  type: 'checkbox',
                  required: false,
                  defaultValue: false,
                  admin: {
                    condition: (data) => data.fieldType === 'file' || data.fieldType === 'image',
                    description: '是否多文件（可选）',
                  },
                },
                {
                  name: 'maxSize',
                  type: 'number',
                  required: false,
                  admin: {
                    condition: (data) => data.fieldType === 'file' || data.fieldType === 'image',
                    description: '最大文件大小（MB，可选）',
                  },
                },
                // 日期时间配置
                {
                  name: 'minDate',
                  type: 'date',
                  required: false,
                  admin: {
                    condition: (data) => data.fieldType === 'date' || data.fieldType === 'datetime',
                    description: '最小日期（可选）',
                  },
                },
                {
                  name: 'maxDate',
                  type: 'date',
                  required: false,
                  admin: {
                    condition: (data) => data.fieldType === 'date' || data.fieldType === 'datetime',
                    description: '最大日期（可选）',
                  },
                },
                // 答案字段配置
                {
                  name: 'answerType',
                  type: 'select',
                  required: false,
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
                    description: '答案类型（可选）',
                  },
                },
                // 标题配置
                {
                  name: 'headingLevel',
                  type: 'select',
                  required: false,
                  options: [
                    { label: 'H1', value: 'h1' },
                    { label: 'H2', value: 'h2' },
                    { label: 'H3', value: 'h3' },
                    { label: 'H4', value: 'h4' },
                    { label: 'H5', value: 'h5' },
                    { label: 'H6', value: 'h6' },
                  ],
                  defaultValue: 'h2',
                  admin: {
                    condition: (data) => data.fieldType === 'heading',
                    description: '标题级别（可选）',
                  },
                },
                // 评分配置
                {
                  name: 'maxRating',
                  type: 'select',
                  required: false,
                  options: [
                    { label: '5星', value: '5' },
                    { label: '10星', value: '10' },
                    { label: '百分比', value: 'percentage' },
                  ],
                  defaultValue: '5',
                  admin: {
                    condition: (data) => data.fieldType === 'rating',
                    description: '最大评分（可选）',
                  },
                },
                // 布局配置
                {
                  name: 'layout',
                  type: 'select',
                  required: false,
                  options: [
                    { label: '垂直', value: 'vertical' },
                    { label: '水平', value: 'horizontal' },
                    { label: '网格', value: 'grid' },
                  ],
                  defaultValue: 'vertical',
                  admin: {
                    condition: (data) =>
                      data.fieldType === 'radio' ||
                      data.fieldType === 'checkboxGroup' ||
                      data.fieldType === 'stats',
                    description: '布局方式（可选）',
                  },
                },
                // 样式配置
                {
                  name: 'style',
                  type: 'select',
                  required: false,
                  options: [
                    { label: '默认', value: 'default' },
                    { label: '主要', value: 'primary' },
                    { label: '次要', value: 'secondary' },
                    { label: '成功', value: 'success' },
                    { label: '警告', value: 'warning' },
                    { label: '危险', value: 'danger' },
                  ],
                  defaultValue: 'default',
                  admin: {
                    condition: (data) =>
                      data.fieldType === 'button' || data.fieldType === 'divider',
                    description: '样式类型（可选）',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
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
