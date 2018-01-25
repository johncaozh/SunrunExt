const serverConfig = {
  requestTimeout: 60000,
  serverEndPoint: "http://localhost:3000/api/v1/",
  filesSegment: "files",
  filesSegment_audio: "files/audio",
  filesSegment_video: "files/video",
  orgsSegment: "orgs",
  appsSegment: "apps",
  appContextMenusSegment: "appContextMenus",
  appMessageTemplatesSegment: "appMessageTemplates",
  appAutoReplyRulesSegment: "appAutoReplyRules",
  appSentMessageRecordsSegment: "appSentMessageRecords",
}

const constants = {
  dateFormat: "YYYY-MM-DD",
}

export default {
  serverConfig,
  constants
}
