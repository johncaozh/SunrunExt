var mongoose = require('mongoose');

const schema = mongoose.Schema({
    appId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'app',
        required: true
    },
    iamUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'iamUser',
        required: true
    }
});

const appRelativeIamUserModel = mongoose.model("appRelativeIamUser", schema);
module.exports = appRelativeIamUserModel;