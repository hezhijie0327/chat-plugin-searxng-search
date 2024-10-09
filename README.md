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
4. 注：需要在配置中启用 `json` 返回才能使用以下功能，可参考官方配置文件 [Use Default Settings](https://docs.searxng.org/admin/installation-searxng.html#use-default-settings-yml)
```
  formats:
    - html
    - json
```



## 安装 SearXNG Search Plugin for LobeChat

### 使用 Docker 安装

1. 拉取并启动 SearXNG Search Plugin 容器：
   ```bash
   docker run --name searxng_lobechat \
       -p 3000:3000 \
       -e PRODUCTION_URL="https://plugin.example.org" \
       -d hezhijie0327/lobechat:searxng
   ```
2. 打开 LobeChat 并添加插件
![image](https://github.com/user-attachments/assets/e06458ed-762c-4858-a774-2894716b2e76)
3. 调整插件参数
![image](https://github.com/user-attachments/assets/c1624b12-bfa3-46d8-ba25-a8454a001fa4)
4. 注：若使用反向代理且使用与 LobeChat 相同主域名时，可使用 Rewrite 路径 `/searxng-search/manifest.json`, `/searxng-search/api/gateway`, `/searxng-search/api/search`

## 工具调用截图
![image](https://github.com/user-attachments/assets/f2065c1c-1cbf-4b12-b784-53331c3ffc62)
