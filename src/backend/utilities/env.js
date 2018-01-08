var path = require('path')

//服务端配置
const serverEndConfig = {
    endpoint: "", //服务端接口地址
    downloadResUrl: "", //下载资源的Url
    mongoDB: "mongodb://localhost:27017/sunrunExt", //mongoDB数据库连接字符串
    staticFileDir: path.resolve(__dirname, "../files"), //用于存放文件的文件夹绝对路径
}

const iamConfig = {
    service: "https://192.168.0.180:9531/sunruniam",
    access_key: "Xctpww9mCiQV1W74vkK4Rj7vSZDe0j21",
    access_secret: "1grsPpqMA65iSQH3hDC8y8MEIWUtkJ",
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