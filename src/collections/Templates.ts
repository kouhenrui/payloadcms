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
      name: 'templateType',
      type: 'select',
      required: true,
      defaultValue: 'page',
      localized: true,
      admin: {
        description: {
          zh: '选择模板类型',
          en: 'Select Template Type',
          ja: 'テンプレートタイプを選択',
          ko: '템플릿 유형 선택',
          'zh-TW': '選擇模板類型',
        },
        position: 'sidebar',
      },
      options: [
        {
          label: { zh: '页面', en: 'Page', ja: 'ページ', ko: '페이지', 'zh-TW': '頁面' },
          value: 'page',
        },
        {
          label: {
            zh: '组件',
            en: 'Component',
            ja: 'コンポーネント',
            ko: '컴포넌트',
            'zh-TW': '組件',
          },
          value: 'component',
        },
        {
          label: {
            zh: '收藏',
            en: 'Collection',
            ja: 'コレクション',
            ko: '컬렉션',
            'zh-TW': '收藏',
          },
          value: 'collection',
        },
      ],
    },
    {
      name: 'fields',
      type: 'blocks',
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
      blocks: [
        // 文本输入块
        {
          slug: 'textInput',
          labels: {
            singular: {
              zh: '文本输入',
              en: 'Text Input',
              ja: 'テキスト入力',
              ko: '텍스트 입력',
              'zh-TW': '文本輸入',
            },
            plural: {
              zh: '文本输入',
              en: 'Text Inputs',
              ja: 'テキスト入力',
              ko: '텍스트 입력',
              'zh-TW': '文本輸入',
            },
          },
          fields: [
            {
              name: 'fieldName',
              type: 'text',
              required: true,
              admin: {
                description: '字段名称（用于数据存储）',
              },
            },
            {
              name: 'label',
              type: 'text',
              required: true,
              localized: true,
              admin: {
                description: '字段标签',
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
              name: 'required',
              type: 'checkbox',
              defaultValue: false,
            },
            {
              name: 'maxLength',
              type: 'number',
              admin: {
                description: '最大长度',
              },
            },
          ],
        },
        // 富文本块
        {
          slug: 'richText',
          labels: {
            singular: {
              zh: '富文本',
              en: 'Rich Text',
              ja: 'リッチテキスト',
              ko: '리치 텍스트',
              'zh-TW': '富文本',
            },
            plural: {
              zh: '富文本',
              en: 'Rich Texts',
              ja: 'リッチテキスト',
              ko: '리치 텍스트',
              'zh-TW': '富文本',
            },
          },
          fields: [
            {
              name: 'fieldName',
              type: 'text',
              required: true,
              admin: {
                description: '字段名称（用于数据存储）',
              },
            },
            {
              name: 'label',
              type: 'text',
              required: true,
              localized: true,
              admin: {
                description: '字段标签',
              },
            },
            {
              name: 'required',
              type: 'checkbox',
              defaultValue: false,
            },
          ],
        },
        // 数字输入块
        {
          slug: 'numberInput',
          labels: {
            singular: {
              zh: '数字输入',
              en: 'Number Input',
              ja: '数値入力',
              ko: '숫자 입력',
              'zh-TW': '數字輸入',
            },
            plural: {
              zh: '数字输入',
              en: 'Number Inputs',
              ja: '数値入力',
              ko: '숫자 입력',
              'zh-TW': '數字輸入',
            },
          },
          fields: [
            {
              name: 'fieldName',
              type: 'text',
              required: true,
              admin: {
                description: '字段名称（用于数据存储）',
              },
            },
            {
              name: 'label',
              type: 'text',
              required: true,
              localized: true,
              admin: {
                description: '字段标签',
              },
            },
            {
              name: 'required',
              type: 'checkbox',
              defaultValue: false,
            },
            {
              name: 'min',
              type: 'number',
              admin: {
                description: '最小值',
              },
            },
            {
              name: 'max',
              type: 'number',
              admin: {
                description: '最大值',
              },
            },
            {
              name: 'step',
              type: 'number',
              defaultValue: 1,
              admin: {
                description: '步长',
              },
            },
          ],
        },
        // 选择框块
        {
          slug: 'select',
          labels: {
            singular: {
              zh: '选择框',
              en: 'Select',
              ja: 'セレクト',
              ko: '선택',
              'zh-TW': '選擇框',
            },
            plural: {
              zh: '选择框',
              en: 'Selects',
              ja: 'セレクト',
              ko: '선택',
              'zh-TW': '選擇框',
            },
          },
          fields: [
            {
              name: 'fieldName',
              type: 'text',
              required: true,
              admin: {
                description: '字段名称（用于数据存储）',
              },
            },
            {
              name: 'label',
              type: 'text',
              required: true,
              localized: true,
              admin: {
                description: '字段标签',
              },
            },
            {
              name: 'required',
              type: 'checkbox',
              defaultValue: false,
            },
            {
              name: 'multiple',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: '是否多选',
              },
            },
            {
              name: 'options',
              type: 'array',
              required: true,
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
              ],
            },
          ],
        },
        // 日期选择块
        {
          slug: 'datePicker',
          labels: {
            singular: {
              zh: '日期选择',
              en: 'Date Picker',
              ja: '日付選択',
              ko: '날짜 선택',
              'zh-TW': '日期選擇',
            },
            plural: {
              zh: '日期选择',
              en: 'Date Pickers',
              ja: '日付選択',
              ko: '날짜 선택',
              'zh-TW': '日期選擇',
            },
          },
          fields: [
            {
              name: 'fieldName',
              type: 'text',
              required: true,
              admin: {
                description: '字段名称（用于数据存储）',
              },
            },
            {
              name: 'label',
              type: 'text',
              required: true,
              localized: true,
              admin: {
                description: '字段标签',
              },
            },
            {
              name: 'required',
              type: 'checkbox',
              defaultValue: false,
            },
            {
              name: 'minDate',
              type: 'date',
              admin: {
                description: '最小日期',
              },
            },
            {
              name: 'maxDate',
              type: 'date',
              admin: {
                description: '最大日期',
              },
            },
          ],
        },
        // 文件上传块
        {
          slug: 'fileUpload',
          labels: {
            singular: {
              zh: '文件上传',
              en: 'File Upload',
              ja: 'ファイルアップロード',
              ko: '파일 업로드',
              'zh-TW': '文件上傳',
            },
            plural: {
              zh: '文件上传',
              en: 'File Uploads',
              ja: 'ファイルアップロード',
              ko: '파일 업로드',
              'zh-TW': '文件上傳',
            },
          },
          fields: [
            {
              name: 'fieldName',
              type: 'text',
              required: true,
              admin: {
                description: '字段名称（用于数据存储）',
              },
            },
            {
              name: 'label',
              type: 'text',
              required: true,
              localized: true,
              admin: {
                description: '字段标签',
              },
            },
            {
              name: 'required',
              type: 'checkbox',
              defaultValue: false,
            },
            {
              name: 'multiple',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: '是否多文件',
              },
            },
            {
              name: 'accept',
              type: 'text',
              admin: {
                description: '接受的文件类型（如：.pdf,.doc,.docx）',
              },
            },
          ],
        },
        // 图片上传块
        {
          slug: 'imageUpload',
          labels: {
            singular: {
              zh: '图片上传',
              en: 'Image Upload',
              ja: '画像アップロード',
              ko: '이미지 업로드',
              'zh-TW': '圖片上傳',
            },
            plural: {
              zh: '图片上传',
              en: 'Image Uploads',
              ja: '画像アップロード',
              ko: '이미지 업로드',
              'zh-TW': '圖片上傳',
            },
          },
          fields: [
            {
              name: 'fieldName',
              type: 'text',
              required: true,
              admin: {
                description: '字段名称（用于数据存储）',
              },
            },
            {
              name: 'label',
              type: 'text',
              required: true,
              localized: true,
              admin: {
                description: '字段标签',
              },
            },
            {
              name: 'required',
              type: 'checkbox',
              defaultValue: false,
            },
            {
              name: 'multiple',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: '是否多图片',
              },
            },
          ],
        },
        // 邮箱输入块
        {
          slug: 'emailInput',
          labels: {
            singular: {
              zh: '邮箱输入',
              en: 'Email Input',
              ja: 'メール入力',
              ko: '이메일 입력',
              'zh-TW': '郵箱輸入',
            },
            plural: {
              zh: '邮箱输入',
              en: 'Email Inputs',
              ja: 'メール入力',
              ko: '이메일 입력',
              'zh-TW': '郵箱輸入',
            },
          },
          fields: [
            {
              name: 'fieldName',
              type: 'text',
              required: true,
              admin: {
                description: '字段名称（用于数据存储）',
              },
            },
            {
              name: 'label',
              type: 'text',
              required: true,
              localized: true,
              admin: {
                description: '字段标签',
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
              name: 'required',
              type: 'checkbox',
              defaultValue: false,
            },
          ],
        },
        // 电话输入块
        {
          slug: 'phoneInput',
          labels: {
            singular: {
              zh: '电话输入',
              en: 'Phone Input',
              ja: '電話入力',
              ko: '전화 입력',
              'zh-TW': '電話輸入',
            },
            plural: {
              zh: '电话输入',
              en: 'Phone Inputs',
              ja: '電話入力',
              ko: '전화 입력',
              'zh-TW': '電話輸入',
            },
          },
          fields: [
            {
              name: 'fieldName',
              type: 'text',
              required: true,
              admin: {
                description: '字段名称（用于数据存储）',
              },
            },
            {
              name: 'label',
              type: 'text',
              required: true,
              localized: true,
              admin: {
                description: '字段标签',
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
              name: 'required',
              type: 'checkbox',
              defaultValue: false,
            },
          ],
        },
        // 复选框块
        {
          slug: 'checkbox',
          labels: {
            singular: {
              zh: '复选框',
              en: 'Checkbox',
              ja: 'チェックボックス',
              ko: '체크박스',
              'zh-TW': '複選框',
            },
            plural: {
              zh: '复选框',
              en: 'Checkboxes',
              ja: 'チェックボックス',
              ko: '체크박스',
              'zh-TW': '複選框',
            },
          },
          fields: [
            {
              name: 'fieldName',
              type: 'text',
              required: true,
              admin: {
                description: '字段名称（用于数据存储）',
              },
            },
            {
              name: 'label',
              type: 'text',
              required: true,
              localized: true,
              admin: {
                description: '字段标签',
              },
            },
            {
              name: 'required',
              type: 'checkbox',
              defaultValue: false,
            },
            {
              name: 'defaultChecked',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: '默认选中',
              },
            },
          ],
        },
        // 单选按钮块
        {
          slug: 'radioGroup',
          labels: {
            singular: {
              zh: '单选按钮',
              en: 'Radio Group',
              ja: 'ラジオボタン',
              ko: '라디오 버튼',
              'zh-TW': '單選按鈕',
            },
            plural: {
              zh: '单选按钮',
              en: 'Radio Groups',
              ja: 'ラジオボタン',
              ko: '라디오 버튼',
              'zh-TW': '單選按鈕',
            },
          },
          fields: [
            {
              name: 'fieldName',
              type: 'text',
              required: true,
              admin: {
                description: '字段名称（用于数据存储）',
              },
            },
            {
              name: 'label',
              type: 'text',
              required: true,
              localized: true,
              admin: {
                description: '字段标签',
              },
            },
            {
              name: 'required',
              type: 'checkbox',
              defaultValue: false,
            },
            {
              name: 'options',
              type: 'array',
              required: true,
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
          ],
        },
        // 文本域块
        {
          slug: 'textarea',
          labels: {
            singular: {
              zh: '文本域',
              en: 'Textarea',
              ja: 'テキストエリア',
              ko: '텍스트 영역',
              'zh-TW': '文本域',
            },
            plural: {
              zh: '文本域',
              en: 'Textareas',
              ja: 'テキストエリア',
              ko: '텍스트 영역',
              'zh-TW': '文本域',
            },
          },
          fields: [
            {
              name: 'fieldName',
              type: 'text',
              required: true,
              admin: {
                description: '字段名称（用于数据存储）',
              },
            },
            {
              name: 'label',
              type: 'text',
              required: true,
              localized: true,
              admin: {
                description: '字段标签',
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
              name: 'required',
              type: 'checkbox',
              defaultValue: false,
            },
            {
              name: 'rows',
              type: 'number',
              defaultValue: 4,
              admin: {
                description: '行数',
              },
            },
            {
              name: 'maxLength',
              type: 'number',
              admin: {
                description: '最大长度',
              },
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
