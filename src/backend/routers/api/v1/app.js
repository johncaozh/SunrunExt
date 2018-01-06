var express = require("express");
var api = require("../../../utilities/api");
var appModel = require("../../../db/app");
var router = express.Router();

router.get("/apps", api.catchAsyncErrors(async function (req, res, next) {
    var foundData = await appModel.find();
    api.attachData2Response(200, "获取成功", foundData, res);
    next();
}));

router.post("/apps", api.catchAsyncErrors(async function (req, res, next) {
    var createdData = await appModel.create(req.body);
    api.attachData2Response(200, "创建成功", createdData, res);
    next();
}));

router.get("/apps/:id", api.catchAsyncErrors(async function (req, res, next) {
    var id = req.params.id;
    var gotData = await appModel.findById(id, req.body);

    if (gotData != null)
        api.attachData2Response(200, "获取成功", gotData, res);
    else
        api.attachData2Response(404, "不存在", gotData, res);

    next();
}));

router.put("/apps/:id", api.catchAsyncErrors(async function (req, res, next) {
    var id = req.params.id;
    var updatedData = await appModel.findByIdAndUpdate(id, req.body)
    api.attachData2Response(200, "更新成功", updatedData, res);
    next();
}));

router.delete("/apps/:id", api.catchAsyncErrors(async function (req, res, next) {
    var id = req.params.id;
    var deletedData = await appModel.findByIdAndRemove(id, req.body)
    api.attachData2Response(200, "移除成功。", deletedData, res);
    next();
}));

module.exports = router;