var path = require("path");
var ffmpeg = require('fluent-ffmpeg');
var uuid = require('node-uuid');
ffmpeg.setFfmpegPath(path.resolve("ffmpeg/ffmpeg.exe"));
ffmpeg.setFfprobePath(path.resolve("ffmpeg/ffprobe.exe"));

async function getAudioDuration(audioPath) {
    return new Promise(function (resolve, reject) {
        ffmpeg(path.resolve(audioPath))
            .ffprobe(0, function (err, data) {
                if (err)
                    reject(err);
                else {
                    var duration = data.format.duration.toFixed(0);
                    resolve(duration);
                }
            });
    });
}

async function convertAudioToAmr(audioPath) {
    return new Promise(function (resolve, reject) {
        try {
            var destinationFileName = uuid.v4();
            var destinationFilePath = path.resolve('files', destinationFileName);
            var command = ffmpeg(path.resolve(audioPath))
                .format('amr')
                .audioBitrate('6.7k')
                .audioChannels(1)
                .audioFrequency(8000)
                .save(destinationFilePath);
            resolve(destinationFilePath);
        } catch (err) {
            reject(err);
        }
    });
}

async function convertVideoToMp4(videoPath) {
    return new Promise(function (resolve, reject) {
        try {
            var destinationFileName = uuid.v4();
            var destinationFilePath = path.resolve('files', destinationFileName);
            var command = ffmpeg(path.resolve(videoPath))
                .format('flv')
                .videoBitrate('8k')
                .save(destinationFilePath);

            resolve(destinationFilePath);
        } catch (err) {
            reject(err);
        }
    });
}

async function resizeVideo(videoPath, width = 640) {
    return new Promise(function (resolve, reject) {
        try {
            var destinationFileName = uuid.v4();
            var destinationFilePath = path.resolve('files', destinationFileName);
            var command = ffmpeg(path.resolve(videoPath))
                .size(`${width}?`)
                .save(destinationFilePath);

            resolve(destinationFilePath);
        } catch (err) {
            reject(err);
        }
    });
}

//获取视频封面，默认为第一帧
async function getVideoSnapshot(videoPath, secondOffset = 0) {
    return new Promise(function (resolve, reject) {
        var destinationFileName = uuid.v4();
        var destinationFilePath = path.resolve('files', destinationFileName);
        var proc = ffmpeg(path.resolve(videoPath))
            .on('end', function () {
                resolve(destinationFilePath);
            })
            .on('error', function (err) {
                reject(err);
            })
            .thumbnail({
                count: 1,
                timemarks: [secondOffset],
                size: '320*160',
                filename: destinationFilePath,
            }, );
    });
}

module.exports = {
    getAudioDuration,
    convertAudioToAmr,
    convertVideoToMp4,
    getVideoSnapshot,
}