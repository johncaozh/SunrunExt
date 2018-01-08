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
          path: '/orgs',
          component: resolve => require(['../components/orgs.vue'], resolve)
        }, {
          path: '/apps',
          component: resolve => require(['../components/apps.vue'], resolve)
        }, {
          path: '/manager',
          component: resolve => require(['../components/manager.vue'], resolve)
        }, {
          path: '/enterprise',
          component: resolve => require(['../components/enterprise.vue'], resolve)
        },
        {
          path: '/createApp',
          component: resolve => require(['../components/createApp.vue'], resolve)
        },
        {
          path: '/appDetail',
          component: resolve => require(['../components/appDetail.vue'], resolve)
        }
      ]
    },
    {
      path: '/createApp',
      component: resolve => require(['../components/createApp.vue'], resolve)
    },
    {
      path: '/appDetail',
      component: resolve => require(['../components/appDetail.vue'], resolve)
    }
  ],
  // mode: 'history',
})
