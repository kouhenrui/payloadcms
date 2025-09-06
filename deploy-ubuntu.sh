#!/bin/bash

# Ubuntu 服务器部署脚本
set -e

IMAGE_FILE="saas-payload-dev.tar"
COMPOSE_FILE="docker-compose.yml"
ENV_FILE=".env"

echo "🚀 开始部署到 Ubuntu 服务器..."

# 检查必要文件是否存在
if [ ! -f "$IMAGE_FILE" ]; then
    echo "❌ 错误: 找不到镜像文件 $IMAGE_FILE"
    exit 1
fi

if [ ! -f "$COMPOSE_FILE" ]; then
    echo "❌ 错误: 找不到 docker-compose.yml 文件"
    exit 1
fi

# 加载镜像
echo "📦 加载 Docker 镜像..."
docker load -i $IMAGE_FILE

# 检查环境变量文件
if [ ! -f "$ENV_FILE" ]; then
    echo "⚠️  警告: 找不到 .env 文件，请确保已配置环境变量"
    echo "💡 提示: 可以复制 env.prod 到 .env 并修改配置"
fi

# 停止现有容器
echo "🛑 停止现有容器..."
docker-compose down || true

# 启动服务
echo "🚀 启动服务..."
docker-compose up -d

# 显示状态
echo "✅ 部署完成!"
echo ""
echo "📊 服务状态:"
docker-compose ps

echo ""
echo "🌐 访问地址:"
echo "  - PayloadCMS: http://localhost:3000"
echo "  - MongoDB: localhost:27017"
echo ""
echo "📝 查看日志:"
echo "  docker-compose logs -f saas-payload"
