<template>
  <header class="app-header">
    <div class="header-content">
      <div class="logo">
        <router-link to="/">
          <h2>🎵 音乐分享</h2>
        </router-link>
      </div>
      <nav class="nav">
        <router-link to="/">首页</router-link>
        
        <!-- 根据登录状态显示不同内容 -->
        <div v-if="isLoggedIn" class="user-menu">
          <el-dropdown>
            <span class="user-avatar">
              <el-avatar :size="32" :src="userAvatar" />
              <span class="user-name">{{ userNickname }}</span>
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
import { ElMessage, ElDropdown, ElDropdownMenu, ElDropdownItem, ElAvatar } from 'element-plus'

const router = useRouter()

const isLoggedIn = ref(false)
const userNickname = ref('')
const userAvatar = ref('')

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
}

.logo h2 {
  color: #42b983;
  margin: 0;
}

.logo a {
  text-decoration: none;
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

.user-menu {
  display: flex;
  align-items: center;
}

.user-avatar {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.user-avatar:hover {
  background-color: rgba(255,255,255,0.1);
}

.user-name {
  color: white;
  font-size: 14px;
}

.auth-links {
  display: flex;
  gap: 10px;
}
</style>