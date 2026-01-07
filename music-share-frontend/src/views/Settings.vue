<template>
  <div class="settings-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">账户设置</h1>
      </div>
    </div>

    <!-- 主要内容 -->
    <div class="main-content">
      <div class="content-container">
        <!-- 左侧导航 -->
        <div class="settings-nav">
          <el-card class="nav-card">
            <el-menu
              :default-active="activeTab"
              class="settings-menu"
              @select="handleMenuSelect"
            >
              <el-menu-item index="profile">
                <el-icon><User /></el-icon>
                <span>个人资料</span>
              </el-menu-item>
              <el-menu-item index="security">
                <el-icon><Lock /></el-icon>
                <span>安全设置</span>
              </el-menu-item>
              <el-menu-item index="binding">
                <el-icon><Link /></el-icon>
                <span>账号绑定</span>
              </el-menu-item>
            </el-menu>
          </el-card>
        </div>

        <!-- 右侧内容 -->
        <div class="settings-content">
          <!-- 个人资料 -->
          <el-card v-if="activeTab === 'profile'" class="content-card">
            <template #header>
              <div class="card-header">
                <el-icon><User /></el-icon>
                <span>个人资料</span>
              </div>
            </template>

            <div class="profile-section">
              <!-- 头像设置 -->
              <div class="setting-item">
                <div class="setting-label">头像</div>
                <div class="setting-control">
                  <div class="avatar-upload">
                    <el-avatar :size="80" :src="userInfo.avatar" />
                    <el-upload
                      :http-request="handleCustomAvatarUpload"
                      :show-file-list="false"
                      :before-upload="beforeAvatarUpload"
                      class="avatar-uploader"
                    >
                      <el-button type="primary" text>更换头像</el-button>
                    </el-upload>
                  </div>
                </div>
              </div>

              <!-- 昵称 -->
              <div class="setting-item">
                <div class="setting-label">昵称</div>
                <div class="setting-control">
                  <el-input
                    v-model="profileForm.nickname"
                    placeholder="请输入昵称"
                    maxlength="20"
                    show-word-limit
                  />
                </div>
              </div>

              <!-- 个性签名 -->
              <div class="setting-item">
                <div class="setting-label">个性签名</div>
                <div class="setting-control">
                  <el-input
                    v-model="profileForm.bio"
                    type="textarea"
                    :rows="3"
                    placeholder="介绍一下自己..."
                    maxlength="100"
                    show-word-limit
                    resize="none"
                  />
                </div>
              </div>

              <!-- 保存按钮 -->
              <div class="setting-actions">
                <el-button type="primary" @click="saveProfile">保存修改</el-button>
              </div>
            </div>
          </el-card>

          <!-- 安全设置 -->
          <el-card v-if="activeTab === 'security'" class="content-card">
            <template #header>
              <div class="card-header">
                <el-icon><Lock /></el-icon>
                <span>安全设置</span>
              </div>
            </template>

            <div class="security-section">
              <!-- 修改密码 -->
              <div class="security-item">
                <div class="security-info">
                  <div class="security-title">登录密码</div>
                  <div class="security-desc">定期更换密码可以让账户更安全</div>
                </div>
                <el-button @click="showChangePasswordDialog">修改密码</el-button>
              </div>

              <!-- 手机绑定 -->
              <div class="security-item">
                <div class="security-info">
                  <div class="security-title">手机号</div>
                  <div class="security-desc">
                    {{ userInfo.phone ? `已绑定：${userInfo.phone}` : '未绑定手机号' }}
                  </div>
                </div>
                <el-button @click="showPhoneBindingDialog">
                  {{ userInfo.phone ? '更换手机' : '绑定手机' }}
                </el-button>
              </div>
            </div>
          </el-card>

          <!-- 账号绑定 -->
          <el-card v-if="activeTab === 'binding'" class="content-card">
            <template #header>
              <div class="card-header">
                <el-icon><Link /></el-icon>
                <span>账号绑定</span>
              </div>
            </template>

            <div class="binding-section">
              <!-- 第三方账号绑定 -->
              <div class="binding-item">
                <div class="binding-info">
                  <div class="binding-icon qq">QQ</div>
                  <div class="binding-details">
                    <div class="binding-title">QQ账号</div>
                    <div class="binding-desc">
                      {{ bindings.qq ? `已绑定：${bindings.qq}` : '未绑定QQ账号' }}
                    </div>
                  </div>
                </div>
                <el-button
                  :type="bindings.qq ? 'danger' : 'primary'"
                  @click="handleQQBinding"
                >
                  {{ bindings.qq ? '解绑' : '绑定' }}
                </el-button>
              </div>

              <div class="binding-item">
                <div class="binding-info">
                  <div class="binding-icon wechat">微信</div>
                  <div class="binding-details">
                    <div class="binding-title">微信账号</div>
                    <div class="binding-desc">
                      {{ bindings.wechat ? '已绑定微信账号' : '未绑定微信账号' }}
                    </div>
                  </div>
                </div>
                <el-button
                  :type="bindings.wechat ? 'danger' : 'primary'"
                  @click="handleWechatBinding"
                >
                  {{ bindings.wechat ? '解绑' : '绑定' }}
                </el-button>
              </div>

              <div class="binding-item">
                <div class="binding-info">
                  <div class="binding-icon weibo">微博</div>
                  <div class="binding-details">
                    <div class="binding-title">微博账号</div>
                    <div class="binding-desc">
                      {{ bindings.weibo ? '已绑定微博账号' : '未绑定微博账号' }}
                    </div>
                  </div>
                </div>
                <el-button
                  :type="bindings.weibo ? 'danger' : 'primary'"
                  @click="handleWeiboBinding"
                >
                  {{ bindings.weibo ? '解绑' : '绑定' }}
                </el-button>
              </div>

              <!-- 账号注销 -->
              <div class="account-deletion">
                <div class="deletion-info">
                  <div class="deletion-title">账号注销</div>
                  <div class="deletion-desc">
                    永久删除账号及其所有数据，此操作不可恢复
                  </div>
                </div>
                <el-button type="danger" @click="showAccountDeletionDialog">
                  注销账号
                </el-button>
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </div>

    <!-- 修改密码对话框 -->
    <el-dialog
      v-model="changePasswordDialogVisible"
      title="修改密码"
      width="400px"
    >
      <el-form
        :model="passwordForm"
        :rules="passwordRules"
        ref="passwordFormRef"
        label-width="80px"
      >
        <el-form-item label="原密码" prop="oldPassword">
          <el-input
            v-model="passwordForm.oldPassword"
            type="password"
            placeholder="请输入原密码"
            show-password
          />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="passwordForm.newPassword"
            type="password"
            placeholder="请输入新密码"
            show-password
          />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="passwordForm.confirmPassword"
            type="password"
            placeholder="请再次输入新密码"
            show-password
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="changePasswordDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="changePassword">确认修改</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  User,
  Lock,
  Link
} from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import request from '@/api/request'

const router = useRouter()
const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)

// 当前激活的标签页
const activeTab = ref('profile')

// 个人资料表单
const profileForm = reactive({
  nickname: '',
  bio: '',
  gender: 'unknown',
  birthday: '',
  region: []
})

// 头像上传相关
const beforeAvatarUpload = (file) => {
  const isJPG = file.type === 'image/jpeg'
  const isPNG = file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPG && !isPNG) {
    ElMessage.error('头像只能是 JPG 或 PNG 格式!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('头像大小不能超过 2MB!')
    return false
  }
  return true
}

const handleCustomAvatarUpload = (options) => {
  const { file, onSuccess, onError } = options
  // 检查file对象的结构
  console.log('收到的file对象:', file)
  
  // element-plus的upload组件在不同版本中返回的file对象结构可能不同
  const actualFile = file.raw || file
  const formData = new FormData()
  formData.append('file', actualFile)
  console.log('构建的FormData:', formData)
  console.log('FormData包含的文件:', formData.get('file'))

  // 使用已配置好的request对象，让拦截器处理Authorization头
  request.post('/user/avatar', formData).then(response => {
    console.log('头像上传响应:', response)
    if (response.code === 200 && response.data) {
      userStore.updateUserInfo({ avatar: response.data.avatar })
      ElMessage.success('头像上传成功')
      onSuccess(response)
    } else {
      ElMessage.error(response.message || '头像上传失败')
      onError(response)
    }
  }).catch(error => {
    console.error('头像上传失败:', error)
    console.error('错误响应:', error.response)
    console.error('错误详情:', error.response ? error.response.data : '无响应数据')
    ElMessage.error('头像上传失败，请重试')
    onError(error)
  })
}

// 账号绑定状态
const bindings = reactive({
  qq: null,
  wechat: null,
  weibo: null
})

// 修改密码相关
const changePasswordDialogVisible = ref(false)
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})
const passwordFormRef = ref()

// 密码验证规则
const passwordRules = {
  oldPassword: [
    { required: true, message: '请输入原密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 方法
const handleMenuSelect = (key) => {
  activeTab.value = key
}

const saveProfile = async () => {
  try {
    // 调用API保存个人资料
    userStore.updateUserInfo(profileForm)
    ElMessage.success('个人资料更新成功')
  } catch (error) {
    ElMessage.error('更新失败')
  }
}

const showChangePasswordDialog = () => {
  passwordForm.oldPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
  changePasswordDialogVisible.value = true
}

const changePassword = async () => {
  try {
    await passwordFormRef.value.validate()
    
    // 调用API修改密码
    ElMessage.success('密码修改成功')
    changePasswordDialogVisible.value = false
  } catch (error) {
    // 验证失败
  }
}

const showPhoneBindingDialog = () => {
  ElMessage.info('手机绑定功能开发中')
}

const handleQQBinding = async () => {
  if (bindings.qq) {
    try {
      await ElMessageBox.confirm('确定要解绑QQ账号吗？', '确认解绑')
      bindings.qq = null
      ElMessage.success('QQ账号已解绑')
    } catch (error) {
      // 用户取消
    }
  } else {
    ElMessage.info('QQ绑定功能开发中')
  }
}

const handleWechatBinding = async () => {
  if (bindings.wechat) {
    try {
      await ElMessageBox.confirm('确定要解绑微信账号吗？', '确认解绑')
      bindings.wechat = null
      ElMessage.success('微信账号已解绑')
    } catch (error) {
      // 用户取消
    }
  } else {
    ElMessage.info('微信绑定功能开发中')
  }
}

const handleWeiboBinding = async () => {
  if (bindings.weibo) {
    try {
      await ElMessageBox.confirm('确定要解绑微博账号吗？', '确认解绑')
      bindings.weibo = null
      ElMessage.success('微博账号已解绑')
    } catch (error) {
      // 用户取消
    }
  } else {
    ElMessage.info('微博绑定功能开发中')
  }
}

const showAccountDeletionDialog = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要注销账号吗？此操作将永久删除您的所有数据且不可恢复。',
      '确认注销账号',
      {
        confirmButtonText: '确认注销',
        cancelButtonText: '取消',
        type: 'error',
        confirmButtonClass: 'el-button--danger'
      }
    )
    
    // 调用API注销账号
    ElMessage.success('账号注销申请已提交')
    router.push('/login')
  } catch (error) {
    // 用户取消
  }
}

// 初始化数据
onMounted(() => {
  // 从userStore获取当前用户数据
  Object.assign(profileForm, {
    nickname: userInfo.value.nickname,
    bio: userInfo.value.bio,
    gender: userInfo.value.gender,
    birthday: userInfo.value.birthday,
    region: userInfo.value.region
  })
})
</script>

<style scoped>
.settings-page {
  background-color: #fffdf8;
  min-height: 100vh;
}

/* 页面头部 */
.page-header {
  background: white;
  padding: 30px 0;
  border-bottom: 1px solid #e8e8e8;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

.page-title {
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 600;
  color: #333;
}

/* 主要内容 */
.main-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px 20px;
}

.content-container {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 24px;
}

/* 左侧导航 */
.nav-card {
  border-radius: 12px;
}

.settings-menu {
  border: none;
}

.settings-menu .el-menu-item {
  height: 50px;
  line-height: 50px;
  margin: 4px 0;
  border-radius: 8px;
}

.settings-menu .el-menu-item.is-active {
  background-color: #fffdf8;
  color: #1890ff;
}

/* 右侧内容 */
.content-card {
  border-radius: 12px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #333;
}

/* 设置项通用样式 */
.setting-item {
  display: flex;
  gap: 24px;
  padding: 20px 0;
  border-bottom: 1px solid #f0f0f0;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-label {
  width: 120px;
  font-weight: 500;
  color: #333;
  flex-shrink: 0;
}

.setting-control {
  flex: 1;
  min-width: 0;
}

/* 头像上传 */
.avatar-upload {
  display: flex;
  align-items: center;
  gap: 16px;
}

.avatar-uploader {
  display: inline-block;
}

/* 保存按钮 */
.setting-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

/* 安全设置 */
.security-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid #f0f0f0;
}

.security-item:last-child {
  border-bottom: none;
}

.security-title {
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.security-desc {
  font-size: 14px;
  color: #666;
}

/* 账号绑定 */
.binding-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid #f0f0f0;
}

.binding-item:last-child {
  border-bottom: none;
}

.binding-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.binding-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: white;
  font-size: 14px;
}

.binding-icon.qq {
  background: #12b7f5;
}

.binding-icon.wechat {
  background: #07c160;
}

.binding-icon.weibo {
  background: #e6162d;
}

.binding-title {
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.binding-desc {
  font-size: 14px;
  color: #666;
}

/* 账号注销 */
.account-deletion {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30px 0;
  margin-top: 20px;
  border-top: 2px solid #f0f0f0;
}

.deletion-title {
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.deletion-desc {
  font-size: 14px;
  color: #666;
  max-width: 400px;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .content-container {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .settings-nav {
    order: 2;
  }
  
  .settings-content {
    order: 1;
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 24px;
  }
  
  .setting-item {
    flex-direction: column;
    gap: 12px;
  }
  
  .setting-label {
    width: auto;
  }
  
  .security-item,
  .binding-item,
  .account-deletion {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  
  .security-item .el-button,
  .binding-item .el-button {
    align-self: flex-start;
  }
}
</style>
