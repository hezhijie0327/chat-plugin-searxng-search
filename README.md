> 📝 **提示**  
> 本项目中所有功能已在 `LobeChat PR #6813` 提交，~~待合并~~ 已并入主线，可直接使用内建搜索功能

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
5. **实验性**
   ```bash
   docker run --name searxng \
       -p 8080:8888 \
       -d hezhijie0327/searxng:latest
   ```
   ```
   # 镜像中支持其他未并入主线的搜索引擎，如
    - ChP (药典)
    - XiaoHongShu (小红书)
    - PubMed（支持 API Key，释放 Rate Limited）
    - 最新 Patch 信息可在 DockerimageBuilder 库中查看

   # 自定义插件（默认启用）
   plugins:
     # 高级搜索结果过滤语法（`site:github.com` `-site:github.com` `"search phrase"` `keyword1 OR keyword2` `-unwanted` `-"unwanted phrase"` `intitle:keyword` `inurl:keyword` `intext:keyword`）
     searx.plugins.advanced_search_syntax.SXNGPlugin:
       active: true
     # BM25 结果排序优化（搜索结果将更与所查询的内容匹配）
     searx.plugins.bm25_rerank.SXNGPlugin:
       active: true

   # BM25 对 Autocomplete 结果排序，并支持多选来源
   search:
     autocomplete: "custom" # 新增 custom, all；当为 custom 时，autocomplete_engines 可用
     autocomplete_engines:
       - baidu
       - duckduckgo
       - google
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
