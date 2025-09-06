# 生产环境 Dockerfile
FROM node:20-alpine

# 安装依赖
RUN apk add --no-cache libc6-compat

# 设置工作目录
WORKDIR /app

# 复制 standalone 构建输出
COPY .next/standalone ./
COPY .next/static ./.next/static
COPY public ./public

# 暴露端口
EXPOSE 3000

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=3000

# 启动应用
CMD ["node", "server.js"]
