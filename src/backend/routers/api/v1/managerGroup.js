var express = require("express");
var api = require("../../../utilities/api");
var managerGroupModel = require("../../../db/managerGroup");
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
        gotData.apps = await appModel.find({ _id: { $in: gotData.apps } });
        gotData.users = await userModel.find({ id: { $in: gotData.users } });
        gotData.orgs = await orgModel.find({ id: { $in: gotData.orgs } });
        api.attachData2Response(200, "获取成功", gotData, res);
    }
    else
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

async function deleteGroup(id) {
    var subGroups = await managerGroupModel.find({ parentId: id });
    for (var i = 0; i < subGroups.length; i++) {
        var subGroup = subGroups[i];
        await managerGroupModel.remove(subGroup);
        await deleteGroup(subGroup._id);
    }

    return await managerGroupModel.findByIdAndRemove(id);
}

async function createSuperGroup() {
    var superGroup = await managerGroupModel.find({ parentId: null });
    if (!superGroup) {
        return await managerGroupModel.create({
            name: "超级管理员组",
            parentId: null,
            apps: null,
            orgs: null,
            users: null
        });
    }
}

module.exports = {
    router,
    createSuperGroup,
}