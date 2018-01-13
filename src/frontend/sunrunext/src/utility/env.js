const serverConfig = {
  requestTimeout: 60000,
  serverEndPoint: "http://192.168.103.184:3000/api/v1/",
  filesSegment: "files",
  filesSegment_audio: "files/audio",
  orgsSegment: "orgs",
  appsSegment: "apps",
  appContextMenusSegment: "appContextMenus",
}

const constants = {
  dateFormat: "YYYY-MM-DD",
}

export default {
  serverConfig,
  constants
}
