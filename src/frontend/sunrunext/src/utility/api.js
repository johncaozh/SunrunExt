import axios from 'axios';
import env from './env';
import { Message } from 'element-ui';
import router from '../router/index.js';

axios.defaults.baseURL = env.serverConfig.serverEndPoint;
axios.defaults.timeout = env.serverConfig.requestTimeout;
axios.defaults.withCredentials = true;
axios.interceptors.response.use(function (response) {
  // Do something with response data
  return response.data.data;
}, function (error) {
  if (error.response.status == 403) {
    var apiSegment = error.config.url.replace(error.config.baseURL, "");

    if (apiSegment != "login" && apiSegment != "logout") {
      Message.error("操作超时，请重新登录。");
      router.replace({
        path: '/login',
        query: { redirect: router.currentRoute.fullPath }
      })
    }
  }
  // Do something with response error
  return Promise.reject(error.response.data);
});

export default {
  fileTransferUrl: env.serverConfig.serverEndPoint + env.serverConfig.filesSegment,
  fileTransferUrl_audio: env.serverConfig.serverEndPoint + env.serverConfig.filesSegment_audio,
  fileTransferUrl_video: env.serverConfig.serverEndPoint + env.serverConfig.filesSegment_video,
  async getOrg() {
    var url = env.serverConfig.orgsSegment;
    return axios.get(url);
  },
  async getApps() {
    var url = env.serverConfig.appsSegment;
    return axios.get(url);
  },
  async createApp(param) {
    var url = env.serverConfig.appsSegment;
    return axios.post(url, param);
  },
  async updateApp(appId, param) {
    var url = `${env.serverConfig.appsSegment}/${appId}`;
    return axios.put(url, param);
  },
  async deleteApp(id) {
    var url = `${env.serverConfig.appsSegment}/${id}`;
    return axios.delete(url);
  },
  async getAppDetail(appId) {
    var url = `${env.serverConfig.appsSegment}/${appId}`;
    return axios.get(url);
  },
  async createAppContextMenu(param) {
    var url = env.serverConfig.appContextMenusSegment;
    return axios.post(url, param);
  },
  async updateAppContextMenu(contextMenuId, param) {
    var url = `${env.serverConfig.appContextMenusSegment}/${contextMenuId}`;
    return axios.put(url, param);
  },
  async deleteAppContextMenu(contextMenuId) {
    var url = `${env.serverConfig.appContextMenusSegment}/${contextMenuId}`;
    return axios.delete(url);
  },
  async getAppMessageTemplates(type = null, showInMaterialLibrary = false) {
    var url = env.serverConfig.appMessageTemplatesSegment;

    if (type)
      url += `?type=${type}`;

    if (showInMaterialLibrary) {
      var connectChar = type ? "&" : "?";
      url += `${connectChar}showInMaterialLibrary=${showInMaterialLibrary}`;
    }
    return axios.get(url);
  },
  async createAppMessageTemplate(param) {
    var url = env.serverConfig.appMessageTemplatesSegment;
    return axios.post(url, param);
  },
  async updateAppMessageTemplate(id, param) {
    var url = `${env.serverConfig.appMessageTemplatesSegment}/${id}`;
    return axios.put(url, param);
  },
  async deleteAppMessageTemplate(id) {
    var url = `${env.serverConfig.appMessageTemplatesSegment}/${id}`;
    return axios.delete(url);
  },
  async createAppAutoReplyRule(param) {
    var url = env.serverConfig.appAutoReplyRulesSegment;
    return axios.post(url, param);
  },
  async updateAppAutoReplyRule(id, param) {
    var url = `${env.serverConfig.appAutoReplyRulesSegment}/${id}`;
    return axios.put(url, param);
  },
  async deleteAppAutoReplyRule(id) {
    var url = `${env.serverConfig.appAutoReplyRulesSegment}/${id}`;
    return axios.delete(url);
  },
  async getAppSentMessageRecords(type, appId) {
    var url = env.serverConfig.appSentMessageRecordsSegment;

    if (type)
      url += `?type=${type}`;

    if (appId) {
      var connectChar = type ? "&" : "?";
      url += `${connectChar}app=${appId}`;
    }

    return axios.get(url);
  },
  async createAppSentMessageRecord(param) {
    var url = env.serverConfig.appSentMessageRecordsSegment;
    return axios.post(url, param);
  },
  async getAppSentMessageRecord(id) {
    var url = `${env.serverConfig.appSentMessageRecordsSegment}/${id}`;
    return axios.get(url);
  },
  async updateAppSentMessageRecord(id, param) {
    var url = `${env.serverConfig.appSentMessageRecordsSegment}/${id}`;
    return axios.put(url, param);
  },
  async deleteAppSentMessageRecord(id) {
    var url = `${env.serverConfig.appSentMessageRecordsSegment}/${id}`;
    return axios.delete(url);
  },
  async getOrgSpecials(type, ruleId, id, orgType) {
    var url = env.serverConfig.orgsSpecialSegment;

    if (type)
      url += `?type=${type}`;

    if (ruleId) {
      var connectChar = type ? "&" : "?";
      url += `${connectChar}ruleId=${ruleId}`;
    }

    if (id) {
      var connectChar = (type || ruleId) ? "&" : "?";
      url += `${connectChar}id=${id}`;
    }

    if (orgType) {
      var connectChar = (type || ruleId || id) ? "&" : "?";
      url += `${connectChar}orgType=${orgType}`;
    }

    return axios.get(url);
  },
  async createOrgSpecial(param) {
    var url = env.serverConfig.orgsSpecialSegment;
    return axios.post(url, param);
  },
  async deleteOrgSpecial(id) {
    var url = `${env.serverConfig.orgsSpecialSegment}/${id}`;
    return axios.delete(url);
  },
  async getOrgSpecialWhiteList(ruleId) {
    var url = env.serverConfig.orgsSpecialWhiteListSegment;

    if (ruleId)
      url += `?ruleId=${ruleId}`;

    return axios.get(url);
  },
  async createOrgSpecialWhiteList(param) {
    var url = env.serverConfig.orgsSpecialWhiteListSegment;
    return axios.post(url, param);
  },
  async deleteOrgSpecialWhiteList(id) {
    var url = `${env.serverConfig.orgsSpecialWhiteListSegment}/${id}`;
    return axios.delete(url);
  },

  async getManagerGroups() {
    var url = env.serverConfig.managerGroupSegment;
    return axios.get(url);
  },
  async createManagerGroup(param) {
    var url = env.serverConfig.managerGroupSegment;
    return axios.post(url, param);
  },
  async updateManagerGroup(id, param) {
    var url = `${env.serverConfig.managerGroupSegment}/${id}`;
    return axios.put(url, param);
  },
  async deleteManagerGroup(id) {
    var url = `${env.serverConfig.managerGroupSegment}/${id}`;
    return axios.delete(url);
  },
  async getManagerGroupDetail(id) {
    var url = `${env.serverConfig.managerGroupSegment}/${id}`;
    return axios.get(url);
  },

  async createManagerGroupApp(param) {
    var url = env.serverConfig.managerGroupSegment_apps;
    return axios.post(url, param);
  },
  async updateManagerGroupApp(id, param) {
    var url = `${env.serverConfig.managerGroupSegment_apps}/${id}`;
    return axios.put(url, param);
  },
  async deleteManagerGroupApp(id) {
    var url = `${env.serverConfig.managerGroupSegment_apps}/${id}`;
    return axios.delete(url);
  },
  async getManagerGroupAppDetailDetail(id) {
    var url = `${env.serverConfig.managerGroupSegment_apps}/${id}`;
    return axios.get(url);
  },

  async createManagerGroupOrg(param) {
    var url = env.serverConfig.managerGroupSegment_orgs;
    return axios.post(url, param);
  },
  async updateManagerGroupOrg(id, param) {
    var url = `${env.serverConfig.managerGroupSegment_orgs}/${id}`;
    return axios.put(url, param);
  },
  async deleteManagerGroupOrg(id) {
    var url = `${env.serverConfig.managerGroupSegment_orgs}/${id}`;
    return axios.delete(url);
  },
  async getManagerGroupOrgDetailDetail(id) {
    var url = `${env.serverConfig.managerGroupSegment_orgs}/${id}`;
    return axios.get(url);
  },

  async createManagerGroupUser(param) {
    var url = env.serverConfig.managerGroupSegment_users;
    return axios.post(url, param);
  },
  async deleteManagerGroupUser(id) {
    var url = `${env.serverConfig.managerGroupSegment_users}/${id}`;
    return axios.delete(url);
  },
  async getManagerGroupUserDetailDetail(id) {
    var url = `${env.serverConfig.managerGroupSegment_users}/${id}`;
    return axios.get(url);
  },

  async getAppGroups() {
    var url = env.serverConfig.appGroupsSegment;
    return axios.get(url);
  },
  async createAppGroup(param) {
    var url = env.serverConfig.appGroupsSegment;
    return axios.post(url, param);
  },
  async deleteAppGroup(id) {
    var url = `${env.serverConfig.appGroupsSegment}/${id}`;
    return axios.delete(url);
  },
  async updateAppGroup(id, param) {
    var url = `${env.serverConfig.appGroupsSegment}/${id}`;
    return axios.put(url, param);
  },

  async getProducts() {
    var url = env.serverConfig.productsSegment;
    return axios.get(url);
  },

  async getConfig() {
    var url = env.serverConfig.configSegment;
    return axios.get(url);
  },
  async updateConfig(param) {
    var url = env.serverConfig.configSegment;
    return axios.put(url, param);
  },
  async login(param) {
    var url = env.serverConfig.loginSegment;
    return axios.post(url, param);
  },
  async logout() {
    var url = env.serverConfig.logoutSegment;
    return axios.post(url);
  },
}
