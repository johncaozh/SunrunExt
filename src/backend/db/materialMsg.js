var mongoose = require("mongoose");

const schema = mongoose.Schema({
    //msg:该消息模板用于发送消息给用户
    //autoReplyRule:该消息模板用于自动回复规则
    usage: {
        type: String,
        require: true
    }

    //素材消息类型
    //text：文本消息
    //image：图片消息
    //voice：语音消息
    //video：视频消息
    //file：文件消息
    //textcard：文本卡片消息
    //news：图文消息
    type: {
        type: String,
        require: true,
    },

    // 消息体内容
    // type为text时的结构：
    // {
    //   "content" : "文本消息"
    // }

    // type为image时的结构:
    // {
    //   "media_id" : "文件id"
    // }

    // type为voice时的结构:
    // {
    //   "media_id" : "文件id"
    // }

    // type为video时的结构:
    // {
    //   "media_id" : "文件id"
    //   "title" : "Title"
    //   "description" : "Description"
    // }

    // type为file时的结构:
    // {
    //   "media_id" : "文件id"
    // }

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
    //   "articles" : [
    //       {
    //          "title" : "Title"
    //          "thumb_media_id" : "封面图片的ID"
    //          "description" : "Description"
    //          "clickAction" : "htmlCode/url"
    //          "htmlCode":"html代码"   
    //          "url" : "网页地址"
    //          "btntxt" : "按钮文字"
    //       }
    //   ]
    // }
    data: {
        type: Object,
        require: true
    }
}, {
    versionKey: false,
    timestamps: {
        createdAt: 'createdTime',
        updatedAt: 'updatedTime'
    }
})

const materialMsgModel = mongoose.model("materialMsgModel", schema);
module.exports = materialMsgModel;