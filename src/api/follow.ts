import http from '@/composables/useRequest'

export function followUser(authorId: number) {
  return http.post(`/write/follow/${authorId}`)
}

export function unfollowUser(authorId: number) {
  return http.post(`/write/follow/unfollow/${authorId}`)
}

export function checkFollow(authorId: number) {
  return http.get(`/read/follow/check/${authorId}`)
}

export function getFollowing() {
  return http.get('/read/follow/following')
}

export function getFollowers(authorId: number) {
  return http.get(`/read/follow/${authorId}/followers`)
}

export function getFollowCounts(userId: number) {
  return http.get(`/read/follow/counts/${userId}`)
}
