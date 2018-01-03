var mongoose = require('mongoose');

const schema = mongoose.Schema({
    appId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'app',
        required: true
    },
    iamOrgId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'iamOrg',
        required: true
    }
});

const appRelativeIamOrgModel = mongoose.model("appRelativeIamOrg", schema);
module.exports = appRelativeIamOrgModel;