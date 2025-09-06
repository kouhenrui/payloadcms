import { Field } from 'payload'
import { DRAFT_STATUS, PUBLISHED_STATUS, ARCHIVED_STATUS } from './key'
import { createLanguageField } from './languages'

// 根据模板字段配置生成动态字段
// export const generateDynamicFields = (templateFields: any[] = []): Field[] => {
//   if (!templateFields || templateFields.length === 0) {
//     return []
//   }

//   return templateFields.map((fieldConfig) => {
//     const baseField: Field = {
//       name: fieldConfig.fieldName,
//       type: getFieldType(fieldConfig.fieldType),
//       required: fieldConfig.fieldConfig?.required || false,
//       localized: shouldBeLocalized(fieldConfig.fieldType),
//       admin: {
//         description: fieldConfig.fieldConfig?.description || fieldConfig.fieldLabel,
//         condition: (data) => data.template, // 只有当选择了模板时才显示
//       },
//     }

//     // 根据字段类型添加特定配置
//     return addFieldSpecificConfig(baseField, fieldConfig)
//   })
// }

// // 将模板字段类型映射到 Payload 字段类型
// const getFieldType = (templateFieldType: string): Field['type'] => {
//   const typeMap: Record<string, Field['type']> = {
//     text: 'text',
//     textarea: 'textarea',
//     richText: 'richText',
//     number: 'number',
//     email: 'email',
//     tel: 'text', // Payload 没有 tel 类型，使用 text
//     password: 'text', // Payload 没有 password 类型，使用 text
//     select: 'select',
//     radio: 'radio',
//     checkbox: 'checkbox',
//     checkboxGroup: 'checkbox',
//     date: 'date',
//     time: 'text', // Payload 没有 time 类型，使用 text
//     datetime: 'date',
//     file: 'upload',
//     image: 'upload',
//     color: 'text', // Payload 没有 color 类型，使用 text
//     range: 'number',
//     rating: 'number',
//     hidden: 'text',
//     question: 'text',
//     answer: 'text',
//     divider: 'text', // 使用 text 类型显示分隔符
//     heading: 'text', // 使用 text 类型显示标题
//     description: 'textarea',
//     contactForm: 'textarea',
//     stats: 'number',
//     table: 'textarea',
//     list: 'textarea',
//     quote: 'textarea',
//     button: 'text',
//     code: 'textarea',
//     video: 'text',
//     embed: 'textarea',
//     gallery: 'array',
//   }

//   return typeMap[templateFieldType] || 'text'
// }

// // 判断字段是否应该本地化
// const shouldBeLocalized = (fieldType: string): boolean => {
//   const localizedTypes = [
//     'text',
//     'textarea',
//     'richText',
//     'question',
//     'answer',
//     'heading',
//     'description',
//     'quote',
//     'button',
//   ]
//   return localizedTypes.includes(fieldType)
// }

// // 为字段添加特定配置
// const addFieldSpecificConfig = (field: Field, fieldConfig: any): Field => {
//   const config = fieldConfig.fieldConfig
//   const advancedConfig = config?.advancedConfig

//   // 添加默认值
//   if (config?.defaultValue) {
//     field.defaultValue = config.defaultValue
//   }

//   // 添加占位符
//   if (config?.placeholder) {
//     field.admin = {
//       ...field.admin,
//       placeholder: config.placeholder,
//     }
//   }

//   // 根据字段类型添加特定配置
//   switch (fieldConfig.fieldType) {
//     case 'text':
//     case 'textarea':
//     case 'password':
//       if (advancedConfig?.maxLength) {
//         field.maxLength = advancedConfig.maxLength
//       }
//       if (advancedConfig?.minLength) {
//         field.minLength = advancedConfig.minLength
//       }
//       if (fieldConfig.fieldType === 'textarea' && advancedConfig?.rows) {
//         field.admin = {
//           ...field.admin,
//           rows: advancedConfig.rows,
//         }
//       }
//       break

//     case 'number':
//     case 'range':
//       if (advancedConfig?.min !== undefined) {
//         field.min = advancedConfig.min
//       }
//       if (advancedConfig?.max !== undefined) {
//         field.max = advancedConfig.max
//       }
//       if (advancedConfig?.step !== undefined) {
//         field.admin = {
//           ...field.admin,
//           step: advancedConfig.step,
//         }
//       }
//       break

//     case 'select':
//     case 'radio':
//     case 'checkboxGroup':
//       if (advancedConfig?.options) {
//         field.options = advancedConfig.options.map((option: any) => ({
//           label: option.label,
//           value: option.value,
//         }))
//       }
//       if (fieldConfig.fieldType === 'select' && advancedConfig?.multiple) {
//         field.hasMany = true
//       }
//       break

//     case 'file':
//     case 'image':
//       field.relationTo = 'media'
//       if (advancedConfig?.accept) {
//         field.admin = {
//           ...field.admin,
//           accept: advancedConfig.accept,
//         }
//       }
//       if (advancedConfig?.fileMultiple) {
//         field.hasMany = true
//       }
//       break

//     case 'date':
//     case 'datetime':
//       if (advancedConfig?.minDate) {
//         field.admin = {
//           ...field.admin,
//           minDate: advancedConfig.minDate,
//         }
//       }
//       if (advancedConfig?.maxDate) {
//         field.admin = {
//           ...field.admin,
//           maxDate: advancedConfig.maxDate,
//         }
//       }
//       break

//     case 'answer':
//       // 答案字段需要根据答案类型显示不同的子字段
//       if (advancedConfig?.answerType) {
//         field.admin = {
//           ...field.admin,
//           condition: (data) =>
//             data.template && data[fieldConfig.fieldName]?.answerType === advancedConfig.answerType,
//         }
//       }
//       break

//     case 'gallery':
//       field.fields = [
//         {
//           name: 'image',
//           type: 'upload',
//           relationTo: 'media',
//           required: true,
//         },
//         {
//           name: 'caption',
//           type: 'text',
//           localized: true,
//         },
//       ]
//       break

//     case 'table':
//       field.fields = [
//         {
//           name: 'headers',
//           type: 'array',
//           fields: [
//             {
//               name: 'header',
//               type: 'text',
//               required: true,
//               localized: true,
//             },
//           ],
//         },
//         {
//           name: 'rows',
//           type: 'array',
//           fields: [
//             {
//               name: 'cells',
//               type: 'array',
//               fields: [
//                 {
//                   name: 'cell',
//                   type: 'text',
//                   localized: true,
//                 },
//               ],
//             },
//           ],
//         },
//       ]
//       break

//     case 'list':
//       field.fields = [
//         {
//           name: 'items',
//           type: 'array',
//           fields: [
//             {
//               name: 'item',
//               type: 'text',
//               required: true,
//               localized: true,
//             },
//           ],
//         },
//       ]
//       break

//     case 'stats':
//       field.fields = [
//         {
//           name: 'statItems',
//           type: 'array',
//           fields: [
//             {
//               name: 'label',
//               type: 'text',
//               required: true,
//               localized: true,
//             },
//             {
//               name: 'value',
//               type: 'number',
//               required: true,
//             },
//             {
//               name: 'unit',
//               type: 'text',
//               localized: true,
//             },
//           ],
//         },
//       ]
//       break
//   }

//   return field
// }

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
  {
    name: 'versionNote',
    type: 'text',
    required: false,
    admin: {
      position: 'sidebar',
      description: {
        zh: '版本更新备注',
        en: 'Version Update Note',
        ja: 'バージョン更新注記',
        ko: '버전 업데이트 노트',
        'zh-TW': '版本更新備註',
      },
    },
  },
  // {
  //   name: 'cover',
  //   type: 'upload',
  //   relationTo: 'media',
  //   required: false,
  //   defaultValue: 1,
  //   admin: {
  //     position: 'sidebar',
  //     description: {
  //       zh: '封面图片',
  //       en: 'Cover Image',
  //       ja: 'カバー画像',
  //       ko: '커버 이미지',
  //       'zh-TW': '封面圖片',
  //     },
  //   },
  // },
]
