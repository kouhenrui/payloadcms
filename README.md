# Payload Blank Template

This template comes configured with the bare minimum to get started on anything you need.

## Quick start

This template can be deployed directly from our Cloud hosting and it will setup MongoDB and cloud S3 object storage for media.

## Quick Start - local setup

To spin up this template locally, follow these steps:

### Clone

After you click the `Deploy` button above, you'll want to have standalone copy of this repo on your machine. If you've already cloned this repo, skip to [Development](#development).

### Development

1. First [clone the repo](#clone) if you have not done so already
2. `cd my-project && cp .env.example .env` to copy the example environment variables. You'll need to add the `MONGODB_URI` from your Cloud project to your `.env` if you want to use S3 storage and the MongoDB database that was created for you.

3. `pnpm install && pnpm dev` to install dependencies and start the dev server
4. open `http://localhost:3000` to open the app in your browser

That's it! Changes made in `./src` will be reflected in your app. Follow the on-screen instructions to login and create your first admin user. Then check out [Production](#production) once you're ready to build and serve your app, and [Deployment](#deployment) when you're ready to go live.

#### Docker (Optional)

If you prefer to use Docker for local development instead of a local MongoDB instance, the provided docker-compose.yml file can be used.

To do so, follow these steps:

- Modify the `MONGODB_URI` in your `.env` file to `mongodb://127.0.0.1/<dbname>`
- Modify the `docker-compose.yml` file's `MONGODB_URI` to match the above `<dbname>`
- Run `docker-compose up` to start the database, optionally pass `-d` to run in the background.

## How it works

The Payload config is tailored specifically to the needs of most websites. It is pre-configured in the following ways:

### Collections

See the [Collections](https://payloadcms.com/docs/configuration/collections) docs for details on how to extend this functionality.

- #### Users (Authentication)

  Users are auth-enabled collections that have access to the admin panel.

  For additional help, see the official [Auth Example](https://github.com/payloadcms/payload/tree/main/examples/auth) or the [Authentication](https://payloadcms.com/docs/authentication/overview#authentication-overview) docs.

- #### Media

  This is the uploads enabled collection. It features pre-configured sizes, focal point and manual resizing to help you manage your pictures.

### Docker

Alternatively, you can use [Docker](https://www.docker.com) to spin up this template locally. To do so, follow these steps:

1. Follow [steps 1 and 2 from above](#development), the docker-compose file will automatically use the `.env` file in your project root
1. Next run `docker-compose up`
1. Follow [steps 4 and 5 from above](#development) to login and create your first admin user

That's it! The Docker instance will help you get up and running quickly while also standardizing the development environment across your teams.

## Questions

If you have any issues or questions, reach out to us on [Discord](https://discord.com/invite/payload) or start a [GitHub discussion](https://github.com/payloadcms/payload/discussions).


# 集合优化总结

## 优化前
- `Users.ts` - 用户管理
- `Contents.ts` - 内容管理
- `Pages.ts` - 页面管理
- `Components.ts` - 组件管理
- `Collections.ts` - 收藏管理
- `Media.ts` - 媒体管理
- `Languages.ts` - 语言管理 ❌
- `Translations.ts` - 翻译管理 ❌
- `YaleHomeTopics.ts` - Yale 主题 ❌

## 优化后
- `Users.ts` - 用户管理 ✅
- `Contents.ts` - 模板管理 ✅
- `Pages.ts` - 页面管理 ✅
- `Components.ts` - 组件管理 ✅
- `Collections.ts` - 收藏管理 ✅
- `Media.ts` - 媒体管理 ✅

## 删除的集合及原因

### 1. Languages.ts
**原因**: 已改用 Payload CMS 的 i18n 字段支持
- 使用 `localized: true` 字段直接在内容中支持多语言
- 在 Settings 全局配置中定义支持的语言列表
- 简化了系统架构，减少了数据复杂性

### 2. Translations.ts
**原因**: 不再需要独立的翻译管理
- 使用 i18n 字段后，翻译直接在内容字段中管理
- 减少了数据冗余和同步复杂性
- 提高了内容管理的效率

### 3. YaleHomeTopics.ts
**原因**: 特定功能，不属于核心系统
- 可以通过 Pages 集合实现类似功能
- 减少了系统复杂度
- 提高了系统的通用性

## 系统架构优化

### 模板系统
```
Contents (模板)
├── 页面模板 → Pages (页面)
├── 组件模板 → Components (组件)
└── 收藏模板 → Collections (收藏)
```

### 多语言支持
- 使用 `localized: true` 字段
- 在 Settings 中配置支持的语言
- 通过 `locale` 参数访问不同语言版本

### 权限控制
- 简化的 RBAC 系统
- 固定角色：super、admin、user、vip
- 基于角色的访问控制

## 优势

1. **简化架构**: 减少了 3 个不必要的集合
2. **提高性能**: 减少了数据库查询和关系复杂度
3. **易于维护**: 更清晰的系统结构
4. **标准化**: 使用 Payload CMS 原生功能
5. **灵活性**: 通过模板系统实现内容复用

## 迁移说明

### 语言配置
- 从 Languages 集合迁移到 Settings 全局配置
- 支持的语言列表在 Settings 中维护
- LanguageSelector 组件使用静态语言列表

### 翻译管理
- 不再需要独立的翻译工作流
- 直接在内容编辑器中管理多语言版本
- 使用 Payload CMS 的原生 i18n 功能

### 内容管理
- 模板、组件、收藏统一通过 Contents 管理
- 实际内容通过对应的 Pages、Components、Collections 管理
- 支持版本控制和草稿管理

## API 变化

### 移除的端点
- `/api/languages/*` - 语言管理端点
- `/api/translations/*` - 翻译管理端点
- `/api/yale-home-topics/*` - Yale 主题端点

### 保留的端点
- `/api/auth/*` - 认证相关端点
- 所有 Payload CMS 原生端点

### 多语言访问
```bash
# 获取中文版本
GET /api/contents?locale=zh-CN

# 获取英文版本
GET /api/contents?locale=en-US
```

## 后续建议

1. **数据迁移**: 如果有现有数据，需要迁移到新的结构
2. **前端更新**: 更新前端代码以使用新的 API 结构
3. **文档更新**: 更新用户文档和开发文档
4. **测试**: 全面测试新的系统架构
