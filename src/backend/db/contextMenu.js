var mongoose = require("mongoose");

const schema = mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    //click:点击推事件
    //view:跳转URL
    //scancode:扫码推事件
    //pic_photo:弹出拍照并发图
    //pic_album:弹出相册并发图
    //pic_photo_album:弹出拍照/相册并发图
    //location_select:弹出地理位置选择器
    type: {
        type: String,
        require: true,
    },
    key: {
        type: String,
        require: true,
    },
    url: {
        type: String,
        require: false,
    },
    //父级菜单的ID(只支持两级菜单)
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'contextMenu',
        required: false
    }
}, {
    versionKey: false,
    timestamps: {
        createdAt: 'createdTime',
        updatedAt: 'updatedTime'
    }
})

const contextMenuModel = mongoose.model("contextMenu", schema);
module.exports = contextMenuModel;