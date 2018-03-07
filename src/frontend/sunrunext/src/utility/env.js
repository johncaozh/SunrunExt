const serverConfig = {
  requestTimeout: 60000,
  iamLoginRedirectUrl: "https://10.50.0.5:9531/sunruniam/sso/login",
  iamLogoutRedirectUrl: "https://10.50.0.5:9531/sunruniam/sso/logout",
  serverEndPoint: "https://localhost:8443/api/v1/",
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
