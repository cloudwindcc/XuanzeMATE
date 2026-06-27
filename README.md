# XuanzeMATE - 人生决策伙伴

XuanzeMATE 是一个面向人生重大选择的 AI 对话应用。它提供职业成长、创业选择、婚姻关系、理财、健康、教育、地域选择等 14 类提示主题，并通过 Cloudflare Pages Functions 安全调用 Kimi、Gemini 或 DeepSeek。默认使用 Kimi。

## 版本

### v3.0.2 - 2026-06-27

- 默认 AI provider 改为 Kimi / Moonshot
- 新增 `MOONSHOT_API_KEY` 服务端 Secret 支持
- 前端移除模型选择器，不显示使用哪一个 Key 或 provider
- Kimi 请求使用 Moonshot OpenAI-compatible chat completions 接口

### v3.0.1 - 2026-06-27

- 将 Gemini / DeepSeek API 调用迁移到 Cloudflare Pages Function `/api/chat`
- 移除前端 `VITE_*_API_KEY` 注入，避免 API Key 被浏览器或构建产物暴露
- 删除会打印或硬编码密钥的本地测试脚本
- Gemini 对话改为保留上下文历史，并默认使用 `gemini-2.5-pro`
- 补充 Node 内置测试，覆盖服务端密钥读取和请求格式转换
- 修正文档中的版本、许可证、Node 版本和部署说明

## 功能特性

- AI 驱动的人生决策分析
- 14 个关键人生选择主题
- 默认使用 Kimi，服务端仍保留 Gemini / DeepSeek 兼容
- 中英文双语界面
- Markdown 回复渲染
- 移动端适配和科技感粒子背景
- API Key 仅保存在服务端环境变量中

## 技术栈

- React 19 + Vite 7
- Cloudflare Pages Functions
- react-markdown + remark-gfm
- Node.js `^20.19.0 || >=22.12.0`

## 本地开发

```bash
npm install
npm run dev
```

本地访问 `http://localhost:3000`。

如果要在本地完整测试 `/api/chat`，请使用 Cloudflare Wrangler 的 Pages 开发环境，并设置服务端环境变量：

```bash
npx wrangler pages dev dist
```

## Cloudflare Pages 环境变量

请在 Cloudflare Pages 项目 `xuanzemate` 的环境变量里配置以下服务端变量：

| 变量名 | 描述 | 必填 | 默认值 |
| --- | --- | --- | --- |
| `MOONSHOT_API_KEY` | Kimi / Moonshot API Key | 是 | - |
| `GEMINI_API_KEY` | Google Gemini API Key | 可选 | - |
| `DEEPSEEK_API_KEY` | DeepSeek API Key | 可选 | - |
| `DEFAULT_AI_PROVIDER` | 默认模型提供商，`KIMI`、`GEMINI` 或 `DEEPSEEK` | 否 | `KIMI` |

不要再把密钥配置为 `VITE_*` 前缀。已经暴露过的 Gemini / DeepSeek Key 应立即在对应平台撤销并重新生成。

## Cloudflare Pages 构建设置

- Build command: `npm run build`
- Build output directory: `dist`
- Functions directory: `functions`
- Node.js version: `22`

部署命令：

```bash
npm run build
npx wrangler pages deploy dist --project-name xuanzemate
```

## 项目结构

```text
functions/
└── api/chat.js              # Cloudflare Pages Function，服务端调用 AI API
public/
├── _headers                 # Cloudflare Pages 安全响应头
└── _redirects               # SPA 路由回退
src/
├── components/              # React 组件
├── contexts/                # 语言上下文
├── data/                    # 翻译和提示词模板
├── services/ai-service.js   # 前端仅调用 /api/chat
├── App.jsx                  # 应用状态和主流程
└── main.jsx                 # 应用入口
tests/
└── chat-function.test.js    # Pages Function 行为测试
```

## 验证

```bash
npm test
npm run build
```

## 许可证

MIT License
