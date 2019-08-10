import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home'
Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/', component: Home
    },
    {
      path: '/waykitv',
      component: () => import('./views/Wayki'),
      children: [
        { path: '', component: () => import('./views/Overview') }
      ]
    },
    {
      path: '*', component: () => import('./views/NotFoundComponent')
    }
  ]
})
