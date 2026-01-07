<template>
  <div 
    class="share-card"
    @click="handleClick"
  >
    <div class="card-cover" :style="{ height: coverHeight }">
      <img :src="share.cover" :alt="share.musicName" />
      <div class="cover-overlay">
        <div class="play-button" :style="{ width: playButtonSize, height: playButtonSize }">
          <el-icon :size="playIconSize"><VideoPlay /></el-icon>
        </div>
      </div>
      <div class="cover-info">
        <span class="play-count">
          <el-icon><View /></el-icon>
          {{ formatCount(share.playCount) }}
        </span>
        <span class="duration">{{ share.duration }}</span>
      </div>
    </div>
    <div class="card-content" :style="{ padding: contentPadding }">
      <h4 class="music-title line-clamp-1">{{ share.musicName }}</h4>
      <p class="artist-name line-clamp-1">{{ share.artist }}</p>
      <div class="user-info">
        <el-avatar :size="24" :src="share.userAvatar" />
        <span class="user-name line-clamp-1">{{ share.userName }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { VideoPlay, View } from '@element-plus/icons-vue'

// 组件属性
const props = defineProps({
  // 分享数据
  share: {
    type: Object,
    required: true
  },
  // 点击事件处理函数
  onClick: {
    type: Function,
    required: true
  },
  // 封面高度
  coverHeight: {
    type: String,
    default: '180px'
  },
  // 播放按钮大小
  playButtonSize: {
    type: String,
    default: '56px'
  },
  // 播放图标大小
  playIconSize: {
    type: Number,
    default: 24
  },
  // 内容区域内边距
  contentPadding: {
    type: String,
    default: '16px'
  }
})

// 处理点击事件
const handleClick = () => {
  props.onClick(props.share)
}

// 格式化数字
const formatCount = (count) => {
  if (count >= 10000) {
    return (count / 10000).toFixed(1) + '万'
  }
  return count.toString()
}
</script>

<style scoped>
.share-card {
  border-radius: 8px;
  overflow: hidden;
  background: white;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.share-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.card-cover {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.card-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.share-card:hover .cover-overlay {
  opacity: 1;
}

.play-button {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #e07c5c;
}

.cover-info {
  position: absolute;
  bottom: 8px;
  left: 8px;
  right: 8px;
  display: flex;
  justify-content: space-between;
  color: white;
  font-size: 12px;
}

.cover-info span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.card-content {
  padding: 16px;
}

.music-title {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333333;
  line-height: 1.4;
}

.artist-name {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #333333;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-name {
  font-size: 14px;
  color: #333333;
}

/* 文本截断工具类 */
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>