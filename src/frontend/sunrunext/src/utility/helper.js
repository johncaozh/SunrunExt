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
  },

  setCookie(c_name, value, expire) {
    var date = new Date()
    date.setSeconds(date.getSeconds() + expire)
    document.cookie = c_name + "=" + escape(value) + "; expires=" + date.toGMTString()
    console.log(document.cookie)
  },

  getCookie(c_name) {
    if (document.cookie.length > 0) {
      let c_start = document.cookie.indexOf(c_name + "=")
      if (c_start != -1) {
        c_start = c_start + c_name.length + 1
        let c_end = document.cookie.indexOf(";", c_start)
        if (c_end == -1) c_end = document.cookie.length
        return unescape(document.cookie.substring(c_start, c_end))
      }
    }
    return ""
  },

  delCookie(c_name) {
    setCookie(c_name, "", -1)
  }
}
