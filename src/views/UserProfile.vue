<template>
  <div class="page">
    <el-skeleton v-if="loading" :rows="6" animated />
    <el-alert v-else-if="error" :title="error" type="error" show-icon />
    <template v-else-if="profileUser">
      <!-- 用户信息卡片 -->
      <el-card class="profile-card">
        <el-avatar :size="72" class="profile-avatar">{{ firstChar }}</el-avatar>
        <h2 class="profile-name">{{ profileUser.nickname || `用户#${profileUser.id}` }}</h2>
        <p class="profile-phone">{{ profileUser.phone }}</p>
        <p v-if="profileUser.email" class="profile-email">{{ profileUser.email }}</p>
        <p class="profile-meta">注册于 {{ profileUser.createTime.slice(0, 10) }}</p>
        <div class="profile-stats">
          <span class="stat-item"><strong class="stat-num">{{ counts.followers }}</strong> 粉丝</span>
          <span class="stat-item"><strong class="stat-num">{{ counts.following }}</strong> 关注</span>
        </div>
        <!-- 只有登录了且不是自己才能关注 -->
        <el-button
          v-if="userStore.token && userStore.user && profileUser.id !== userStore.user.id"
          :type="isFollowing ? 'info' : 'primary'"
          round
          class="follow-btn"
          @click="handleFollow"
        >
          {{ isFollowing ? '已关注' : '关注' }}
        </el-button>
      </el-card>

      <h3 class="section-title">TA 的新闻</h3>
      <el-empty v-if="!newsList.length" description="暂无新闻" :image-size="80" />
      <NewsCard v-for="item in newsList" :key="item.id" :news="item" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { getUserNews } from '@/api/news'
import { checkFollow, followUser, unfollowUser, getFollowCounts } from '@/api/follow'
import NewsCard from '@/components/NewsCard.vue'
import { ElMessage } from 'element-plus'

const route = useRoute()
const userStore = useUserStore()

const profileUser = ref<any>(null)
const newsList = ref<any[]>([])
const isFollowing = ref(false)
const counts = ref({ followers: 0, following: 0 })
const loading = ref(false)
const error = ref('')

const targetId = computed(() => Number(route.params.id))

// 头像显示的第一个字
const firstChar = computed(() => {
  if (profileUser.value && profileUser.value.nickname) {
    return profileUser.value.nickname.charAt(0)
  }
  return String(profileUser.value?.id || '?')
})

// 加载页面数据
onMounted(async () => {
  loading.value = true
  error.value = ''
  try {
    const id = targetId.value

    // 同时加载：用户信息、TA的新闻、关注数量
    const [u, newsData, countsData] = await Promise.all([
      userStore.fetchUserInfo(id),
      getUserNews(id),
      getFollowCounts(targetId.value)
    ])

    profileUser.value = u

    // 处理新闻列表
    const nd = newsData as any
    if (nd && nd.records) {
      newsList.value = nd.records
    } else if (Array.isArray(nd)) {
      newsList.value = nd
    } else {
      newsList.value = []
    }

    const c = countsData as any
    counts.value = {
      followers: c?.followers || 0,
      following: c?.following || 0
    }

    // 如果已登录，检查是否关注了这个人
    if (userStore.token) {
      try {
        const res: any = await checkFollow(id)
        isFollowing.value = !!res
      } catch {
        // 忽略检查失败
      }
    }
  } catch (e: any) {
    error.value = e.message || '加载失败'
  } finally {
    loading.value = false
  }
})

// 关注/取消关注
async function handleFollow() {
  try {
    if (isFollowing.value) {
      await unfollowUser(targetId.value)
      isFollowing.value = false
      counts.value.followers = Math.max(0, counts.value.followers - 1)
    } else {
      await followUser(targetId.value)
      isFollowing.value = true
      counts.value.followers++
    }
  } catch (e: any) {
    ElMessage.error(e.message || '操作失败')
  }
}
</script>

<style scoped>
.profile-card { text-align: center; margin-bottom: 16px; padding-bottom: 28px; }
.profile-avatar { background: var(--primary) !important; }
.profile-name { margin: 16px 0 6px; font-size: 20px; font-weight: 700; }
.profile-phone { color: var(--text-secondary); margin: 0; font-size: 14px; }
.profile-email { color: var(--text-muted); margin: 4px 0 0; font-size: 13px; }
.profile-meta { color: var(--text-muted); font-size: 12px; margin: 10px 0 0; }
.profile-stats { margin-top: 20px; display: flex; justify-content: center; gap: 56px; }
.stat-num { font-size: 24px; font-weight: 700; color: var(--primary); }
.follow-btn { margin-top: 16px; }
.section-title {
  margin: 0 0 14px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
</style>
