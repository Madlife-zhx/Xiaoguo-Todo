# 晓果代办

一个使用 Electron、React 与 TypeScript 开发的离线 Windows 待办事项应用。浅蓝与浅绿为主的清爽风格，任务数据保存在当前 Windows 用户的数据目录中，关闭应用后不会丢失。

![应用截图](docs/screenshot.png)

## 功能特性

- 创建、编辑、删除任务，支持标题、描述、优先级、预计完成日期
- 自动标记已逾期任务
- 未完成任务与已完成任务分开显示
- 实时搜索标题或描述
- 按预计完成日期或优先级排序
- 任务数据原子写入，损坏可自动从备份恢复
- 单实例桌面程序，同时只能运行一个
- 快捷键：`Ctrl + N` 新建任务，`Ctrl + F` 聚焦搜索

## 直接使用（推荐）

下载 [release/晓果代办-Portable-1.0.0-x64.exe](release/晓果代办-Portable-1.0.0-x64.exe)，双击即可运行，无需安装。

首次运行时如果 Windows SmartScreen 弹出「未知发布者」提示：

1. 点击「更多信息」
2. 选择「仍要运行」

这是因为 exe 没有商业代码签名证书，未签名应用的正常行为。

## 数据存储位置

任务数据保存在 Windows 用户目录下：

```text
C:\Users\<用户名>\AppData\Roaming\晓果代办\tasks.json
```

卸载或移动程序不会删除任务数据。

## 从源码运行

需要 Node.js 24+。

```powershell
# 安装依赖
npm install

# 开发模式（热更新）
npm run dev

# 代码检查与单元测试
npm run typecheck
npm test

# 打包 Windows 应用
npm run dist
```

构建产物在 `release/` 目录中。

> 由于依赖安装与 exe 打包需要从 Electron 官方 GitHub Releases 下载运行时，国内网络可能需要重试或配置镜像。

## 项目结构

```text
src/
├── main/         Electron 主进程
├── preload/      安全的渲染进程桥接
├── renderer/     React 渲染层
└── shared/       主进程与渲染进程共享的类型与工具
```

## 技术栈

- Electron 39
- React 19
- TypeScript
- electron-vite
- electron-builder
- Vitest

## 许可

MIT