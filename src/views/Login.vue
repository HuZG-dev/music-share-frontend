<template>
  <div class="login-container">
    <div class="login-form">
      <h2>登录音乐分享平台</h2>
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
            style="width: 100%"
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
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Iphone, Lock } from '@element-plus/icons-vue'
import { userLogin } from '@/api/user'

const router = useRouter()
const formRef = ref()
const loading = ref(false)

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

const handleLogin = async () => {
  try {
    await formRef.value.validate()
    loading.value = true
    
    const response = await userLogin(form)
    
    // 保存token
    localStorage.setItem('token', response.message)
    
    // 模拟用户信息（实际应该从接口获取）
    const userInfo = {
      nickname: form.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'), // 手机号脱敏
      phone: form.phone,
      avatar: '' // 可以设置默认头像
    }
    localStorage.setItem('userInfo', JSON.stringify(userInfo))
    
    ElMessage.success('登录成功！')
    
    // 刷新页面以更新导航栏状态
    window.location.reload()
    
  } catch (error) {
    console.error('登录失败:', error)
    if (error.response) {
      ElMessage.error(error.response.data.message || '登录失败')
    } else {
      ElMessage.error('网络错误，请稍后重试')
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-form {
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  width: 400px;
}

.login-form h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.login-links {
  text-align: center;
  margin-top: 20px;
}

.login-links a {
  color: #667eea;
  text-decoration: none;
}

.login-links a:hover {
  text-decoration: underline;
}
</style>