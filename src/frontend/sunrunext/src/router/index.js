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
        component: resolve => require(['../components/manager.vue'], resolve),
      },
      {
        path: '/manager/contractSync',
        component: resolve => require(['../components/contractSync.vue'], resolve)
      }, {
        path: '/manager/openApi',
        component: resolve => require(['../components/openApi.vue'], resolve)
      }, {
        path: '/manager/message',
        component: resolve => require(['../components/message.vue'], resolve)
      }, {
        path: '/manager/userMessage',
        component: resolve => require(['../components/userMessageHistory.vue'], resolve)
      }, {
        path: '/manager/usageAnalysis',
        component: resolve => require(['../components/usageAnalysis.vue'], resolve)
      },
      {
        path: '/enterprise',
        component: resolve => require(['../components/enterprise.vue'], resolve),
        redirect: '/enterprise/enterpriseInfo',
        children: [{
            path: '/enterprise/enterpriseInfo',
            component: resolve => require(['../components/common/enterpriseInfo.vue'], resolve),
          }, {
            path: '/enterprise/admin',
            component: resolve => require(['../components/common/adminManage.vue'], resolve),
          }, {
            path: '/enterprise/chatSession',
            component: resolve => require(['../components/common/chatSessionManage.vue'], resolve),
          }, {
            path: '/enterprise/contract',
            component: resolve => require(['../components/common/contractManage.vue'], resolve),
          }, {
            path: '/enterprise/security',
            component: resolve => require(['../components/common/securityManage.vue'], resolve),
          }, {
            path: '/enterprise/contract/hideAddressBook',
            component: resolve => require(['../components/common/contractManage_hideAddressBook.vue'], resolve),
          }, {
            path: '/enterprise/contract/notVisibleForAll',
            component: resolve => require(['../components/common/contractManage_notVisibleForAll.vue'], resolve),
          }, {
            path: '/enterprise/contract/onlyVisibleForDepartment',
            component: resolve => require(['../components/common/contractManage_onlyVisibleForDepartment.vue'], resolve),
          }, {
            path: '/enterprise/client',
            component: resolve => require(['../components/common/clientManage.vue'], resolve),
          },
          {
            path: '/enterprise/client/appGroup',
            component: resolve => require(['../components/common/appGroup.vue'], resolve),
          }
        ]
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
    ]
  }, ],
  mode: 'history',
})
