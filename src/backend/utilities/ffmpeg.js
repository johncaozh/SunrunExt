var ffmpeg = require('fluent-ffmpeg');

ffmpeg.setFfmpegPath('../ffmpeg/ffmpeg.exe');
ffmpeg.setFfprobePath('../ffmpeg/ffprobe.exe');

function lauch() {
    // ffmpeg('../ffmpeg/test.avi')
    //     .output('../ffmpeg/test.mp4')
    //     .on('end', function () {
    //         console.log('Finished processing');
    //     })
    //     .run();

    //make sure you set the correct path to your video file
    var proc = new ffmpeg({
        source: 'F:\\Workspace\\SunrunExt\\src\\backend\\ffmpeg\\test.avi',
        nolog: true
    });

    //Set the path to where FFmpeg is installed
    proc.setFfmpegPath("F:\\Workspace\\SunrunExt\\src\\backend\\ffmpeg\\ffmpeg.exe"); //I forgot to include "ffmpeg.exe"

    proc
        .output('F:\\Workspace\\SunrunExt\\src\\backend\\ffmpeg\\test.mp4')
        // .audioCodec('libfaac')
        // .videoCodec('libx264')
        .size('320x200')
        .run();
};

module.exports = {
    lauch,
}