// 用户
export interface User {
  id: number
  phone: string
  password: string | null
  nickname: string
  email: string
  createTime: string
}

// 新闻
export interface NewsItem {
  id: number
  title: string
  content: string
  authorId: number
  authorNickname?: string
  likeCount: number
  createTime: string
}

// 评论
export interface Comment {
  id: number
  newsId: number
  userId: number
  content: string
  parentId: number | null
  likeCount: number
  createTime: string
  userNickname: string | null
  replies: Comment[]
}

// 关注数量
export interface FollowCounts {
  followers: number
  following: number
}
