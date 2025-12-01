<template>
  <div class="profile-container">
    <!-- 头部背景 -->
    <div class="profile-header">
      <div class="header-bg"></div>
      <div class="user-info">
        <div class="avatar-section">
          <div class="avatar" @click="editAvatar">
            <img :src="userInfo.avatar || defaultAvatar" alt="头像">
            <div class="avatar-edit">
              <i class="el-icon-camera"></i>
            </div>
          </div>
          <h2 class="username">{{ userInfo.nickname }}</h2>
          <p class="phone">{{ userInfo.phone }}</p>
        </div>
      </div>
    </div>

    <!-- 主要内容 -->
    <div class="profile-content">
      <!-- 统计信息 -->
      <div class="stats-section">
        <el-row :gutter="20">
          <el-col :xs="12" :sm="6">
            <div class="stat-item">
              <div class="stat-number">128</div>
              <div class="stat-label">我的收藏</div>
            </div>
          </el-col>
          <el-col :xs="12" :sm="6">
            <div class="stat-item">
              <div class="stat-number">64</div>
              <div class="stat-label">我的分享</div>
            </div>
          </el-col>
          <el-col :xs="12" :sm="6">
            <div class="stat-item">
              <div class="stat-number">1,024</div>
              <div class="stat-label">获赞数</div>
            </div>
          </el-col>
          <el-col :xs="12" :sm="6">
            <div class="stat-item">
              <div class="stat-number">28</div>
              <div class="stat-label">关注</div>
            </div>
          </el-col>
        </el-row>
      </div>

      <!-- 功能菜单 -->
      <div class="menu-section">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span>账户设置</span>
            </div>
          </template>

          <el-menu>
            <el-menu-item @click="showEditDialog">
              <i class="el-icon-user"></i>
              <span>编辑资料</span>
            </el-menu-item>
            <el-menu-item @click="showSecurityDialog">
              <i class="el-icon-lock"></i>
              <span>安全设置</span>
            </el-menu-item>
            <el-menu-item @click="showPrivacyDialog">
              <i class="el-icon-view"></i>
              <span>隐私设置</span>
            </el-menu-item>
            <el-menu-item @click="showAboutDialog">
              <i class="el-icon-info"></i>
              <span>关于我们</span>
            </el-menu-item>
          </el-menu>
        </el-card>
      </div>

      <!-- 快速操作 -->
      <div class="action-section">
        <el-row :gutter="20">
          <el-col :xs="12" :sm="8">
            <el-card class="action-card" shadow="hover" @click="goToMyFavorites">
              <div class="action-content">
                <i class="el-icon-star-off"></i>
                <div class="action-text">我的收藏</div>
              </div>
            </el-card>
          </el-col>
          <el-col :xs="12" :sm="8">
            <el-card class="action-card" shadow="hover" @click="goToMyShares">
              <div class="action-content">
                <i class="el-icon-share"></i>
                <div class="action-text">我的分享</div>
              </div>
            </el-card>
          </el-col>
          <el-col :xs="12" :sm="8">
            <el-card class="action-card" shadow="hover" @click="goToHistory">
              <div class="action-content">
                <i class="el-icon-time"></i>
                <div class="action-text">播放历史</div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>

    <!-- 编辑资料对话框 -->
    <el-dialog
      v-model="editDialogVisible"
      title="编辑资料"
      width="500px"
      :before-close="handleCloseEditDialog"
    >
      <el-form :model="editForm" label-width="80px">
        <el-form-item label="昵称">
          <el-input v-model="editForm.nickname" placeholder="请输入昵称"></el-input>
        </el-form-item>
        <el-form-item label="个性签名">
          <el-input
            v-model="editForm.bio"
            type="textarea"
            :rows="3"
            placeholder="请输入个性签名"
            maxlength="100"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="头像">
          <el-upload
            class="avatar-uploader"
            action="/api/upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="editForm.avatar" :src="editForm.avatar" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveProfile">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

export default {
  name: 'ProfilePage',
  setup() {
    const router = useRouter()
    
    // 用户信息
    const userInfo = reactive({
      id: 1,
      phone: '138****5678',
      nickname: '音乐爱好者',
      avatar: '',
      bio: '热爱音乐，分享美好'
    })

    const defaultAvatar = '/default-avatar.png'
    
    // 对话框状态
    const editDialogVisible = ref(false)
    const securityDialogVisible = ref(false)
    const privacyDialogVisible = ref(false)
    const aboutDialogVisible = ref(false)

    // 编辑表单
    const editForm = reactive({
      nickname: '',
      bio: '',
      avatar: ''
    })

    // 方法
    const editAvatar = () => {
      ElMessage.info('点击了编辑头像')
    }

    const showEditDialog = () => {
      Object.assign(editForm, userInfo)
      editDialogVisible.value = true
    }

    const showSecurityDialog = () => {
      ElMessage.info('安全设置功能开发中')
    }

    const showPrivacyDialog = () => {
      ElMessage.info('隐私设置功能开发中')
    }

    const showAboutDialog = () => {
      ElMessage.info('关于我们功能开发中')
    }

    const handleCloseEditDialog = (done) => {
      ElMessageBox.confirm('确定要放弃修改吗？')
        .then(() => {
          done()
        })
        .catch(() => {})
    }

    const handleAvatarSuccess = (response, file) => {
      editForm.avatar = URL.createObjectURL(file.raw)
    }

    const beforeAvatarUpload = (file) => {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG && !isPNG) {
        ElMessage.error('头像图片只能是 JPG 或 PNG 格式!')
        return false
      }
      if (!isLt2M) {
        ElMessage.error('头像图片大小不能超过 2MB!')
        return false
      }
      return true
    }

    const saveProfile = async () => {
      try {
        // 调用 API 保存资料
        Object.assign(userInfo, editForm)
        editDialogVisible.value = false
        ElMessage.success('资料更新成功')
      } catch (error) {
        ElMessage.error('资料更新失败')
      }
    }

    const goToMyFavorites = () => {
      router.push('/favorites')
    }

    const goToMyShares = () => {
      router.push('/shares')
    }

    const goToHistory = () => {
      router.push('/history')
    }

    // 初始化用户数据
    onMounted(async () => {
      try {
        // 调用 API 获取用户信息
        // const response = await getUserInfo()
        // Object.assign(userInfo, response.data)
      } catch (error) {
        ElMessage.error('获取用户信息失败')
      }
    })

    return {
      userInfo,
      defaultAvatar,
      editDialogVisible,
      securityDialogVisible,
      privacyDialogVisible,
      aboutDialogVisible,
      editForm,
      editAvatar,
      showEditDialog,
      showSecurityDialog,
      showPrivacyDialog,
      showAboutDialog,
      handleCloseEditDialog,
      handleAvatarSuccess,
      beforeAvatarUpload,
      saveProfile,
      goToMyFavorites,
      goToMyShares,
      goToHistory
    }
  }
}
</script>

<style scoped>
.profile-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.profile-header {
  position: relative;
  height: 300px;
  overflow: hidden;
}

.header-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.8) 100%);
}

.user-info {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: white;
  text-align: center;
}

.avatar-section .avatar {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin: 0 auto 16px;
  cursor: pointer;
  border: 4px solid rgba(255, 255, 255, 0.3);
  overflow: hidden;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-edit {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 4px;
  font-size: 12px;
}

.username {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
}

.phone {
  opacity: 0.8;
  font-size: 14px;
}

.profile-content {
  padding: 24px;
  background: white;
  border-radius: 20px 20px 0 0;
  margin-top: -20px;
  position: relative;
}

.stats-section {
  margin-bottom: 24px;
}

.stat-item {
  text-align: center;
  padding: 16px;
}

.stat-number {
  font-size: 24px;
  font-weight: 600;
  color: #667eea;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.menu-section {
  margin-bottom: 24px;
}

.card-header {
  font-weight: 600;
  color: #333;
}

.action-section {
  margin-bottom: 24px;
}

.action-card {
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-card:hover {
  transform: translateY(-4px);
}

.action-content {
  text-align: center;
  padding: 20px;
}

.action-content i {
  font-size: 32px;
  color: #667eea;
  margin-bottom: 12px;
}

.action-text {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.avatar-uploader {
  :deep(.el-upload) {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
  }
  
  :deep(.el-upload:hover) {
    border-color: #667eea;
  }
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}

.avatar {
  width: 100px;
  height: 100px;
  display: block;
  object-fit: cover;
}

@media (max-width: 768px) {
  .profile-header {
    height: 250px;
  }
  
  .profile-content {
    padding: 16px;
    margin-top: -30px;
  }
  
  .stat-item {
    padding: 12px;
  }
  
  .stat-number {
    font-size: 20px;
  }
}
</style>