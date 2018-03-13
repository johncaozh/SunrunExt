var express = require('express');
var https = require('https');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var favicon = require('serve-favicon');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var env = require("./utilities/env");
var common = require('./utilities/common');
var api = require('./utilities/api');
var iam = require('./utilities/iam');
var log = require('./utilities/log');
var logger = require('./utilities/log').logger;
var s3 = require('./utilities/s3');
var fs = require('fs');
var path = require('path');
var appSentMessageScheduler = require('./utilities/appSentMessageScheduler');
var ffmpeg = require('./utilities/ffmpeg');
var v1_router_app = require("./routers/api/v1/app");
var v1_router_org = require('./routers/api/v1/org');
var v1_router_file = require('./routers/api/v1/file');
var v1_router_appContextMenu = require('./routers/api/v1/appContextMenu');
var v1_router_appMessageTemplate = require('./routers/api/v1/appMessageTemplate');
var v1_router_appAutoReplyRule = require('./routers/api/v1/appAutoReplyRule');
var v1_router_appSentMessageRecord = require('./routers/api/v1/appSentMessageRecord');
var v1_router_config = require('./routers/api/v1/config');
var v1_router_managerGroup = require('./routers/api/v1/managerGroup');
var v1_router_appGroup = require('./routers/api/v1/appGroup');
var v1_router_product = require('./routers/api/v1/product');
var v1_router_authentication = require('./routers/api/v1/authentication');
var v1_router_zk = require('./routers/api/v1/zk');

var promise = mongoose.connect(env.serverEndConfig.mongoDB, {
    useMongoClient: true
});

promise.then(db => {
        logger.info("连接数据库成功。");
    })
    .catch(error => {
        logger.fatal("连接数据库失败：" + error);
    });

var app = express();
log.use(app);
app.use(express.static(env.serverEndConfig.staticFileDir));
app.use(cookieParser());
app.use(session({
    secret: 'sunrunext38288446',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 60
    }
}));

app.use(bodyParser.json({
    limit: '10mb'
}));
app.use(bodyParser.urlencoded({
    extended: false,
    limit: '10mb'
}));

app.use(function (req, req, next) {
    if (req.session) {
        req.session._garbage = Date();
        req.session.touch();
    }
    next();
});

//允许跨域访问
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", req.get('origin'));
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, HEAD");
    res.header('Access-Control-Allow-Credentials', true);

    if (req.method === "OPTIONS") {
        res.send(200);
        return;
    }

    var userId = 'Anonymous User';

    if (req.session.userId) {
        req.Authenticationed = true;
        req.userId = req.session.userId;
        userId = req.session.userId;
    }

    logger.info(`url:${req.url},method:${req.method},request by ${userId}`);

    if (req.url !== '/api/v1/login' && !req.Authenticationed) {
        res.status(403);
        res.end();
        return;
    }

    next();
});

app.use("/api/v1/", v1_router_app);
app.use("/api/v1/", v1_router_org);
app.use("/api/v1/", v1_router_file);
app.use("/api/v1/", v1_router_appContextMenu);
app.use("/api/v1/", v1_router_appMessageTemplate);
app.use("/api/v1/", v1_router_appAutoReplyRule);
app.use("/api/v1/", v1_router_appSentMessageRecord);
app.use("/api/v1/", v1_router_config);
app.use("/api/v1/", v1_router_managerGroup.router);
app.use("/api/v1/", v1_router_appGroup);
app.use("/api/v1/", v1_router_product);
app.use("/api/v1/", v1_router_authentication);
app.use("/api/v1/", v1_router_zk);

//生成特定格式的响应
app.use(function (req, res, next) {
    if (res.code != 200 && res != 302)
        logger.error(`url:${req.url},error:${res.msg}`)

    if (res.code == 302) {
        resData = {
            location: res.data
        }
        res.redirect(res.data);
    } else {
        var resData = {
            code: res.code,
            msg: res.msg,
            data: res.data
        };
        res.status(res.code).json(resData);
    }
});

app.use((err, req, res, next) => {
    logger.error(`url:${req.url},method:${req.method},error:${err.message}`);
    var resData = {
        code: err.status || 500,
        msg: err.message,
        data: err.data
    }

    res.status(err.status || 500).json(resData);
});

//根据项目的路径导入生成的证书文件  
var privateKey = fs.readFileSync(path.join(__dirname, './certificate/private.pem'), 'utf8');
var certificate = fs.readFileSync(path.join(__dirname, './certificate/file.crt'), 'utf8');
var credentials = {
    key: privateKey,
    cert: certificate
};

var httpsServer = https.createServer(credentials, app);

httpsServer.listen(8443, async function () {
    var host = common.getServerIp();
    var port = httpsServer.address().port;
    env.serverEndConfig.endpoint = `http://${host}:${port}`;
    env.serverEndConfig.downloadResUrl = `http://${host}:${port}/download/`;
    await iam.syncIamUsers();
    await s3.init();
    await appSentMessageScheduler.loadAllTimingSentMessageJobs();
    await v1_router_managerGroup.createSuperGroup();
});