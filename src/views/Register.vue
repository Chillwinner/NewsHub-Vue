<template>
  <div class="page register-page">
    <el-card class="register-card">
      <div class="register-header">
        <div class="register-logo avatar-gradient">A</div>
        <h2 class="register-title">创建账号</h2>
        <p class="register-sub">加入 Pulse 新闻社区</p>
      </div>
      <el-form @submit.prevent="handleRegister" label-position="top">
        <el-form-item label="手机号">
          <el-input v-model="phone" placeholder="请输入手机号" size="large" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="password" type="password" placeholder="设置密码" size="large" show-password />
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="nickname" placeholder="给自己起个名字" size="large" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="email" placeholder="your@email.com" size="large" />
        </el-form-item>
        <el-alert v-if="error" :title="error" type="error" show-icon class="form-alert" />
        <el-alert v-if="success" title="注册成功，正在跳转登录" type="success" show-icon class="form-alert" />
        <el-button type="primary" size="large" class="submit-btn" :loading="loading" native-type="submit">
          注册
        </el-button>
      </el-form>
      <p class="form-switch">
        已有账号？
        <router-link to="/login" class="form-link">去登录</router-link>
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
const nickname = ref('')
const email = ref('')
const loading = ref(false)
const error = ref('')
const success = ref(false)

async function handleRegister() {
  loading.value = true
  error.value = ''
  success.value = false
  try {
    // 如果昵称或邮箱没填，就传 undefined
    await userStore.register(
      phone.value,
      password.value,
      nickname.value || undefined,
      email.value || undefined
    )
    success.value = true
    // 1 秒后跳转到登录页
    setTimeout(() => router.push('/login'), 1000)
  } catch (e: any) {
    error.value = e.message || '注册失败'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 64px);
  padding: 40px 20px;
}
.register-card {
  width: 100%;
  max-width: 440px;
}
.register-header {
  text-align: center;
  margin-bottom: 36px;
}
.register-logo {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  font-size: 22px;
  margin: 0 auto 16px;
  background: linear-gradient(135deg, #06b6d4, #3b82f6) !important;
}
.register-title {
  margin: 0 0 6px;
  font-size: 22px;
  font-weight: 700;
}
.register-sub {
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
