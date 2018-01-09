var mongoose = require("mongoose");

const schema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        default: null,
        unique: true
    },
    desc: {
        type: String,
        default: null,
        required: false
    },
    avatar: {
        type: String,
        default: null,
        required: true
    },
    enable: {
        type: Boolean,
        default: true,
        required: false,
    },
    //在IAM中的产品名（用于SSO）
    iamProductName: {
        type: String,
        default: null,
        required: false
    },
    //是否是群应用
    useInGroup: {
        type: Boolean,
        default: false,
        required: false,
    },
    //是否在应用列表中显示
    visible: {
        type: Boolean,
        default: true,
        required: false,
    },
    //是否上报用户进入应用事件
    isreportenter: {
        type: Boolean,
        default: false,
        required: false,
    },
    //进入应用会话时是否上报用户地理位置
    isreportLocation_Session: {
        type: Boolean,
        default: false,
        required: false,
    },
    //应用主页地址
    home_url: {
        type: String,
        default: null,
        required: false,
    },
    //接收消息的服务器地址
    receiveMsg_url: {
        type: String,
        default: null,
        required: false,
    },
    //关联的用户ID数组
    iamUserIds: {
        type: Array,
        default: null,
        required: false,
    },
    //关联的组织ID数组
    iamOrgIds: {
        type: Array,
        default: null,
        required: false,
    }
}, {
    versionKey: false,
    timestamps: {
        createdAt: 'createdTime',
        updatedAt: 'updatedTime'
    }
});

const appModel = mongoose.model("app", schema);
module.exports = appModel;