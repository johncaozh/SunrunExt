var express = require("express");
var api = require("../../../utilities/api");
var appSentMessageScheduler = require("../../../utilities/appSentMessageScheduler");
var appSentMessageHistoryModel = require("../../../db/appSentMessageHistory");
var appMessageTemplateModel = require("../../../db/appMessageTemplate");
var userModel = require("../../../db/user");
var router = express.Router();

router.get("/appSentMessageRecords", api.catchAsyncErrors(async function (req, res, next) {
    var foundData = await appSentMessageHistoryModel.find(req.query).populate('appMessageTemplate').populate('app').sort({
        updatedTime: 'descending'
    });
    api.attachData2Response(200, "获取成功", foundData, res);
    next();
}));

router.post("/appSentMessageRecords", api.catchAsyncErrors(async function (req, res, next) {
    var createdData = await appSentMessageHistoryModel.create(req.body);
    api.attachData2Response(200, "创建成功", createdData, res);

    if (createdData.type == 'timing') {
        appSentMessageScheduler.addJob(createdData)
    } else if (createdData.type == 'sent') {
        appSentMessageScheduler.sendMessageJob(createdData);
    } else if (createdData.type == "draft") {
        //草稿类型不需要任何处理
    }

    next();
}));

router.get("/appSentMessageRecords/:id", api.catchAsyncErrors(async function (req, res, next) {
    var id = req.params.id;
    var gotData = await appSentMessageHistoryModel.findById(id, req.body)
    var detailReceivers = await userModel.find({
        id: {
            $in: gotData.receivers
        }
    });

    gotData.receivers = detailReceivers;

    if (gotData != null)
        api.attachData2Response(200, "获取成功", gotData, res);
    else
        api.attachData2Response(404, "不存在", gotData, res);

    next();
}));

router.put("/appSentMessageRecords/:id", api.catchAsyncErrors(async function (req, res, next) {
    var id = req.params.id;
    var targetData = await appSentMessageHistoryModel.findById(id);
    if (targetData) {
        var updatedData = await appSentMessageHistoryModel.findByIdAndUpdate(id, req.body)
        api.attachData2Response(200, "更新成功", updatedData, res);

        if (targetData.type == "draft" && updatedData.type == "timing") {
            appSentMessageScheduler.addJob(updatedData);
        } else if (targetData.type == "timing" && updatedData.type == "draft") {
            appSentMessageScheduler.cancelJob(id);
        } else if (targetData.type == 'timing' && updatedData.type == 'timing' && targetData.schedulerDate != updatedData.schedulerDate) {
            appSentMessageScheduler.rescheduleJob(updatedData._id, updatedData.schedulerDate);
        }
    } else {
        api.attachData2Response(404, "不存在", gotData, res);
    }
    next();
}));

router.delete("/appSentMessageRecords/:id", api.catchAsyncErrors(async function (req, res, next) {
    var id = req.params.id;
    var deletedData = await appSentMessageHistoryModel.findByIdAndRemove(id, req.body)
    await appMessageTemplateModel.findByIdAndRemove(id);
    if (deletedData.type == 'timing')
        appSentMessageScheduler.cancelJob(id);
    api.attachData2Response(200, "移除成功。", deletedData, res);
    next();
}));

module.exports = router;