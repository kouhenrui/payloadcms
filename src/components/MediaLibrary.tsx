'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'

interface Media {
  id: string
  title: string
  alt: string
  filename: string
  mimeType: string
  fileType: string
  filesize: number
  url: string
  thumbnail?: string
  category: string
  tags?: string[]
  createdAt: string
}

interface MediaLibraryProps {
  onSelect?: (media: Media) => void
  multiple?: boolean
  selectedMedia?: Media[]
  fileType?: string
  className?: string
}

export default function MediaLibrary({
  onSelect,
  multiple = false,
  selectedMedia = [],
  fileType,
  className = '',
}: MediaLibraryProps) {
  const [media, setMedia] = useState<Media[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [filter, setFilter] = useState({
    fileType: fileType || '',
    category: '',
    search: '',
  })

  useEffect(() => {
    fetchMedia()
  }, [page, filter])

  const fetchMedia = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...filter,
      })

      const response = await fetch(`/api/media/list?${params}`)
      if (!response.ok) {
        throw new Error('获取媒体文件失败')
      }

      const data = await response.json()

      if (page === 1) {
        setMedia(data.docs || [])
      } else {
        setMedia((prev) => [...prev, ...(data.docs || [])])
      }

      setHasMore(data.hasNextPage || false)
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取媒体文件失败')
    } finally {
      setLoading(false)
    }
  }

  const handleSelect = (media: Media) => {
    if (multiple) {
      const isSelected = selectedMedia.some((m) => m.id === media.id)
      if (isSelected) {
        onSelect?.(media) // 移除选中
      } else {
        onSelect?.(media) // 添加选中
      }
    } else {
      onSelect?.(media)
    }
  }

  const isSelected = (media: Media) => {
    return selectedMedia.some((m) => m.id === media.id)
  }

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'image':
        return '🖼️'
      case 'video':
        return '🎥'
      case 'audio':
        return '🎵'
      case 'document':
        return '📄'
      default:
        return '📁'
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('zh-CN')
  }

  if (error) {
    return (
      <div className={`media-library ${className}`}>
        <div className="text-center text-red-500 p-4">
          <p>{error}</p>
          <button
            onClick={() => {
              setError(null)
              fetchMedia()
            }}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            重试
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`media-library ${className}`}>
      {/* 过滤器 */}
      <div className="mb-4 space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="搜索文件..."
            value={filter.search}
            onChange={(e) => setFilter((prev) => ({ ...prev, search: e.target.value }))}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={filter.fileType}
            onChange={(e) => setFilter((prev) => ({ ...prev, fileType: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">所有类型</option>
            <option value="image">图片</option>
            <option value="video">视频</option>
            <option value="audio">音频</option>
            <option value="document">文档</option>
          </select>
          <select
            value={filter.category}
            onChange={(e) => setFilter((prev) => ({ ...prev, category: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">所有分类</option>
            <option value="general">通用</option>
            <option value="product">产品</option>
            <option value="marketing">营销</option>
            <option value="news">新闻</option>
            <option value="user-upload">用户上传</option>
          </select>
        </div>
      </div>

      {/* 媒体网格 */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {media.map((item) => (
          <div
            key={item.id}
            className={`media-item relative border rounded-lg overflow-hidden cursor-pointer transition-all ${
              isSelected(item)
                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleSelect(item)}
          >
            {/* 选中指示器 */}
            {isSelected(item) && (
              <div className="absolute top-2 right-2 z-10">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            )}

            {/* 媒体预览 */}
            <div className="aspect-square bg-gray-100 flex items-center justify-center">
              {item.fileType === 'image' ? (
                <Image
                  src={item.url}
                  alt={item.alt}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-4xl">{getFileIcon(item.fileType)}</div>
              )}
            </div>

            {/* 文件信息 */}
            <div className="p-2">
              <p className="text-xs font-medium truncate" title={item.title}>
                {item.title}
              </p>
              <p className="text-xs text-gray-500">{formatFileSize(item.filesize)}</p>
              <p className="text-xs text-gray-400">{formatDate(item.createdAt)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 加载更多 */}
      {hasMore && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={loading}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
          >
            {loading ? '加载中...' : '加载更多'}
          </button>
        </div>
      )}

      {/* 空状态 */}
      {!loading && media.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>暂无媒体文件</p>
        </div>
      )}
    </div>
  )
}
