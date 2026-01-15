# Music Share

一个基于 Vue 3 和 Spring Boot 的音乐分享平台，用户可以分享音乐、发现新歌、关注好友，并享受在线音乐播放体验。

## 项目简介

Music Share 是一个现代化的音乐社交平台，集成了网易云音乐 API，允许用户：
- 分享自己喜欢的音乐
- 发现和搜索歌曲
- 关注其他用户
- 点赞和评论分享
- 在线播放音乐
- 查看热门推荐和分类音乐

## 技术栈

### 前端
- **框架**: Vue 3.5.22
- **构建工具**: Vite 7.1.7
- **UI 组件库**: Element Plus 2.11.4
- **状态管理**: Pinia 3.0.4
- **路由**: Vue Router 4.5.1
- **HTTP 客户端**: Axios 1.13.2
- **代码规范**: ESLint + Prettier

### 后端
- **框架**: Spring Boot 3.2.0
- **数据库**: MySQL 8.0
- **ORM**: Spring Data JPA
- **安全**: Spring Security + JWT
- **数据库连接池**: HikariCP
- **构建工具**: Maven

### 第三方服务
- **网易云音乐 API**: NeteaseCloudMusicApi

## 功能特性

### 用户功能
- 用户注册和登录（JWT 认证）
- 个人资料管理
- 关注/取消关注用户
- 查看用户主页和分享历史

### 音乐分享
- 创建音乐分享（支持搜索和选择歌曲）
- 管理个人分享
- 查看分享详情
- 批量导入分享数据

### 社交互动
- 点赞分享
- 评论分享
- 查看关注列表

### 音乐发现
- 搜索歌曲、分享和用户
- 查看热门推荐
- 浏览分类音乐
- 在线播放音乐

### 其他功能
- 轮播图展示
- 响应式设计
- 播放器控制（播放/暂停、进度条拖动）

## 项目结构

```
MusicShare/
├── music-share-frontend/          # 前端项目
│   ├── public/                    # 静态资源
│   ├── src/
│   │   ├── api/                  # API 接口
│   │   ├── assets/               # 资源文件
│   │   ├── components/           # 组件
│   │   ├── router/               # 路由配置
│   │   ├── stores/               # 状态管理
│   │   ├── views/                # 页面组件
│   │   ├── App.vue               # 根组件
│   │   └── main.js               # 入口文件
│   ├── package.json
│   └── vite.config.js
├── music-share-backend/          # 后端项目
│   ├── NeteaseCloudMusicApi/     # 网易云音乐 API
│   ├── src/main/java/com/fangyuan/musicsharebackend/
│   │   ├── config/              # 配置类
│   │   ├── controller/          # 控制器
│   │   ├── dto/                 # 数据传输对象
│   │   ├── entity/              # 实体类
│   │   ├── exception/           # 异常处理
│   │   ├── filter/              # 过滤器
│   │   ├── repository/          # 数据访问层
│   │   ├── service/             # 业务逻辑层
│   │   └── util/                # 工具类
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
└── README.md
```

## 环境要求

### 前端
- Node.js ^20.19.0 || >=22.12.0
- npm 或 yarn

### 后端
- JDK 17
- Maven 3.6+
- MySQL 8.0+

## 安装和运行

### 1. 克隆项目

```bash
git clone <repository-url>
cd MusicShare
```

### 2. 配置数据库

创建 MySQL 数据库：

```sql
CREATE DATABASE music_share CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. 配置后端

编辑 `music-share-backend/src/main/resources/application.properties`：

```properties
# 数据库配置
spring.datasource.url=jdbc:mysql://localhost:3306/music_share?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC&charset=utf8mb4&useUnicode=true
spring.datasource.username=root
spring.datasource.password=your_password

# JWT 配置
jwt.secret=your_jwt_secret_key_change_this_in_production
jwt.expiration=2592000000
```

### 4. 启动后端

```bash
cd music-share-backend
./mvnw spring-boot:run
```

后端服务将在 `http://localhost:8080` 启动

### 5. 启动网易云音乐 API

```bash
cd music-share-backend/NeteaseCloudMusicApi
npm install
node app.js
```

网易云音乐 API 将在 `http://localhost:3000` 启动

### 6. 启动前端

```bash
cd music-share-frontend
npm install
npm run dev
```

前端服务将在 `http://localhost:5173` 启动

## API 接口

### 后端 API

- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/shares` - 获取分享列表
- `POST /api/shares` - 创建分享
- `GET /api/shares/{id}` - 获取分享详情
- `POST /api/shares/{id}/like` - 点赞分享
- `POST /api/shares/{id}/comments` - 评论分享
- `GET /api/users/{id}` - 获取用户信息
- `POST /api/follow/{userId}` - 关注用户

### 网易云音乐 API

- `GET /search?keywords={keyword}` - 搜索歌曲
- `GET /song/url?id={id}` - 获取歌曲播放 URL
- `GET /song/detail?ids={ids}` - 获取歌曲详情

## 开发指南

### 前端开发

```bash
cd music-share-frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 代码检查
npm run lint

# 代码格式化
npm run format
```

### 后端开发

```bash
cd music-share-backend

# 编译项目
./mvnw clean compile

# 运行测试
./mvnw test

# 打包项目
./mvnw clean package
```

## 配置说明

### 前端配置

前端 API 配置位于 `src/api/request.js`，根据需要修改后端 API 基础 URL。

### 后端配置

主要配置项在 `application.properties`：

- **数据库配置**: 数据库连接、用户名、密码
- **JPA 配置**: 数据库方言、DDL 策略、SQL 日志
- **JWT 配置**: 密钥、过期时间
- **日志配置**: 日志级别

## 常见问题

### 1. 数据库连接失败

检查 MySQL 服务是否启动，数据库配置是否正确。

### 2. 前端无法连接后端

确保后端服务已启动，检查 CORS 配置。

### 3. 音乐无法播放

确保网易云音乐 API 服务已启动，检查 API 地址配置。

## 贡献指南

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License

## 联系方式

如有问题，请提交 Issue 或联系项目维护者。
