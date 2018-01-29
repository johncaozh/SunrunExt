var mongoose = require("mongoose");

const schema = mongoose.Schema({
    //管理组名称
    name: {
        type: String,
        required: true,
    },
    //其父管理组的ID，当为null时，意味着其为根管理组，即超级超管理组。超级管理组具备所有通讯录和应用的管理权限
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'managerGroup',
        required: false
    },
    users: {
        type: Array,
        required: false,
        default: [],
    },
    apps: {
        type: Array,
        required: false,
        default: [],
    },
    orgs: {
        type: Array,
        required: false,
        default: [],
    }
}, {
        versionKey: false,
        timestamps: {
            createdAt: 'createdTime',
            updatedAt: 'updatedTime'
        }
    })

const managerGroupModel = mongoose.model("managerGroup", schema);
module.exports = managerGroupModel;