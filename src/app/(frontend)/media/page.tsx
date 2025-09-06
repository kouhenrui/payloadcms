'use client'

import React, { useState } from 'react'
import MediaUploader from '@/components/MediaUploader'
import MediaLibrary from '@/components/MediaLibrary'

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

export default function MediaPage() {
  const [selectedMedia, setSelectedMedia] = useState<Media[]>([])
  const [activeTab, setActiveTab] = useState<'upload' | 'library'>('upload')

  const handleMediaSelect = (media: Media) => {
    const isSelected = selectedMedia.some((m) => m.id === media.id)
    if (isSelected) {
      setSelectedMedia((prev) => prev.filter((m) => m.id !== media.id))
    } else {
      setSelectedMedia((prev) => [...prev, media])
    }
  }

  const handleUploadSuccess = (media: Media) => {
    console.log('文件上传成功:', media)
    // 可以在这里刷新媒体库
  }

  const handleUploadError = (error: string) => {
    console.error('文件上传失败:', error)
    alert(`上传失败: ${error}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow">
          {/* 页面标题 */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">媒体管理</h1>
            <p className="mt-1 text-sm text-gray-500">上传、管理和组织您的媒体文件</p>
          </div>

          {/* 标签页 */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('upload')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'upload'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                上传文件
              </button>
              <button
                onClick={() => setActiveTab('library')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'library'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                媒体库
                {selectedMedia.length > 0 && (
                  <span className="ml-2 bg-blue-100 text-blue-600 py-0.5 px-2 rounded-full text-xs">
                    {selectedMedia.length}
                  </span>
                )}
              </button>
            </nav>
          </div>

          {/* 内容区域 */}
          <div className="p-6">
            {activeTab === 'upload' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">上传新文件</h2>
                  <MediaUploader
                    onUploadSuccess={handleUploadSuccess}
                    onUploadError={handleUploadError}
                    multiple={true}
                    className="max-w-2xl"
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-blue-900 mb-2">支持的文件类型</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-blue-700">
                    <div>🖼️ 图片 (JPEG, PNG, GIF, WebP)</div>
                    <div>🎥 视频 (MP4, WebM, OGG)</div>
                    <div>🎵 音频 (MP3, WAV, OGG)</div>
                    <div>📄 文档 (PDF, Word, Excel)</div>
                  </div>
                  <p className="text-xs text-blue-600 mt-2">最大文件大小: 50MB</p>
                </div>
              </div>
            )}

            {activeTab === 'library' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-900">媒体库</h2>
                  {selectedMedia.length > 0 && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          // 这里可以添加批量操作逻辑
                          console.log('批量操作:', selectedMedia)
                        }}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
                      >
                        批量操作 ({selectedMedia.length})
                      </button>
                      <button
                        onClick={() => setSelectedMedia([])}
                        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-sm"
                      >
                        清除选择
                      </button>
                    </div>
                  )}
                </div>

                <MediaLibrary
                  onSelect={handleMediaSelect}
                  selectedMedia={selectedMedia}
                  multiple={true}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
