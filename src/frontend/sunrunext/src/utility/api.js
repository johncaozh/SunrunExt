import axios from 'axios'
import env from './env'

axios.defaults.baseURL = env.serverConfig.serverEndPoint;
axios.defaults.timeout = env.serverConfig.requestTimeout;
axios.defaults.withCredentials = true;
axios.interceptors.response.use(function (response) {
  // Do something with response data
  return response.data.data;
}, function (error) {
  // Do something with response error
  return Promise.reject(error);
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
}
