import http from '@/composables/useRequest'

export function createNews(title: string, content: string) {
  return http.post('/write/news', { title, content })
}

export function getNewsDetail(id: number) {
  return http.get(`/read/news/${id}`)
}

export function getAllNews(page: number, size: number) {
  return http.get('/read/news/all', { params: { page, size } })
}

export function getFeedNews(page: number, size: number) {
  return http.get('/read/news/feed', { params: { page, size } })
}

export function getUserNews(authorId: number) {
  return http.get(`/read/news/author/${authorId}`)
}

export function updateNews(id: number, title: string, content: string) {
  return http.put(`/write/news/${id}`, { title, content })
}

export function likeNews(id: number) {
  return http.post(`/write/news/${id}/like`)
}

export function deleteNews(id: number) {
  return http.delete(`/write/news/${id}`)
}
