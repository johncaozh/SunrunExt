var mongoose = require("mongoose");

const schema = mongoose.Schema({
    name: {
        type: String,
        default: null,
        required: true,
    },
    //click:点击推事件
    //view:跳转URL
    //send_message:发送消息
    //scancode:扫码推事件
    //pic_photo:弹出拍照并发图
    //pic_album:弹出相册并发图
    //pic_photo_album:弹出拍照/相册并发图
    //location_select:弹出地理位置选择器
    type: {
        type: String,
        default: null,
        required: true,
    },
    url: {
        type: String,
        default: null,
        required: false,
    },
    //消息模板的ID
    messageTemplateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'appMessageTemplate',
        default: null,
        required: false
    },
    //父级菜单的ID(只支持两级菜单)
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'contextMenu',
        default: null,
        required: false
    },
    //关联的应用ID
    appId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'app',
        required: true
    }
}, {
    versionKey: false,
    timestamps: {
        createdAt: 'createdTime',
        updatedAt: 'updatedTime'
    }
})

const appContextMenuModel = mongoose.model("appContextMenu", schema);
module.exports = appContextMenuModel;