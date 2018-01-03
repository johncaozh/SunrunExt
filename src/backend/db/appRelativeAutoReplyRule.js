var mongoose = require('mongoose');

const schema = mongoose.Schema({
    appId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'app',
        required: true
    },
    ruleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'autoReplyRule',
        required: true
    }
});

const appRelativeAutoReplyRuleModel = mongoose.model("app", schema);
module.exports = appRelativeAutoReplyRuleModel;