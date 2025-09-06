import { Payload } from 'payload'
import { CollectionSlug } from 'payload'

// 导出数据接口
export interface ExportData {
  version: string
  timestamp: string
  collection: string
  data: any[]
}

// 导入数据接口
export interface ImportData {
  version: string
  timestamp: string
  collection: string
  data: any[]
}

// 导出集合数据
export async function exportCollectionData(
  payload: Payload,
  collectionSlug: string,
  options?: {
    status?: string
    limit?: number
    depth?: number
  },
): Promise<ExportData> {
  try {
    const query: any = {}

    // 如果指定了状态，添加状态过滤
    if (options?.status) {
      query.status = { equals: options.status }
    }

    const result = await payload.find({
      collection: collectionSlug as CollectionSlug,
      where: query,
      limit: options?.limit || 1000,
      depth: options?.depth || 2,
    })

    const exportData: ExportData = {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      collection: collectionSlug as CollectionSlug,
      data: result.docs,
    }

    return exportData
  } catch (error) {
    throw new Error(`导出失败: ${error instanceof Error ? error.message : '未知错误'}`)
  }
}

// 导入集合数据
export async function importCollectionData(
  payload: Payload,
  importData: ImportData,
  options?: {
    overwrite?: boolean
    skipExisting?: boolean
  },
): Promise<{ success: number; failed: number; errors: string[] }> {
  const result = {
    success: 0,
    failed: 0,
    errors: [] as string[],
  }

  try {
    for (const item of importData.data) {
      try {
        // 检查是否已存在（基于slug或id）
        const existingQuery: any = {}
        if (item.slug) {
          existingQuery.slug = { equals: item.slug }
        } else if (item.id) {
          existingQuery.id = { equals: item.id }
        }

        const existing = await payload.find({
          collection: importData.collection as CollectionSlug,
          where: existingQuery,
          limit: 1,
        })

        if (existing.docs.length > 0) {
          if (options?.skipExisting) {
            continue
          }
          if (options?.overwrite) {
            // 更新现有记录
            await payload.update({
              collection: importData.collection as CollectionSlug,
              id: existing.docs[0].id,
              data: {
                ...item,
                id: undefined, // 移除id，避免冲突
              },
            })
            result.success++
          } else {
            result.errors.push(`记录已存在: ${item.slug || item.id}`)
            result.failed++
          }
        } else {
          // 创建新记录
          await payload.create({
            collection: importData.collection as CollectionSlug,
            data: {
              ...item,
              id: undefined, // 移除id，避免冲突
            },
          })
          result.success++
        }
      } catch (error) {
        result.errors.push(`导入失败: ${error instanceof Error ? error.message : '未知错误'}`)
        result.failed++
      }
    }

    return result
  } catch (error) {
    throw new Error(`导入失败: ${error instanceof Error ? error.message : '未知错误'}`)
  }
}

// 导出模板及其相关数据
export async function exportTemplateWithRelated(
  payload: Payload,
  templateId: string,
): Promise<ExportData> {
  try {
    // 获取模板数据
    const template = await payload.findByID({
      collection: 'templates',
      id: templateId,
    })

    if (!template) {
      throw new Error('模板不存在')
    }

    // 根据模板类型获取相关数据
    let relatedData: any[] = []

    switch (template.templateType) {
      case 'template':
        // 获取使用此模板的页面
        const pages = await payload.find({
          collection: 'pages',
          where: {
            template: { equals: templateId },
          },
        })
        relatedData = pages.docs
        break

      case 'component':
        // 获取使用此模板的组件
        const components = await payload.find({
          collection: 'components',
          where: {
            template: { equals: templateId },
          },
        })
        relatedData = components.docs
        break

      case 'collection':
        // 获取使用此模板的收藏
        const collections = await payload.find({
          collection: 'collections',
          where: {
            template: { equals: templateId },
          },
        })
        relatedData = collections.docs
        break
    }

    const exportData: ExportData = {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      collection: 'template-with-related',
      data: {
        template,
        related: relatedData,
      },
    }

    return exportData
  } catch (error) {
    throw new Error(`导出模板失败: ${error instanceof Error ? error.message : '未知错误'}`)
  }
}

// 验证导入数据格式
export function validateImportData(data: any): data is ImportData {
  return (
    data &&
    typeof data.version === 'string' &&
    typeof data.timestamp === 'string' &&
    typeof data.collection === 'string' &&
    Array.isArray(data.data)
  )
}

// 生成导出文件名
export function generateExportFileName(collection: string, timestamp?: string): string {
  const date = timestamp ? new Date(timestamp) : new Date()
  const dateStr = date.toISOString().split('T')[0]
  const timeStr = date.toTimeString().split(' ')[0].replace(/:/g, '-')
  return `${collection}-export-${dateStr}-${timeStr}.json`
}
