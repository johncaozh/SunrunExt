var mongoose = require("mongoose");

const schema = mongoose.Schema({
    appId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'app',
        default: null,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
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

const frequentlyUsedAppModel = mongoose.model("frequentlyUsedApp", schema);
module.exports = frequentlyUsedAppModel;