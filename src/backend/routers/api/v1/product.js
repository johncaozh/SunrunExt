var express = require("express");
var api = require("../../../utilities/api");
var iam = require('../../../utilities/iam');
var router = express.Router();

router.get("/products", api.catchAsyncErrors(async function (req, res, next) {
    var foundData = await iam.getProductList();
    api.attachData2Response(200, "获取成功", foundData, res);
    next();
}));

module.exports = router;