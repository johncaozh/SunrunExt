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
}
