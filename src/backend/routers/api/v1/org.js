var express = require("express");
var api = require("../../../utilities/api");
var iam = require("../../../utilities/iam");
var specialOrgOrUserModel = require('../../../db/specialOrgOrUser');
var whiteListOrgOrUserModel = require('../../../db/whiteListOrgOrUser');
var router = express.Router();

router.get("/orgs", api.catchAsyncErrors(async function (req, res, next) {
    var foundData = await iam.getDomainOrg();
    api.attachData2Response(200, "获取成功", foundData, res);
    next();
}));

router.post("/orgs", api.catchAsyncErrors(async function (req, res, next) {
    var createdData = await iam.syncIamUsers();
    api.attachData2Response(200, "同步成功", createdData, res);
    next();
}));

router.get("/orgs/special", api.catchAsyncErrors(async function (req, res, next) {
    var foundData = await specialOrgOrUserModel.find(req.query).lean().exec();
    for (let i = 0; i < foundData.length; i++) {
        var target = foundData[i];
        target.detail = await iam.getOrgOrUser(target.id);
    }

    var filted = foundData.filter(i => i.detail);

    api.attachData2Response(200, "获取成功", filted, res);
    next();
}));

router.post("/orgs/special", api.catchAsyncErrors(async function (req, res, next) {
    var exitedData = await specialOrgOrUserModel.find({
        id: req.body.id,
        type: req.body.type
    });

    if (exitedData) {
        api.attachData2Response(409, "已存在相同的项目", foundData, res);
        next();
        return;
    }

    var foundData = await specialOrgOrUserModel.create(req.body);
    api.attachData2Response(200, "添加成功", foundData, res);
    next();
}));

router.delete("/orgs/special/:orgOrUserId", api.catchAsyncErrors(async function (req, res, next) {
    var id = req.param.orgOrUserId;
    var foundData = await specialOrgOrUserModel.remove({
        id
    });
    api.attachData2Response(200, "删除成功", foundData, res);
    next();
}));

router.get("/orgs/special/:orgOrUserId/whiteList", api.catchAsyncErrors(async function (req, res, next) {
    var id = req.param.orgOrUserId;
    var foundData = await whiteListOrgOrUserModel.find({
        id
    });
    api.attachData2Response(200, "获取成功", foundData, res);
    next();
}));

router.post("/orgs/special/:orgOrUserId/whiteList", api.catchAsyncErrors(async function (req, res, next) {
    var id = req.param.orgOrUserId;
    var foundData = await whiteListOrgOrUserModel.create(req.body);
    api.attachData2Response(200, "添加成功", foundData, res);
    next();
}));

router.delete("/orgs/special/:orgOrUserId/whiteList/:whilteListId", api.catchAsyncErrors(async function (req, res, next) {
    var id = req.param.orgOrUserId;
    var whilteListId = req.param.whilteListId;
    var foundData = await whiteListOrgOrUserModel.remove({
        id,
        whilteListId,
    });
    api.attachData2Response(200, "删除成功", foundData, res);
    next();
}));

module.exports = router;