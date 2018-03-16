var aws = require('aws-sdk');
var env = require('./env');
var s3Model = require('../db/s3');
var fs = require('fs');
const md5File = require('md5-file/promise')
var s3Client = null;

async function init() {
    var config = env.s3Config;
    aws.config.update(config);
    s3Client = new aws.S3();
    s3Client.endpoint = new aws.Endpoint(config.endpoint);
}

async function uploadObject(filePath, objectKey, mimeType) {
    var fileData = fs.readFileSync(filePath);
    var request = {
        Bucket: env.s3Config.bucketName,
        Key: objectKey,
        Body: new Buffer(fileData),
    };

    if (mimeType)
        request.ContentType = mimeType;

    return await s3Client.putObject(request).promise();
}

async function downloadObject(filePath, objectKey) {
    var request = {
        Bucket: env.s3Config.bucketName,
        Key: objectKey,
    };
    return await s3Client.getObject(request);
}

async function getObjectPresignedUrl(objectKey) {
    var request = {
        Bucket: env.s3Config.bucketName,
        Key: objectKey,
        Expires: 86400 * 7,
    }

    return s3Client.getSignedUrl('getObject', request);
}

async function checkObjectExist(objectKey) {
    try {
        var request = {
            Bucket: env.s3Config.bucketName,
            Key: objectKey
        }
        var result = await s3Client.getObject(request).promise();
        return result != null;
    } catch (err) {
        return false;
    }
}

async function getFileMd5(filePath) {
    var md5 = await md5File(filePath);
    return md5.toUpperCase();
}

module.exports = {
    init,
    uploadObject,
    downloadObject,
    getObjectPresignedUrl,
    checkObjectExist,
    getFileMd5,
}