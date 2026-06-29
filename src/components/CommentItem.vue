<template>
  <div class="comment-item">
    <div class="comment-body">
      <el-avatar :size="34" class="avatar">{{ firstChar }}</el-avatar>
      <div class="comment-content">
        <div class="comment-header">
          <span class="comment-name">{{ comment.userNickname || `用户#${comment.userId}` }}</span>
          <span class="comment-time">{{ comment.createTime.slice(0, 16).replace('T', ' ') }}</span>
        </div>
        <p class="comment-text">{{ comment.content }}</p>
        <div class="comment-actions">
          <el-button text size="small" class="action-btn" @click="handleLike">👍 {{ comment.likeCount }}</el-button>
          <el-button v-if="showReply" text size="small" class="action-btn" @click="$emit('reply', comment.id)">
            回复
          </el-button>
          <el-button v-if="isOwner" text size="small" type="danger" class="action-btn" @click="$emit('delete', comment.id)">
            删除
          </el-button>
        </div>
      </div>
    </div>

    <!-- 子评论（回复） -->
    <div v-if="comment.replies && comment.replies.length" class="comment-replies">
      <div v-for="r in comment.replies" :key="r.id" class="reply-item">
        <div class="comment-body">
          <el-avatar :size="28" class="avatar avatar-sm">{{ (r.userNickname || String(r.userId)).charAt(0) }}</el-avatar>
          <div class="comment-content">
            <div class="comment-header">
              <span class="comment-name">{{ r.userNickname || `用户#${r.userId}` }}</span>
              <span class="comment-time">{{ r.createTime.slice(0, 16).replace('T', ' ') }}</span>
            </div>
            <p class="comment-text">{{ r.content }}</p>
            <div class="comment-actions">
              <el-button text size="small" class="action-btn" @click="handleLikeReply(r)">👍 {{ r.likeCount }}</el-button>
              <el-button v-if="isReplyOwner(r)" text size="small" type="danger" class="action-btn" @click="$emit('delete', r.id)">
                删除
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { likeComment } from '@/api/comment'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

const props = defineProps<{
  comment: any
  showReply?: boolean
}>()

defineEmits<{
  delete: [id: number]
  reply: [parentId: number]
}>()

const userStore = useUserStore()

// 头像显示的第一个字
const firstChar = computed(() => {
  if (props.comment.userNickname) {
    return props.comment.userNickname.charAt(0)
  }
  return String(props.comment.userId)
})

// 判断是不是自己的评论
const isOwner = computed(() => {
  if (!userStore.user) {
    return false
  }
  return userStore.user.id === props.comment.userId
})

// 判断回复是不是自己的
function isReplyOwner(reply: any) {
  if (!userStore.user) {
    return false
  }
  return userStore.user.id === reply.userId
}

// 点赞
async function handleLike() {
  try {
    await likeComment(props.comment.id)
    props.comment.likeCount++
  } catch (e: any) {
    ElMessage.error(e.message || '点赞失败')
  }
}

// 给回复点赞
async function handleLikeReply(reply: any) {
  try {
    await likeComment(reply.id)
    reply.likeCount++
  } catch (e: any) {
    ElMessage.error(e.message || '点赞失败')
  }
}
</script>

<style scoped>
.comment-item { padding: 14px 0; border-bottom: 1px solid var(--border); }
.comment-item:last-child { border-bottom: none; }
.comment-body { display: flex; align-items: flex-start; gap: 10px; }
.comment-content { flex: 1; min-width: 0; }
.comment-header { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
.comment-name { font-weight: 600; font-size: 13px; }
.comment-time { color: var(--text-muted); font-size: 12px; }
.comment-text { margin: 0 0 8px; font-size: 14px; line-height: 1.65; color: var(--text-secondary); }
.comment-actions { display: flex; gap: 6px; }
.action-btn { font-size: 12px; color: var(--text-muted); }
.comment-replies {
  margin-top: 8px;
  margin-left: 20px;
  padding-left: 14px;
  border-left: 2px solid var(--border);
}
.reply-item { padding: 8px 0; }
</style>
