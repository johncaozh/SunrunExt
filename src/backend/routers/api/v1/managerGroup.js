var express = require("express");
var api = require("../../../utilities/api");
var iam = require("../../../utilities/iam");
var managerGroupModel = require("../../../db/managerGroup");
var managerGroupAppModel = require("../../../db/managerGroup_app");
var managerGroupOrgModel = require("../../../db/managerGroup_org");
var managerGroupUserModel = require("../../../db/managerGroup_user");
var appModel = require("../../../db/app");
var userModel = require("../../../db/user");
var orgModel = require("../../../db/org");
var router = express.Router();

router.get("/managerGroups", api.catchAsyncErrors(async function (req, res, next) {
    var foundData = await managerGroupModel.find(req.query);
    api.attachData2Response(200, "获取成功", foundData, res);
    next();
}));

router.post("/managerGroups", api.catchAsyncErrors(async function (req, res, next) {
    var createdData = await managerGroupModel.create(req.body);
    api.attachData2Response(200, "创建成功", createdData, res);
    next();
}));

router.get("/managerGroups/:id", api.catchAsyncErrors(async function (req, res, next) {
    var id = req.params.id;
    var gotData = await managerGroupModel.findById(id, req.body).lean().exec();

    if (gotData != null) {
        gotData.apps = await managerGroupAppModel.find({
            groupId: gotData._id
        }).lean().exec();

        for (let i = 0; i < gotData.apps.length; i++) {
            gotData.apps[i].detail = await appModel.findById(gotData.apps[i].appId).lean().exec();
            gotData.apps[i].detail.permission = gotData.apps[i].permission;
        }

        gotData.orgs = await managerGroupOrgModel.find({
            groupId: gotData._id
        }).lean().exec();

        for (let i = 0; i < gotData.orgs.length; i++) {
            var detail = await orgModel.findOne({
                id: gotData.orgs[i].orgId
            }).lean().exec();
            detail.type = "org";
            gotData.orgs[i].detail = detail;
            gotData.orgs[i].detail.permission = gotData.orgs[i].permission;
        }

        gotData.users = await managerGroupUserModel.find({
            groupId: gotData._id
        }).lean().exec();

        for (let i = 0; i < gotData.users.length; i++) {
            var detail = await userModel.findOne({
                id: gotData.users[i].userId
            }).lean().exec();
            detail.type = "user";
            gotData.users[i].detail = detail;
        }

        api.attachData2Response(200, "获取成功", gotData, res);
    } else
        api.attachData2Response(404, "不存在", gotData, res);

    next();
}));

router.put("/managerGroups/:id", api.catchAsyncErrors(async function (req, res, next) {
    var id = req.params.id;
    var updatedData = await managerGroupModel.findByIdAndUpdate(id, req.body)
    api.attachData2Response(200, "更新成功", updatedData, res);
    next();
}));

router.delete("/managerGroups/:id", api.catchAsyncErrors(async function (req, res, next) {
    var id = req.params.id;
    var deletedData = await deleteGroup(id);
    api.attachData2Response(200, "移除成功。", deletedData, res);
    next();
}));

router.get("/managerGroups/apps/:id", api.catchAsyncErrors(async function (req, res, next) {
    var id = this.params.id;
    var foundData = await managerGroupAppModel.findById(id).populate('appId');
    api.attachData2Response(200, "获取成功", foundData, res);
    next();
}));

router.post("/managerGroups/apps", api.catchAsyncErrors(async function (req, res, next) {
    var createdData = await managerGroupAppModel.create(req.body);
    api.attachData2Response(200, "创建成功", createdData, res);
    next();
}));

router.post("/managerGroups/apps/:id", api.catchAsyncErrors(async function (req, res, next) {
    var id = this.params.id;
    var updatedData = await managerGroupAppModel.findByIdAndUpdate(id, req.body);
    api.attachData2Response(200, "更新成功", updatedData, res);
    next();
}));

router.delete("/managerGroups/apps/:id", api.catchAsyncErrors(async function (req, res, next) {
    var id = req.params.id;
    var deletedData = await managerGroupAppModel.findByIdAndRemove(id)
    api.attachData2Response(200, "移除成功。", deletedData, res);
    next();
}));

router.get("/managerGroups/orgs/:id", api.catchAsyncErrors(async function (req, res, next) {
    var id = req.params.id;
    var foundData = await managerGroupOrgModel.findById(id).lean().exec();
    foundData.orgDetail = iam.getOrgOrUser(foundData.orgId, "org");
    api.attachData2Response(200, "获取成功", foundData, res);
    next();
}));

router.post("/managerGroups/orgs", api.catchAsyncErrors(async function (req, res, next) {
    var createdData = await managerGroupOrgModel.create(req.body);
    api.attachData2Response(200, "创建成功", createdData, res);
    next();
}));

router.put("/managerGroups/orgs/:id", api.catchAsyncErrors(async function (req, res, next) {
    var id = req.params.id;
    var updatedData = await managerGroupOrgModel.findByIdAndUpdate(id, req.body);
    api.attachData2Response(200, "更新成功", updatedData, res);
    next();
}));

router.delete("/managerGroups/orgs/:id", api.catchAsyncErrors(async function (req, res, next) {
    var id = req.params.id;
    var deletedData = await managerGroupOrgModel.findByIdAndRemove(id)
    api.attachData2Response(200, "移除成功。", deletedData, res);
    next();
}));

router.get("/managerGroups/users/:id", api.catchAsyncErrors(async function (req, res, next) {
    var id = req.params.id;
    var foundData = await managerGroupUserModel.findById(id).lean().exec();
    foundData.userDetail = iam.getOrgOrUser(foundData.userId, "user");
    api.attachData2Response(200, "获取成功", foundData, res);
    next();
}));

router.post("/managerGroups/users", api.catchAsyncErrors(async function (req, res, next) {
    var createdData = await managerGroupUserModel.create(req.body);
    api.attachData2Response(200, "创建成功", createdData, res);
    next();
}));

router.post("/managerGroups/users/:id", api.catchAsyncErrors(async function (req, res, next) {
    var id = req.params.id;
    var updatedData = await managerGroupUserModel.findByIdAndUpdate(id, req.body);
    api.attachData2Response(200, "更新成功", updatedData, res);
    next();
}));

router.delete("/managerGroups/users/:id", api.catchAsyncErrors(async function (req, res, next) {
    var id = req.params.id;
    var deletedData = await managerGroupUserModel.findByIdAndRemove(id)
    api.attachData2Response(200, "移除成功。", deletedData, res);
    next();
}));

async function deleteGroup(id) {
    var subGroups = await managerGroupModel.find({
        parentId: id
    });
    for (var i = 0; i < subGroups.length; i++) {
        var subGroup = subGroups[i];
        await managerGroupModel.remove(subGroup);
        await deleteGroup(subGroup._id);
    }

    return await managerGroupModel.findByIdAndRemove(id);
}

async function createSuperGroup() {
    var superGroup = await managerGroupModel.findOne({
        parentId: null
    });
    if (!superGroup) {
        return await managerGroupModel.create({
            name: "超级管理员组",
            parentId: null,
        });
    }
}

module.exports = {
    router,
    createSuperGroup,
}