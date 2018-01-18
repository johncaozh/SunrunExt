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
        path: '/apps/create',
        component: resolve => require(['../components/appCreate.vue'], resolve)
      },
      {
        path: '/apps/:appId/detail',
        component: resolve => require(['../components/appDetail.vue'], resolve)
      },
      {
        path: '/apps/:appId/contextMenu',
        component: resolve => require(['../components/appContextMenu.vue'], resolve)
      },
      {
        path: '/apps/:appId/autoReply',
        component: resolve => require(['../components/appAutoReply.vue'], resolve)
      },
      {
        path: '/apps/:appId/autoReply/new',
        component: resolve => require(['../components/appAutoReply_new.vue'], resolve)
      },
      {
        path: '/apps/:appId/autoReply/newKeyword',
        component: resolve => require(['../components/appAutoReply_new_keyword.vue'], resolve)
      },
      {
        path: '/contractSync',
        component: resolve => require(['../components/contractSync.vue'], resolve)
      },
    ]
  }, ],
  // mode: 'history',
})
