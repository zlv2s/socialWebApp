import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase'
// import Login from '@/components/Login'
// import Dashboard from '@/components/Dashboard'
// import Setting from '@/components/Setting'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '*',
      redirect: '/dashboard'
    }, {
      path: '/login',
      name: 'Login',
      component: () => import('./components/Login.vue')
    }, {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('./components/Dashboard.vue'),
      meta: {
        requiresAuth: true
      }
    }, {
      path: '/setting',
      name: 'Setting',
      component: () => import('./components/Setting.vue'),
      meta: {
        requiresAuth: true
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth)
  const currentUser = firebase.auth().currentUser

  if (requiresAuth && !currentUser) {
    next('/login')
  } else if (requiresAuth && currentUser) {
    next()
  } else {
    next()
  }
})

export default router