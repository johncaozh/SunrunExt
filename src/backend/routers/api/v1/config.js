var fs = require('fs');
var express = require("express");
var router = express.Router();

async function loadConfig() {
    var json = await fs.readFileSync('../../../config.json').toString();
    return JSON.parse(json);
}

async function saveConfig(config) {
    var json = JSON.stringify(config);
    await fs.writeFileSync('../../../config.json', json);
}

router.get("/config", api.catchAsyncErrors(async function (req, res, next) {
    var config = await loadConfig();
    api.attachData2Response(200, "获取成功", config, res);
    next();
}));

router.put("/config", api.catchAsyncErrors(async function (req, res, next) {
    var config = await loadConfig();
    for (var p in req.body) {
        if (!config[p] || typeof (config[p]) !== typeof (req.body[p])) {
            api.attachData2Response(400, "无效的请求数据", config, res);
            next();
            return;
        } else {
            config[p] = req.body[p];
        }
    }

    await saveConfig(config);
    api.attachData2Response(200, "更新成功", config, res);
    next();
}));

module.exports = router;