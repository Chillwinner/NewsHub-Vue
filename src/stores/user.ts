import { defineStore } from 'pinia'
import { ref } from 'vue'
import { login as apiLogin, register as apiRegister, getUserInfo, updateProfile } from '@/api/user'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '')
  const user = ref<any>(null)

  // 从本地恢复用户信息
  const saved = localStorage.getItem('user')
  if (saved) {
    user.value = JSON.parse(saved)
  }

  // 登录
  async function login(phone: string, password: string) {
    const t = await apiLogin(phone, password)
    token.value = t
    localStorage.setItem('token', t)

    // 从 token 中解析用户 id，再去拿用户信息
    try {
      const payload = JSON.parse(atob(t.split('.')[1]))
      const id = payload.id || payload.userId || payload.sub
      if (id) {
        const u = await getUserInfo(id)
        user.value = u
        localStorage.setItem('user', JSON.stringify(u))
      }
    } catch (e) {
      console.error('解析 token 失败', e)
    }
  }

  // 注册
  async function register(phone: string, password: string, nickname?: string, email?: string) {
    await apiRegister(phone, password, nickname, email)
  }

  // 刷新自己的信息
  async function fetchMyInfo() {
    if (!user.value) {
      return
    }
    const u = await getUserInfo(user.value.id)
    user.value = u
    localStorage.setItem('user', JSON.stringify(u))
  }

  // 获取别人的信息
  async function fetchUserInfo(id: number) {
    const u = await getUserInfo(id)
    return u
  }

  // 更新个人资料
  async function updateMyProfile(nickname?: string, email?: string) {
    const u = await updateProfile(nickname, email)
    user.value = u
    localStorage.setItem('user', JSON.stringify(u))
  }

  // 退出登录
  function logout() {
    token.value = ''
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return { token, user, login, register, fetchMyInfo, fetchUserInfo, updateMyProfile, logout }
})
