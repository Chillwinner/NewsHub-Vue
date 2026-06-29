<template>
  <div class="page login-page">
    <el-card class="login-card">
      <div class="login-header">
        <div class="login-logo avatar-gradient">A</div>
        <h2 class="login-title">欢迎回来</h2>
        <p class="login-sub">登录你的 Pulse 账号</p>
      </div>
      <el-form @submit.prevent="handleLogin" label-position="top">
        <el-form-item label="手机号">
          <el-input v-model="phone" placeholder="请输入手机号" size="large" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="password" type="password" placeholder="请输入密码" size="large" show-password />
        </el-form-item>
        <el-alert v-if="error" :title="error" type="error" show-icon class="form-alert" />
        <el-button type="primary" size="large" class="submit-btn" :loading="loading" native-type="submit">
          登录
        </el-button>
      </el-form>
      <p class="form-switch">
        没有账号？
        <router-link to="/register" class="form-link">去注册</router-link>
      </p>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()
const router = useRouter()
const phone = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  loading.value = true
  error.value = ''
  try {
    await userStore.login(phone.value, password.value)
    ElMessage.success('登录成功')
    router.push('/')
  } catch (e: any) {
    error.value = e.message || '登录失败'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 64px);
  padding: 40px 20px;
}
.login-card {
  width: 100%;
  max-width: 440px;
}
.login-header {
  text-align: center;
  margin-bottom: 36px;
}
.login-logo {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  font-size: 22px;
  margin: 0 auto 16px;
}
.login-title {
  margin: 0 0 6px;
  font-size: 22px;
  font-weight: 700;
}
.login-sub {
  color: var(--text-muted);
  margin: 0;
  font-size: 14px;
}
.form-alert { margin-bottom: 16px; }
.submit-btn { width: 100%; height: 44px; font-size: 15px; font-weight: 600; }
.form-switch {
  text-align: center;
  margin-top: 24px;
  color: var(--text-muted);
  font-size: 13px;
}
.form-link { color: var(--primary); text-decoration: none; }
</style>
