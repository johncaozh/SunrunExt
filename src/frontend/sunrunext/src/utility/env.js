const serverConfig = {
  requestTimeout: 60000,
  serverEndPoint: "http://localhost:3000/api/v1/",
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
  configSegment: "config",
}

const constants = {
  dateFormat: "YYYY-MM-DD",
}

export default {
  serverConfig,
  constants
}
