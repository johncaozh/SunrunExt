var mongoose = require("mongoose");

const schema = mongoose.Schema({
    //用户或者部门ID
    id: {
        type: String,
        default: null,
        required: true
    },
    //用户类型 org/user
    orgType: {
        type: String,
        default: null,
        required: true
    },
    ruleId: {
        type: String,
        default: null,
        required: true
    },
    //角色，可能的值有三种：
    //null:表示空，用于notVisibleForAll的规则场景
    //from:表示限制端的白名单，用于onlyVisibleForDepartment的规则场景
    //to:表示可见段的白名单，用于onlyVisibleForDepartment的规则场景
    role: {
        type: String,
        default: null,
        required: false,
    }
}, {
    versionKey: false,
    timestamps: {
        createdAt: 'createdTime',
        updatedAt: 'updatedTime'
    }
})

const whiteListOrgOrUserModel = mongoose.model("whiteListOrgOrUser", schema);
module.exports = whiteListOrgOrUserModel;