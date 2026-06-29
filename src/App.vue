<template>
  <ParticleBackground />
  <el-config-provider :locale="zhCn">
    <el-container class="app-container">
      <el-header class="app-header" height="64px">
        <div class="header-inner">
          <router-link to="/" class="logo">Pulse</router-link>
          <div class="nav-links">
            <template v-if="userStore.user">
              <router-link to="/news/create">
                <el-button type="primary" round>发布</el-button>
              </router-link>
              <router-link to="/dashboard">
                <el-button round>个人中心</el-button>
              </router-link>
              <el-button text class="logout-btn" @click="handleLogout">退出</el-button>
            </template>
            <template v-else>
              <router-link to="/login">
                <el-button text>登录</el-button>
              </router-link>
              <router-link to="/register">
                <el-button type="primary" round>注册</el-button>
              </router-link>
            </template>
          </div>
        </div>
      </el-header>
      <el-main class="app-main">
        <router-view />
      </el-main>
    </el-container>
  </el-config-provider>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import ParticleBackground from '@/components/ParticleBackground.vue'

const userStore = useUserStore()
const router = useRouter()

function handleLogout() {
  userStore.logout()
  router.push('/')
}

onMounted(() => {
  if (userStore.token && !userStore.user) {
    userStore.fetchMyInfo()
  }
})
</script>

<style>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.app-container > .el-main {
  padding: 0 !important;
  margin: 0 auto;
  width: 80vw;
  max-width: 1100px;
  min-width: 520px;
}
</style>

<style scoped>
.app-header {
  background: transparent !important;
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  width: 100% !important;
  max-width: none !important;
  padding: 0 !important;
}
.header-inner {
  width: 80vw;
  max-width: 1100px;
  min-width: 520px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}
.logo {
  font-size: 20px;
  font-weight: 700;
  color: var(--primary);
  text-decoration: none;
  letter-spacing: 0.06em;
}
.nav-links {
  display: flex;
  align-items: center;
  gap: 12px;
}
.app-main {
  flex: 1;
}
.logout-btn {
  color: var(--text-muted);
}
</style>
