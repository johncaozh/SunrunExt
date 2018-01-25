var schedule = require('node-schedule');
var appSentMessageHistoryModel = require('../db/appSentMessageHistory');
const allScheduleJobs = [];

async function loadAllTimingSentMessageJobs() {
    var timingRecord = await appSentMessageHistoryModel.find({
        'status': 'timing'
    });

    timingRecord.forEach(record => {
        addJob(record);
    });
};

async function sendMessageJob(messageRecord) {
    if (messageRecord) {
        //执行发送操作
    }
}

function addJob(record) {
    var target = getJobById(record._id);
    if (target)
        return;

    var newJob = schedule.scheduleJob(record.schedulerDate, function () {
        sendMessageJob(record);
    });

    newJob.id = id;
    allScheduleJobs.push(newJob);
}

function rescheduleJob(id, date) {
    var target = getJobById(id);
    if (target)
        return;

    target.reschedule(date);
}

function cancelJob(id) {
    var target = getJobById(id);
    if (target) {
        target.cancel();
        var index = allScheduleJobs.indexOf(target);
        allScheduleJobs.splice(index, 1);
    }
}

function getJobById(id) {
    return allScheduleJobs.find(job => {
        return job.id && job.id === id
    });
};

module.exports = {
    loadAllTimingSentMessageJobs,
    sendMessageJob,
    addJob,
    rescheduleJob,
    cancelJob,
    getJobById,
}