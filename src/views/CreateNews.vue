<template>
  <div class="page form-page">
    <el-card class="form-card">
      <h2 class="form-title">发布新闻</h2>
      <el-form @submit.prevent="handleSubmit" label-position="top">
        <el-form-item label="标题">
          <el-input v-model="title" placeholder="请输入新闻标题" size="large" />
        </el-form-item>
        <el-form-item label="内容">
          <el-input v-model="content" type="textarea" :rows="10" placeholder="请输入新闻正文..." resize="vertical" />
        </el-form-item>
        <el-alert v-if="error" :title="error" type="error" show-icon class="form-alert" />
        <div class="form-actions">
          <el-button type="primary" size="large" round :loading="loading" native-type="submit">发布</el-button>
          <el-button size="large" round @click="router.push('/')">取消</el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { createNews } from '@/api/news'
import { ElMessage } from 'element-plus'

const router = useRouter()
const title = ref('')
const content = ref('')
const loading = ref(false)
const error = ref('')

async function handleSubmit() {
  loading.value = true
  error.value = ''
  try {
    const news: any = await createNews(title.value, content.value)
    ElMessage.success('发布成功')
    router.push(`/news/${news.id}`)
  } catch (e: any) {
    error.value = e.message || '发布失败'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.form-page { display: flex; justify-content: center; padding: 40px 20px; }
.form-card { width: 100%; max-width: 780px; }
.form-title { margin: 0 0 24px; font-size: 20px; font-weight: 700; }
.form-alert { margin-bottom: 16px; }
.form-actions { display: flex; gap: 10px; }
</style>
