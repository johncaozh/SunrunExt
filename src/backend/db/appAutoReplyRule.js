var mongoose = require("mongoose");

const schema = mongoose.Schema({
    name: {
        type: String,
        default: null,
        required: false,
    },
    //规则类型：
    //default：默认回复，不需要匹配任何关键字
    //match：接收到的消息包含keyword
    //exactMatch：接收到的消息完全匹配keyword
    type: {
        type: String,
        default: "default",
        required: false,
    },
    //匹配的关键词，默认回复时该字段为空
    keywork: {
        type: String,
        default: null,
        required: false
    },
    //开启保密后，文章详情页面将印有收件人姓名
    safe: {
        type: Boolean,
        default: false,
        required: false,
    },
    //关联的应用ID
    appId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'app',
        required: true
    },
    //关联的消息模板ID
    appMessageTemplateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'appMessageTemplate',
        default: null,
        required: true
    }
}, {
    versionKey: false,
    timestamps: {
        createdAt: 'createdTime',
        updatedAt: 'updatedTime'
    }
})

const appAutoReplyRuleModel = mongoose.module("appAutoReplyRule", schema);
module.exports = appAutoReplyRuleModel;