# SaaS Payload CMS

一个基于 Payload CMS 的现代化 SaaS 内容管理系统，支持多语言、模板系统和完整的用户权限管理。

## ✨ 特性

- 🚀 **现代化架构**: 基于 Next.js 14 + Payload CMS 3.0
- 🌍 **多语言支持**: 内置中文、英文、日文、韩文、繁体中文支持
- 🎨 **模板系统**: 灵活的页面、组件、收藏模板管理
- 👥 **权限管理**: 完整的 RBAC 用户权限系统
- 📱 **响应式设计**: 支持桌面端和移动端
- 🔐 **安全认证**: JWT 认证 + 密码重置功能
- 📊 **媒体管理**: 完整的文件上传和媒体库管理
- 🐳 **Docker 支持**: 开箱即用的容器化部署

## 🚀 快速开始

### 环境要求

- Node.js 18+ 
- MongoDB 4.4+
- pnpm (推荐) 或 npm

### 本地开发

1. **克隆项目**
```bash
git clone https://github.com/kouhenrui/payloadcms.git
cd payloadcms
```

2. **安装依赖**
```bash
pnpm install
```

3. **环境配置**
```bash
cp env.example .env
# 编辑 .env 文件，配置数据库连接等
```

4. **启动开发服务器**
```bash
pnpm dev
```

5. **访问应用**
- 前端: http://localhost:3000
- 管理后台: http://localhost:3000/admin

### Docker 部署

```bash
# 使用 Docker Compose
docker-compose up -d

# 或使用开发环境
docker-compose -f docker-compose.dev.yml up -d
```

## 📁 项目结构

```
src/
├── app/                    # Next.js App Router
│   ├── (frontend)/        # 前端页面
│   └── (payload)/         # Payload 管理后台
├── collections/           # 数据集合定义
│   ├── Users.ts          # 用户管理
│   ├── Templates.ts      # 模板管理
│   ├── Pages.ts          # 页面管理
│   ├── Components.ts     # 组件管理
│   ├── Collections.ts    # 收藏管理
│   └── Media.ts          # 媒体管理
├── components/           # 可复用组件
├── endpoints/            # 自定义 API 端点
├── globals/              # 全局配置
├── hooks/                # 自定义 Hooks
├── plugins/              # Payload 插件
└── utilities/            # 工具函数
```

## 🌍 多语言支持

系统支持以下语言：

- 🇨🇳 简体中文 (zh)
- 🇺🇸 英语 (en) 
- 🇯🇵 日语 (ja)
- 🇰🇷 韩语 (ko)
- 🇹🇼 繁体中文 (zh-TW)

### 使用方式

```typescript
// 在集合中使用多语言字段
{
  name: 'title',
  type: 'text',
  localized: true, // 启用多语言
  required: true
}

// API 调用
GET /api/pages?locale=zh    // 获取中文版本
GET /api/pages?locale=en    // 获取英文版本
```

## 🎨 模板系统

### 模板类型

1. **页面模板** - 用于创建标准页面
2. **组件模板** - 用于创建可复用组件
3. **收藏模板** - 用于创建内容收藏

### 使用流程

```
创建模板 → 基于模板创建内容 → 发布内容
```

## 👥 用户权限系统

### 角色定义

- **super** - 超级管理员 (所有权限)
- **admin** - 管理员 (管理权限)
- **vip** - VIP 用户 (高级权限)
- **user** - 普通用户 (基础权限)

### 权限控制

```typescript
// 在集合中定义访问控制
access: {
  create: ({ req: { user } }) => {
    return user?.role === 'admin' || user?.role === 'super'
  },
  read: () => true,
  update: ({ req: { user } }) => {
    return user?.role === 'admin' || user?.role === 'super'
  },
  delete: ({ req: { user } }) => {
    return user?.role === 'super'
  }
}
```

## 🔧 配置说明

### 环境变量

```bash
# 数据库配置
DATABASE_URI=mongodb://localhost:27017/payload

# JWT 密钥
JWT_SECRET=your-secret-key

# 系统配置
SYSTEM_NAME=SaaS Payload CMS
FALLBACK_LANGUAGE=zh

# 跨域配置
CORS_ORIGINS=http://localhost:3000,https://yourdomain.com
```

### 系统配置

在 `src/utilities/key.ts` 中可以配置：

- 系统名称和版本
- 支持的语言列表
- 文件上传限制
- 权限配置
- 跨域设置

## 📊 API 文档

### 认证端点

- `POST /api/auth/login` - 用户登录
- `POST /api/auth/logout` - 用户登出
- `POST /api/auth/forgot-password` - 忘记密码
- `POST /api/auth/reset-password` - 重置密码

### 内容端点

- `GET /api/pages` - 获取页面列表
- `GET /api/pages/:id` - 获取单个页面
- `POST /api/pages` - 创建页面
- `PUT /api/pages/:id` - 更新页面
- `DELETE /api/pages/:id` - 删除页面

### 媒体端点

- `GET /api/media` - 获取媒体列表
- `POST /api/media` - 上传媒体文件

## 🚀 部署

### 生产环境部署

1. **构建应用**
```bash
pnpm build
```

2. **启动生产服务器**
```bash
pnpm start
```

### Docker 部署

```bash
# 构建镜像
docker build -t saas-payload .

# 运行容器
docker run -p 3000:3000 saas-payload
```

### 云部署

支持部署到：
- Vercel
- Netlify  
- Railway
- DigitalOcean
- AWS

## 🧪 测试

```bash
# 运行单元测试
pnpm test

# 运行 E2E 测试
pnpm test:e2e

# 运行集成测试
pnpm test:int
```

## 📝 开发指南

### 添加新集合

1. 在 `src/collections/` 创建新的集合文件
2. 在 `src/payload.config.ts` 中注册集合
3. 运行 `pnpm generate:types` 生成类型

### 添加新端点

1. 在 `src/endpoints/` 创建端点文件
2. 在 `src/payload.config.ts` 中注册端点

### 自定义组件

1. 在 `src/components/` 创建组件
2. 在集合的 `admin.components` 中注册

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [Payload CMS](https://payloadcms.com/) - 强大的无头 CMS
- [Next.js](https://nextjs.org/) - React 框架
- [MongoDB](https://www.mongodb.com/) - 数据库
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架

## 📞 支持

如有问题，请：

1. 查看 [文档](https://payloadcms.com/docs)
2. 提交 [Issue](https://github.com/kouhenrui/payloadcms/issues)
3. 加入 [Discord](https://discord.com/invite/payload)

---

⭐ 如果这个项目对你有帮助，请给个 Star！