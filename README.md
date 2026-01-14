<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Zootopia: Fun Work - Supabase Integration

这是一个集成了 Supabase 后端数据库的问卷调查应用，支持问卷提交、吐槽墙和点赞功能。

View your app in AI Studio: https://ai.studio/apps/drive/1_MDQD6OOYNZAGBwRD1tT7VCYfTe4miiL

## 功能特性

✅ **问卷系统**
- 两步问卷流程
- 数据保存到 Supabase 数据库
- 提交成功后跳转到吐槽墙

✅ **吐槽墙**
- 从数据库加载真实帖子
- 点赞/取消点赞功能
- 按时间或热度排序
- Emoji 筛选
- 搜索功能
- "我的"标签页（显示点赞过的帖子）

✅ **数据库操作**
- 问卷数据持久化
- 帖子 CRUD 操作
- 点赞状态追踪（基于 IP）
- 自动更新点赞数

## 快速开始

### 1. 创建 Supabase 项目

访问 [supabase.com](https://supabase.com) 并创建一个新项目。

### 2. 设置数据库表

在 Supabase Dashboard 的 SQL Editor 中，依次运行 [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) 中的 SQL 命令：

```sql
-- 1. 创建 surveys 表
CREATE TABLE surveys (...);

-- 2. 创建 venting_posts 表
CREATE TABLE venting_posts (...);

-- 3. 创建 venting_likes 表
CREATE TABLE venting_likes (...);

-- 4. 创建点赞数更新函数
CREATE OR REPLACE FUNCTION update_post_likes_count()...;
```

### 3. 配置环境变量

复制 `.env.example` 到 `.env`：

```bash
cp .env.example .env
```

编辑 `.env` 文件，填入你的 Supabase 凭证：

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

获取凭证的方式：
- 访问 Supabase Dashboard → Settings → API
- 复制 Project URL 和 anon public key

### 4. 安装依赖并运行

```bash
# 安装依赖
bun install

# 启动开发服务器
bun run dev
```

应用将在 http://localhost:3000 启动。

## 数据库架构

### surveys 表
存储问卷回复数据

```
- id: UUID (主键)
- tasks: TEXT[] (选中的任务列表)
- feedback: TEXT (详细反馈)
- ai_tasks: TEXT[] (AI 任务列表)
- ai_help: TEXT (AI 帮助详情)
- mood: TEXT (心情状态)
- user_ip: TEXT (用户 IP)
- user_agent: TEXT (浏览器信息)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### venting_posts 表
存储吐槽墙帖子

```
- id: UUID (主键)
- emoji: TEXT (表情符号)
- content: TEXT (帖子内容)
- likes_count: INTEGER (点赞数)
- rank: INTEGER (排名)
- rotation: INTEGER (旋转角度)
- user_ip: TEXT
- user_agent: TEXT
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### venting_likes 表
存储点赞记录（防止重复点赞）

```
- id: UUID (主键)
- post_id: UUID (外键 → venting_posts)
- user_ip: TEXT (用户 IP)
- created_at: TIMESTAMP
- UNIQUE(post_id, user_ip) (每个 IP 对每个帖子只能点赞一次)
```

## API 使用说明

### 问卷相关

```typescript
import { saveSurvey, getSurveys } from './lib/database';

// 保存问卷
const result = await saveSurvey({
  tasks: ['手工处理数据', '重复运维'],
  feedback: '详细反馈内容',
  aiTasks: ['撰写报告'],
  aiHelp: 'AI 帮助详情',
  mood: '挺不错'
});

// 获取问卷列表
const surveys = await getSurveys(100);
```

### 吐槽墙相关

```typescript
import { getVentingPosts, createVentingPost, toggleLike, checkUserLike } from './lib/database';

// 获取帖子（按时间或热度排序）
const posts = await getVentingPosts(50, 'likes');

// 创建新帖子
const result = await createVentingPost('😤', '这是吐槽内容');

// 切换点赞状态
const result = await toggleLike(postId);
// result.liked: boolean - 是否已点赞
// result.likesCount: number - 当前点赞数

// 检查是否已点赞
const check = await checkUserLike(postId);
// check.liked: boolean
```

## 安全性说明

当前实现使用了基本的 IP 地址追踪来防止重复点赞：

✅ **优点**
- 简单易用，无需用户登录
- 防止基本层面的重复点赞

⚠️ **限制**
- IP 地址可能被共享或变化
- 不适用于需要严格身份验证的场景

**改进建议**：
- 添加用户认证系统（Supabase Auth）
- 实现 Row Level Security (RLS) 策略
- 添加内容审核机制
- 实现 Rate Limiting

## 故障排除

### 数据库连接失败
- 检查 `.env` 文件中的 URL 和 Key 是否正确
- 确认 Supabase 项目是否处于 Active 状态
- 检查浏览器控制台的错误信息

### 权限错误
- 确认已在 Supabase Dashboard 中启用 RLS 策略
- 检查表和策略的权限设置

### 点赞不工作
- 确认 `venting_likes` 表的唯一约束已创建
- 检查 trigger 函数是否正确设置

## 项目结构

```
survey-sre/
├── lib/
│   ├── supabase.ts       # Supabase 客户端配置
│   ├── database.ts       # 数据库操作函数
│   └── router.tsx        # 路由系统
├── app/
│   ├── survey/page.tsx   # 问卷页面（已集成数据库）
│   ├── venting/page.tsx  # 吐槽墙页面
│   └── layout.tsx        # 布局组件
├── components/
│   └── VentingWall.tsx   # 吐槽墙组件（已集成数据库）
├── types.ts              # TypeScript 类型定义
├── DATABASE_SCHEMA.md    # 数据库架构说明
└── .env.example          # 环境变量示例
```

## 技术栈

- **Frontend**: React 19 + TypeScript + Vite
- **Backend**: Supabase (PostgreSQL + REST API)
- **Styling**: Tailwind CSS
- **Build Tool**: Vite

## License

MIT

