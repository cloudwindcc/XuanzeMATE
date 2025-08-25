# XuanzeMATE - 人生决策伙伴

一个简洁而富有科技感的AI对话界面，专注于为用户提供人生决策支持。

## 🚀 版本更新日志

### v2.0.0 - 2025-08-26
**用户体验优化与AI模型升级**
- ✅ **Gemini 2.5 Pro升级**: 升级到最新的Gemini 2.5 Pro模型，提供更强大的AI能力
- ✅ **输入框优化**: 输入框高度增加至原来的两倍，提升用户体验
- ✅ **界面微调**: 发送按钮向左移动，整体布局更加协调
- ✅ **默认模型切换**: 默认使用Gemini模型，提供更稳定的服务
- ✅ **模型切换优化**: 切换模型时自动清空对话历史，避免模型混淆
- ✅ **错误处理增强**: 改进的错误提示和15秒超时设置，提供更好的反馈

### v1.1.0 - 2024-08-25
**功能增强与部署优化**
- ✅ **Markdown格式化支持**: AI回复现在支持完整的Markdown渲染
- ✅ **多平台部署配置**: 支持Vercel、Cloudflare Pages、Netlify一键部署
- ✅ **响应式设计优化**: 改进移动端体验和表格响应式布局
- ✅ **环境变量标准化**: 统一Vite环境变量前缀规范
- ✅ **自动化部署流水线**: GitHub Actions自动部署到多个平台

### v1.0.0 - 2024-08-25  
**初始版本发布**
- ✅ 基础聊天界面与14个决策主题侧边栏
- ✅ Deepseek & Gemini AI API集成
- ✅ 科技感深色主题设计
- ✅ 实时对话体验与消息历史

## 功能特性

- 🤖 AI驱动的决策分析
- 🎯 14个关键人生选择主题
- 🎙️ 语音输入支持（待实现）
- 💬 流畅的对话体验
- 🎨 科技感界面设计
- 🔒 隐私保护设计

## 快速开始

### 环境要求
- Node.js 16+
- npm 或 yarn

### 安装依赖
```bash
npm install
```

### 配置API密钥
1. 复制 `.env.example` 为 `.env`
2. 填入您的AI API密钥：
   - `VITE_DEEPSEEK_API_KEY`: Deepseek API密钥
   - `VITE_GEMINI_API_KEY`: Google Gemini API密钥
   - `VITE_DEFAULT_AI_PROVIDER`: 默认AI提供商 (DEEPSEEK 或 GEMINI)

### 启动开发服务器
```bash
npm run dev
```

访问 http://localhost:3000 查看应用

## 部署指南

### Vercel 一键部署
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/xuanzemate&env=VITE_DEEPSEEK_API_KEY,VITE_GEMINI_API_KEY,VITE_DEFAULT_AI_PROVIDER&envDescription=AI%20API%20密钥配置&envLink=https://github.com/your-username/xuanzemate%23环境变量配置)

1. 点击上方按钮
2. 连接您的GitHub仓库
3. 配置环境变量：
   - `VITE_DEEPSEEK_API_KEY`: 您的Deepseek API密钥
   - `VITE_GEMINI_API_KEY`: 您的Gemini API密钥
   - `VITE_DEFAULT_AI_PROVIDER`: DEEPSEEK 或 GEMINI

### Cloudflare Pages 部署

1. Fork 此仓库到您的GitHub账号
2. 登录 [Cloudflare Pages](https://pages.cloudflare.com/)
3. 连接您的GitHub仓库
4. 构建设置：
   - 构建命令: `npm run build`
   - 构建输出目录: `dist`
5. 环境变量：
   - `VITE_DEEPSEEK_API_KEY`: 您的API密钥
   - `VITE_GEMINI_API_KEY`: 您的API密钥
   - `VITE_DEFAULT_AI_PROVIDER`: DEEPSEEK

### Netlify 部署

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/your-username/xuanzemate)

### 手动部署命令

```bash
# 部署到Vercel
npm run deploy:vercel

# 部署到Cloudflare Pages
npm run deploy:cloudflare
```

## 环境变量配置

在部署平台上需要设置以下环境变量：

| 变量名 | 描述 | 必填 | 默认值 |
|--------|------|------|--------|
| `VITE_DEEPSEEK_API_KEY` | Deepseek API密钥 | 是 | - |
| `VITE_GEMINI_API_KEY` | Google Gemini API密钥 | 否 | - |
| `VITE_DEFAULT_AI_PROVIDER` | 默认AI提供商 | 否 | DEEPSEEK |

## 项目结构

```
src/
├── components/          # React组件
│   ├── Sidebar.jsx     # 侧边栏导航
│   ├── ChatInterface.jsx # 聊天界面
│   └── *.css          # 组件样式
├── services/           # 服务层
│   └── ai-service.js   # AI服务集成
├── data/              # 数据文件
│   └── prompt-templates.js # 提示词模板
├── App.jsx            # 主应用组件
├── main.jsx           # 应用入口
└── index.css          # 全局样式
```

## 技术支持

- **前端框架**: React 19 + Vite 7
- **样式系统**: CSS3 + 渐变设计 + 玻璃态效果
- **AI集成**: Deepseek API / Google Gemini API
- **Markdown渲染**: react-markdown + remark-gfm
- **构建工具**: Vite with optimized chunk splitting
- **部署平台**: Vercel, Cloudflare Pages, Netlify

## 🛠 技术架构升级详情

### Markdown格式化系统
- **组件**: `FormattedMessage` 专用Markdown渲染组件
- **特性**: 支持标题、列表、代码块、表格、引用等完整Markdown语法
- **样式**: 专业的代码高亮、表格响应式设计、优雅的排版间距

### 部署架构优化
- **Vercel**: 完整的 `vercel.json` 配置，支持环境变量映射和路由重写
- **Cloudflare**: `wrangler.toml` 配置 + `_redirects` SPA支持
- **Netlify**: `netlify.toml` 配置文件和安全头部设置
- **自动化**: GitHub Actions CI/CD 流水线，主分支自动部署

### 开发体验提升
- **环境变量**: 标准化 `VITE_` 前缀，支持多平台环境变量
- **构建优化**: Rollup代码分割，vendor和markdown独立chunk
- **错误处理**: 增强的API错误日志和用户友好提示

## 许可证

MIT License

---

**📦 项目状态**: Production Ready  
**🚀 最新版本**: v2.0.0  
**🔄 最后更新**: 2025-08-26  
**🔧 维护状态**: Active