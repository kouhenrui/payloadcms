'use client'

import React, { useState, useRef } from 'react'

interface MediaUploaderProps {
  onUploadSuccess?: (media: any) => void
  onUploadError?: (error: string) => void
  acceptedTypes?: string[]
  maxFileSize?: number // 字节
  multiple?: boolean
  className?: string
}

export default function MediaUploader({
  onUploadSuccess,
  onUploadError,
  acceptedTypes = ['image/*', 'video/*', 'audio/*', 'application/pdf'],
  maxFileSize = 50 * 1024 * 1024, // 50MB
  multiple = false,
  className = '',
}: MediaUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (files: FileList) => {
    if (files.length === 0) return

    setIsUploading(true)
    setUploadProgress(0)

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]

        // 检查文件大小
        if (file.size > maxFileSize) {
          throw new Error(`文件 ${file.name} 太大，最大允许 ${formatFileSize(maxFileSize)}`)
        }

        // 检查文件类型
        const isValidType = acceptedTypes.some((type) => {
          if (type.endsWith('/*')) {
            return file.type.startsWith(type.replace('/*', ''))
          }
          return file.type === type
        })

        if (!isValidType) {
          throw new Error(`不支持的文件类型: ${file.type}`)
        }

        await uploadFile(file)
      }
    } catch (error) {
      onUploadError?.(error instanceof Error ? error.message : '上传失败')
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const uploadFile = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    // 添加文件元数据
    formData.append('alt', file.name)
    formData.append('title', file.name)
    formData.append('category', 'user-upload')

    const response = await fetch('/api/media', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || '上传失败')
    }

    const media = await response.json()
    onUploadSuccess?.(media)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className={`media-uploader ${className}`}>
      <div
        className={`upload-area ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'} ${
          isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-gray-400'
        } border-2 border-dashed rounded-lg p-6 text-center transition-all`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={!isUploading ? handleClick : undefined}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={acceptedTypes.join(',')}
          onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
          className="hidden"
        />

        {isUploading ? (
          <div className="space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-sm text-gray-600">上传中... {uploadProgress}%</p>
          </div>
        ) : (
          <div className="space-y-2">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="text-sm text-gray-600">
              <p className="font-medium">点击上传或拖拽文件到此处</p>
              <p className="text-xs mt-1">
                支持 {acceptedTypes.join(', ')} 格式，最大 {formatFileSize(maxFileSize)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
