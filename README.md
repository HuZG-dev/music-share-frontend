# music-share-frontend

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) 
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
yarn
```

### Compile and Hot-Reload for Development

```sh
yarn dev
```

### Compile and Minify for Production

```sh
yarn build
```

### Lint with [ESLint](https://eslint.org/)

```sh
yarn lint
```

## 音乐搜索功能说明

### 当前实现
当前项目中的音乐搜索功能已成功接入网易云音乐官方搜索API，实现了真正的在线搜索功能：

1. **使用官方API**：项目现在使用网易云音乐官方搜索API (`https://music.163.com/api/search/get/web`) 进行搜索
2. **实时搜索**：用户输入关键词后，系统会实时调用官方API获取最新的搜索结果
3. **搜索范围**：支持搜索歌曲名、歌手名和专辑名
4. **搜索结果**：返回的搜索结果包含歌曲ID、歌曲名、歌手、专辑和封面图片等信息

### 技术实现

- **API请求**：使用Axios库发送HTTP请求，配置了正确的请求头（Referer）以确保API调用成功
- **数据格式化**：将官方API返回的数据转换为前端需要的格式
- **错误处理**：添加了完善的错误处理机制，当API调用失败时会自动降级使用模拟数据
- **用户体验**：移除了之前的模拟数据提示，用户现在可以看到真实的搜索结果

### API参数说明

当前使用的网易云音乐官方搜索API参数说明：

| 参数名 | 说明 | 可选值 |
|--------|------|--------|
| s | 搜索关键词 | 字符串 |
| type | 搜索类型 | 1 (单曲, 默认), 10 (专辑), 100 (歌手), 1000 (歌单), 1002 (用户) |
| offset | 偏移量 | 整数 (默认0) |
| limit | 限制数量 | 整数 (默认10) |
| total | 是否返回总数 | true, false (默认false) |

### 未来改进方向

1. **优化搜索算法**：添加模糊搜索、拼音搜索等高级功能
2. **增加搜索结果数量**：支持分页加载更多搜索结果
3. **优化用户体验**：添加搜索历史记录、热门搜索推荐等功能
4. **增加搜索类型**：支持搜索专辑、歌手、歌单等更多类型
5. **添加音乐预览**：支持在搜索结果中直接预览音乐
