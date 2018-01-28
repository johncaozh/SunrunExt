var mongoose = require("mongoose");

const schema = mongoose.Schema({
    //用户或者部门UID
    id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        default: null,
        required: true
    },
    //ID为此值的用户可以在通讯录中看到上面的用户，即该用户列为以上用户的白名单
    whilteListId: {
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

const whiteListOrgOrUserModel = mongoose.model("whiteListOrgOrUser", schema);
module.exports = whiteListOrgOrUserModel;