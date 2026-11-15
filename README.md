# chat-plugin-searxng-search

[![License](https://img.shields.io/badge/License-Apache%202.0--Commons%20Clause-blue)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

LobeChat 的 SearXNG 元搜索插件：通过自建 SearXNG 实例聚合多个搜索引擎的结果，作为 function-calling 工具供 AI 调用。开发规范见 [AGENTS.md](AGENTS.md)。

> **提示**：本插件功能已并入 LobeChat 主线（PR #6813），可直接使用内建搜索功能；本仓库适用于独立部署/自建 SearXNG 场景。

## 特性

- **元搜索聚合**：经 SearXNG 聚合多引擎结果，不追踪用户
- **参数可控**：搜索类别（general/news/images/science 等）、时间范围、最大结果数
- **自建友好**：Docker 多架构镜像（amd64/arm64），compose 一键起 SearXNG + 插件
- **增强镜像（实验性）**：`hezhijie0327/searxng` 额外支持药典 ChP、小红书、PubMed API、Google PSE、Brave Search API，内置高级搜索语法与 BM25 排序插件

## 快速开始

### 1. 部署 SearXNG

```bash
docker run --name searxng -p 8080:8080 -d searxng/searxng:latest
```

**必须在配置中启用 `json` 返回格式**（参考 [官方文档](https://docs.searxng.org/admin/installation-searxng.html#use-default-settings-yml)）：

```yaml
search:
  formats:
    - html
    - json
```

或直接使用 compose（SearXNG + 插件一起启动）：

```bash
docker compose up -d
```

### 2. 部署插件

```bash
docker run --name searxng_lobechat \
    -p 3000:3000 \
    -e PRODUCTION_URL="https://plugin.example.org" \
    -d hezhijie0327/lobechat:searxng
```

`PRODUCTION_URL` 必须填 LobeChat 实际访问到的插件公网地址。

### 3. 在 LobeChat 中添加插件

1. 打开 LobeChat → 插件设置 → 添加自定义插件，填入 `https://<你的地址>/manifest.json`
2. 在插件参数中配置 `SEARXNG_INSTANCE_URL`（必填）和 `SEARXNG_MAX_RESULTS`（默认 5）

![添加插件](https://github.com/user-attachments/assets/e06458ed-762c-4858-a774-2894716b2e76)
![配置参数](https://github.com/user-attachments/assets/c1624b12-bfa3-46d8-ba25-a8454a001fa4)

## 配置 / 用法

### 反向代理

与 LobeChat 同主域名时，Rewrite 以下路径即可：

```text
/searxng-search/manifest.json
/searxng-search/api/gateway
/searxng-search/api/search
```

### 本地开发

```bash
pnpm install
pnpm dev      # 0.0.0.0:3000
pnpm build
```

### 增强 SearXNG 镜像（实验性）

```bash
docker run --name searxng -p 8080:8888 -d hezhijie0327/searxng:latest
```

内置自定义插件（默认启用）：

- **高级搜索语法**：`site:github.com`、`-site:`、`"精确短语"`、`a && b`、`a || b`、`intitle:`、`inurl:`、`intext:`、`keyword*`
- **BM25 重排序**：结果与查询更相关；autocomplete 支持 custom/all 多来源排序

补丁信息见 [DockerimageBuilder](https://github.com/hezhijie0327/DockerimageBuilder) 仓库。

### 工具调用示例

![工具调用](https://github.com/user-attachments/assets/f2065c1c-1cbf-4b12-b784-53331c3ffc62)

## 文档

- [AGENTS.md](AGENTS.md) — 开发规范与实现细节（英文）

## License

[Apache License 2.0 with Commons Clause v1.0](LICENSE)
