import api from "../../utility/api";

export default {
  data() {
    return {
      uploadUrl: api.fileTransferUrl,
      uploadUrl_video: api.fileTransferUrl_video,
      uploadUrl_audio: api.fileTransferUrl_audio,
    }
  },
}
