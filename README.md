# Pulse

一个基于 Vue 3 的新闻社区前端应用，支持用户注册登录、发布新闻、评论互动、关注其他用户等功能。

## 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| Vue | 3.5 beta (Vapor Mode) | 前端框架 |
| TypeScript | 5.9 | 类型系统 |
| Vite | 7 | 构建工具 |
| Pinia | 3 | 状态管理 |
| Vue Router | 5 | 路由管理 |
| Element Plus | 2 | UI 组件库 |
| Axios | 1.13 | HTTP 请求 |

## 功能

- 用户注册 / 登录 / 登出
- 浏览全部新闻（分页）
- 查看关注用户的动态（Feed）
- 发布 / 编辑新闻
- 新闻详情 + 多级评论 + 点赞
- 关注 / 取关其他用户
- 个人中心（修改昵称、邮箱）
- 用户主页（查看他人信息）

## 前置要求

- Node.js `^20.19.0` 或 `>=22.12.0`
- 后端服务运行在 `http://localhost:8080`

## 快速开始

```bash
# 1. 克隆项目
git clone https://github.com/your-username/pulse.git
cd pulse

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev
```

浏览器访问 `http://localhost:5173`。

## 项目结构

```
src/
├── api/                  # API 请求封装
│   ├── comment.ts        #   评论
│   ├── follow.ts         #   关注
│   ├── news.ts           #   新闻
│   └── user.ts           #   用户
├── components/           # 通用组件
│   ├── CommentItem.vue   #   评论条目
│   ├── NewsCard.vue      #   新闻卡片
│   └── ParticleBackground.vue
├── composables/
│   └── useRequest.ts     # Axios 实例 + 拦截器
├── router/
│   └── index.ts          # 路由配置 + 登录守卫
├── stores/
│   └── user.ts           # 用户状态管理
├── styles/
│   └── m3.css            # 全局样式（深色主题）
├── types/
│   └── index.ts          # TypeScript 类型定义
└── views/                # 页面组件
    ├── Home.vue          # 首页
    ├── Login.vue         # 登录
    ├── Register.vue      # 注册
    ├── CreateNews.vue    # 发布新闻
    ├── EditNews.vue      # 编辑新闻
    ├── NewsDetail.vue    # 新闻详情 + 评论
    ├── Dashboard.vue     # 个人中心
    └── UserProfile.vue   # 用户主页
```

## 其他命令

```bash
# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# 类型检查
npm run type-check

# 代码格式化
npm run format
```

## 关于后端

本项目是纯前端应用，后端 API 需要单独部署并运行在 `http://localhost:8080`。Vite 开发服务器会将 `/api` 请求代理到后端。

API 路径约定：

| 路径前缀 | 说明 |
|----------|------|
| `/api/read/*` | 读操作（查询、列表） |
| `/api/write/*` | 写操作（增删改） |
