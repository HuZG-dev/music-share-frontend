<template>
  <header class="app-header">
    <div class="header-content">
      <!-- 左侧：Logo和导航按钮 -->
      <div class="header-left">
        <div class="logo">
          <router-link to="/">
            <img src="/logo.png" alt="拾音" class="logo-img" />
            <span class="logo-text">拾音</span>
          </router-link>
        </div>
        <nav class="main-nav">
          <router-link to="/recommend" class="nav-item">推荐</router-link>
          <router-link to="/hot" class="nav-item">热门</router-link>
          <router-link to="/categories" class="nav-item">分类</router-link>
          <router-link to="/care" class="nav-item">关注</router-link>
        </nav>
      </div>

      <!-- 中间：搜索框 -->
      <div class="search-container">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索音乐、分享..."
          class="search-input"
          @keyup.enter="handleSearch"
        >
          <template #append>
            <el-button @click="handleSearch">
              <el-icon><Search /></el-icon>
            </el-button>
          </template>
        </el-input>
      </div>

      <!-- 右侧：用户操作 -->
      <div class="header-right">
        <!-- 分享按钮 -->
        <el-dropdown trigger="hover" class="share-dropdown">
          <div class="share-container">
            <span class="share-btn">
              <el-icon size="16"><Plus /></el-icon>
            </span>
            <span class="share-text">分享</span>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="goToCreateShare">
                <el-icon><Edit /></el-icon>
                发布分享
              </el-dropdown-item>
              <el-dropdown-item @click="goToShareManagement">
                <el-icon><FolderOpened /></el-icon>
                分享管理
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <!-- 用户菜单 -->
        <div v-if="isLoggedIn" class="user-menu">
          <el-dropdown>
            <span class="user-avatar">
              <el-avatar :size="32" :src="userAvatar" />
              <span class="user-name">{{ userNickname }}</span>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="goToProfile">
                  <el-icon><User /></el-icon>
                  个人中心
                </el-dropdown-item>
                <el-dropdown-item @click="goToSettings">
                  <el-icon><Setting /></el-icon>
                  账户设置
                </el-dropdown-item>
                <el-dropdown-item divided @click="handleLogout">
                  <el-icon><SwitchButton /></el-icon>
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <div v-else class="auth-links">
          <router-link to="/login" class="auth-link">登录</router-link>
          <router-link to="/register" class="auth-link">注册</router-link>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElDropdown, ElDropdownMenu, ElDropdownItem, ElAvatar, ElInput, ElButton } from 'element-plus'
import { Search, Plus, Edit, FolderOpened, User, Setting, SwitchButton } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'

const router = useRouter()
const userStore = useUserStore()
const { isLoggedIn, userInfo } = storeToRefs(userStore)

const userNickname = ref('')
const userAvatar = ref('')
const searchKeyword = ref('')

// 更新用户信息显示
const updateUserInfo = () => {
  if (isLoggedIn.value && userInfo.value) {
    userNickname.value = userInfo.value.nickname || userInfo.value.phone || '用户'
    userAvatar.value = userInfo.value.avatar || ''
  } else {
    userNickname.value = ''
    userAvatar.value = ''
  }
}

// 检查登录状态
const checkLoginStatus = () => {
  updateUserInfo()
}

// 搜索处理
const handleSearch = () => {
  if (!searchKeyword.value.trim()) {
    ElMessage.warning('请输入搜索关键词')
    return
  }
  
  // 跳转到搜索结果页面
  router.push({
    path: '/search',
    query: {
      keyword: searchKeyword.value.trim()
    }
  })
  searchKeyword.value = ''
}

// 跳转到发布分享
const goToCreateShare = () => {
  if (!isLoggedIn.value) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }
  // ElMessage.info('发布分享功能开发中')
  router.push('/create-share')
}

// 跳转到分享管理
const goToShareManagement = () => {
  if (!isLoggedIn.value) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }
  // ElMessage.info('分享管理功能开发中')
  router.push('/manage-share')
}

// 跳转到个人中心
const goToProfile = () => {
  router.push('/user')
}

// 跳转到设置
const goToSettings = () => {
  // ElMessage.info('账户设置功能开发中')
  router.push('/user/settings')
}

// 退出登录
const handleLogout = () => {
  userStore.logout()
  ElMessage.success('已退出登录')
  router.push('/login')
}

// 监听路由变化，更新登录状态
watch(() => router.currentRoute.value, () => {
  checkLoginStatus()
})

// 监听用户状态变化
watch(isLoggedIn, () => {
  checkLoginStatus()
})

// 监听存储变化（跨标签页同步）
const handleStorageChange = (event) => {
  if (event.key === 'token' || event.key === 'userInfo') {
    checkLoginStatus()
  }
}

// 自定义事件监听（同标签页内）
const handleCustomStorageChange = () => {
  checkLoginStatus()
}

onMounted(() => {
  checkLoginStatus()
  window.addEventListener('storage', handleStorageChange)
  window.addEventListener('loginStatusChange', handleCustomStorageChange)
})

onUnmounted(() => {
  window.removeEventListener('storage', handleStorageChange)
  window.removeEventListener('loginStatusChange', handleCustomStorageChange)
})
</script>

<style scoped>
.app-header {
  background-color: #fffaf7;
  color: #333;
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  gap: 20px;
}

/* 左侧区域 */
.header-left {
  display: flex;
  align-items: center;
  gap: 40px;
}

.logo-img {
  height: 36px;
  width: auto;
}

.logo-text {
  font-size: 20px;
  font-weight: 600;
  color: #e07c5c;
  margin-left: 8px;
}

.logo a {
  text-decoration: none;
  display: flex;
  align-items: center;
}

/* 主导航 */
.main-nav {
  display: flex;
  align-items: center;
  gap: 30px;
}

.nav-item {
  color: #333;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.3s;
  font-size: 16px;
  font-weight: 500;
}

.nav-item:hover {
  background-color: rgba(0,0,0,0.05);
  color: #e07c5c;
}

.nav-item.router-link-active {
  background-color: #e07c5c;
  color: white;
}

/* 搜索框 */
.search-container {
  flex: 1;
  max-width: 400px;
}

.search-input {
  width: 100%;
}

.search-input :deep(.el-input-group__append) {
  background-color: #e07c5c;
  border-color: #e07c5c;
}

.search-input :deep(.el-input-group__append .el-button) {
  color: white;
}

.search-input :deep(.el-input-group__append .el-button:hover) {
  background-color: #d06a4a;
}

/* 右侧区域 */
.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

/* 分享按钮 */
.share-dropdown {
  display: flex;
  align-items: center;
}

.share-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: background-color 0.3s;
  gap: 2px;
}

.share-container:hover {
  background-color: rgba(0,0,0,0.05);
}

.share-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: #e07c5c;
  color: white;
  transition: all 0.3s ease;
}

.share-btn:hover {
  background-color: #d06a4a;
  transform: scale(1.05);
}

.share-text {
  font-size: 12px;
  color: #333;
  line-height: 1;
}

/* 用户菜单 */
.user-menu {
  display: flex;
  align-items: center;
}

.user-avatar {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 20px;
  transition: background-color 0.3s;
  gap: 8px;
}

.user-avatar:hover {
  background-color: rgba(0,0,0,0.05);
}

.user-name {
  font-size: 14px;
  color: #333;
}

/* 登录注册链接 */
.auth-links {
  display: flex;
  gap: 15px;
}

.auth-link {
  color: #333;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 6px;
  transition: background-color 0.3s;
  font-size: 14px;
}

.auth-link:hover {
  background-color: rgba(0,0,0,0.05);
}

.auth-link:first-child {
  background-color: #e07c5c;
  color: white;
}

.auth-link:first-child:hover {
  background-color: #d06a4a;
}

/* 下拉菜单项样式 */
:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-content {
    flex-wrap: wrap;
    height: auto;
    padding: 10px 0;
    gap: 10px;
  }
  
  .header-left {
    gap: 20px;
  }
  
  .main-nav {
    gap: 15px;
  }
  
  .nav-item {
    padding: 6px 12px;
    font-size: 14px;
  }
  
  .search-container {
    order: 3;
    flex: 1 0 100%;
    max-width: none;
  }
  
  .header-right {
    gap: 15px;
  }
  
  .share-btn {
    width: 24px;
    height: 24px;
  }
  
  .share-text {
    font-size: 11px;
  }
  
  .user-name {
    display: none;
  }
}
</style>