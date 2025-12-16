<template>
  <div class="player-component">
    <div class="player-info">
      <div class="album-cover">
        <img :src="musicInfo.cover || 'https://via.placeholder.com/64x64/42b983/ffffff?text=🎵'" :alt="musicInfo.title" />
      </div>
      <div class="music-details">
        <h4 class="music-title">{{ musicInfo.title }}</h4>
        <p class="music-artist">{{ musicInfo.artist }}</p>
      </div>
    </div>
    
    <!-- 添加直接的HTML5 audio元素 -->
    <audio 
      ref="audioElement" 
      :src="musicInfo.url" 
      @timeupdate="updateProgress"
      @loadedmetadata="onLoadedMetadata"
      @ended="onAudioEnded"
      @error="onAudioError"
      @loadstart="onLoadStart"
      @canplaythrough="onCanPlayThrough"
    ></audio>
    
    <div class="player-controls">
      <div class="progress-section">
        <span class="time current-time">{{ formatTime(currentTime) }}</span>
        <div class="progress-container" :style="{ '--progress-width': progressPercentage + '%' }">
          <div 
            class="progress-bar"
            :style="{ width: progressPercentage + '%' }"
            @click="jumpToPosition"
            @touchstart="jumpToPosition"
          ></div>
          <div 
            class="progress-handle"
            @mousedown="startDrag"
            @touchstart="startDrag"
          ></div>
        </div>
        <span class="time total-time">{{ formatTime(duration) }}</span>
      </div>
      
      <div class="control-buttons">
        <el-button 
          type="text" 
          size="large"
          @click="togglePlay"
        >
          <el-icon :size="32">
            <VideoPlay v-if="!isPlaying" />
            <VideoPause v-else />
          </el-icon>
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { VideoPlay, VideoPause } from '@element-plus/icons-vue'

// 定义组件属性
const props = defineProps({
  // 音乐信息
  musicInfo: {
    type: Object,
    required: true,
    default: () => ({
      title: '未知歌曲',
      artist: '未知艺术家',
      cover: 'https://via.placeholder.com/64x64/42b983/ffffff?text=🎵',
      url: ''
    })
  },
  // 是否自动播放
  autoplay: {
    type: Boolean,
    default: false
  }
})

// 播放器状态
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const isDragging = ref(false)

// 创建音频元素
const audioElement = ref(null)

// 计算属性
const progressPercentage = computed(() => {
  if (duration.value === 0) return 0
  return (currentTime.value / duration.value) * 100
})

// 格式化时间
const formatTime = (time) => {
  if (!time) return '0:00'
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

// 播放/暂停切换
const togglePlay = () => {
  console.log('===== 开始执行togglePlay方法 =====')
  console.log('当前播放状态:', isPlaying.value)
  
  // 检查音频元素是否存在
  if (!audioElement.value) {
    console.error('播放失败：音频元素不存在')
    
    // 如果音频元素不存在，尝试重新初始化
    if (props.musicInfo?.url && props.musicInfo.url !== '#' && props.musicInfo.url !== '') {
      console.log('尝试重新初始化音频元素:', props.musicInfo.url)
      initAudio(props.musicInfo.url)
      
      // 延迟一下，确保音频元素已经初始化完成
      setTimeout(() => {
        console.log('重新初始化后，再次尝试播放')
        if (audioElement.value) {
          audioElement.value.play().then(() => {
            console.log('重新初始化后，音频播放成功')
            isPlaying.value = true
          }).catch(err => {
            console.error('重新初始化后，播放仍然失败:', err)
          })
        }
      }, 100)
    }
    
    return
  }
  
  console.log('音频元素src:', audioElement.value.src)
  console.log('音频元素readyState:', audioElement.value.readyState)
  console.log('音频元素networkState:', audioElement.value.networkState)
  console.log('音频元素error:', audioElement.value.error)
  
  // 检查音频是否可以播放
  if (audioElement.value.readyState === 0) {
    console.error('音频尚未加载完成，readyState:', audioElement.value.readyState)
    
    // 尝试重新加载音频
    audioElement.value.load()
    
    // 等待音频加载完成后再播放
    audioElement.value.addEventListener('canplaythrough', function() {
      console.log('音频加载完成，可以播放了')
      audioElement.value.play().then(() => {
        console.log('音频播放成功')
        isPlaying.value = true
      }).catch(err => {
        console.error('播放失败:', err)
      })
    }, { once: true })
    
    return
  }
  
  if (isPlaying.value) {
    console.log('执行暂停操作')
    audioElement.value.pause()
    isPlaying.value = false
    console.log('暂停完成')
  } else {
    // 捕获play()可能抛出的错误
    console.log('尝试播放音频')
    audioElement.value.play().then(() => {
      console.log('音频播放成功')
      isPlaying.value = true
    }).catch(err => {
      console.error('===== 播放失败 =====')
      console.error('错误对象:', err)
      console.error('错误类型:', err.name)
      console.error('错误信息:', err.message)
      console.error('错误堆栈:', err.stack)
      
      // 检查是否是自动播放限制
      if (err.name === 'NotAllowedError') {
        console.error('播放失败原因：浏览器自动播放限制')
      }
      
      // 尝试手动触发播放（用户交互后应该可以播放）
      console.log('尝试再次播放...')
      audioElement.value.play().then(() => {
        console.log('第二次尝试，音频播放成功')
        isPlaying.value = true
      }).catch(secondErr => {
        console.error('第二次尝试播放仍然失败:', secondErr)
      })
      
      // 处理自动播放限制或其他错误
      isPlaying.value = false
    })
  }
  
  console.log('===== togglePlay方法执行完成 =====')
}

// 更新播放进度
const updateProgress = () => {
  if (!audioElement.value || isDragging.value) return
  
  currentTime.value = audioElement.value.currentTime
  duration.value = audioElement.value.duration
}

// 音频元数据加载完成事件处理
const onLoadedMetadata = () => {
  console.log('===== 音频元数据加载完成 =====')
  if (audioElement.value) {
    console.log('音频时长:', audioElement.value.duration)
    duration.value = audioElement.value.duration
  }
}

// 音频播放结束事件处理
const onAudioEnded = () => {
  console.log('===== 音频播放结束 =====')
  isPlaying.value = false
  currentTime.value = 0
}

// 音频播放错误事件处理
const onAudioError = (e) => {
  console.error('===== 音频播放错误 =====')
  console.error('错误事件:', e)
  console.error('错误代码:', audioElement.value?.error?.code)
  
  let errorType = ''
  if (audioElement.value?.error) {
    switch (audioElement.value.error.code) {
      case 1: errorType = 'MEDIA_ERR_ABORTED: 用户中止了播放'; break;
      case 2: errorType = 'MEDIA_ERR_NETWORK: 网络错误'; break;
      case 3: errorType = 'MEDIA_ERR_DECODE: 解码错误'; break;
      case 4: errorType = 'MEDIA_ERR_SRC_NOT_SUPPORTED: 不支持的音频格式'; break;
      default: errorType = '未知错误';
    }
    console.error('错误类型:', errorType)
  }
  
  isPlaying.value = false
}

// 音频加载开始事件处理
const onLoadStart = () => {
  console.log('===== 音频加载开始 =====')
}

// 音频可以播放事件处理
const onCanPlayThrough = () => {
  console.log('===== 音频可以播放 =====')
  console.log('音频元素readyState:', audioElement.value?.readyState)
  
  // 如果设置了自动播放，并且当前不是播放状态，则尝试播放
  if (props.autoplay && !isPlaying.value && props.musicInfo?.url) {
    console.log('自动播放条件满足，尝试播放')
    togglePlay()
  }
}

// 计算新的进度百分比
const calculateProgressPercentage = (clientX) => {
  if (!audioElement.value) return 0
  
  const progressContainer = document.querySelector('.progress-container')
  const rect = progressContainer.getBoundingClientRect()
  
  // 计算百分比
  let percentage = ((clientX - rect.left) / rect.width) * 100
  return Math.max(0, Math.min(100, percentage))
}

// 设置新的播放位置
const setNewPlayPosition = (percentage) => {
  if (!audioElement.value || duration.value === 0) return
  
  const newTime = (percentage / 100) * duration.value
  currentTime.value = newTime
  
  // 如果不是拖动状态，直接设置音频播放位置
  if (!isDragging.value) {
    audioElement.value.currentTime = newTime
    
    // 如果之前是播放状态，确保继续播放
    if (isPlaying.value) {
      audioElement.value.play()
    }
  }
}

// 开始拖动进度条
const startDrag = (e) => {
  isDragging.value = true
  handleDrag(e)
  
  // 添加拖动状态类
  const progressContainer = document.querySelector('.progress-container')
  progressContainer.classList.add('is-dragging')
  
  // 添加全局事件监听器
  document.addEventListener('mousemove', handleDrag)
  document.addEventListener('touchmove', handleDrag)
  document.addEventListener('mouseup', stopDrag)
  document.addEventListener('touchend', stopDrag)
}

// 处理拖动
const handleDrag = (e) => {
  if (!audioElement.value || !isDragging.value) return
  
  // 获取点击/触摸位置
  const clientX = e.touches ? e.touches[0].clientX : e.clientX
  
  // 计算百分比
  const percentage = calculateProgressPercentage(clientX)
  
  // 更新当前时间
  currentTime.value = (percentage / 100) * duration.value
}

// 停止拖动
const stopDrag = () => {
  if (!audioElement.value || !isDragging.value) return
  
  // 移除拖动状态类
  const progressContainer = document.querySelector('.progress-container')
  progressContainer.classList.remove('is-dragging')
  
  // 设置音频播放位置
  audioElement.value.currentTime = currentTime.value
  
  // 如果之前是播放状态，继续播放
  if (isPlaying.value) {
    audioElement.value.play()
  }
  
  isDragging.value = false
  
  // 移除全局事件监听器
  document.removeEventListener('mousemove', handleDrag)
  document.removeEventListener('touchmove', handleDrag)
  document.removeEventListener('mouseup', stopDrag)
  document.removeEventListener('touchend', stopDrag)
}

// 点击进度条跳转
const jumpToPosition = (e) => {
  if (!audioElement.value || isDragging.value) return
  
  // 获取点击/触摸位置
  const clientX = e.touches ? e.touches[0].clientX : e.clientX
  
  // 计算百分比
  const percentage = calculateProgressPercentage(clientX)
  
  // 设置新的播放位置
  setNewPlayPosition(percentage)
}

// 初始化音频元素 - 使用模板中的audio元素
const initAudio = (url) => {
  console.log('===== 开始初始化音频元素 =====')
  console.log('接收到的URL:', url)
  console.log('URL类型:', typeof url)
  
  // 验证URL有效性
  if (!url) {
    console.error('初始化音频失败：URL为空')
    return
  }
  
  if (url === '#') {
    console.error('初始化音频失败：URL为"#"')
    return
  }
  
  // 确保音频元素引用存在（来自模板中的ref）
  if (!audioElement.value) {
    console.error('音频元素引用不存在，请检查模板中的ref="audioElement"')
    return
  }
  
  try {
    // 重置播放状态
    isPlaying.value = false
    currentTime.value = 0
    duration.value = 0
    
    console.log('使用模板中的音频元素，设置src为:', url)
    
    // 直接更新模板中audio元素的src
    audioElement.value.src = url
    
    // 加载音频
    audioElement.value.load()
    
    console.log('音频元素初始化完成')
    console.log('音频元素src:', audioElement.value.src)
    console.log('===== 音频元素初始化完成 =====')
  } catch (err) {
    console.error('===== 初始化音频元素失败 =====')
    console.error('错误:', err)
    isPlaying.value = false
  }
}

onMounted(() => {
  console.log('===== 播放器组件挂载完成 =====')
  console.log('初始音乐信息:', props.musicInfo)
  console.log('自动播放设置:', props.autoplay)
  
  // 由于watch配置了immediate: true，音频初始化将由watch处理
  // 这里不再重复初始化，避免冲突
  console.log('音频初始化将由watch监听器处理')
})

// 监听音乐信息对象变化
watch(
  () => props.musicInfo,
  (newMusicInfo, oldMusicInfo) => {
    console.log('===== 开始执行音乐信息对象变化监听 =====')
    console.log('旧音乐信息:', oldMusicInfo)
    console.log('新音乐信息:', newMusicInfo)
    
    // 确保新音乐信息对象存在
    if (!newMusicInfo) {
      console.error('新音乐信息对象为空')
      return
    }
    
    // 比较URL是否真正变化
    const newUrl = newMusicInfo?.url
    const oldUrl = oldMusicInfo?.url
    
    console.log('旧URL:', oldUrl)
    console.log('新URL:', newUrl)
    
    if (newUrl !== oldUrl) {
      console.log('URL已变化，重置播放状态并重新初始化音频')
      
      // 重置播放状态
      isPlaying.value = false
      currentTime.value = 0
      duration.value = 0
      
      // 确保URL有效
      if (newUrl && newUrl !== '#' && newUrl !== '') {
        console.log('有效的URL，开始初始化音频:', newUrl)
        initAudio(newUrl)
        
        // 如果需要自动播放新歌曲
        if (props.autoplay) {
          console.log('设置了自动播放，等待音频加载后调用togglePlay')
          // 延迟一下，确保音频元素已经初始化完成
          setTimeout(() => {
            togglePlay()
          }, 100)
        }
      } else {
        console.error('无效的URL，无法初始化音频:', newUrl)
        // 清理旧的音频元素
        if (audioElement.value) {
          audioElement.value.pause()
          audioElement.value = null
        }
      }
    }
    console.log('===== 音乐信息对象变化监听执行完成 =====')
  },
  { immediate: true, deep: true }
)

// 清理
onUnmounted(() => {
  if (audioElement.value) {
    audioElement.value.pause()
    audioElement.value.removeEventListener('timeupdate', updateProgress)
    audioElement.value.removeEventListener('loadedmetadata', () => {})
    audioElement.value.removeEventListener('ended', () => {})
  }
})
</script>

<style scoped>
.player-component {
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  gap: 16px;
}

.player-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.album-cover {
  width: 64px;
  height: 64px;
  border-radius: 4px;
  overflow: hidden;
  flex-shrink: 0;
}

.album-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.music-details {
  flex: 1;
  min-width: 0;
}

.music-title {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.music-artist {
  margin: 0;
  font-size: 14px;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.player-controls {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
  flex: 2;
}

.progress-section {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.time {
  font-size: 12px;
  color: #666;
  min-width: 45px;
  text-align: center;
}

.progress-container {
  flex: 1;
  height: 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
  position: relative;
  overflow: visible;
  display: flex;
  align-items: center;
}

.progress-bar {
  height: 100%;
  background-color: #42b983;
  border-radius: 4px;
  transition: width 0.1s ease;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
}

.progress-handle {
  position: absolute;
  left: var(--progress-width, 0%);
  top: 50%;
  transform: translate(-50%, -50%);
  width: 14px;
  height: 14px;
  background-color: #42b983;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
  z-index: 2;
}

.progress-handle:hover {
  transform: translate(-50%, -50%) scale(1.2);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
}

.progress-container:active .progress-handle,
.is-dragging .progress-handle {
  transform: translate(-50%, -50%) scale(1.3);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
}

.control-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>