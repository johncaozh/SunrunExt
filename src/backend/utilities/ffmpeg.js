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

    // //make sure you set the correct path to your video file
    // var proc = new ffmpeg({
    //     source: 'C:\\Workspace\\SunrunExt\\src\\backend\\ffmpeg\\test.avi',
    //     nolog: true
    // });

    //Set the path to where FFmpeg is installed
    //proc.setFfmpegPath("C:\\Workspace\\SunrunExt\\src\\backend\\ffmpeg\\ffmpeg.exe"); //I forgot to include "ffmpeg.exe"

    // proc
    //     .output('C:\\Workspace\\SunrunExt\\src\\backend\\ffmpeg\\test.mp4')
    //     .audioCodec('libmp3lame')
    //     .videoCodec('libx264')
    //     .size('320x200')
    //     .run();

    // Create a command to convert source.avi to MP4
    var command = ffmpeg('C:\\Workspace\\SunrunExt\\src\\backend\\ffmpeg\\test.wav')
        // .audioCodec('libfaac')
        // .videoCodec('libx264')
       
        .format('amr');

    command.setFfmpegPath("C:\\Workspace\\SunrunExt\\src\\backend\\ffmpeg\\ffmpeg.exe"); //I forgot to include "ffmpeg.exe"

    command.clone()
    .audioBitrate('6.7k')
    .audioChannels(1)
    .audioFrequency(8000)
    .save('C:\\Workspace\\SunrunExt\\src\\backend\\ffmpeg\\test.amr');

    // Create a clone to save a small resized version
    // command.clone()
    //     .size('320x200')
    //     .save('C:\\Workspace\\SunrunExt\\src\\backend\\ffmpeg\\test1.mp4');

    // // Create a clone to save a medium resized version
    // command.clone()
    //     .size('640x400')
    //     .save('C:\\Workspace\\SunrunExt\\src\\backend\\ffmpeg\\test2.mp4');

    // // Save a converted version with the original size
    // command.save('C:\\Workspace\\SunrunExt\\src\\backend\\ffmpeg\\test3.mp4');
};

module.exports = {
    lauch,
}