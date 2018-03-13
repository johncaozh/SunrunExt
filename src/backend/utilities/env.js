var path = require('path')

//服务端配置
const serverEndConfig = {
    endpoint: "", //服务端接口地址
    downloadResUrl: "", //下载资源的Url
    mongoDB: "mongodb://localhost:27017/sunrunExt", //mongoDB数据库连接字符串
    staticFileDir: path.resolve(__dirname, "../files"), //用于存放文件的文件夹绝对路径
    superAdmin: "admin", //超级管理员账号
    sunperAdminPWD: 'sunrun38288446', //超级管理员密码,
    zookeeper: '10.21.1.150:2181,10.21.1.150:2182,10.21.1.150:2183', //zookeeper集群地址
}

const iamConfig = {
    service: "https://10.50.0.5:9531/iam",
    access_key: "Ewx3EBwZWhGxip8tVFZO2RCLsUTCKz1",
    access_secret: "9P7AkNiuR586Jt5CFDyHPSQjqexZwX",
    registerProductName: "SunrunExt",
}

const s3Config = {
    accessKeyId: 'GKI4XZE9MOUO1FFFL2YQ',
    secretAccessKey: 'p57mZbR8NZQ9nKBsUbviMrmBEpzTlPNxMWJgNg10',
    endpoint: "218.107.10.86:28080",
    sslEnabled: false,
    s3ForcePathStyle: true,
    // bucketName: "dfs_develop",
    bucketName: "czqtesting",
    path: "/thirdparty",
}

module.exports = {
    serverEndConfig,
    iamConfig,
    s3Config
}