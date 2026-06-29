<template>
  <div class="page form-page">
    <el-card class="form-card">
      <h2 class="form-title">编辑新闻</h2>
      <el-skeleton v-if="loading" :rows="6" animated />
      <template v-else>
        <el-form @submit.prevent="handleSubmit" label-position="top">
          <el-form-item label="标题">
            <el-input v-model="title" size="large" />
          </el-form-item>
          <el-form-item label="内容">
            <el-input v-model="content" type="textarea" :rows="10" resize="vertical" />
          </el-form-item>
          <el-alert v-if="error" :title="error" type="error" show-icon class="form-alert" />
          <div class="form-actions">
            <el-button type="primary" size="large" round :loading="saving" native-type="submit">保存</el-button>
            <router-link :to="`/news/${route.params.id}`">
              <el-button size="large" round>取消</el-button>
            </router-link>
          </div>
        </el-form>
      </template>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { getNewsDetail, updateNews } from '@/api/news'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const title = ref('')
const content = ref('')
const loading = ref(false)
const saving = ref(false)
const error = ref('')

// 加载新闻内容
onMounted(async () => {
  loading.value = true
  try {
    const data: any = await getNewsDetail(Number(route.params.id))
    // 如果不是作者本人，跳转回去
    if (userStore.user && userStore.user.id !== data.authorId) {
      router.replace(`/news/${route.params.id}`)
      return
    }
    title.value = data.title
    content.value = data.content
  } catch (e: any) {
    error.value = e.message || '加载失败'
  } finally {
    loading.value = false
  }
})

// 保存修改
async function handleSubmit() {
  saving.value = true
  error.value = ''
  try {
    await updateNews(Number(route.params.id), title.value, content.value)
    ElMessage.success('保存成功')
    router.push(`/news/${route.params.id}`)
  } catch (e: any) {
    error.value = e.message || '保存失败'
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.form-page { display: flex; justify-content: center; }
.form-card { width: 100%; max-width: 680px; }
.form-title { margin: 0 0 24px; font-size: 20px; font-weight: 700; }
.form-alert { margin-bottom: 16px; }
.form-actions { display: flex; gap: 10px; }
</style>
