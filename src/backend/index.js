var express = require('express');
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
var v1_router_app = require("./routers/api/v1/app");
var v1_router_org = require('./routers/api/v1/org');

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
    secret: 'sunrunio38288446',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false
    }
}));

app.use(bodyParser.json({
    limit: '10mb'
}));
app.use(bodyParser.urlencoded({
    extended: false,
    limit: '10mb'
}));

//允许跨域访问
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:8080");
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

    // if (req.method !== 'GET' && !req.Authenticationed) {
    //     res.status(403);
    //     res.end();
    //     return;
    // }

    next();
});

app.use("/api/v1/", v1_router_app);
app.use("/api/v1/", v1_router_org);

//生成特定格式的响应
app.use(function (req, res, next) {
    if (res.code != 200)
        logger.error(`url:${req.url},error:${res.msg}`)

    var resData = {
        code: res.code,
        msg: res.msg,
        data: res.data
    }

    res.status(res.code).json(resData);
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

var server = app.listen(3000, async function () {
    var host = common.getServerIp();
    var port = server.address().port;
    env.serverEndConfig.endpoint = `http://${host}:${port}`;
    env.serverEndConfig.downloadResUrl = `http://${host}:${port}/download/`;
    await iam.syncIamUsers();
});