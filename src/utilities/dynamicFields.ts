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
    // position: 'sidebar',
  },
})

// 创建公共的动态字段
export const createDynamicField = (): Field => ({
  name: 'dynamicFields',
  type: 'blocks',
  admin: {
    description: {
      zh: '根据模板定义的字段添加内容，只能增加数量，不能增加新类型',
      en: 'Add content based on template-defined fields, can only increase quantity, not add new types',
      ja: 'テンプレートで定義されたフィールドに基づいてコンテンツを追加、数量のみ増加可能、新しいタイプは追加不可',
      ko: '템플릿에서 정의된 필드를 기반으로 콘텐츠 추가, 수량만 증가 가능, 새로운 유형 추가 불가',
      'zh-TW': '根據模板定義的字段添加內容，只能增加數量，不能增加新類型',
    },
    condition: (data) => data.template,
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
          admin: { description: '字段名称', readOnly: true },
        },
        { name: 'value', type: 'text', localized: true, admin: { description: '文本值' } },
        {
          name: 'placeholder',
          type: 'text',
          localized: true,
          admin: { description: '占位符文本', readOnly: true },
        },
        { name: 'required', type: 'checkbox', admin: { description: '是否必填', readOnly: true } },
        { name: 'maxLength', type: 'number', admin: { description: '最大长度', readOnly: true } },
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
          admin: { description: '字段名称', readOnly: true },
        },
        { name: 'value', type: 'richText', localized: true, admin: { description: '富文本内容' } },
        { name: 'required', type: 'checkbox', admin: { description: '是否必填', readOnly: true } },
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
          admin: { description: '字段名称', readOnly: true },
        },
        { name: 'value', type: 'number', admin: { description: '数字值' } },
        { name: 'required', type: 'checkbox', admin: { description: '是否必填', readOnly: true } },
        { name: 'min', type: 'number', admin: { description: '最小值', readOnly: true } },
        { name: 'max', type: 'number', admin: { description: '最大值', readOnly: true } },
        { name: 'step', type: 'number', admin: { description: '步长', readOnly: true } },
      ],
    },
    // 选择框块
    {
      slug: 'select',
      labels: {
        singular: { zh: '选择框', en: 'Select', ja: 'セレクト', ko: '선택', 'zh-TW': '選擇框' },
        plural: { zh: '选择框', en: 'Selects', ja: 'セレクト', ko: '선택', 'zh-TW': '選擇框' },
      },
      fields: [
        {
          name: 'fieldName',
          type: 'text',
          required: true,
          admin: { description: '字段名称', readOnly: true },
        },
        { name: 'value', type: 'text', admin: { description: '选择值' } },
        { name: 'required', type: 'checkbox', admin: { description: '是否必填', readOnly: true } },
        { name: 'multiple', type: 'checkbox', admin: { description: '是否多选', readOnly: true } },
        {
          name: 'options',
          type: 'array',
          fields: [{ name: 'value', type: 'text', required: true }],
          admin: { description: '选项列表', readOnly: true },
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
          admin: { description: '字段名称', readOnly: true },
        },
        { name: 'value', type: 'date', admin: { description: '日期值' } },
        {
          name: 'label',
          type: 'text',
          localized: true,
          admin: { description: '字段标签', readOnly: true },
        },
        { name: 'required', type: 'checkbox', admin: { description: '是否必填', readOnly: true } },
        { name: 'minDate', type: 'date', admin: { description: '最小日期', readOnly: true } },
        { name: 'maxDate', type: 'date', admin: { description: '最大日期', readOnly: true } },
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
          admin: { description: '字段名称', readOnly: true },
        },
        { name: 'value', type: 'upload', relationTo: 'media', admin: { description: '文件' } },
        {
          name: 'label',
          type: 'text',
          localized: true,
          admin: { description: '字段标签', readOnly: true },
        },
        { name: 'required', type: 'checkbox', admin: { description: '是否必填', readOnly: true } },
        {
          name: 'multiple',
          type: 'checkbox',
          admin: { description: '是否多文件', readOnly: true },
        },
        { name: 'accept', type: 'text', admin: { description: '接受的文件类型', readOnly: true } },
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
          admin: { description: '字段名称', readOnly: true },
        },
        { name: 'value', type: 'upload', relationTo: 'media', admin: { description: '图片' } },
        {
          name: 'label',
          type: 'text',
          localized: true,
          admin: { description: '字段标签', readOnly: true },
        },
        { name: 'required', type: 'checkbox', admin: { description: '是否必填', readOnly: true } },
        {
          name: 'multiple',
          type: 'checkbox',
          admin: { description: '是否多图片', readOnly: true },
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
          admin: { description: '字段名称', readOnly: true },
        },
        { name: 'value', type: 'email', admin: { description: '邮箱值' } },
        {
          name: 'label',
          type: 'text',
          localized: true,
          admin: { description: '字段标签', readOnly: true },
        },
        {
          name: 'placeholder',
          type: 'text',
          localized: true,
          admin: { description: '占位符文本', readOnly: true },
        },
        { name: 'required', type: 'checkbox', admin: { description: '是否必填', readOnly: true } },
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
          admin: { description: '字段名称', readOnly: true },
        },
        { name: 'value', type: 'text', admin: { description: '电话值' } },
        {
          name: 'label',
          type: 'text',
          localized: true,
          admin: { description: '字段标签', readOnly: true },
        },
        {
          name: 'placeholder',
          type: 'text',
          localized: true,
          admin: { description: '占位符文本', readOnly: true },
        },
        { name: 'required', type: 'checkbox', admin: { description: '是否必填', readOnly: true } },
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
          admin: { description: '字段名称', readOnly: true },
        },
        { name: 'value', type: 'checkbox', admin: { description: '复选框值' } },
        { name: 'required', type: 'checkbox', admin: { description: '是否必填', readOnly: true } },
        {
          name: 'defaultChecked',
          type: 'checkbox',
          admin: { description: '默认选中', readOnly: true },
        },
        {
          name: 'options',
          type: 'array',
          fields: [
            { name: 'value', type: 'text', required: true },
            { name: 'defaultSelected', type: 'checkbox' },
          ],
          admin: { description: '选项列表', readOnly: true },
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
          admin: { description: '字段名称', readOnly: true },
        },
        { name: 'value', type: 'text', admin: { description: '单选值' } },
        { name: 'required', type: 'checkbox', admin: { description: '是否必填', readOnly: true } },
        {
          name: 'options',
          type: 'array',
          fields: [
            { name: 'value', type: 'text', required: true },
            { name: 'defaultSelected', type: 'checkbox' },
          ],
          admin: { description: '选项列表', readOnly: true },
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
          admin: { description: '字段名称', readOnly: true },
        },
        { name: 'value', type: 'textarea', localized: true, admin: { description: '文本域值' } },
        {
          name: 'label',
          type: 'text',
          localized: true,
          admin: { description: '字段标签', readOnly: true },
        },
        {
          name: 'placeholder',
          type: 'text',
          localized: true,
          admin: { description: '占位符文本', readOnly: true },
        },
        { name: 'required', type: 'checkbox', admin: { description: '是否必填', readOnly: true } },
        { name: 'rows', type: 'number', admin: { description: '行数', readOnly: true } },
        { name: 'maxLength', type: 'number', admin: { description: '最大长度', readOnly: true } },
      ],
    },
  ],
})
