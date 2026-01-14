# Vercel 部署配置

## 环境变量设置

在 Vercel Dashboard 的 **Settings > Environment Variables** 中添加以下变量：

### 必需变量
| 变量名 | 值 | 说明 |
|--------|-----|------|
| `NEXT_PUBLIC_SUPABASE_URL` | https://your-project.supabase.co | Supabase 项目 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | your-anon-key | Supabase 匿名访问密钥 |

### 可选变量
| 变量名 | 值 | 说明 |
|--------|-----|------|
| `GEMINI_API_KEY` | your-gemini-key | Gemini API Key（如果代码中使用） |

**注意：**
- 环境变量名必须完全匹配（包括 `NEXT_PUBLIC_` 前缀）
- 可以同时应用到 `Production`、`Preview`、`Development` 环境

## 构建配置

### 方案 A：使用 Bun（推荐）

在 Vercel Dashboard 的 **Settings > General** 中设置：

- **Framework Preset**: `Other`
- **Build Command**: `bun run build`
- **Output Directory**: `dist`

### 方案 B：使用 npm（无需修改）

如果没有安装 bun，将 `package.json` 修改为：

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

Vercel 默认配置即可工作。

## 验证部署

1. **检查环境变量**：
   - 部署后打开浏览器控制台
   - 确认没有 Supabase 相关错误

2. **测试功能**：
   - 问卷提交
   - 吐槽墙显示
   - 点赞功能

## 常见问题

### Q: 部署后 Supabase 连接失败
**A:** 检查 Vercel Dashboard 中是否正确设置了环境变量，变量名必须完全匹配 `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY`。

### Q: 构建失败
**A:** 如果使用 bun，确保 Vercel 的 Build Command 设置为 `bun run build`。

### Q: 环境变量不生效
**A:**
1. Vite 在**构建时**替换环境变量，不是运行时
2. 修改环境变量后需要重新部署才能生效
3. 确认 `vite.config.ts` 中已配置 `envPrefix: ['VITE_', 'NEXT_PUBLIC_']`

## 安全提示

⚠️ **重要：**
- `NEXT_PUBLIC_*` 变量会暴露在浏览器中，只用于客户端代码
- 敏感信息（如服务端密钥）不要使用 `NEXT_PUBLIC_` 前缀
- Supabase 的 anon key 是设计为公开的，但仍需启用 RLS 策略保护数据
