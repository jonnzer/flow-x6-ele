import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/flow'
  },
  {
    path: '/flow',
    name: 'flowChart',
    component: () => import(/* webpackChunkName: "x6" */ '../views/flowChart.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
