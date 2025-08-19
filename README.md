# 🐟 摸鱼办提醒工具

![摸鱼办提醒工具](https://img.shields.io/badge/摸鱼办-提醒工具-blue?style=for-the-badge&logo=react)
![版本](https://img.shields.io/badge/版本-1.0.0-green?style=flat-square)
![许可证](https://img.shields.io/badge/许可证-MIT-orange?style=flat-square)

一个精美的"摸鱼办"提醒网页应用，帮助您轻松了解距离发工资、周末和节假日的倒计时。每次刷新都能获取不同的摸鱼提示，让您的工作生活更加愉快！

## ✨ 功能特点

- **随机提醒文本**：每次刷新都能看到不同的摸鱼提示和健康建议
- **实时倒计时**：精确显示距离发工资、周末和节假日的天数
- **工作进度条**：直观展示当天工作进度，让您掌握时间节奏
- **暗黑模式**：支持明亮和暗黑两种主题，保护您的眼睛
- **一键复制**：方便地复制文本内容，随时分享给同事好友
- **响应式设计**：完美适配各种设备，从手机到桌面都能舒适使用

## 🖥️ 在线体验

访问 [摸鱼办提醒工具](https://moyuba.vercel.app) 立即体验！

## 📸 界面预览

<div align="center">
  <img src="https://via.placeholder.com/800x450.png?text=摸鱼办提醒工具界面预览" alt="摸鱼办提醒工具界面预览" width="80%">
</div>

## 🚀 本地运行步骤

### 前提条件

确保您的电脑已安装：
- Node.js (v18.0.0 或更高版本)
- pnpm (推荐的包管理器)

如果未安装 pnpm，可以通过以下命令安装：
```bash
npm install -g pnpm
```

### 安装与启动

1. 克隆项目到本地
```bash
git clone https://github.com/yourusername/moyuba.git
cd moyuba
```

2. 安装依赖
```bash
pnpm install
```

3. 启动开发服务器
```bash
pnpm dev
```

4. 在浏览器中访问：`http://localhost:3000`

### 构建生产版本

```bash
pnpm build
```

构建后的文件将位于 `dist` 目录中，可以部署到任何静态网站托管服务。

## 🔧 技术栈

- **前端框架**：React 18 + TypeScript
- **样式解决方案**：Tailwind CSS + Framer Motion
- **构建工具**：Vite
- **部署平台**：Vercel

## 📝 使用指南

1. **查看倒计时**：打开网页即可看到距离各种重要日期的倒计时
2. **刷新提示**：点击刷新按钮获取新的随机摸鱼提示
3. **切换主题**：点击右上角的主题切换按钮在明亮/暗黑模式之间切换
4. **复制内容**：点击"复制文本内容"按钮，一键复制所有提醒文本
5. **分享**：使用分享按钮将内容分享给好友

## 🤝 贡献指南

欢迎提交 Pull Request 或创建 Issue！

1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交您的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建一个 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 详情请参阅 [LICENSE](LICENSE) 文件
---

<div align="center">
  <p>工作再忙，也要记得摸鱼！</p>
  <p>Made with ❤️ by 摸鱼办</p>
</div>