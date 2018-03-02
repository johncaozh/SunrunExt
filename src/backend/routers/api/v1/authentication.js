var request = require('request');
var express = require("express");
var session = require('express-session');
var env = require("../../../utilities/env");
var iam = require("../../../utilities/iam");
var userModel = require("../../../db/user");
var api = require("../../../utilities/api");
var managerGroupUserModel = require("../../../db/managerGroup_user");

var router = express.Router();

router.post("/login", api.catchAsyncErrors(async function (req, res, next) {
    var postData = req.body;

    if (postData.mode != "system" && postData.mode != "iam") {
        api.attachData2Response(403, "参数错误", null, res);
        next();
        return;
    }

    var logonUserData = null;

    if (postData.mode == "system") {
        var systemName = postData.userId;
        var passsWord = postData.passsWord;

        if (env.serverEndConfig.superAdmin != systemName || env.serverEndConfig.sunperAdminPWD != passsWord) {
            api.attachData2Response(403, "账号或密码错误。", null, res);
            next();
            return;
        } else {
            logonUserData = {
                userId: env.serverEndConfig.superAdmin,
                userName: "系统管理员"
            }
        }
    } else {
        var st = postData.st;
        if (!st) {
            api.attachData2Response(403, "ST为空", null, res);
            next();
            return;
        }

        var {
            id,
            userId
        } = await iam.verifyST(st);

        if (!id) {
            api.attachData2Response(403, "验证ST失败", null, res);
            next();
            return;
        }

        var userDetail = await iam.getUserDetail(id);
        if (!userDetail) {
            api.attachData2Response(403, "获取用户信息失败", null, res);
            next();
            return;
        }

        logonUserData = {
            userId: userId,
            userName: userDetail.real_name ? userDetail.real_name : userId
        }

        var targetUserInManagerGroup = await managerGroupUserModel.findOne({
            userId: id
        });

        if (targetUserInManagerGroup == null) {
            api.attachData2Response(403, "该用户不是管理员", null, res);
            next();
            return;
        }

        var targetUserInDB = await userModel.findOne({
            id: id
        });

        if (targetUserInDB == null) {
            await iam.syncIamUsers();
        }
    }

    req.session.regenerate(function (err) {
        if (err) {
            api.attachData2Response(403, err, null, res);
            next();
        } else {
            api.attachData2Response(200, "登录成功", logonUserData, res);
            next();
        }
    });
}));

router.post("/logout", api.catchAsyncErrors(async function (req, res, next) {
    req.session.destroy();
    api.attachData2Response(200, "注销成功", null, res);
    next();
}));

module.exports = router;