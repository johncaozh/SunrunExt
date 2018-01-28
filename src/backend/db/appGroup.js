var mongoose = require("mongoose");

const schema = mongoose.Schema({
    //分组的名称
    name: {
        type: String,
        required: true,
    }
}, {
        versionKey: false,
        timestamps: {
            createdAt: 'createdTime',
            updatedAt: 'updatedTime'
        }
    })

const appGroupModel = mongoose.model("appGroup", schema);
module.exports = appGroupModel;