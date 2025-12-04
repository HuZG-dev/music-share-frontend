<template>
  <div class="settings-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">账户设置</h1>
        <p class="page-subtitle">管理你的账户信息和隐私设置</p>
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
              <el-menu-item index="privacy">
                <el-icon><View /></el-icon>
                <span>隐私设置</span>
              </el-menu-item>
              <el-menu-item index="notification">
                <el-icon><Bell /></el-icon>
                <span>消息通知</span>
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
                      action="/api/upload/avatar"
                      :show-file-list="false"
                      :before-upload="beforeAvatarUpload"
                      :on-success="handleAvatarSuccess"
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
                  <div class="setting-tip">昵称将在社区中显示给其他用户</div>
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

              <!-- 性别 -->
              <div class="setting-item">
                <div class="setting-label">性别</div>
                <div class="setting-control">
                  <el-radio-group v-model="profileForm.gender">
                    <el-radio label="male">男</el-radio>
                    <el-radio label="female">女</el-radio>
                    <el-radio label="unknown">保密</el-radio>
                  </el-radio-group>
                </div>
              </div>

              <!-- 生日 -->
              <div class="setting-item">
                <div class="setting-label">生日</div>
                <div class="setting-control">
                  <el-date-picker
                    v-model="profileForm.birthday"
                    type="date"
                    placeholder="选择生日"
                    value-format="YYYY-MM-DD"
                  />
                </div>
              </div>

              <!-- 地区 -->
              <div class="setting-item">
                <div class="setting-label">地区</div>
                <div class="setting-control">
                  <el-cascader
                    v-model="profileForm.region"
                    :options="regionOptions"
                    placeholder="请选择地区"
                  />
                </div>
              </div>

              <!-- 保存按钮 -->
              <div class="setting-actions">
                <el-button type="primary" @click="saveProfile">保存修改</el-button>
                <el-button @click="resetProfile">重置</el-button>
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

              <!-- 登录设备 -->
              <div class="security-item">
                <div class="security-info">
                  <div class="security-title">登录设备管理</div>
                  <div class="security-desc">管理已登录的设备，可远程退出</div>
                </div>
                <el-button @click="showDeviceManagement">管理设备</el-button>
              </div>

              <!-- 登录记录 -->
              <div class="security-item">
                <div class="security-info">
                  <div class="security-title">登录记录</div>
                  <div class="security-desc">查看最近的登录活动</div>
                </div>
                <el-button @click="showLoginHistory">查看记录</el-button>
              </div>
            </div>
          </el-card>

          <!-- 隐私设置 -->
          <el-card v-if="activeTab === 'privacy'" class="content-card">
            <template #header>
              <div class="card-header">
                <el-icon><View /></el-icon>
                <span>隐私设置</span>
              </div>
            </template>

            <div class="privacy-section">
              <!-- 个人资料可见性 -->
              <div class="privacy-item">
                <div class="privacy-info">
                  <div class="privacy-title">个人资料可见性</div>
                  <div class="privacy-desc">谁可以看到你的个人资料</div>
                </div>
                <el-select v-model="privacyForm.profileVisibility">
                  <el-option label="公开" value="public" />
                  <el-option label="仅好友" value="friends" />
                  <el-option label="私密" value="private" />
                </el-select>
              </div>

              <!-- 分享可见性 -->
              <div class="privacy-item">
                <div class="privacy-info">
                  <div class="privacy-title">默认分享可见性</div>
                  <div class="privacy-desc">新分享的默认隐私设置</div>
                </div>
                <el-select v-model="privacyForm.defaultShareVisibility">
                  <el-option label="公开" value="public" />
                  <el-option label="仅好友" value="friends" />
                  <el-option label="私密" value="private" />
                </el-select>
              </div>

              <!-- 在线状态 -->
              <div class="privacy-item">
                <div class="privacy-info">
                  <div class="privacy-title">在线状态显示</div>
                  <div class="privacy-desc">是否向其他用户显示在线状态</div>
                </div>
                <el-switch v-model="privacyForm.showOnlineStatus" />
              </div>

              <!-- 播放记录 -->
              <div class="privacy-item">
                <div class="privacy-info">
                  <div class="privacy-title">播放记录可见性</div>
                  <div class="privacy-desc">谁可以看到你的播放记录</div>
                </div>
                <el-select v-model="privacyForm.playHistoryVisibility">
                  <el-option label="公开" value="public" />
                  <el-option label="仅好友" value="friends" />
                  <el-option label="仅自己" value="private" />
                </el-select>
              </div>

              <!-- 收藏可见性 -->
              <div class="privacy-item">
                <div class="privacy-info">
                  <div class="privacy-title">收藏列表可见性</div>
                  <div class="privacy-desc">谁可以看到你的收藏列表</div>
                </div>
                <el-select v-model="privacyForm.favoritesVisibility">
                  <el-option label="公开" value="public" />
                  <el-option label="仅好友" value="friends" />
                  <el-option label="仅自己" value="private" />
                </el-select>
              </div>

              <!-- 保存按钮 -->
              <div class="privacy-actions">
                <el-button type="primary" @click="savePrivacySettings">保存设置</el-button>
              </div>
            </div>
          </el-card>

          <!-- 消息通知 -->
          <el-card v-if="activeTab === 'notification'" class="content-card">
            <template #header>
              <div class="card-header">
                <el-icon><Bell /></el-icon>
                <span>消息通知</span>
              </div>
            </template>

            <div class="notification-section">
              <!-- 系统通知 -->
              <div class="notification-group">
                <div class="group-title">系统通知</div>
                <div class="notification-item">
                  <div class="notification-info">
                    <div class="notification-title">系统公告</div>
                    <div class="notification-desc">重要更新和功能通知</div>
                  </div>
                  <el-switch v-model="notificationForm.systemAnnouncement" />
                </div>
                <div class="notification-item">
                  <div class="notification-info">
                    <div class="notification-title">安全提醒</div>
                    <div class="notification-desc">账户安全相关通知</div>
                  </div>
                  <el-switch v-model="notificationForm.securityAlerts" />
                </div>
              </div>

              <!-- 社交互动 -->
              <div class="notification-group">
                <div class="group-title">社交互动</div>
                <div class="notification-item">
                  <div class="notification-info">
                    <div class="notification-title">新粉丝</div>
                    <div class="notification-desc">有人关注了你</div>
                  </div>
                  <el-switch v-model="notificationForm.newFollowers" />
                </div>
                <div class="notification-item">
                  <div class="notification-info">
                    <div class="notification-title">点赞通知</div>
                    <div class="notification-desc">有人点赞了你的分享</div>
                  </div>
                  <el-switch v-model="notificationForm.likeNotifications" />
                </div>
                <div class="notification-item">
                  <div class="notification-info">
                    <div class="notification-title">评论通知</div>
                    <div class="notification-desc">有人评论了你的分享</div>
                  </div>
                  <el-switch v-model="notificationForm.commentNotifications" />
                </div>
                <div class="notification-item">
                  <div class="notification-info">
                    <div class="notification-title">@提及</div>
                    <div class="notification-desc">有人在评论中@了你</div>
                  </div>
                  <el-switch v-model="notificationForm.mentionNotifications" />
                </div>
              </div>

              <!-- 邮件通知 -->
              <div class="notification-group">
                <div class="group-title">邮件通知</div>
                <div class="notification-item">
                  <div class="notification-info">
                    <div class="notification-title">邮件摘要</div>
                    <div class="notification-desc">每周活动摘要邮件</div>
                  </div>
                  <el-switch v-model="notificationForm.emailDigest" />
                </div>
                <div class="notification-item">
                  <div class="notification-info">
                    <div class="notification-title">营销邮件</div>
                    <div class="notification-desc">产品更新和活动信息</div>
                  </div>
                  <el-switch v-model="notificationForm.marketingEmails" />
                </div>
              </div>

              <!-- 保存按钮 -->
              <div class="notification-actions">
                <el-button type="primary" @click="saveNotificationSettings">保存设置</el-button>
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
  View,
  Bell,
  Link
} from '@element-plus/icons-vue'

const router = useRouter()

// 当前激活的标签页
const activeTab = ref('profile')

// 用户信息
const userInfo = ref({
  id: 1,
  phone: '138****5678',
  nickname: '音乐爱好者',
  avatar: '',
  bio: '热爱音乐，分享美好',
  gender: 'unknown',
  birthday: '',
  region: []
})

// 个人资料表单
const profileForm = reactive({
  nickname: '',
  bio: '',
  gender: 'unknown',
  birthday: '',
  region: []
})

// 隐私设置表单
const privacyForm = reactive({
  profileVisibility: 'public',
  defaultShareVisibility: 'public',
  showOnlineStatus: true,
  playHistoryVisibility: 'friends',
  favoritesVisibility: 'friends'
})

// 通知设置表单
const notificationForm = reactive({
  systemAnnouncement: true,
  securityAlerts: true,
  newFollowers: true,
  likeNotifications: true,
  commentNotifications: true,
  mentionNotifications: true,
  emailDigest: false,
  marketingEmails: false
})

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

// 地区选项（简化版）
const regionOptions = [
  {
    value: 'beijing',
    label: '北京市',
    children: [
      { value: 'dongcheng', label: '东城区' },
      { value: 'xicheng', label: '西城区' }
    ]
  },
  {
    value: 'shanghai',
    label: '上海市',
    children: [
      { value: 'huangpu', label: '黄浦区' },
      { value: 'xuhui', label: '徐汇区' }
    ]
  }
]

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

const handleAvatarSuccess = (response) => {
  userInfo.value.avatar = response.url
  ElMessage.success('头像上传成功')
}

const saveProfile = async () => {
  try {
    // 调用API保存个人资料
    Object.assign(userInfo.value, profileForm)
    ElMessage.success('个人资料更新成功')
  } catch (error) {
    ElMessage.error('更新失败')
  }
}

const resetProfile = () => {
  Object.assign(profileForm, {
    nickname: userInfo.value.nickname,
    bio: userInfo.value.bio,
    gender: userInfo.value.gender,
    birthday: userInfo.value.birthday,
    region: userInfo.value.region
  })
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

const showDeviceManagement = () => {
  ElMessage.info('设备管理功能开发中')
}

const showLoginHistory = () => {
  ElMessage.info('登录记录功能开发中')
}

const savePrivacySettings = async () => {
  try {
    // 调用API保存隐私设置
    ElMessage.success('隐私设置已更新')
  } catch (error) {
    ElMessage.error('更新失败')
  }
}

const saveNotificationSettings = async () => {
  try {
    // 调用API保存通知设置
    ElMessage.success('通知设置已更新')
  } catch (error) {
    ElMessage.error('更新失败')
  }
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
  // 加载用户数据
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
  background-color: #f8f9fa;
  min-height: 100vh;
}

/* 页面头部 */
.page-header {
  background: white;
  padding: 30px 0;
  border-bottom: 1px solid #e8e8e8;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.page-title {
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 600;
  color: #333;
}

.page-subtitle {
  margin: 0;
  font-size: 16px;
  color: #666;
}

/* 主要内容 */
.main-content {
  max-width: 1200px;
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
  background-color: #f0f7ff;
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

.setting-tip {
  font-size: 12px;
  color: #999;
  margin-top: 8px;
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

/* 隐私设置 */
.privacy-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;
}

.privacy-item:last-child {
  border-bottom: none;
}

.privacy-title {
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.privacy-desc {
  font-size: 14px;
  color: #666;
}

.privacy-actions {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

/* 消息通知 */
.notification-group {
  margin-bottom: 32px;
}

.group-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.notification-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
}

.notification-title {
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.notification-desc {
  font-size: 14px;
  color: #666;
}

.notification-actions {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
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
  .privacy-item,
  .binding-item,
  .account-deletion {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  
  .security-item .el-button,
  .privacy-item .el-select,
  .binding-item .el-button {
    align-self: flex-start;
  }
}
</style>