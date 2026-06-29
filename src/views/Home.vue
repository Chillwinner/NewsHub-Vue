<template>
  <div class="page home-page">
    <div class="home-header">
      <h1 class="page-title">最新新闻</h1>
      <el-radio-group v-if="userStore.token" v-model="tab" @change="load">
        <el-radio-button value="all">全部</el-radio-button>
        <el-radio-button value="feed">关注</el-radio-button>
      </el-radio-group>
    </div>

    <el-skeleton v-if="loading" :rows="5" animated />
    <el-empty v-else-if="!list.length" :description="tab === 'feed' ? '关注的人还没有发布新闻' : '暂无新闻'" />
    <template v-else>
      <NewsCard v-for="item in list" :key="item.id" :news="item" />
      <el-pagination
        v-if="totalPages > 1"
        class="home-pagination"
        layout="prev, pager, next"
        :total="totalPages * 10"
        :current-page="page"
        background
        @current-change="goPage"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { getAllNews, getFeedNews } from '@/api/news'
import NewsCard from '@/components/NewsCard.vue'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()
const list = ref<any[]>([])
const page = ref(1)
const totalPages = ref(1)
const tab = ref('all')
const loading = ref(false)

async function load() {
  loading.value = true
  try {
    // 如果是"关注"标签且已登录，就获取关注的人的新闻
    const fetcher = tab.value === 'feed' && userStore.token ? getFeedNews : getAllNews
    const data: any = await fetcher(page.value, 20)

    // 后端可能返回分页对象 { records, pages } 或者直接返回数组
    if (data && data.records) {
      list.value = data.records
      totalPages.value = data.pages || 1
    } else if (Array.isArray(data)) {
      list.value = data
      totalPages.value = 1
    } else {
      list.value = []
    }
  } catch (e: any) {
    ElMessage.error(e.message || '加载失败')
    list.value = []
  } finally {
    loading.value = false
  }
}

function goPage(p: number) {
  page.value = p
  load()
}

onMounted(() => load())
</script>

<style scoped>
.home-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28px;
}
.home-pagination {
  justify-content: center;
  margin-top: 32px;
}
</style>
