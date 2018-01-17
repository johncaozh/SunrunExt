var mongoose = require("mongoose");

const schema = mongoose.Schema({
    //消息类型
    //text：文本消息
    //photo：图片消息
    //voice：语音消息
    //video：视频消息
    //file：文件消息
    //news：图文消息
    //externalLinkNews：外链图文消息
    type: {
        type: String,
        required: true,
    },

    // 消息体内容
    // type为text时的结构：
    // {
    //   "content" : "文本消息"
    // }

    // type为image时的结构:
    // {
    //   "mediaId" : "文件id"
    // }

    // type为voice时的结构:
    // {
    //   "mediaId" : "文件id"
    //   "duration" : "语音时长"
    // }

    // type为video时的结构:
    // {
    //   "mediaId" : "视频文件id"
    //   "mediaUrl" : "视频文件Url"
    //   "thumbMediaId" : "视频封面文件id"
    //   "title" : "标题"
    //   "abstract" : "摘要"
    // }

    // type为file时的结构:
    // {
    //   "mediaId" : "文件id"
    //   "name" : "文件名"
    //   "size" : "文件大小"
    //   "mediaUrl" : "文件Url"
    // }

    //[暂时不支持]
    // type为textcard时的结构:
    // {
    //   "title" : "Title"
    //   "description" : "Description"
    //   "clickAction" : "htmlCode/url"
    //   "htmlCode":"html代码"   
    //   "url" : "网页地址"
    //   "btntxt" : "按钮文字"
    // }

    // type为news时的结构:
    // {
    //   "news" : [
    //       {
    //          "title" : "标题"
    //          "mediaId" : "封面图片的ID"
    //          "mediaUrl" : "封面图片的URL"
    //          "abstract" : "摘要"
    //          "html":"html代码"   
    //          "link" : "原文链接地址"
    //          "author" : "作者"
    //          "files" : [
    //             {
    //                mediaId:'附件Id',
    //                name:'附件名',
    //                size:'附件大小',
    //             }
    //           ]
    //          "btntxt" : "按钮文字"
    //       }
    //   ]
    // }

    // type为externalLinkNews时的结构:
    // {
    //   "news" : [
    //       {
    //          "title" : "标题"
    //          "mediaId" : "封面图片的ID"
    //          "mediaUrl" : "封面图片的URL"
    //          "abstract" : "摘要"
    //          "link" : "外链地址"
    //          "btntxt" : "按钮文字"
    //       }
    //   ]
    // }
    data: {
        type: Object,
        required: true
    },
    //是否加入素材库
    showInMaterialLibrary: {
        type: Boolean,
        required: false,
        default: false,
    }
}, {
    versionKey: false,
    timestamps: {
        createdAt: 'createdTime',
        updatedAt: 'updatedTime'
    }
})

const appMessageTemplateModel = mongoose.model("appMessageTemplate", schema);
module.exports = appMessageTemplateModel;