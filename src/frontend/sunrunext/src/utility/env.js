const serverConfig = {
  requestTimeout: 60000,
  iamLoginRedirectUrl: "https://192.168.0.180:9531/sunruniam/sso/login",
  iamLogoutRedirectUrl: "https://192.168.0.180:9531/sunruniam/sso/logout",
<<<<<<< HEAD
  serverEndPoint: "http://localhost:3000/api/v1/",
=======
  serverEndPoint: "https://localhost:8443/api/v1/",
>>>>>>> a4c71ea046a3c75a2b7368054cbc75f99e92c8c2
  apiDocsServerEndPoint: 'http://10.11.13.252:8084',
  filesSegment: "files",
  filesSegment_audio: "files/audio",
  filesSegment_video: "files/video",
  orgsSegment: "orgs",
  orgsSpecialSegment: "orgs/special",
  orgsSpecialWhiteListSegment: "orgs/special/whiteList",
  appsSegment: "apps",
  appContextMenusSegment: "appContextMenus",
  appMessageTemplatesSegment: "appMessageTemplates",
  appAutoReplyRulesSegment: "appAutoReplyRules",
  appSentMessageRecordsSegment: "appSentMessageRecords",
  managerGroupSegment: "managerGroups",
  managerGroupSegment_apps: "managerGroups/apps",
  managerGroupSegment_orgs: "managerGroups/orgs",
  managerGroupSegment_users: "managerGroups/users",
  appGroupsSegment: "appGroups",
  productsSegment: "products",
  configSegment: "config",
  loginSegment: "login",
  logoutSegment: "logout",
}

const constants = {
  dateFormat: "YYYY-MM-DD",
}

export default {
  serverConfig,
  constants
}
