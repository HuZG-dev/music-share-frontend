<template>
  <div class="login-container">
    <div class="login-form">
      <!-- 已登录状态 -->
      <div v-if="isLoggedIn" class="logged-in-status">
        <div class="welcome-section">
          <div class="welcome-icon">🎉</div>
          <h2 class="welcome-title">欢迎回来！</h2>
          <p class="welcome-subtitle">您已成功登录拾音</p>
        </div>

        <div class="user-card">
          <div class="user-avatar-wrapper">
            <el-avatar :size="80" :src="userInfo.avatar" class="user-avatar">
              <span v-if="!userInfo.avatar" class="avatar-text">
                {{ userInfo.nickname?.charAt(0) || '用' }}
              </span>
            </el-avatar>
          </div>
          <div class="user-info-content">
            <h3 class="user-name">{{ userInfo.nickname }}</h3>
            <p class="user-phone">
              <el-icon><Iphone /></el-icon>
              {{ userInfo.phone }}
            </p>
          </div>
        </div>

        <div class="action-section">
          <button class="custom-btn primary-btn" @click="goToHome">
            进入首页
          </button>
          <button class="custom-btn secondary-btn" @click="handleLogout">
            退出登录
          </button>
        </div>
      </div>

      <!-- 未登录状态 - 登录表单 -->
      <div v-else>
        <h2 class="form-title">登录拾音</h2>
        <el-form :model="form" :rules="rules" ref="formRef">
          <el-form-item prop="phone">
            <el-input
              v-model="form.phone"
              placeholder="请输入手机号"
              size="large"
              :prefix-icon="Iphone"
            />
          </el-form-item>
          
          <el-form-item prop="password">
            <el-input
              v-model="form.password"
              type="password"
              placeholder="请输入密码"
              size="large"
              :prefix-icon="Lock"
              show-password
            />
          </el-form-item>

          <el-form-item>
            <el-button 
              type="primary" 
              size="large" 
              @click="handleLogin"
              :loading="loading"
              class="login-btn"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>

        <div class="login-links">
          <router-link to="/register">还没有账号？立即注册</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Iphone, Lock } from '@element-plus/icons-vue'
// import { userLogin } from '@/api/user'
import { authLogin } from '@/api/auth'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'

const router = useRouter()
const formRef = ref()
const loading = ref(false)
const userStore = useUserStore()
const { isLoggedIn, userInfo } = storeToRefs(userStore)

const form = reactive({
  phone: '',
  password: ''
})

const rules = {
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少6位', trigger: 'blur' }
  ]
}

// 检查登录状态
const checkLoginStatus = () => {
  // 状态由store管理，无需手动检查
}

// 登录处理
const handleLogin = async () => {
  try {
    await formRef.value.validate()
    loading.value = true
    
    const response = await authLogin(form)
    console.log('登录响应:', response)
    
    if (response.code === 200) {
      const token = response.data?.token || ''
      const userData = response.data?.userInfo || response.data || {}

      if (!token) {
        ElMessage.error('登录响应缺少令牌，请联系管理员')
        return
      }
      
      // 保存到 store
      userStore.login({
        id: userData.id,
        nickname: userData.nickname || userData.username || '用户',
        phone: userData.phone || form.phone,
        avatar: userData.avatar || ''
      }, token)
      
      ElMessage.success('登录成功！')
      
      // 跳转到首页
      router.push('/')
      
    } else {
      ElMessage.error(response.message || '登录失败')
    }
    
  } catch (error) {
    console.error('登录失败:', error)
    if (error.response) {
      ElMessage.error(error.response.data?.message || '登录失败')
    } else if (error.message) {
      ElMessage.error(error.message)
    } else {
      ElMessage.error('网络错误，请稍后重试')
    }
  } finally {
    loading.value = false
  }
}

// 退出登录
const handleLogout = () => {
  userStore.logout()
  ElMessage.success('已退出登录')
  
  // 刷新页面以重置状态
  window.location.reload()
}

// 跳转到首页
const goToHome = () => {
  router.push('/')
}

// 监听存储变化
const handleStorageChange = () => {
  // 状态由store管理，无需手动处理
}

onMounted(() => {
  // 状态由store管理，无需手动检查
  window.addEventListener('storage', handleStorageChange)
})

onUnmounted(() => {
  window.removeEventListener('storage', handleStorageChange)
})
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-form {
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 420px;
}

/* 已登录状态样式 */
.logged-in-status {
  text-align: center;
}

.welcome-section {
  margin-bottom: 30px;
}

.welcome-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.welcome-title {
  font-size: 24px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 8px 0;
}

.welcome-subtitle {
  color: #7f8c8d;
  font-size: 14px;
  margin: 0;
}

.user-card {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  padding: 24px;
  margin: 24px 0;
  border: 1px solid #e9ecef;
}

.user-avatar-wrapper {
  margin-bottom: 16px;
}

.user-avatar {
  border: 4px solid white;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.avatar-text {
  font-size: 24px;
  font-weight: 600;
}

.user-info-content {
  text-align: center;
}

.user-name {
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 8px 0;
}

.user-phone {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: #7f8c8d;
  font-size: 14px;
  margin: 0;
}

.action-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.custom-btn {
  width: 100%;
  height: 44px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.primary-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.primary-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.secondary-btn {
  background: transparent;
  color: #667eea;
  border: 1px solid #667eea;
}

.secondary-btn:hover {
  background: #f8f9fa;
  transform: translateY(-1px);
}

/* 未登录状态样式 */
.form-title {
  text-align: center;
  margin-bottom: 30px;
  color: #2c3e50;
  font-size: 24px;
  font-weight: 600;
}

.login-btn {
  width: 100%;
  height: 44px;
  border-radius: 8px;
  font-weight: 500;
}

.login-links {
  text-align: center;
  margin-top: 20px;
}

.login-links a {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
}

.login-links a:hover {
  text-decoration: underline;
}
</style>