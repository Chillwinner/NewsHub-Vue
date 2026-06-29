<template>
  <router-link :to="`/news/${news.id}`" class="news-link">
    <el-card shadow="hover" class="news-card">
      <div class="news-meta">
        <el-avatar :size="32" class="avatar">{{ firstChar }}</el-avatar>
        <div>
          <router-link :to="`/user/${news.authorId}`" class="news-author" @click.stop>
            {{ authorName }}
          </router-link>
          <div class="news-time">{{ news.createTime.slice(0, 16).replace('T', ' ') }}</div>
        </div>
      </div>
      <h3 class="news-title">{{ news.title }}</h3>
      <p class="news-excerpt">{{ news.content }}</p>
      <div class="news-footer">
        <span class="news-like">👍 {{ news.likeCount }}</span>
      </div>
    </el-card>
  </router-link>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getUserInfo } from '@/api/user'

const props = defineProps<{
  news: any
}>()

const authorName = ref(`用户#${props.news.authorId}`)

// 头像显示的第一个字
const firstChar = computed(() => {
  return authorName.value.charAt(0)
})

// 加载作者名字
onMounted(async () => {
  try {
    const u = await getUserInfo(props.news.authorId)
    if (u) {
      authorName.value = u.nickname || `用户#${u.id}`
    }
  } catch {
    // 加载失败就用默认的
  }
})
</script>

<style scoped>
.news-link { text-decoration: none; color: inherit; }
.news-card { cursor: pointer; margin-bottom: 12px; }
.news-card:hover { border-color: var(--text-muted) !important; }
.news-meta { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
.news-author { color: var(--primary); font-size: 13px; font-weight: 500; text-decoration: none; }
.news-time { color: var(--text-muted); font-size: 12px; }
.news-title { margin: 0 0 8px; font-size: 17px; font-weight: 600; line-height: 1.4; }
.news-excerpt {
  margin: 0;
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.65;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.news-footer { margin-top: 14px; padding-top: 12px; border-top: 1px solid var(--border); }
.news-like { font-size: 13px; color: var(--text-muted); }
</style>
