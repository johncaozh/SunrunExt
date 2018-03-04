var request = require('request');
var rq = require('request-promise');
var express = require("express");
var orgModel = require('../db/org')
var userModel = require('../db/user')
var env = require('./env')
var url = require('url');
var logger = require('../utilities/log').logger;
var router = express.Router();
var accessToken = null;

//刷新AccessToken
async function refreshAccessToken() {
    var getAcessTokenUrl = `${env.iamConfig.service}/oauth2/token?grant_type=client_credentials&access_key=${env.iamConfig.access_key}&access_secret=${env.iamConfig.access_secret}&scope=SunrunIAM-api:*:*:*`

    try {
        var getAccessTokenRes = await rq({
            url: getAcessTokenUrl,
            rejectUnauthorized: false
        });

        var getAcessTokenJO = JSON.parse(getAccessTokenRes);
        accessToken = getAcessTokenJO.access_token;
    }
    catch (err) {
        logger.error("刷新iam Token失败", err);
    }
}

//获取产品列表
async function getProductList() {
    try {
        await refreshAccessToken();
        var hostIp = url.parse(env.iamConfig.service).host;
        var getProductListUrl = `${env.iamConfig.service}/product/list?access_token=${accessToken}&server_host=${hostIp}`;

        var getProductListRes = await rq({
            url: getProductListUrl,
            rejectUnauthorized: false
        });

        var getProductListJO = JSON.parse(getProductListRes);
        return getProductListJO.products;
    }
    catch (err) {
        logger.error("获取产品列表失败", err);
    }
}

//验证ST
async function verifyST(st) {
    try {
        await refreshAccessToken();
        var validateSTUrl = `${env.iamConfig.service}/sso/service_validate?st=${st}&service=${env.iamConfig.registerProductName}`

        var verifySTRes = await rq({
            url: validateSTUrl,
            rejectUnauthorized: false
        });

        var verifySTJO = JSON.parse(verifySTRes);
        return {
            id: verifySTJO.user_id,
            userId: verifySTJO.user_name
        }
    }
    catch (err) {
        logger.error("验证ST失败", err);
    }
}

//获取用户信息
async function getUserDetail(userId) {
    try {
        await refreshAccessToken();
        var getUserDetailUrl = `${env.iamConfig.service}/user/get?access_token=${accessToken}&user_id=${userId}`;

        var getUserDetailRes = await rq({
            url: getUserDetailUrl,
            rejectUnauthorized: false
        });

        var getUserDetailJO = JSON.parse(getUserDetailRes);
        return getUserDetailJO;
    }
    catch (err) {
        logger.error("获取用户信息失败", err);
    }
}


//从IAM同步组织架构
async function syncIamUsers() {
    try {
        await refreshAccessToken();
        var getDomainListUrl = `${env.iamConfig.service}/domain/list?access_token=${accessToken}`;

        var getDomainListRes = await rq({
            url: getDomainListUrl,
            rejectUnauthorized: false
        });

        var getDomainListJO = JSON.parse(getDomainListRes);
        //获取默认域（name为sunrun，如果没有，则选择第一个域作为默认域名）
        var defaultDomain = getDomainListJO.domains.find(d => d.name === "sunrun") || getDomainListJO.domains[0];
        var orgProperties = ['id', 'name', 'parent_id', 'type'].join(',');
        var userProperties = ['id', 'real_name', 'org_id', 'email', 'mobile', 'rank', 'type'].join(',');
        var getOrgListUrl = `${env.iamConfig.service}/org/list?access_token=${accessToken}&domain_id=${defaultDomain.id}&user_infos=${userProperties}&org_infos=${orgProperties}`;

        var getDomainOrgRes = await rq({
            url: getOrgListUrl,
            rejectUnauthorized: false
        });

        var getDomainOrgListJO = JSON.parse(getDomainOrgRes);
        await orgModel.remove({});
        await userModel.remove({});

        //添加根组织
        await orgModel.create({
            id: 0,
            name: defaultDomain.name,
        });

        for (let i = 0; i < getDomainOrgListJO.orgs.length; i++) {
            var item = getDomainOrgListJO.orgs[i];
            await parseDomainOrg(item);
        }

    }
    catch (err) {
        logger.error("同步组织架构失败", err);
    }
};

//解析Iam服务器返回的组织架构数据并写入数据库
async function parseDomainOrg(item) {
    if (item.type && item.type === "user") {
        await userModel.create({
            id: item.id,
            name: item.real_name || item.id,
            email: item.email,
            phone: item.mobile,
            rank: item.rank,
            parentId: item.org_id,
        });
    } else if (item.type && item.type === "org") {
        await orgModel.create({
            id: item.id,
            name: item.name,
            parentId: item.parent_id
        });

        if (item.children && item.children.length > 0) {
            for (let i = 0; i < item.children.length; i++) {
                var subItem = item.children[i];
                await parseDomainOrg(subItem);
            }
        }
    }
}

//从数据库读取组织架构并生成自己的json格式数据
async function getDomainOrg() {
    var rootOrg = await orgModel.findOne({
        id: 0
    }, {
            id: 1,
            name: 1,
            parentId: 1
        }).lean().exec();

    var domainOrgTree = await getOrgContent(rootOrg.id, rootOrg);
    return domainOrgTree;
}

//获取指定组织的组成
async function getOrgContent(orgId, orgInfo) {
    var subOrgs = await orgModel.find({
        parentId: orgId
    }, {
            id: 1,
            name: 1,
            parentId: 1
        }).lean().exec();

    for (let i = 0; i < subOrgs.length; i++) {
        var item = subOrgs[i];
        await getOrgContent(item.id, item);
    }

    var users = await userModel.find({
        parentId: orgId
    }, {
            id: 1,
            name: 1,
            email: 1,
            phone: 1,
            rank: 1,
            parentId: 1,
        }).sort({
            name: "ascending"
        });

    orgInfo.subOrgs = subOrgs;
    orgInfo.users = users;
    return orgInfo;
};

async function getOrgOrUser(id, type) {
    var data = null;
    if (type == 'org') {
        data = await orgModel.findOne({
            id
        }).lean().exec();
    } else if (type == 'user') {
        data = await userModel.findOne({
            id
        }).lean().exec();
    }

    if (data) {
        data.type = type;
    }

    return data;
}

module.exports = {
    router,
    syncIamUsers,
    getDomainOrg,
    getOrgOrUser,
    getProductList,
    verifyST,
    getUserDetail,
};