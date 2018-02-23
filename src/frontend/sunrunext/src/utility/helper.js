import validator from "validator";
import api from "./api";

export default {
  isUrl(url) {
    if (!url) {
      return false;
    }

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      return false;
    }

    return validator.isURL(url, ["http", "https"]);
  },

  deepCopy(obj) {
    if (typeof obj != 'object') {
      return obj;
    }
    var newobj = {};
    for (var attr in obj) {
      newobj[attr] = this.deepCopy(obj[attr]);
    }
    return newobj;
  },

  getMediaLink(mediaId) {
    return `${api.fileTransferUrl}/${mediaId}`
  },

  getVideoMediaLink(mediaId) {
    return `${api.fileTransferUrl_video}/${mediaId}`
  },

  getAudioMediaLink(mediaId) {
    return `${api.fileTransferUrl_audio}/${mediaId}`
  }
}
