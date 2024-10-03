# SearXNG Search Plugin for LobeChat 使用指南

## 安装 SearXNG

### 使用 Docker 安装

1. 确保已经安装了 Docker。
2. 拉取并启动 SearXNG 容器：
   ```bash
   docker run --name searxng \
       -p 8080:8080 \
       -d searxng/searxng:latest
   ```
3. 打开浏览器并访问 `http://localhost:8080`，即可使用 SearXNG 搜索。

## 安装 SearXNG Search Plugin for LobeChat

### 使用 Docker 安装

1. 拉取并启动 SearXNG Search Plugin 容器：
   ```bash
   docker run --name searxng_lobechat \
       -p 3000:3000 \
       -e PRODUCTION_URL="https://plugin-searxng.example.org" \
       -d hezhijie0327/lobechat:searxng
   ```
2. 打开 LobeChat 并添加插件
![image](https://github.com/user-attachments/assets/e06458ed-762c-4858-a774-2894716b2e76)
