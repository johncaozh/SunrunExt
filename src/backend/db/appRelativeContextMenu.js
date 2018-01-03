var mongoose = require('mongoose');

const schema = mongoose.Schema({
    appId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'app',
        required: true
    },
    contextMenuId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'contentMenu',
        required: true
    }
});

const appRelativeContextMenuModel = mongoose.model("appRelativeContextMenu", schema);
module.exports = appRelativeContextMenuModel;