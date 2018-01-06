var log4js = require("log4js");

log4js.configure({
    appenders: {
        sunrunExt: {
            type: 'dateFile',
            filename: 'logs/sunrunExt_',
            pattern: 'yyyy-MM-dd.log',
            alwaysIncludePattern: true
        },
        console: {
            type: 'console'
        }
    },
    categories: {
        sunrunExt: {
            appenders: ['console', 'sunrunExt'],
            level: 'info'
        },
        default: {
            appenders: ['console', 'sunrunExt'],
            level: 'trace'
        }
    }
});

var logger = log4js.getLogger('sunrunExt');
exports.logger = logger;

exports.use = function (app) {
    app.use(log4js.connectLogger(logger, {
        level: log4js.levels.Debug
    }));
}