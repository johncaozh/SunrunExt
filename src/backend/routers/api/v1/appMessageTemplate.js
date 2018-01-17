var express = require("express");
var api = require("../../../utilities/api");
var appMessageTemplateModel = require("../../../db/appMessageTemplate");
var router = express.Router();

router.get("/appMessageTemplates", api.catchAsyncErrors(async function (req, res, next) {
    var foundData = await appMessageTemplateModel.find();
    api.attachData2Response(200, "获取成功", foundData, res);
    next();
}));

router.post("/appMessageTemplates", api.catchAsyncErrors(async function (req, res, next) {
    var createdData = await appMessageTemplateModel.create(req.body);
    api.attachData2Response(200, "创建成功", createdData, res);
    next();
}));

router.get("/appMessageTemplates/:id", api.catchAsyncErrors(async function (req, res, next) {
    var id = req.params.id;
    var gotData = await appMessageTemplateModel.findById(id, req.body)

    if (gotData != null)
        api.attachData2Response(200, "获取成功", gotData, res);
    else
        api.attachData2Response(404, "不存在", gotData, res);

    next();
}));

router.put("/appMessageTemplates/:id", api.catchAsyncErrors(async function (req, res, next) {
    var id = req.params.id;
    var updatedData = await appMessageTemplateModel.findByIdAndUpdate(id, req.body)
    api.attachData2Response(200, "更新成功", updatedData, res);
    next();
}));

router.delete("/appMessageTemplates/:id", api.catchAsyncErrors(async function (req, res, next) {
    var id = req.params.id;
    var deletedData = await appMessageTemplateModel.findByIdAndRemove(id, req.body)
    api.attachData2Response(200, "移除成功。", deletedData, res);
    next();
}));

module.exports = router;