var express = require("express");
var api = require("../../../utilities/api");
var appGroupModel = require("../../../db/appGroup");
var appModel = require("../../../db/app");
var router = express.Router();

router.get("/appGroups", api.catchAsyncErrors(async function (req, res, next) {
    var foundData = await appGroupModel.find(req.query);
    api.attachData2Response(200, "获取成功", foundData, res);
    next();
}));

router.post("/appGroups", api.catchAsyncErrors(async function (req, res, next) {
    var createdData = await appGroupModel.create(req.body);
    api.attachData2Response(200, "创建成功", createdData, res);
    next();
}));

router.get("/appGroups/:id", api.catchAsyncErrors(async function (req, res, next) {
    var id = req.params.id;
    var gotData = await appGroupModel.findById(id, req.body).lean().exec();

    if (gotData != null) {
        var apps = appModel.find({
            groupId: id
        });
        gotData.apps = apps;
        api.attachData2Response(200, "获取成功", gotData, res);
    } else
        api.attachData2Response(404, "不存在", gotData, res);

    next();
}));

router.put("/appGroups/:id", api.catchAsyncErrors(async function (req, res, next) {
    var id = req.params.id;
    var updatedData = await appGroupModel.findByIdAndUpdate(id, req.body)
    api.attachData2Response(200, "更新成功", updatedData, res);
    next();
}));

router.delete("/appGroups/:id", api.catchAsyncErrors(async function (req, res, next) {
    var id = req.params.id;
    var deletedData = await appGroupModel.findByIdAndRemove(id, req.body)
    api.attachData2Response(200, "移除成功。", deletedData, res);
    next();
}));

module.exports = router