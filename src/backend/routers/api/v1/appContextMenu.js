var express = require("express");
var api = require("../../../utilities/api");
var appContextMenuModel = require("../../../db/appContextMenu");
var router = express.Router();

router.get("/appContextMenu", api.catchAsyncErrors(async function (req, res, next) {
    var foundData = await appContextMenuModel.find();
    api.attachData2Response(200, "获取成功", foundData, res);
    next();
}));

router.post("/appContextMenu", api.catchAsyncErrors(async function (req, res, next) {
    var createdData = await appContextMenuModel.create(req.body);
    api.attachData2Response(200, "创建成功", createdData, res);
    next();
}));

router.get("/appContextMenu/:id", api.catchAsyncErrors(async function (req, res, next) {
    var id = req.params.id;
    var gotData = await appContextMenuModel.findById(id, req.body)

    if (gotData != null)
        api.attachData2Response(200, "获取成功", gotData, res);
    else
        api.attachData2Response(404, "不存在", gotData, res);

    next();
}));

router.put("/appContextMenu/:id", api.catchAsyncErrors(async function (req, res, next) {
    var id = req.params.id;
    var updatedData = await appContextMenuModel.findByIdAndUpdate(id, req.body)
    api.attachData2Response(200, "更新成功", updatedData, res);
    next();
}));

router.delete("/appContextMenu/:id", api.catchAsyncErrors(async function (req, res, next) {
    var id = req.params.id;
    var deletedData = await appContextMenuModel.findByIdAndRemove(id, req.body)
    api.attachData2Response(200, "移除成功。", deletedData, res);
    next();
}));

module.exports = router;