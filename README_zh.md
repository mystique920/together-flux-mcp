# Search1API MCP 服务

[English](./README.md)

Search1API 官方 MCP 服务，一个 API 里实现搜索和爬虫。

https://github.com/user-attachments/assets/58bc98ae-3b6b-442c-a7fc-010508b5f028

更多讨论，欢迎加入官方 [discord](https://discord.com/invite/AKXYq32Bxc) 频道

## 功能特点

- 网页搜索
- 新闻搜索
- 网页内容提取
- 网站站点地图提取
- 使用 DeepSeek R1 进行深度思考和复杂问题解决
- 可以在 Claude Desktop、Cursor、Windsurf、Cline 等 MCP 客户端安装使用

## 工具

### 1. 搜索工具
- 名称：`search`
- 描述：使用 Search1API 搜索网页
- 参数：
  * `query`（必需）：用自然语言描述的搜索查询。请具体且简洁以获得更好的结果
  * `max_results`（可选，默认值：10）：返回结果的数量
  * `search_service`（可选，默认值："google"）：使用的搜索服务（google、bing、duckduckgo、yahoo、github、youtube、arxiv、wechat、bilibili、imdb、wikipedia）
  * `crawl_results`（可选，默认值：0）：需要爬取完整网页内容的结果数量
  * `include_sites`（可选）：搜索结果中要包含的网站列表
  * `exclude_sites`（可选）：搜索结果中要排除的网站列表
  * `time_range`（可选）：搜索结果的时间范围（"day"、"month"、"year"）

### 2. 新闻工具
- 名称：`news`
- 描述：使用 Search1API 搜索新闻文章
- 参数：
  * `query`（必需）：用自然语言描述的搜索查询。请具体且简洁以获得更好的结果
  * `max_results`（可选，默认值：10）：返回结果的数量
  * `search_service`（可选，默认值："bing"）：使用的搜索服务（google、bing、duckduckgo、yahoo、hackernews）
  * `crawl_results`（可选，默认值：0）：需要爬取完整网页内容的结果数量
  * `include_sites`（可选）：搜索结果中要包含的网站列表
  * `exclude_sites`（可选）：搜索结果中要排除的网站列表
  * `time_range`（可选）：搜索结果的时间范围（"day"、"month"、"year"）

### 3. 爬虫工具
- 名称：`crawl`
- 描述：使用 Search1API 提取 URL 内容
- 参数：
  * `url`（必需）：要爬取的 URL

### 4. 站点地图工具
- 名称：`sitemap`
- 描述：获取 URL 的所有相关链接
- 参数：
  * `url`（必需）：获取站点地图的 URL

### 5. 推理工具
- 名称：`reasoning`
- 描述：使用快速的 deepseek r1 模型和网络搜索能力进行深度思考和复杂问题解决（您可以在 search1api 网站上更换其他模型，但速度可能会受影响）
- 参数：
  * `content`（必需）：需要深度思考的问题或难题

### 6. 热榜工具
- 名称：`trending`
- 描述：获取流行平台的热门话题
- 参数：
  * `search_service`（必需）：指定获取热门话题的平台（github、hackernews）
  * `max_results`（可选，默认值：10）：返回的热门项目数量

## 设置指南

### 1. 获取 Search1API 密钥
1. 在 [Search1API](https://www.search1api.com/?utm_source=mcp) 注册
2. 获取您的 API 密钥和 100 个免费积分

### 2. 配置

```json
{
  "mcpServers": {
    "search1api": {
      "command": "npx",
      "args": ["-y", "search1api-mcp"],
      "env": {
        "SEARCH1API_KEY": "YOUR_SEARCH1API_KEY"
      }
    }
  }
}
```

## 版本历史

- v0.1.7：添加热榜工具，目前支持 GitHub 和 Hacker News 榜单
- v0.1.6：添加 Wikipedia 搜索服务
- v0.1.5：添加了新的搜索参数（include_sites、exclude_sites、time_range）和新的搜索服务（arxiv、wechat、bilibili、imdb）
- v0.1.4：添加了使用 deepseek r1 的推理工具，并更新了 Cursor 和 Windsurf 配置指南
- v0.1.3：添加了新闻搜索功能
- v0.1.2：添加了站点地图功能
- v0.1.1：添加了网页爬取功能
- v0.1.0：首次发布，具有搜索功能

## 许可证

本项目采用 MIT 许可证 - 查看 LICENSE 文件了解详情。