<template>
  <div class="page">
    <el-skeleton v-if="loading" :rows="10" animated />
    <el-alert v-else-if="error" :title="error" type="error" show-icon />
    <template v-else-if="news">
      <el-card>
        <h1 class="article-title">{{ news.title }}</h1>
        <div class="article-meta">
          <div class="article-author">
            <el-avatar :size="30" class="avatar">{{ firstChar }}</el-avatar>
            <router-link :to="`/user/${news.authorId}`" class="author-link">{{ authorName }}</router-link>
          </div>
          <span class="article-time">{{ news.createTime.slice(0, 16).replace('T', ' ') }}</span>
          <el-button size="small" round @click="handleLike">👍 {{ news.likeCount }}</el-button>
          <!-- 只有作者能看到编辑和删除按钮 -->
          <template v-if="userStore.user && userStore.user.id === news.authorId">
            <router-link :to="`/news/edit/${news.id}`">
              <el-button size="small" round>编辑</el-button>
            </router-link>
            <el-button size="small" round type="danger" @click="handleDelete">删除</el-button>
          </template>
        </div>
        <p class="article-body">{{ news.content }}</p>
      </el-card>

      <el-card class="comment-section">
        <template #header><span>评论</span></template>

        <!-- 评论输入框（需要登录才能评论） -->
        <div v-if="userStore.token" class="comment-form">
          <el-input v-model="commentContent" type="textarea" :rows="3" placeholder="写下你的评论..." resize="none" />
          <div class="comment-form-actions">
            <el-button type="primary" size="small" round :disabled="!commentContent.trim()" @click="handlePostComment">
              发表评论
            </el-button>
            <el-button v-if="replyToId" size="small" round @click="replyToId = null">取消回复</el-button>
          </div>
          <p v-if="replyToId" class="replying-hint">回复中...</p>
        </div>
        <p v-else class="login-hint">
          <router-link to="/login" class="form-link">登录</router-link>后可以评论
        </p>

        <!-- 评论列表 -->
        <el-empty v-if="!comments.length" description="暂无评论" :image-size="80" />
        <CommentItem
          v-for="c in comments"
          :key="c.id"
          :comment="c"
          :show-reply="!!userStore.token"
          @delete="handleDeleteComment"
          @reply="(id: number) => (replyToId = id)"
        />
      </el-card>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { getNewsDetail, likeNews, deleteNews } from '@/api/news'
import { createComment, getNewsComments, deleteComment } from '@/api/comment'
import { getUserInfo } from '@/api/user'
import CommentItem from '@/components/CommentItem.vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const news = ref<any>(null)
const comments = ref<any[]>([])
const commentContent = ref('')
const replyToId = ref<number | null>(null)
const authorName = ref('')
const loading = ref(false)
const error = ref('')

// 头像显示的第一个字
const firstChar = computed(() => {
  if (authorName.value) {
    return authorName.value.charAt(0)
  }
  return String(news.value?.authorId || '?')
})

// 加载新闻详情和评论
async function load() {
  loading.value = true
  error.value = ''
  try {
    const id = Number(route.params.id)
    // 同时加载新闻和评论
    const [n, c] = await Promise.all([getNewsDetail(id), getNewsComments(id)])
    news.value = n
    comments.value = (c as any[]) || []

    // 获取作者名字
    const u = await getUserInfo(news.value.authorId)
    if (u) {
      authorName.value = u.nickname || `用户#${u.id}`
    }
  } catch (e: any) {
    error.value = e.message || '加载失败'
  } finally {
    loading.value = false
  }
}

// 点赞
async function handleLike() {
  try {
    await likeNews(news.value.id)
    news.value.likeCount++
    ElMessage.success('点赞成功')
  } catch (e: any) {
    ElMessage.error(e.message || '点赞失败')
  }
}

// 删除新闻
async function handleDelete() {
  try {
    await ElMessageBox.confirm('确定要删除这条新闻吗？', '提示', { type: 'warning' })
  } catch {
    return // 用户取消
  }
  try {
    await deleteNews(news.value.id)
    ElMessage.success('已删除')
    router.push('/')
  } catch (e: any) {
    ElMessage.error(e.message || '删除失败')
  }
}

// 发表评论
async function handlePostComment() {
  if (!commentContent.value.trim()) {
    return
  }
  try {
    const c = await createComment(news.value.id, commentContent.value, replyToId.value || undefined)
    commentContent.value = ''

    // 如果是回复某条评论，把新评论加到那条评论的 replies 里
    if (replyToId.value) {
      const parent = comments.value.find((x) => x.id === replyToId.value)
      if (parent) {
        if (!parent.replies) {
          parent.replies = []
        }
        parent.replies.push(c)
      }
    } else {
      // 否则加到顶级评论列表
      comments.value.push(c)
    }

    replyToId.value = null
    ElMessage.success('评论成功')
  } catch (e: any) {
    ElMessage.error(e.message || '评论失败')
  }
}

// 删除评论
async function handleDeleteComment(id: number) {
  try {
    await deleteComment(id)
    // 从顶级列表移除
    comments.value = comments.value.filter((c) => c.id !== id)
    // 从所有回复列表移除
    for (const c of comments.value) {
      if (c.replies) {
        c.replies = c.replies.filter((r: any) => r.id !== id)
      }
    }
    ElMessage.success('已删除')
  } catch (e: any) {
    ElMessage.error(e.message || '删除失败')
  }
}

onMounted(() => load())
</script>

<style scoped>
.article-title { font-size: 26px; font-weight: 700; margin: 0 0 20px; line-height: 1.35; }
.article-meta {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 28px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border);
  flex-wrap: wrap;
}
.article-author { display: flex; align-items: center; gap: 10px; }
.author-link { color: var(--primary); font-weight: 500; text-decoration: none; font-size: 14px; }
.article-time { color: var(--text-muted); font-size: 13px; }
.article-body { white-space: pre-wrap; line-height: 1.85; font-size: 15px; color: var(--text-secondary); }
.comment-section { margin-top: 16px; }
.comment-form {
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border);
}
.comment-form-actions { display: flex; gap: 10px; margin-top: 12px; }
.replying-hint { color: var(--primary); font-size: 13px; margin: 10px 0 0; }
.login-hint { color: var(--text-muted); margin-bottom: 16px; font-size: 14px; }
.form-link { color: var(--primary); text-decoration: none; }
</style>
