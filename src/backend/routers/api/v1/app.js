var express = require("express");
var api = require("../../../utilities/api");
var appModel = require("../../../db/app");
var ObjectId = require('mongoose').Types.ObjectId;
var appContextMenuModel = require('../../../db/appContextMenu');
var appAutoReplyRuleModel = require('../../../db/appAutoReplyRule');
var appMessageTemplateModel = require('../../../db/appMessageTemplate');
var userModel = require('../../../db/user');
var orgModel = require('../../../db/org');
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
    var gotData = await appModel.findById(id, req.body).lean().exec();

    if (gotData != null) {
        gotData.contextMenus = await getAppContextMenu(id);
        gotData.autoReplyRules = await getAppAutoReplyRule(id);
        var users = await getAppUsers(gotData.iamUserIds);
        var orgs = await getAppOrgs(gotData.iamOrgIds);
        gotData.orgs = users.concat(orgs)
        api.attachData2Response(200, "获取成功", gotData, res);
    } else
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


async function getAppContextMenu(appId) {
    //获取第一级菜单项列表
    var rootMenuItems = await appContextMenuModel.find({
        appId: appId,
        parentId: null
    }).lean().exec();

    for (let i = 0; i < rootMenuItems.length; i++) {
        var rootMenu = rootMenuItems[i];
        rootMenu.subMenuItems = await appContextMenuModel.find({
            appId: appId,
            parentId: rootMenu._id
        }).lean().exec();
    }

    return rootMenuItems;
};

async function getAppAutoReplyRule(appId) {
    var defaultRule = await appAutoReplyRuleModel
        .findOne({
            name: null,
            type: null,
            appId: new ObjectId(appId)
        })
        .populate('appMessageTemplateId')
        .lean()
        .exec();

    var filtedRules = await appAutoReplyRuleModel.find({
            name: {
                $ne: null
            },
            type: {
                $ne: null
            },
            appId: new ObjectId(appId)
        })
        .populate('appMessageTemplateId')
        .lean()
        .exec();;

    var tempRules = {};
    for (let i = 0; i < filtedRules.length; i++) {
        var rule = filtedRules[i];
        tempRules[rule.name] = tempRules[rule.name] || [];
        tempRules[rule.name].push(rule);
    }

    var keywordRules = [];
    for (var name in tempRules) {
        var appMessageTemplate = tempRules[name][0].appMessageTemplateId;
        tempRules[name].forEach(i => {
            delete i.appMessageTemplateId;
        });

        keywordRules.push({
            name: name,
            rules: tempRules[name],
            appMessageTemplate: appMessageTemplate
        });
    }

    return {
        defaultRule: defaultRule,
        keywordRules: keywordRules,
    }
};

async function getAppUsers(iamUserIds) {
    if (iamUserIds == null || iamUserIds.length == 0)
        return [];

    var users = await userModel.find({
        id: {
            $in: iamUserIds
        }
    }).lean().exec();

    users.forEach(i => i.type = "user");
    return users;
}

async function getAppOrgs(iamOrgIds) {
    if (iamOrgIds == null || iamOrgIds.length == 0)
        return [];

    var orgs = await orgModel.find({
        id: {
            $in: iamOrgIds
        }
    }).lean().exec();

    orgs.forEach(i => i.type = "org");
    return orgs;
}

module.exports = router;