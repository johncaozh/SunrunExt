var mongoose = require("mongoose");

const schema = mongoose.Schema({
    //用户ID
    userId: {
        type: String,
        required: true,
    },
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'managerGroup',
        required: true
    },
}, {
    versionKey: false,
    timestamps: {
        createdAt: 'createdTime',
        updatedAt: 'updatedTime'
    }
})

const managerGroupUserModel = mongoose.model("managerGroup_user", schema);
module.exports = managerGroupUserModel;