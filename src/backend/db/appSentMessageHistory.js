var mongoose = require("mongoose");

const schema = mongoose.Schema({
    //消息状态
    //draft：草稿
    //timing：定时发送
    //sent：已发送
    type: {
        type: String,
        default: "default",
        required: false,
    },
    //定时发送的时间
    schedulerDate: {
        type: Date,
        default: null,
        required: false
    },
    //开启保密后，文章详情页面将印有收件人姓名
    safe: {
        type: Boolean,
        default: false,
        required: false,
    },
    //关联的应用
    app: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'app',
        required: true
    },
    //关联的消息模板
    appMessageTemplate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'appMessageTemplate',
        default: null,
        required: true
    },
    ///消息接收者
    receivers: {
        type: Array,
        default: null,
        required: true
    },
}, {
    versionKey: false,
    timestamps: {
        createdAt: 'createdTime',
        updatedAt: 'updatedTime'
    }
})

const appSentMessageHistoryModel = mongoose.model("appSentMessageHistory", schema);
module.exports = appSentMessageHistoryModel;