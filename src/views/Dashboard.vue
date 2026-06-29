<template>
  <div class="page">
    <el-skeleton v-if="loading" :rows="8" animated />
    <el-alert v-else-if="error" :title="error" type="error" show-icon />
    <template v-else-if="userStore.user">
      <!-- 个人信息卡片 -->
      <el-card class="profile-card">
        <el-avatar :size="72" class="profile-avatar">{{ firstChar }}</el-avatar>
        <h2 class="profile-name">{{ userStore.user.nickname || `用户#${userStore.user.id}` }}</h2>
        <p class="profile-phone">{{ userStore.user.phone }}</p>
        <p v-if="userStore.user.email" class="profile-email">{{ userStore.user.email }}</p>
        <div class="profile-stats">
          <div class="stat-item">
            <strong class="stat-num">{{ counts.followers }}</strong>
            <div class="stat-label">粉丝</div>
          </div>
          <div class="stat-item">
            <strong class="stat-num">{{ counts.following }}</strong>
            <div class="stat-label">关注</div>
          </div>
        </div>
      </el-card>

      <!-- 编辑资料 -->
      <el-card class="section-card">
        <template #header>编辑资料</template>
        <el-form @submit.prevent="handleUpdateProfile" label-width="60px">
          <el-form-item label="昵称">
            <el-input v-model="editNickname" />
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="editEmail" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" round :loading="profileLoading" native-type="submit">保存</el-button>
            <span v-if="profileMsg" class="profile-msg">{{ profileMsg }}</span>
          </el-form-item>
        </el-form>
      </el-card>

      <!-- 我的新闻 -->
      <el-card class="section-card">
        <template #header>我的新闻</template>
        <el-empty v-if="!myNews.length" description="你还没有发布新闻" :image-size="80" />
        <NewsCard v-for="item in myNews" :key="item.id" :news="item" />
      </el-card>

      <!-- 关注列表 -->
      <el-card class="section-card">
        <template #header>关注列表</template>
        <el-empty v-if="!followingList.length" description="暂无关注" :image-size="80" />
        <div v-for="u in followingList" :key="u.id" class="follow-item">
          <el-avatar :size="32" class="avatar-sm">{{ (u.nickname || String(u.id)).charAt(0) }}</el-avatar>
          <router-link :to="`/user/${u.id}`" class="follow-link">{{ u.nickname || `用户#${u.id}` }}</router-link>
        </div>
      </el-card>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { getUserNews } from '@/api/news'
import { getFollowing, getFollowCounts } from '@/api/follow'
import NewsCard from '@/components/NewsCard.vue'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()

const myNews = ref<any[]>([])
const followingList = ref<any[]>([])
const counts = ref({ followers: 0, following: 0 })
const editNickname = ref('')
const editEmail = ref('')
const profileMsg = ref('')
const profileLoading = ref(false)
const loading = ref(false)
const error = ref('')

// 头像显示的第一个字
const firstChar = computed(() => {
  if (userStore.user && userStore.user.nickname) {
    return userStore.user.nickname.charAt(0)
  }
  return String(userStore.user?.id || '?')
})

// 加载页面数据
onMounted(async () => {
  loading.value = true
  error.value = ''
  try {
    // 先刷新自己的信息
    await userStore.fetchMyInfo()
    const u = userStore.user
    if (!u) {
      return
    }

    // 填充编辑表单
    editNickname.value = u.nickname || ''
    editEmail.value = u.email || ''

    // 同时加载：我的新闻、关注列表、关注数量
    const [newsData, followingData, countsData] = await Promise.all([
      getUserNews(u.id),
      getFollowing(),
      getFollowCounts(u.id)
    ])

    // 处理新闻列表（后端可能返回数组或分页对象）
    const nd = newsData as any
    if (nd && nd.records) {
      myNews.value = nd.records
    } else if (Array.isArray(nd)) {
      myNews.value = nd
    } else {
      myNews.value = []
    }

    followingList.value = (followingData as any[]) || []

    const c = countsData as any
    counts.value = {
      followers: c?.followers || 0,
      following: c?.following || 0
    }
  } catch (e: any) {
    error.value = e.message || '加载失败'
  } finally {
    loading.value = false
  }
})

// 更新个人资料
async function handleUpdateProfile() {
  profileLoading.value = true
  profileMsg.value = ''
  try {
    await userStore.updateMyProfile(editNickname.value || undefined, editEmail.value || undefined)
    profileMsg.value = '保存成功'
    ElMessage.success('保存成功')
  } catch {
    profileMsg.value = '保存失败'
  } finally {
    profileLoading.value = false
  }
}
</script>

<style scoped>
.profile-card { text-align: center; margin-bottom: 16px; padding-bottom: 28px; }
.profile-avatar { background: var(--primary) !important; }
.avatar-sm { background: var(--primary) !important; }
.profile-name { margin: 16px 0 6px; font-size: 20px; font-weight: 700; }
.profile-phone { color: var(--text-secondary); margin: 0; font-size: 14px; }
.profile-email { color: var(--text-muted); margin: 4px 0 0; font-size: 13px; }
.profile-stats { margin-top: 24px; display: flex; justify-content: center; gap: 56px; }
.stat-num { font-size: 24px; font-weight: 700; color: var(--primary); }
.stat-label {
  color: var(--text-muted);
  font-size: 12px;
  margin-top: 4px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.section-card { margin-bottom: 16px; }
.profile-msg { color: #10b981; margin-left: 12px; font-size: 13px; }
.follow-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid var(--border);
}
.follow-item:last-child { border-bottom: none; }
.follow-link { color: var(--primary); font-weight: 500; text-decoration: none; font-size: 14px; }
</style>
