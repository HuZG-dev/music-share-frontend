<template>
  <header class="app-header">
    <div class="header-content">
      <div class="logo">
        <router-link to="/">
          <h2>🎵 音乐分享</h2>
        </router-link>
      </div>
      
      <!-- 搜索框 - 居中位置 -->
      <div class="search-container">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索音乐、用户..."
          class="search-input"
          @keyup.enter="handleSearch"
        >
          <template #append>
            <el-button @click="handleSearch" :icon="Search" />
          </template>
        </el-input>
      </div>
      
      <nav class="nav">
        <!-- 根据登录状态显示不同内容 -->
        <div v-if="isLoggedIn" class="user-actions">
          <!-- 分享按钮 -->
          <el-dropdown trigger="hover" class="share-dropdown">
            <span class="share-btn">
              <el-icon size="20"><Plus /></el-icon>
            </span>
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
          <el-dropdown class="user-menu">
            <span class="user-avatar">
              <el-avatar :size="32" :src="userAvatar" />
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="goToProfile">个人中心</el-dropdown-item>
                <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <div v-else class="auth-links">
          <router-link to="/login">登录</router-link>
          <router-link to="/register">注册</router-link>
        </div>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElDropdown, ElDropdownMenu, ElDropdownItem, ElAvatar, ElInput, ElButton } from 'element-plus'
import { Search, Plus, Edit, FolderOpened } from '@element-plus/icons-vue'

const router = useRouter()

const isLoggedIn = ref(false)
const userNickname = ref('')
const userAvatar = ref('')
const searchKeyword = ref('')

// 检查登录状态
const checkLoginStatus = () => {
  const token = localStorage.getItem('token')
  const userInfo = localStorage.getItem('userInfo')
  
  isLoggedIn.value = !!token
  
  if (userInfo) {
    try {
      const user = JSON.parse(userInfo)
      userNickname.value = user.nickname || '用户'
      userAvatar.value = user.avatar || ''
    } catch (e) {
      console.error('解析用户信息失败:', e)
    }
  }
}

// 搜索处理
const handleSearch = () => {
  if (!searchKeyword.value.trim()) {
    ElMessage.warning('请输入搜索关键词')
    return
  }
  
  // 跳转到搜索结果页面，传递搜索关键词
  router.push({
    path: '/search',
    query: {
      keyword: searchKeyword.value.trim()
    }
  })
  
  // 清空搜索框
  searchKeyword.value = ''
}

// 跳转到发布分享
const goToCreateShare = () => {
  router.push('/share/create')
}

// 跳转到分享管理
const goToShareManagement = () => {
  router.push('/share/management')
}

// 跳转到个人中心
const goToProfile = () => {
  // 这里可以跳转到个人中心页面
  ElMessage.info('个人中心功能开发中...')
}

// 退出登录
const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('userInfo')
  isLoggedIn.value = false
  userNickname.value = ''
  userAvatar.value = ''
  ElMessage.success('已退出登录')
  router.push('/login')
}

// 监听存储变化（用于响应登录状态变化）
const handleStorageChange = () => {
  checkLoginStatus()
}

onMounted(() => {
  checkLoginStatus()
  // 监听 localStorage 变化
  window.addEventListener('storage', handleStorageChange)
})

onUnmounted(() => {
  window.removeEventListener('storage', handleStorageChange)
})
</script>

<style scoped>
.app-header {
  background-color: #2c3e50;
  color: white;
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  gap: 20px;
}

.logo h2 {
  color: #42b983;
  margin: 0;
}

.logo a {
  text-decoration: none;
}

/* 搜索框容器 - 居中布局 */
.search-container {
  flex: 1;
  max-width: 400px;
  margin: 0 20px;
}

.search-input {
  width: 100%;
}

/* 调整搜索框样式 */
.search-input :deep(.el-input-group__append) {
  background-color: #42b983;
  border-color: #42b983;
}

.search-input :deep(.el-input-group__append .el-button) {
  color: white;
}

.search-input :deep(.el-input-group__append .el-button:hover) {
  background-color: #3aa876;
}

.nav {
  display: flex;
  align-items: center;
  gap: 20px;
}

.nav a {
  color: white;
  text-decoration: none;
  padding: 5px 10px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.nav a:hover {
  background-color: rgba(255,255,255,0.1);
}

.nav a.router-link-active {
  background-color: #42b983;
}

/* 用户操作区域 */
.user-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* 分享按钮样式 */
.share-dropdown {
  display: flex;
  align-items: center;
}

.share-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #42b983;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.share-btn:hover {
  background-color: #3aa876;
  transform: scale(1.05);
}

/* 用户菜单样式 */
.user-menu {
  display: flex;
  align-items: center;
}

.user-avatar {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  transition: background-color 0.3s;
}

.user-avatar:hover {
  background-color: rgba(255,255,255,0.1);
}

/* 下拉菜单项样式 */
:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 8px;
}

.auth-links {
  display: flex;
  gap: 10px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-content {
    flex-wrap: wrap;
    height: auto;
    padding: 10px 0;
  }
  
  .search-container {
    order: 3;
    flex: 1 0 100%;
    margin: 10px 0 0 0;
    max-width: none;
  }
  
  .logo {
    flex: 1;
  }
  
  .nav {
    flex: 0;
  }
  
  .user-actions {
    gap: 8px;
  }
  
  .share-btn {
    width: 32px;
    height: 32px;
  }
}
</style>