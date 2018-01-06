var express = require("express");
var api = require("../../../utilities/api");
var appAutoReplyRule = require("../../../db/appAutoReplyRule");
var router = express.Router();

router.get("/appAutoReplyRuleModel", api.catchAsyncErrors(async function (req, res, next) {
    var foundData = await appAutoReplyRuleModel.find();
    api.attachData2Response(200, "获取成功", foundData, res);
    next();
}));

router.post("/appAutoReplyRuleModel", api.catchAsyncErrors(async function (req, res, next) {
    var createdData = await appAutoReplyRuleModel.create(req.body);
    api.attachData2Response(200, "创建成功", createdData, res);
    next();
}));

router.get("/appAutoReplyRuleModel/:id", api.catchAsyncErrors(async function (req, res, next) {
    var id = req.params.id;
    var gotData = await appAutoReplyRuleModel.findById(id, req.body)

    if (gotData != null)
        api.attachData2Response(200, "获取成功", gotData, res);
    else
        api.attachData2Response(404, "不存在", gotData, res);

    next();
}));

router.put("/appAutoReplyRuleModel/:id", api.catchAsyncErrors(async function (req, res, next) {
    var id = req.params.id;
    var updatedData = await appAutoReplyRuleModel.findByIdAndUpdate(id, req.body)
    api.attachData2Response(200, "更新成功", updatedData, res);
    next();
}));

router.delete("/appAutoReplyRuleModel/:id", api.catchAsyncErrors(async function (req, res, next) {
    var id = req.params.id;
    var deletedData = await appAutoReplyRuleModel.findByIdAndRemove(id, req.body)
    api.attachData2Response(200, "移除成功。", deletedData, res);
    next();
}));

module.exports = router;