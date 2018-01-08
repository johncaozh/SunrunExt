var express = require("express");
var multer = require("multer");
var api = require("../../../utilities/api");
var env = require("../../../utilities/env");
const fs = require('fs');
const path = require('path');
const s3 = require('../../../utilities/s3');
const s3Model = require('../../../db/s3');

var router = express.Router();
var upload = multer({
    dest: env.serverEndConfig.staticFileDir
}).single('file');

// 单文件上传
router.post("/files", upload, function (req, res, next) {
    upload(req, res, async function (err) {
        if (err) {
            api.attachData2Response(500, "上传失败", err, res);
            next();
        } else {
            var presignedUrl;
            var filePath = req.file.path;
            var md5 = await s3.getFileMd5(req.file.path);
            var existed = await s3.checkObjectExist(md5);
            if (!existed) {
                await s3.uploadObject(filePath, md5);
                presignedUrl = await s3.getObjectPresignedUrl(md5);
            }

            var item = await s3Model.findOne({
                objectKey: md5
            });

            if (item == null || item.presignedUrl == null) {
                if (!presignedUrl)
                    presignedUrl = await s3.getObjectPresignedUrl(md5);

                if (item != null) {
                    await item.update({
                        presignedUrl: md5
                    });
                } else {
                    var parsm = {
                        objectKey: md5,
                        presignedUrl: presignedUrl,
                    };

                    await s3Model.create(parsm);
                }
            }

            fs.unlinkSync(filePath);
            api.attachData2Response(200, "上传成功", md5, res);
            next();
        }
    });
});

router.get("/files/:fileId", api.catchAsyncErrors(async function (req, res, next) {
    var fileId = req.params.fileId;
    var item = await s3Model.findOne({
        objectKey: fileId
    });

    if (item == null || item.presignedUrl == null) {
        var existed = await s3.checkObjectExist(fileId);
        if (existed) {
            var presignedUrl = await s3.getObjectPresignedUrl(md5);

            if (item != null) {
                await item.update({
                    presignedUrl: presignedUrl
                });
            } else {
                var parsm = {
                    objectKey: fileId,
                    presignedUrl: presignedUrl,
                };

                await s3Model.create(parsm);
            }

            api.attachData2Response(302, "获取文件成功", presignedUrl, res);
            next();
        } else {
            api.attachData2Response(404, "文件不存在", presignedUrl, res);
            next();
        }
    }

    api.attachData2Response(302, "获取文件成功", item.presignedUrl, res);
    next();
}));

module.exports = router;