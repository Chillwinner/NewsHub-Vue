import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/Home.vue'),
      meta: { title: '首页' }
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/Login.vue'),
      meta: { title: '登录' }
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/views/Register.vue'),
      meta: { title: '注册' }
    },
    {
      path: '/news/create',
      name: 'CreateNews',
      component: () => import('@/views/CreateNews.vue'),
      meta: { title: '发布新闻', requiresAuth: true }
    },
    {
      path: '/news/:id',
      name: 'NewsDetail',
      component: () => import('@/views/NewsDetail.vue'),
      meta: { title: '新闻详情' }
    },
    {
      path: '/news/edit/:id',
      name: 'EditNews',
      component: () => import('@/views/EditNews.vue'),
      meta: { title: '编辑新闻', requiresAuth: true }
    },
    {
      path: '/user/:id',
      name: 'UserProfile',
      component: () => import('@/views/UserProfile.vue'),
      meta: { title: '用户主页' }
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('@/views/Dashboard.vue'),
      meta: { title: '个人中心', requiresAuth: true }
    }
  ]
})

// 路由守卫：需要登录的页面，没登录就跳转到登录页
router.beforeEach((to, _from, next) => {
  document.title = to.meta.title as string
  if (to.meta.requiresAuth) {
    const store = useUserStore()
    if (!store.token) {
      next('/login')
      return
    }
  }
  next()
})

export default router
