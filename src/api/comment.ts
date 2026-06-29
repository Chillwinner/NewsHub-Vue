import http from '@/composables/useRequest'

export function createComment(newsId: number, content: string, parentId?: number) {
  return http.post('/write/comment', { newsId, content, parentId: parentId || 0 })
}

export function getNewsComments(newsId: number) {
  return http.get(`/read/comment/news/${newsId}`)
}

export function updateComment(id: number, content: string) {
  return http.put(`/write/comment/${id}`, { content })
}

export function likeComment(id: number) {
  return http.post(`/write/comment/${id}/like`)
}

export function deleteComment(id: number) {
  return http.delete(`/write/comment/${id}`)
}
