var mongoose = require("mongoose");

const schema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    desc: {
        type: String,
        require: false
    },
    avatar: {
        type: String,
        require: true
    },
    enable: {
        type: Boolean,
        default: true,
        require: false,
    },
    //在IAM中的产品名（用于SSO）
    iamProjectName: {
        type: String,
        require: false
    },
    //是否是群应用
    useInGroup: {
        type: Boolean,
        require: false,
    },
    //是否使用SSO登录
    useIamSSO: {
        type: Boolean,
        require: false,
    },
    //是否在应用列表中显示
    visible: {
        type: Boolean,
        default: true,
        require: false,
    },
    //是否上报用户进入应用事件
    isreportenter: {
        type: Boolean,
        default: false,
        require: false,
    },
    //进入应用会话时是否上报用户地理位置
    isreportLocation_Session: {
        type: Boolean,
        default: false,
        require: false,
    },
    //应用主页地址
    home_url: {
        type: String,
        require: false,
    },
    //接收消息的服务器地址
    receiveMsg_url: {
        type: String,
        require: false,
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