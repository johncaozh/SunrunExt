var mongoose = require("mongoose");

const schema = mongoose.Schema({
    //应用ID
    appId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'app',
        required: true,
    },
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'managerGroup',
        required: true
    },
    //管理组拥有的权限
    //0：没有任何权限
    //1：发消息权限
    //2：完全控制权限
    permission: {
        type: Number,
        default: 0,
        required: false
    }
}, {
    versionKey: false,
    timestamps: {
        createdAt: 'createdTime',
        updatedAt: 'updatedTime'
    }
})

const managerGroupAppModel = mongoose.model("managerGroup_app", schema);
module.exports = managerGroupAppModel;