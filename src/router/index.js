import Vue from 'vue'
import VueRouter from 'vue-router'
import {getToken, Role} from '@/helpers/helpers'
// import {decodeJWT} from "@/use/auth";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    meta: {
      layout: 'blank',
    },
    redirect: '/pages/login',
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    meta: { layout: 'main'},
    component: () => import('../views/dashboard/Dashboard'),
  },
  {
    path: '/settings',
    name: 'settings',
    meta: { layout: 'main'},
    component: () => import('../views/Settings/Settings'),
  },
  {
    path: '/storage',
    name: 'storage',
    meta: { layout: 'main'},
    component: () => import('../views/Storage/index'),
  },
  {
    path: '/report',
    name: 'report',
    meta: { layout: 'main'},
    component: () => import('../views/report/index'),
  },
  {
    path: '/users',
    name: 'users',
    meta: { layout: 'main'},
    component: () => import('../views/UserController/index'),
  },
  {
  // , auth: true, authorize: [Role.User, Role.Admin]
    path: '/detail/:id',
    name: 'detail',
    meta: { layout: 'main'},
    component: () => import('@/views/Branches/index'),
  },
  {
    // , auth: true, authorize: [Role.User, Role.Admin]
    path: '/department-detail/:id',
    name: 'department-detail',
    meta: { layout: 'main'},
    component: () => import('@/views/Department/index'),
  },
  {
    // , auth: true, authorize: [Role.User, Role.Admin]
    path: '/employee-report',
    name: 'employee-report',
    meta: { layout: 'main'},
    component: () => import('@/views/report/components/reportByEmployee/reportByEmployee'),
  },
  {
    path: '/pages/login',
    name: 'pages-login',
    component: () => import('../views/pages/Login.vue'),
    meta: {
      layout: 'blank',
    },
  },
  {
    path: '/pages/register',
    name: 'pages-register',
    component: () => import('../views/pages/Register.vue'),
    meta: {
      layout: 'blank',
    },
  },
  {
    path: '/error-404',
    name: 'error-404',
    component: () => import('../views/Error.vue'),
    meta: {
      layout: 'blank',
    },
  },
  {
    path: '*',
    redirect: 'error-404',
  },
]

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes,
})

router.beforeEach((to, from, next) => {
  const requireAuth = to.matched.some(record => record.meta.auth)
  // const role = to.matched[0].meta.authorize[0]
  const currentUser = getToken()
  // to.matched.some(r => {
  //   r.meta.authorize.map(i => {
  //       console.log(decodeJWT().roled[0] === i)
  //   })
  // })
  if (requireAuth && !currentUser) {
    next('/pages/login')
  }
  // else if(decodeJWT().roles[0] !== role) {
  //   next('/dashboard')
  // }
  else {
    next()
  }
})

export default router
