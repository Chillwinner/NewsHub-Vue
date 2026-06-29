import http from '@/composables/useRequest'

export function register(phone: string, password: string, nickname?: string, email?: string) {
  return http.post('/write/user/register', { phone, password, nickname, email })
}

export function login(phone: string, password: string) {
  return http.post('/write/user/login', null, { params: { phone, password } })
}

export function getUserInfo(id: number) {
  return http.get(`/read/user/${id}`)
}

export function updateProfile(nickname?: string, email?: string) {
  return http.put('/write/user/profile', { nickname, email })
}
