var mongoose = require("mongoose");

const schema = mongoose.Schema({
    name: {
        type: String,
        default: "默认回复",
        require: false,
    },
    //规则类型：
    //default：默认回复，不需要匹配任何关键字
    //match：接收到的消息包含keyword
    //exactMatch：接收到的消息完全匹配keyword
    type: {
        type: String,
        default: "default",
        require: false,
    },
    //匹配的关键词，默认回复时该字段为空
    keywork: {
        type: String,
        require: false
    },
    //开启保密后，文章详情页面将印有收件人姓名
    safe: {
        type: Boolean,
        require: false,
    }
}, {
    versionKey: false,
    timestamps: {
        createdAt: 'createdTime',
        updatedAt: 'updatedTime'
    }
});

const autoReplyRuleModel = mongoose.model("appAutoReplyRule", schema);
module.exports = autoReplyRuleModel;