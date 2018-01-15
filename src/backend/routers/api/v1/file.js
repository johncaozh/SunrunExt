var express = require("express");
var multer = require("multer");
var api = require("../../../utilities/api");
var env = require("../../../utilities/env");
var ffmpeg = require('../../../utilities/ffmpeg');
const fs = require('fs');
const path = require('path');
const s3 = require('../../../utilities/s3');
const s3Model = require('../../../db/s3');

var router = express.Router();
var upload = multer({
    dest: env.serverEndConfig.staticFileDir
}).single('file');

//处理用户上次的文件，生成预签名链接，最后返回文件的MD5(用MD5作为ObjectkEY,可以去掉冗余上传)
async function processUploadFile(filePath, mimeType) {
    var md5 = await s3.getFileMd5(filePath);
    var existed = await s3.checkObjectExist(md5);
    if (!existed) {
        await s3.uploadObject(filePath, md5, mimeType);
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
    return md5;
}

// 上传语音
router.post("/files/audio", upload, function (req, res, next) {
    upload(req, res, async function (err) {
        if (err) {
            api.attachData2Response(500, "上传失败", err, res);
            next();
        } else {
            var presignedUrl;
            var filePath = req.file.path;
            var audioDuration = await ffmpeg.getAudioDuration(filePath);

            if (audioDuration > 60) {
                api.attachData2Response(413, "语音时长不能超过一分钟", amrMd5, res);
                next();
                return;
            }

            var amrPath = await ffmpeg.convertAudioToAmr(filePath);
            var amrMd5 = await processUploadFile(filePath, "audio/amr");
            api.attachData2Response(200, "上传成功", {
                mediaId: amrMd5,
                duration: audioDuration,
            }, res);
            next();
        }
    });
});

// 上传视频
router.post("/files/video", upload, function (req, res, next) {
    upload(req, res, async function (err) {
        if (err) {
            api.attachData2Response(500, "上传失败", err, res);
            next();
        } else {
            var presignedUrl;
            var filePath = req.file.path;
            var mp4FilePath = await ffmpeg.convertVideoToMp4(filePath);
            console.log("mp4FilePath:" + mp4FilePath);
            var resizeMp4FilePath = await ffmpeg.resizeVideo(mp4FilePath);
            console.log("resizeMp4FilePath:" + resizeMp4FilePath);
            
            var videoThumbFilePath = await ffmpeg.getVideoSnapshot(resizeMp4FilePath);
            console.log("videoThumbFilePath:" + videoThumbFilePath);
            
            var resizeMp4FileMd5 = await processUploadFile(resizeMp4FilePath, "video/mp4");
            var videoThumbFileMd5 = await processUploadFile(videoThumbFilePath, "image/png");

            api.attachData2Response(200, "上传成功", {
                mediaId: resizeMp4FileMd5,
                thumbMediaId: videoThumbFileMd5,
            }, res);
            next();
        }
    });
});

// 单文件上传
router.post("/files", upload, function (req, res, next) {
    upload(req, res, async function (err) {
        if (err) {
            api.attachData2Response(500, "上传失败", err, res);
            next();
        } else {
            var presignedUrl;
            var filePath = req.file.path;
            var md5 = await processUploadFile(filePath);
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