#!/bin/bash

# 构建和导出镜像脚本
set -e

IMAGE_NAME="saas-payload"
IMAGE_TAG="dev"
EXPORT_FILE="saas-payload-dev.tar"

echo "🚀 开始构建镜像..."

# 使用 podman 构建镜像
podman build -f Dockerfile.dev -t ${IMAGE_NAME}:${IMAGE_TAG} .

echo "✅ 镜像构建完成"

# 导出镜像为 tar 文件
echo "📦 导出镜像到 ${EXPORT_FILE}..."
podman save -o ${EXPORT_FILE} ${IMAGE_NAME}:${IMAGE_TAG}

echo "✅ 镜像导出完成: ${EXPORT_FILE}"
echo ""
echo "📋 部署到 Ubuntu 服务器的步骤:"
echo "1. 将 ${EXPORT_FILE} 和 docker-compose.yml 复制到服务器"
echo "2. 在服务器上运行: docker load -i ${EXPORT_FILE}"
echo "3. 复制 env.prod 到 .env 并修改配置"
echo "4. 运行: docker-compose up -d"
echo ""
echo "🔧 镜像信息:"
podman images ${IMAGE_NAME}:${IMAGE_TAG}
