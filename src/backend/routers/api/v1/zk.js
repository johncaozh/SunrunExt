var express = require("express");
var api = require("../../../utilities/api");
var zk = require("../../../utilities/zk");
var router = express.Router();

router.get("/zk", api.catchAsyncErrors(async function (req, res, next) {
    var path = req.query.path || '/';
    var action = req.query.action;
    var data = null;

    if (action === "getChildren") {
        data = await zk.getChildren(path);
        api.attachData2Response(200, "获取成功", data, res);
    } else if (action === "getData") {
        data = await zk.getData(path);
        api.attachData2Response(200, "获取成功", data, res);
    } else {
        api.attachData2Response(400, "action参数错误", data, res);
    }

    next();
}));

router.delete("/zk", api.catchAsyncErrors(async function (req, res, next) {
    var path = req.query.path;
    var data = await zk.remove(path);
    if (data)
        api.attachData2Response(200, "删除成功", data , res);
    else
        api.attachData2Response(500, "删除失败", data, res);

    next();
}));

router.put("/zk", api.catchAsyncErrors(async function (req, res, next) {
    var path = req.body.path;
    var value = req.body.value;
    await zk.setData(path, value);
    api.attachData2Response(200, "更新成功", null, res);
    next();
}));

router.post("/zk", api.catchAsyncErrors(async function (req, res, next) {
    var action = req.query.action;
    if (action === "mkdir") {
        await zk.mkdir(req.body.path);
    } else {
        await zk.create(req.body.path, req.body.value);
    }
    api.attachData2Response(200, "创建成功", null, res);
    next();
}));

module.exports = router