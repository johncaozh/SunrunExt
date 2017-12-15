var mongoose = require("mongoose");

const schema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: false
    },
    size: {
        type: Number,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    public: {
        type: Boolean,
        default: true,
        required: false
    },
    _product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        required: true
    },
    _createUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'iamUser',
        required: true
    },
    _lastUpdateUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'iamUser',
        required: true
    },
}, {
    versionKey: false,
    timestamps: {
        createdAt: 'createTime',
        updatedAt: 'updateTime'
    }
});

const documenetModel = mongoose.model("document", schema);

module.exports = documenetModel;