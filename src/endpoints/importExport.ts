import { CollectionSlug, Endpoint } from 'payload'
import {
  exportCollectionData,
  importCollectionData,
  exportTemplateWithRelated,
  validateImportData,
  generateExportFileName,
} from '@/utilities/importExport'

// 导出集合数据
export const exportData: Endpoint = {
  path: '/import-export/export',
  method: 'post',
  handler: async (req) => {
    try {
      if (!req.json) {
        return new Response(JSON.stringify({ error: 'Invalid request' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        })
      }

      const { collection, status, limit, depth } = await req.json()

      if (!collection) {
        return new Response(JSON.stringify({ error: '集合名称不能为空' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        })
      }

      const exportData = await exportCollectionData(req.payload, collection, {
        status,
        limit,
        depth,
      })

      const fileName = generateExportFileName(collection)

      return new Response(JSON.stringify(exportData), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="${fileName}"`,
        },
      })
    } catch (error) {
      return new Response(
        JSON.stringify({
          error: '导出失败',
          message: error instanceof Error ? error.message : '未知错误',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }
  },
}

// 导入集合数据
export const importData: Endpoint = {
  path: '/import-export/import',
  method: 'post',
  handler: async (req) => {
    try {
      if (!req.json) {
        return new Response(JSON.stringify({ error: 'Invalid request' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        })
      }

      const { data, overwrite, skipExisting } = await req.json()

      if (!data || !validateImportData(data)) {
        return new Response(JSON.stringify({ error: '无效的导入数据格式' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        })
      }

      const result = await importCollectionData(req.payload, data, {
        overwrite,
        skipExisting,
      })

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    } catch (error) {
      return new Response(
        JSON.stringify({
          error: '导入失败',
          message: error instanceof Error ? error.message : '未知错误',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }
  },
}

// 导出模板及其相关数据
export const exportTemplate: Endpoint = {
  path: '/import-export/export-template',
  method: 'post',
  handler: async (req) => {
    try {
      if (!req.json) {
        return new Response(JSON.stringify({ error: 'Invalid request' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        })
      }

      const { templateId } = await req.json()

      if (!templateId) {
        return new Response(JSON.stringify({ error: '模板ID不能为空' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        })
      }

      const exportData = await exportTemplateWithRelated(req.payload, templateId)
      const fileName = generateExportFileName('template-with-related')

      return new Response(JSON.stringify(exportData), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="${fileName}"`,
        },
      })
    } catch (error) {
      return new Response(
        JSON.stringify({
          error: '导出模板失败',
          message: error instanceof Error ? error.message : '未知错误',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }
  },
}

// 获取导入导出状态
export const getImportExportStatus: Endpoint = {
  path: '/import-export/status',
  method: 'get',
  handler: async (req) => {
    try {
      // 获取各集合的数据统计
      const collections = ['templates', 'pages', 'components', 'collections']
      const stats: any = {}

      for (const collection of collections) {
        try {
          const result = await req.payload.find({
            collection: collection as CollectionSlug,
            limit: 1,
          })
          stats[collection] = {
            total: result.totalDocs,
            published: 0,
            draft: 0,
          }

          // 获取状态统计
          const publishedResult = await req.payload.find({
            collection: collection as CollectionSlug,
            where: {
              status: { equals: 'published' },
            },
            limit: 1,
          })
          stats[collection].published = publishedResult.totalDocs

          const draftResult = await req.payload.find({
            collection: collection as CollectionSlug,
            where: {
              status: { equals: 'draft' },
            },
            limit: 1,
          })
          stats[collection].draft = draftResult.totalDocs
        } catch (error) {
          stats[collection] = { error: '获取失败' }
        }
      }

      return new Response(JSON.stringify(stats), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    } catch (error) {
      return new Response(
        JSON.stringify({
          error: '获取状态失败',
          message: error instanceof Error ? error.message : '未知错误',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }
  },
}
