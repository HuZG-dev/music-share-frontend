<template>
  <div class="recommendations-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1>所有分享</h1>
      <p>发现大家分享的精彩音乐</p>
    </div>

    <!-- 分享列表 -->
    <div class="shares-container">
      <ShareCard
        v-for="share in allShares" 
        :key="share.id"
        :share="share"
        :on-click="goToShareDetail"
      />
    </div>

    <!-- 加载状态 -->
    <el-skeleton :rows="3" animated v-if="loading" />

    <!-- 空状态 -->
    <div v-if="!loading && allShares.length === 0" class="empty-state">
      <el-empty description="暂无分享数据" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import { fetchAllShares } from '../api/index'
import { getMusicDetail } from '../api/netease'
import ShareCard from '../components/ShareCard.vue'

// 路由实例
const router = useRouter()

// 所有分享数据
const allShares = ref([])
const loading = ref(true)

// 获取所有分享数据
const fetchAllSharesData = async () => {
  try {
    loading.value = true
    const response = await fetchAllShares()
    // 处理API返回的数据结构
    const sharesData = response || []
    if (sharesData.length > 0) {
      // 将后端返回的数据转换为我们需要的格式，并获取真实封面
      allShares.value = await Promise.all(sharesData.map(async (item) => {
        let coverUrl = 'https://via.placeholder.com/80x80/666666/ffffff?text=音乐封面'
        
        // 尝试通过网易云音乐API获取真实封面
        try {
          const musicDetail = await getMusicDetail(item.musicId)
          if (musicDetail && musicDetail.pic) {
            coverUrl = musicDetail.pic
          }
        } catch (error) {
          console.error(`获取音乐${item.musicId}封面失败:`, error)
        }
        
        return {
          id: item.id,
          musicName: item.musicTitle,
          artist: item.musicArtist,
          cover: coverUrl,
          userName: item.user?.nickname || '未知用户',
          userAvatar: item.user?.avatar || 'https://via.placeholder.com/32x32/cccccc/ffffff?text=用户',
          playCount: item.likedCount || 0,
          duration: '未知时长',
          musicId: item.musicId
        }
      }))
    }
  } catch (error) {
    console.error('获取所有分享失败:', error)
  } finally {
    loading.value = false
  }
}

// 跳转到分享详情页
const goToShareDetail = (share) => {
  router.push(`/share/${share.id}`)
}

// 页面加载时获取数据
onMounted(() => {
  fetchAllSharesData()
})
</script>

<style scoped>
.recommendations-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f4f4f4;
  min-height: 100vh;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
  padding: 40px 0;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.page-header h1 {
  font-size: 32px;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: #333;
}

.page-header p {
  font-size: 16px;
  color: #666;
  margin: 0;
}

.shares-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}



/* 空状态 */
.empty-state {
  text-align: center;
  padding: 80px 20px;
  background-color: white;
  border-radius: 8px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .shares-container {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 16px;
  }
  
  .page-header {
    padding: 20px 0;
  }
  
  .page-header h1 {
    font-size: 24px;
  }
  
  .recommendations-page {
    padding: 12px;
  }
}

@media (max-width: 480px) {
  .shares-container {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}
</style>