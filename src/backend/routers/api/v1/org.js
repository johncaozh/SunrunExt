var express = require("express");
var api = require("../../../utilities/api");
var iam = require("../../../utilities/iam");
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

module.exports = router;