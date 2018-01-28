var express = require("express");
var api = require("../../../utilities/api");
var ObjectId = require('mongoose').Types.ObjectId;
var frequentlyUsedAppModel = require('../../../db/frequentlyUsedApp');
var router = express.Router();

router.get("users/:userId/frequentlyUsedApps", api.catchAsyncErrors(async function (req, res, next) {
    var userId = this.param.userId;
    var foundData = await frequentlyUsedAppModel.find({ userId }).populate('appId');
    api.attachData2Response(200, "获取成功", foundData, res);
    next();
}));

router.post("users/:userId/frequentlyUsedApps", api.catchAsyncErrors(async function (req, res, next) {
    req.body.userID = this.param.userId;
    var createdData = await frequentlyUsedAppModel.create(req.body);
    api.attachData2Response(200, "创建成功", createdData, res);
    next();
}));


router.delete("users/frequentlyUsedApps/:id", api.catchAsyncErrors(async function (req, res, next) {
    var id = req.params.id;
    var deletedData = await frequentlyUsedAppModel.findByIdAndRemove(id)
    api.attachData2Response(200, "移除成功。", deletedData, res);
    next();
}));

module.exports = router;