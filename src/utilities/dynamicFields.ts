import { Field } from 'payload'
import { DRAFT_STATUS, PUBLISHED_STATUS, ARCHIVED_STATUS } from './key'
import { createLanguageField } from './languages'

// 获取基础字段（所有集合都需要的字段）
export const getBaseFields = (): Field[] => [
  {
    name: 'slug',
    type: 'text',
    unique: true,
    required: true,
    localized: true,
    admin: {
      position: 'sidebar',
      description: {
        zh: 'URL 友好的标识符',
        en: 'URL Friendly Identifier',
        ja: 'URL フレンドリーな識別子',
        ko: 'URL 친숙한 식별자',
        'zh-TW': 'URL 友好的識別符',
      },
    },
  },
  createLanguageField(),
  {
    name: 'status',
    type: 'select',
    required: true,
    defaultValue: DRAFT_STATUS,
    options: [
      {
        label: { zh: '草稿', en: 'Draft', ja: '草稿', ko: '草稿', 'zh-TW': '草稿' },
        value: DRAFT_STATUS,
      },
      {
        label: { zh: '已发布', en: 'Published', ja: '公開', ko: '公開', 'zh-TW': '已發布' },
        value: PUBLISHED_STATUS,
      },
      {
        label: {
          zh: '已归档',
          en: 'Archived',
          ja: 'アーカイブ',
          ko: '아카이브',
          'zh-TW': '已歸檔',
        },
        value: ARCHIVED_STATUS,
      },
    ],
    admin: {
      position: 'sidebar',
      description: {
        zh: '内容状态',
        en: 'Content Status',
        ja: 'コンテンツステータス',
        ko: '콘텐츠 상태',
        'zh-TW': '內容狀態',
      },
    },
  },
  {
    name: 'author',
    type: 'relationship',
    relationTo: 'users',
    required: true,
    defaultValue: ({ user }) => user?.id,
    admin: {
      position: 'sidebar',
      description: {
        zh: '内容作者',
        en: 'Content Author',
        ja: 'コンテンツ作者',
        ko: '콘텐츠 작성자',
        'zh-TW': '內容作者',
      },
    },
  },
  {
    name: 'publishedAt',
    type: 'date',
    required: false,
    admin: {
      position: 'sidebar',
      description: {
        zh: '发布时间',
        en: 'Published At',
        ja: '公開時間',
        ko: '公開 시간',
        'zh-TW': '發布時間',
      },
    },
  },
  {
    name: 'updatedBy',
    type: 'relationship',
    relationTo: 'users',
    required: false,
    hidden: true,
    admin: {
      position: 'sidebar',
      description: {
        zh: '最后修改者',
        en: 'Last Updated By',
        ja: '最終更新者',
        ko: '마지막 수정자',
        'zh-TW': '最後修改者',
      },
      readOnly: true,
    },
  },
]
// 获取模板类型字段配置
export const getTemplateType = (collectionType: 'collection' | 'component' | 'page'): Field => ({
  // 模板选择字段
  name: 'template',
  type: 'relationship',
  relationTo: 'templates',
  required: true,
  filterOptions: {
    status: {
      equals: 'published',
    },
    templateType: {
      equals: collectionType,
    },
  },
  admin: {
    description: {
      zh: `选择已发布的${collectionType}模板`,
      en: `Select a published ${collectionType} template`,
      ja: `公開された${collectionType}テンプレートを選択`,
      ko: `게시된 ${collectionType} 템플릿 선택`,
      'zh-TW': `選擇已發布的${collectionType}模板`,
    },
    position: 'sidebar',
  },
})
