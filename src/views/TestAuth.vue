<template>
  <div class="test-container">
    <h1>前端认证测试</h1>
    
    <div class="test-section">
      <h2>1. 检查登录状态</h2>
      <div class="test-result">
        <span>是否登录:</span>
        <span :class="isLoggedIn ? 'status-ok' : 'status-error'">
          {{ isLoggedIn ? '是' : '否' }}
        </span>
      </div>
      <div class="test-result">
        <span>用户名:</span>
        <span>{{ userInfo.nickname || '未登录' }}</span>
      </div>
      <div class="test-result">
        <span>手机号:</span>
        <span>{{ userInfo.phone || '未登录' }}</span>
      </div>
    </div>
    
    <div class="test-section">
      <h2>2. Token信息</h2>
      <div class="test-result">
        <span>Token是否存在:</span>
        <span :class="!!token ? 'status-ok' : 'status-error'">
          {{ !!token ? '是' : '否' }}
        </span>
      </div>
      <div v-if="token" class="token-info">
        <pre>{{ token }}</pre>
      </div>
    </div>
    
    <div class="test-section">
      <h2>3. 发送测试请求</h2>
      <el-button type="primary" @click="testAuthRequest" :loading="loading">
        测试认证请求
      </el-button>
      <div v-if="testResult" class="test-result-area">
        <pre>{{ JSON.stringify(testResult, null, 2) }}</pre>
      </div>
    </div>
    
    <div class="test-section">
      <h2>4. 测试分享创建</h2>
      <el-button type="success" @click="testShareCreation" :loading="shareLoading">
        测试分享创建
      </el-button>
      <div v-if="shareResult" class="test-result-area">
        <pre>{{ JSON.stringify(shareResult, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { createShare } from '@/api/index.js'
import request from '@/api/request.js'

const userStore = useUserStore()
const token = computed(() => userStore.token)
const userInfo = computed(() => userStore.userInfo)
const isLoggedIn = computed(() => userStore.isLoggedIn)

const loading = ref(false)
const shareLoading = ref(false)
const testResult = ref(null)
const shareResult = ref(null)

// 测试认证请求
const testAuthRequest = async () => {
  loading.value = true
  try {
    const response = await request.get('/auth/check-status')
    testResult.value = response
    ElMessage.success('认证请求成功')
  } catch (error) {
    testResult.value = {
      error: error.message,
      response: error.response ? {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      } : null
    }
    ElMessage.error('认证请求失败')
  } finally {
    loading.value = false
  }
}

// 测试分享创建
const testShareCreation = async () => {
  shareLoading.value = true
  try {
    const shareData = {
      musicId: 'test123',
      musicTitle: '测试音乐',
      musicArtist: '测试歌手',
      musicAlbum: '测试专辑',
      musicCover: 'https://example.com/cover.jpg',
      content: '测试分享内容',
      tags: '测试,音乐',
      privacy: false
    }
    
    const response = await createShare(shareData)
    shareResult.value = response
    ElMessage.success('分享创建成功')
  } catch (error) {
    shareResult.value = {
      error: error.message,
      response: error.response ? {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      } : null
    }
    ElMessage.error('分享创建失败')
  } finally {
    shareLoading.value = false
  }
}
</script>

<style scoped>
.test-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.test-section {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
}

h1 {
  text-align: center;
  color: #333;
}

h2 {
  color: #666;
  margin-top: 0;
}

.test-result {
  display: flex;
  margin-bottom: 10px;
}

.test-result span:first-child {
  width: 150px;
  font-weight: bold;
}

.status-ok {
  color: green;
}

.status-error {
  color: red;
}

.token-info {
  margin-top: 10px;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 4px;
  overflow-x: auto;
}

.token-info pre {
  margin: 0;
  font-family: monospace;
  font-size: 12px;
}

.test-result-area {
  margin-top: 20px;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 4px;
  overflow-x: auto;
  max-height: 300px;
}

.test-result-area pre {
  margin: 0;
  font-family: monospace;
}
</style>