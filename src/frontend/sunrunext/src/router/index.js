import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    component: resolve => require(['../components/main.vue'], resolve),
    children: [{
      path: '/home',
      component: resolve => require(['../components/home.vue'], resolve)
    }, {
      path: '/org',
      component: resolve => require(['../components/org.vue'], resolve)
    }, {
      path: '/app',
      component: resolve => require(['../components/app.vue'], resolve)
    }, {
      path: '/manager',
      component: resolve => require(['../components/manager.vue'], resolve)
    }, {
      path: '/enterprise',
      component: resolve => require(['../components/enterprise.vue'], resolve)
    }]
  }],
  mode: 'history',
})
