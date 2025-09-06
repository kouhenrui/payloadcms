import { CollectionConfig } from 'payload'
import { isAdminOrSelf } from '@/access/userAccess'

// 支持的文件类型
const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
]
const SUPPORTED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime']
const SUPPORTED_AUDIO_TYPES = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4']
const SUPPORTED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
]

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'fileType', 'category', 'createdAt'],
    group: {
      zh: '媒体管理',
      en: 'Media Management',
      ja: 'メディア管理',
      ko: '미디어 관리',
      'zh-TW': '媒體管理',
    },
    description: {
      zh: '管理媒体文件，支持图片、视频、音频和文档',
      en: 'Manage media files, supporting images, videos, audio and documents',
      ja: '画像、動画、音声、文書をサポートするメディアファイルの管理',
      ko: '이미지, 비디오, 오디오 및 문서를 지원하는 미디어 파일 관리',
      'zh-TW': '管理媒體文件，支持圖片、視頻、音頻和文檔',
    },
  },
  access: {
    read: () => true,
    create: isAdminOrSelf,
    update: isAdminOrSelf,
    delete: isAdminOrSelf,
  },
  upload: {
    staticDir: 'media',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 1024,
        position: 'centre',
      },
      {
        name: 'tablet',
        width: 1024,
        height: undefined,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: [
      ...SUPPORTED_IMAGE_TYPES,
      ...SUPPORTED_VIDEO_TYPES,
      ...SUPPORTED_AUDIO_TYPES,
      ...SUPPORTED_DOCUMENT_TYPES,
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description: '文件的替代文本，用于无障碍访问',
      },
    },
    {
      name: 'caption',
      type: 'text',
      admin: {
        description: '文件说明文字',
      },
    },
    {
      name: 'title',
      type: 'text',
      admin: {
        description: '文件标题',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: '文件详细描述',
      },
    },
    {
      name: 'fileType',
      type: 'select',
      admin: {
        description: '文件类型分类',
        position: 'sidebar',
      },
      options: [
        { label: '图片', value: 'image' },
        { label: '视频', value: 'video' },
        { label: '音频', value: 'audio' },
        { label: '文档', value: 'document' },
        { label: '其他', value: 'other' },
      ],
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.mimeType) {
              if (SUPPORTED_IMAGE_TYPES.includes(data.mimeType)) return 'image'
              if (SUPPORTED_VIDEO_TYPES.includes(data.mimeType)) return 'video'
              if (SUPPORTED_AUDIO_TYPES.includes(data.mimeType)) return 'audio'
              if (SUPPORTED_DOCUMENT_TYPES.includes(data.mimeType)) return 'document'
              return 'other'
            }
            return value
          },
        ],
      },
    },
    {
      name: 'tags',
      type: 'text',
      hasMany: true,
      admin: {
        description: '文件标签，用于分类和搜索',
      },
    },
    {
      name: 'category',
      type: 'select',
      admin: {
        description: '文件分类',
        position: 'sidebar',
      },
      options: [
        { label: '通用', value: 'general' },
        { label: '产品', value: 'product' },
        { label: '营销', value: 'marketing' },
        { label: '新闻', value: 'news' },
        { label: '用户上传', value: 'user-upload' },
        { label: '系统', value: 'system' },
      ],
      defaultValue: 'general',
    },
    {
      name: 'usage',
      type: 'select',
      hasMany: true,
      admin: {
        description: '文件用途',
        position: 'sidebar',
      },
      options: [
        { label: '网站', value: 'website' },
        { label: '移动应用', value: 'mobile' },
        { label: '社交媒体', value: 'social' },
        { label: '邮件营销', value: 'email' },
        { label: '印刷品', value: 'print' },
        { label: '内部使用', value: 'internal' },
      ],
    },
    {
      name: 'metadata',
      type: 'group',
      admin: {
        description: '文件元数据',
        position: 'sidebar',
      },
      fields: [
        {
          name: 'width',
          type: 'number',
          admin: {
            description: '图片/视频宽度（像素）',
          },
        },
        {
          name: 'height',
          type: 'number',
          admin: {
            description: '图片/视频高度（像素）',
          },
        },
        {
          name: 'duration',
          type: 'number',
          admin: {
            description: '视频/音频时长（秒）',
          },
        },
        {
          name: 'fileSize',
          type: 'number',
          admin: {
            description: '文件大小（字节）',
          },
        },
        {
          name: 'format',
          type: 'text',
          admin: {
            description: '文件格式',
          },
        },
        {
          name: 'bitrate',
          type: 'number',
          admin: {
            description: '视频/音频比特率',
          },
        },
        {
          name: 'fps',
          type: 'number',
          admin: {
            description: '视频帧率',
          },
        },
      ],
    },
    {
      name: 'seo',
      type: 'group',
      admin: {
        description: 'SEO 设置',
        position: 'sidebar',
      },
      fields: [
        {
          name: 'altText',
          type: 'text',
          admin: {
            description: 'SEO 替代文本',
          },
        },
        {
          name: 'title',
          type: 'text',
          admin: {
            description: 'SEO 标题',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          admin: {
            description: 'SEO 描述',
          },
        },
      ],
    },
    {
      name: 'permissions',
      type: 'group',
      admin: {
        description: '权限设置',
        position: 'sidebar',
      },
      fields: [
        {
          name: 'isPublic',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: '是否公开访问',
          },
        },
        {
          name: 'requiresAuth',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: '是否需要认证才能访问',
          },
        },
        {
          name: 'allowedRoles',
          type: 'select',
          hasMany: true,
          admin: {
            description: '允许访问的角色',
          },
          options: [
            { label: '管理员', value: 'admin' },
            { label: '用户', value: 'user' },
            { label: 'VIP', value: 'vip' },
          ],
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, req }) => {
        // 自动设置文件类型
        if (data.mimeType && !data.fileType) {
          if (SUPPORTED_IMAGE_TYPES.includes(data.mimeType)) {
            data.fileType = 'image'
          } else if (SUPPORTED_VIDEO_TYPES.includes(data.mimeType)) {
            data.fileType = 'video'
          } else if (SUPPORTED_AUDIO_TYPES.includes(data.mimeType)) {
            data.fileType = 'audio'
          } else if (SUPPORTED_DOCUMENT_TYPES.includes(data.mimeType)) {
            data.fileType = 'document'
          } else {
            data.fileType = 'other'
          }
        }

        // 设置文件大小
        if (data.filesize) {
          data.metadata = {
            ...data.metadata,
            fileSize: data.filesize,
          }
        }

        return data
      },
    ],
    afterChange: [
      async ({ doc, req }) => {
        // 如果是图片，获取尺寸信息
        if (doc.fileType === 'image' && doc.filename) {
          try {
            // 这里可以添加图片尺寸检测逻辑
            // 由于需要额外的图片处理库，暂时跳过
          } catch (error) {
            console.error('获取图片尺寸失败:', error)
          }
        }

        return doc
      },
    ],
  },
  timestamps: true,
}
