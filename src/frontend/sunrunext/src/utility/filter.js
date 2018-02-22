import Vue from 'vue'
import moment from 'moment'
import env from './env'
import api from './api'

Vue.filter('dateConverter', function (value, formatString) {
  formatString = formatString || env.constants.dateFormat;
  return moment(value).format(formatString);
});

Vue.filter('sizeUnitConverter', function (bytes) {
  if (!bytes)
    return "0B";

  var s = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  var e = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, Math.floor(e))).toFixed(2) + " " + s[e];
});

Vue.filter('appMessageTemplateTypeConverter', function (type) {
  if (type == "text")
    return "文字";
  else if (type == "news")
    return "图文";
  else if (type == "externalLinkNews")
    return "外链图文";
  else if (type == "photo")
    return "图片";
  else if (type == "voice")
    return "语音";
  else if (type == "video")
    return "视频";
  else if (type == "file")
    return "文件";
  else return "文字"
});

Vue.filter('appMessageTemplateToStringConverter', function (template) {
  if (template.type == "text")
    return template.data.content;
  else if (template.type == "news")
    return template.data.news[0].title;
  else if (template.type == "externalLinkNews")
    return template.data.news[0].title;
  else if (template.type == "photo")
    return '图片';
  else if (template.type == "voice")
    return template.data.fileName;
  else if (template.type == "video")
    return template.data.title;
  else if (template.type == "file")
    return template.data.fileName;
  else return "文字"
});

Vue.filter('getMediaLink', function (mediaId) {
  return `${api.fileTransferUrl}/${mediaId}`
});
