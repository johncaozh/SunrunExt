var mongoose = require('mongoose');

const schema = mongoose.Schema({
    autoReplyRuleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'autoReplyRule',
        required: true
    },
    materialMsgId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'materialMsg',
        required: true
    }
});

const autoReplyRuleRelativeMaterialMsgModel = mongoose.model("autoReplyRuleRelativeMaterialMsg", schema);
module.exports = autoReplyRuleRelativeMaterialMsgModel;