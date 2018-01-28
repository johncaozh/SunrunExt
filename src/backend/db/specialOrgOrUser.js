var mongoose = require("mongoose");

const schema = mongoose.Schema({
    //消息状态
    //notVisibleForAll：对所有人隐藏
    //onlyVisibleForDepartment：只能看到其所有部门的通讯录
    //hideAddressBook：禁止查看通讯录
    type: {
        type: String,
        default: "default",
        required: false,
    },
    //用户或者部门UID
    id: {
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

const specialOrgOrUserModel = mongoose.model("specialOrgOrUser", schema);
module.exports = specialOrgOrUserModel;