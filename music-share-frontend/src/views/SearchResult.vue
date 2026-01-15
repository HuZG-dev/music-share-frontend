<template>
  <div class="search-result-container">
    <!-- 搜索标题和关键词 -->
    <div class="search-header">
      <h1>搜索结果</h1>
      <p class="search-keyword">"{{ keyword }}"</p>
    </div>

    <!-- 标签切换 -->
    <div class="tab-container">
      <el-tabs v-model="activeTab" type="card" @tab-change="handleTabChange">
        <el-tab-pane label="分享" name="shares">
          <!-- 分享结果列表 -->
          <div class="result-list share-result-list">
            <div v-if="loadingShares" class="loading">
              <el-skeleton :rows="5" animated />
            </div>
            <div v-else-if="shareResults.length === 0" class="empty-result">
              <el-empty description="暂无分享结果" />
            </div>
            <div v-else>
              <share-card 
                v-for="share in shareResults" 
                :key="share.id" 
                :share="share"
                :on-click="goToShareDetail"
              />
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="歌曲" name="songs">
          <!-- 歌曲结果列表 -->
          <div class="result-list">
            <div v-if="loadingSongs" class="loading">
              <el-skeleton :rows="5" animated />
            </div>
            <div v-else-if="songResults.length === 0" class="empty-result">
              <el-empty description="暂无歌曲结果" />
            </div>
            <div v-else class="song-list-scroll">
              <div v-for="song in songResults" :key="song.id" class="song-item">
                <div class="song-info">
                  <div class="song-cover">
                    <img :src="song.pic || 'https://via.placeholder.com/64x64/42b983/ffffff?text=🎵'" :alt="song.name">
                  </div>
                  <div class="song-details">
                    <h3 class="song-title">{{ song.name }}</h3>
                    <p class="song-artist">{{ song.artist }}</p>
                    <p class="song-album">{{ typeof song.album === 'object' ? song.album.name : song.album }}</p>
                  </div>
                </div>
                <div class="song-action">
                  <el-button type="primary" size="small" @click="playSong(song)" :loading="loadingMusicId === song.id">
                    <el-icon><VideoPlay /></el-icon> 播放
                  </el-button>
                </div>
              </div>
            </div>
            
            <!-- 音乐播放器 -->
            <div v-if="currentPlayingMusic?.url" class="player-container">
              <Player :music-info="currentPlayingMusic" :autoplay="true" />
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="用户" name="users">
          <!-- 用户结果列表 -->
          <div class="result-list">
            <div v-if="loadingUsers" class="loading">
              <el-skeleton :rows="5" animated />
            </div>
            <div v-else-if="userResults.length === 0" class="empty-result">
              <el-empty description="暂无用户结果" />
            </div>
            <div v-else>
              <div v-for="user in userResults" :key="user.id" class="user-item">
                <div class="user-info">
                  <el-avatar :size="50" :src="user.avatar || 'https://via.placeholder.com/50'" />
                  <div class="user-details">
                    <h3 class="user-nickname">{{ user.nickname }}</h3>
                    <p class="user-phone">{{ user.phone }}</p>
                  </div>
                </div>
                <div class="user-action">
                  <el-button type="primary" size="small" @click="goToUserProfile(user.id)">
                    查看主页
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElSkeleton, ElEmpty, ElButton, ElTabs, ElTabPane } from 'element-plus'
import { VideoPlay } from '@element-plus/icons-vue'
import ShareCard from '@/components/ShareCard.vue'
import Player from '@/components/Player.vue'
import { searchMusic, getMusicUrl } from '@/api/netease.js'
import { searchShares, searchUsers } from '@/api/index.js'

const route = useRoute()
const router = useRouter()

// 搜索关键词
const keyword = ref('')

// 激活的标签
const activeTab = ref('shares')

// 分享结果
const shareResults = ref([])
const loadingShares = ref(false)

// 歌曲结果
const songResults = ref([])
const loadingSongs = ref(false)

// 用户结果
const userResults = ref([])
const loadingUsers = ref(false)

// 播放相关
const currentPlayingMusic = ref(null)
const loadingMusicId = ref(null)

// 标签切换处理
const handleTabChange = (tabName) => {
  activeTab.value = tabName
}

// 播放歌曲
const playSong = async (song) => {
  try {
    console.log('开始播放音乐:', song.name, '-', song.artist, 'ID:', song.id)
    loadingMusicId.value = song.id
    
    // 获取音乐播放 URL
    const musicWithUrl = await getMusicUrl(song.id)
    
    if (!musicWithUrl.url) {
      ElMessage.error('无法获取音乐播放 URL')
      return
    }
    
    // 更新当前播放歌曲信息
    currentPlayingMusic.value = {
      id: song.id,
      title: song.name,
      artist: song.artist,
      album: typeof song.album === 'object' ? song.album.name : song.album,
      cover: song.pic || 'https://via.placeholder.com/64x64/42b983/ffffff?text=🎵',
      url: musicWithUrl.url
    }
    
    ElMessage.success(`开始播放: ${song.name}`)
  } catch (error) {
    console.error('播放音乐失败:', error)
    ElMessage.error('播放失败，请重试')
  } finally {
    loadingMusicId.value = null
  }
}

// 跳转到分享详情
const goToShareDetail = (share) => {
  router.push(`/share/${share.id}`)
}

// 跳转到用户主页
const goToUserProfile = (userId) => {
  router.push(`/user/${userId}`)
}

// 搜索分享
const loadShareResults = async () => {
  if (!keyword.value) return
  
  loadingShares.value = true
  try {
    const results = await searchShares(keyword.value)
    console.log('后端返回的分享数据:', results)
    
    // 按创建时间倒序排列
    const sortedResults = results.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt)
    })
    
    // 转换数据格式以匹配ShareCard组件
    shareResults.value = sortedResults.map(share => {
      // 使用后端保存的musicDuration
      let durationStr = '--:--' // 旧数据没有时长
      if (share.musicDuration && share.musicDuration > 0) {
        const minutes = Math.floor(share.musicDuration / 60)
        const seconds = share.musicDuration % 60
        durationStr = `${minutes}:${seconds.toString().padStart(2, '0')}`
      }
      
      return {
        id: share.id,
        cover: share.musicCover || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%2342b983' width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='80' fill='white'%3E🎵%3C/text%3E%3C/svg%3E",
        musicName: share.musicTitle || '未知歌曲',
        artist: share.musicArtist || '未知艺术家',
        playCount: share.likedCount || 0,
        duration: durationStr,
        userAvatar: share.user?.avatar || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32'%3E%3Crect fill='%23cccccc' width='32' height='32'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='16' fill='white'%3E用户%3C/text%3E%3C/svg%3E",
        userName: share.user?.nickname || '匿名用户',
        musicId: share.musicId
      }
    })
  } catch (error) {
    console.error('搜索分享失败:', error)
    ElMessage.error('搜索分享失败，请重试')
    shareResults.value = []
  } finally {
    loadingShares.value = false
  }
}

// 搜索歌曲
const loadSongResults = async () => {
  if (!keyword.value) return
  
  loadingSongs.value = true
  try {
    const results = await searchMusic(keyword.value, 20)
    songResults.value = results
  } catch (error) {
    console.error('搜索歌曲失败:', error)
    ElMessage.error('搜索歌曲失败，请重试')
    songResults.value = []
  } finally {
    loadingSongs.value = false
  }
}

// 搜索用户
const loadUserResults = async () => {
  if (!keyword.value) return
  
  loadingUsers.value = true
  try {
    const results = await searchUsers(keyword.value)
    userResults.value = results
  } catch (error) {
    console.error('搜索用户失败:', error)
    ElMessage.error('搜索用户失败，请重试')
    userResults.value = []
  } finally {
    loadingUsers.value = false
  }
}

// 初始化搜索
onMounted(() => {
  // 获取搜索关键词
  const searchKeyword = route.query.keyword
  if (searchKeyword) {
    keyword.value = searchKeyword
    // 加载搜索结果
    loadShareResults()
    loadSongResults()
    loadUserResults()
  } else {
    // 如果没有关键词，返回首页
    router.push('/')
  }
})

// 监听路由查询参数变化
watch(
  () => route.query.keyword,
  (newKeyword) => {
    if (newKeyword) {
      keyword.value = newKeyword
      // 重新搜索
      loadShareResults()
      loadSongResults()
      loadUserResults()
    }
  }
)
</script>

<style scoped>
.search-result-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.search-header {
  text-align: center;
  margin-bottom: 30px;
}

.search-header h1 {
  font-size: 32px;
  color: #333;
  margin-bottom: 10px;
}

.search-keyword {
  font-size: 18px;
  color: #666;
}

.tab-container {
  margin-bottom: 30px;
}

.result-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

/* 分享结果列表使用多列布局 */
.share-result-list {
  grid-template-columns: repeat(3, 1fr);
}

.song-list-scroll {
  max-height: 500px;
  overflow-y: auto;
  padding-right: 8px;
}

.song-list-scroll::-webkit-scrollbar {
  width: 8px;
}

.song-list-scroll::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.song-list-scroll::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.song-list-scroll::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.song-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  border-radius: 8px;
  background-color: #f5f7fa;
  transition: all 0.3s;
  margin-bottom: 10px;
}

.song-item:hover {
  background-color: #e6f7ff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.song-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.song-cover {
  width: 60px;
  height: 60px;
  border-radius: 4px;
  overflow: hidden;
}

.song-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.song-details {
  flex: 1;
  min-width: 0;
}

.song-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 5px 0;
}

.song-artist {
  font-size: 14px;
  color: #666;
  margin: 0 0 3px 0;
}

.song-album {
  font-size: 12px;
  color: #999;
  margin: 0;
}

.song-action {
  margin-left: auto;
}

.user-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  border-radius: 8px;
  background-color: #f5f7fa;
  transition: all 0.3s;
}

.user-item:hover {
  background-color: #e6f7ff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-details {
  flex: 1;
  min-width: 0;
}

.user-nickname {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 5px 0;
}

.user-phone {
  font-size: 14px;
  color: #999;
  margin: 0;
}

.user-action {
  margin-left: auto;
}

.player-container {
  margin-top: 24px;
  padding: 20px;
  background: #fffdf8;
  border-radius: 8px;
  width: 100%;
  max-width: 100%;
}

.loading {
  grid-column: 1 / -1;
}

.empty-result {
  grid-column: 1 / -1;
  text-align: center;
  padding: 50px 0;
}

@media (max-width: 1024px) {
  .share-result-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .search-result-container {
    padding: 10px;
  }
  
  .search-header h1 {
    font-size: 24px;
  }
  
  .share-result-list {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .song-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .song-action {
    margin-left: 0;
  }
}
</style>