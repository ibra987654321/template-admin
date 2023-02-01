import Vue from 'vue'
import VueRouter from 'vue-router'
import {getToken, Role} from '@/helpers/helpers'
// import {decodeJWT} from "@/use/auth";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/pages/login',
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    meta: { layout: 'main'},
    component: () => import('../views/dashboard/Dashboard'),
  },
  // {
  //   path: '/detail/:id',
  //   name: 'detail',
  //   meta: { layout: 'main', auth: true, authorize: [Role.User, Role.Admin] },
  //   component: () => import('../components/Detail'),
  // },
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
