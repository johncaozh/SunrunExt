! function (g, initFunc) {
    "function" == typeof define && (define.amd || define.cmd) ? define(function () {
        return initFunc(g)
    }) : initFunc(g, true)
}(this, function (glob, b) {
    function invokeCmd(cmd, param, callbackObj) {
        glob.WeixinJSBridge ? WeixinJSBridge.invoke(cmd, normParameter(param), function (res) {
            completeBridgeInteraction(cmd, res, callbackObj)
        }) : debugBridgeInteraction(cmd, callbackObj)
    }

    function bindEvent(targetItem, callbackObj, debugCallback) {
        glob.WeixinJSBridge ? WeixinJSBridge.on(targetItem, function (res) {
            if (debugCallback && debugCallback.trigger)
                debugCallback.trigger(res);

            completeBridgeInteraction(targetItem, res, callbackObj);
        }) : debugCallback ? debugBridgeInteraction(targetItem, debugCallback) : debugBridgeInteraction(targetItem, callbackObj)
    }

    function normParameter(param) {
        param = param || {};
        param.appId = cfg.appId;
        param.verifyAppId = cfg.appId;
        param.verifySignType = 'sha1';
        param.verifyTimestamp = cfg.timestamp + '';
        param.verifyNonceStr = cfg.nonceStr;
        param.verifySignature = cfg.signature;

        return param;
    }

    function buildPayParameter(obj) {
        return {
            timeStamp: obj.timestamp + "",
            nonceStr: obj.nonceStr,
            "package": obj["package"],
            paySign: obj.paySign,
            signType: obj.signType || "SHA1"
        }
    }

    function getAddress(a) {
        a.postalCode = a.addressPostalCode;
        a.detailInfo = a.addressDetailInfo;
        a.provinceName = a.proviceFirstStageName;
        a.cityName = a.addressCitySecondStageName;
        a.countryName = a.addressCountiesThirdStageName;
        delete a.addressPostalCode;
        delete a.proviceFirstStageName;
        delete a.addressCitySecondStageName;
        delete a.addressCountiesThirdStageName;
        delete a.addressDetailInfo;

        return a;
    }

    function completeBridgeInteraction(cmd, res, callbackObj) {
        var errMsg, resMsgp;
        if (cmd == "openEnterpriseChat")
            res.errCode = res.err_code;

        delete res.err_code;
        delete res.err_desc;
        delete res.err_detail;
        errMsg = res.errMsg;

        if (!errMsg) {
            errMsg = res.err_msg;
            delete res.err_msg;
            errMsg = parseResultMsg(cmd, errMsg);
            res.errMsg = errMsg;
        }

        callbackObj = callbackObj || {};

        if (callbackObj._complete) {
            callbackObj._complete(res);
            delete callbackObj._complete;
        }

        //debug, show command result
        if (cfg.debug && !callbackObj.isInnerInvoke)
            alert(JSON.stringify(res));

        errMsg = res.errMsg || '';
        resMsg = errMsg.substring(errMsg.indexOf(':') + 1);

        switch (resMsg) {
            case "ok":
                callbackObj.success && callbackObj.success(res);
                break;
            case "cancel":
                callbackObj.cancel && callbackObj.cancel(res);
                break;
            default:
                callbackObj.fail && callbackObj.fail(res)
        }
        callbackObj.complete && callbackObj.complete(res)
    }

    function parseResultMsg(cmd, errMsg) {
        var idx, cmdStr, msgStr;

        if (errMsg) {
            idx = errMsg.indexOf(':');

            switch (cmd) {
                case apiNameMapInv.config:
                    cmdStr = 'config';
                    break;
                case apiNameMapInv.openProductSpecificView:
                    cmdStr = 'openProductSpecificView';
                    break;
                default:
                    cmdStr = errMsg.substring(0, idx).replace(/_/g, ' ').replace(/\b\w+\b/g, function (str) {
                        return str.substring(0, 1).toUpperCase() + str.substring(1)
                    });

                    cmdStr = cmdStr.substring(0, 1).toLowerCase() + cmdStr.substring(1);
                    cmdStr = cmdStr.replace(/ /g, '');
                    if (cmdStr.indexOf('Wcpay') != -1)
                        cmdStr = cmdStr.replace('Wcpay', 'WCPay');

                    if (apiNameMapInv[cmdStr])
                        cmdStr = apiNameMapInv[cmdStr];
            }//end switch

            msgStr = errMsg.substring(idx + 1);
            if (msgStr == 'confirm')
                msgStr = 'ok';
            if (msgStr == 'failed')
                msgStr = 'fail';
            if (msgStr.indexOf('failed_') != -1)
                msgStr = msgStr.substring(7);
            if (msgStr.indexOf('fail_') != -1)
                msgStr = msgStr.substring(5);

            msgStr = msgStr.replace(/_/g, ' ').toLowerCase();
            if (msgStr == 'access denied' || msgStr == 'no permission to execute')
                msgStr = 'permission denied';
            if (cmdStr == 'config' && msgStr == 'function not exist')
                msgStr = 'ok';

            errMsg = cmdStr + ':' + msgStr;
        }

        return errMsg;
    }

    function mapApiBridgeId(names) {
        if (names) {
            for (var idx = 0, len = names.length; idx < len; idx++) {
                var n = names[idx];
                if (apiNameMapInv[n])
                    names[idx] = apiNameMapInv[n];
            }

            return names;
        }
    }

    function debugBridgeInteraction(cmd, callbackObj) {
        if (cfg.debug && !callbackObj.isInnerInvoke) {
            if (apiNameMapInv[cmd])
                cmd = apiNameMapInv[cmd];
            if (callbackObj && callbackObj._complete)
                delete callbackObj._complete;

            console.log('"' + cmd + '",', callbackObj || '');
        }
    }

    function reportSDK() {
        if (!('6.0.2' > wxVer || sdkInfo.systemType < 0)) {
            var img = new Image;

            sdkInfo.appId = cfg.appId,
                sdkInfo.initTime = timeInfo.initEndTime - timeInfo.initStartTime,
                sdkInfo.preVerifyTime = timeInfo.preVerifyEndTime - timeInfo.preVerifyStartTime,
                wxAPI.getNetworkType({
                    isInnerInvoke: true,
                    success: function (typeInfo) {
                        sdkInfo.networkType = typeInfo.networkType;
                        var url = 'https://open.weixin.qq.com/sdk/report?v=' + sdkInfo.version + '&o=' + sdkInfo.isPreVerifyOk + '&s=' + sdkInfo.systemType + '&c=' + sdkInfo.clientVersion + '&a=' + sdkInfo.appId + '&n=' + sdkInfo.networkType + '&i=' + sdkInfo.initTime + '&p=' + sdkInfo.preVerifyTime + '&u=' + sdkInfo.url;
                        img.src = url;
                    }
                })
        }
    }

    function getCurrentTimestamp() {
        return (new Date).getTime();
    }

    function regWXReadyFunc(readyFunc) {
        if (isWXBrowser)
            glob.WeixinJSBridge ? readyFunc() : doc.addEventListener && doc.addEventListener('WeixinJSBridgeReady', readyFunc, false);
    }

    function extendBridgeInteraction() {
        if (!wxAPI.invoke) {
            wxAPI.invoke = function (cmd, param, callbackFunc) {
                if (glob.WeixinJSBridge)
                    WeixinJSBridge.invoke(cmd, normParameter(param), callbackFunc);
            };
            wxAPI.on = function (targetItem, callbackFunc) {
                if (glob.WeixinJSBridge)
                    WeixinJSBridge.on(targetItem, callbackFunc);
            };
        }
    }

    if (!glob.jWeixin) {
        var apiNameMap = {
            config: "preVerifyJSAPI",
            onMenuShareTimeline: "menu:share:timeline",
            onMenuShareAppMessage: "menu:share:appmessage",
            onMenuShareQQ: "menu:share:qq",
            onMenuShareWeibo: "menu:share:weiboApp",
            onMenuShareQZone: "menu:share:QZone",
            previewImage: "imagePreview",
            getLocation: "geoLocation",
            openProductSpecificView: "openProductViewWithPid",
            addCard: "batchAddCard",
            openCard: "batchViewCard",
            chooseWXPay: "getBrandWCPayRequest",
            openEnterpriseRedPacket: "getRecevieBizHongBaoRequest",
            startSearchBeacons: "startMonitoringBeacons",
            stopSearchBeacons: "stopMonitoringBeacons",
            onSearchBeacons: "onBeaconsInRange",
            consumeAndShareCard: "consumedShareCard",
            openAddress: "editAddress"
        };
        var apiNameMapInv = function () {
            var map = {};
            for (var attr in apiNameMap)
                map[apiNameMap[attr]] = attr;

            return map;
        }();
        var doc = glob.document;
        var title = doc.title;
        var nav = navigator.userAgent.toLowerCase();
        var plat = navigator.platform.toLowerCase();
        var isDesktop = !(!plat.match("mac") && !plat.match("win"));
        var isWXDebugger = -1 != nav.indexOf("wxdebugger");
        var isWXBrowser = -1 != nav.indexOf("micromessenger");
        var isAndroid = -1 != nav.indexOf("android");
        var isIOS = -1 != nav.indexOf("iphone") || -1 != nav.indexOf("ipad");

        var wxVer = function () {
            var v = nav.match(/micromessenger\/(\d+\.\d+\.\d+)/) || nav.match(/micromessenger\/(\d+\.\d+)/);
            return v ? v[1] : ""
        }();

        var timeInfo = {
            initStartTime: getCurrentTimestamp(),
            initEndTime: 0,
            preVerifyStartTime: 0,
            preVerifyEndTime: 0
        };

        var sdkInfo = {
            version: 1,
            appId: "",
            initTime: 0,
            preVerifyTime: 0,
            networkType: "",
            isPreVerifyOk: 1,
            systemType: isIOS ? 1 : isAndroid ? 2 : -1,
            clientVersion: wxVer,
            url: encodeURIComponent(location.href)
        };

        var cfg = {};
        var cmdExecCB = {
            _completes: []
        };

        var stateInfo = {
            state: 0,
            data: {}
        };

        regWXReadyFunc(function () {
            timeInfo.initEndTime = getCurrentTimestamp()
        });

        var G = !1,
            H = [],
            I = {
                config: function (paramObj) {
                    cfg = paramObj;
                    debugBridgeInteraction("config", paramObj);
                    var preVerifyAPI = (cfg.check === false) ? false : true;
                    regWXReadyFunc(function () {
                        if (preVerifyAPI) {
                            invokeCmd(apiNameMap.config, {
                                verifyJsApiList: mapApiBridgeId(cfg.jsApiList)
                            }, function () {
                                var cmdExecCB = {};
                                cmdExecCB._complete = function (res) {
                                    timeInfo.preVerifyEndTime = getCurrentTimestamp();
                                    stateInfo.state = 1;
                                    stateInfo.res = res;
                                };
                                cmdExecCB.success = function (res) {
                                    sdkInfo.isPreVerifyOk = 0;
                                };
                                cmdExecCB.fail = function (res) {
                                    cmdExecCB._fail ? cmdExecCB._fail(res) : cmdExecCB.state = -1
                                };
                                var cbArray = cmdExecCB._completes; //a
                                cbArray.push(function () {
                                    if (!cfg.debug)
                                        reportSDK();
                                });
                                cmdExecCB.complete = function () {
                                    for (var i = 0, len = cbArray.length; i < len; ++i)
                                        cbArray[i]();

                                    cmdExecCB._completes = [];  //clear registered complete callbacks
                                };

                                return cmdExecCB;
                            }());

                            timeInfo.preVerifyStartTime = getCurrentTimestamp();
                        }
                        else {
                            stateInfo.state = 1;
                            var cbArray = cmdExecCB._completes;
                            for (var i = 0, len = cbArray.length; i < len; ++i)
                                cbArray[i]();

                            cmdExecCB._completes = [];
                        }
                    });

                    if (cfg.beta)
                        extendBridgeInteraction();
                },
                ready: function (completeFunc) {
                    if (stateInfo.state != 0) {
                        //api-call already finished
                        completeFunc();
                    }
                    else {
                        cmdExecCB._completes.push(completeFunc);
                        if (!isWXBrowser && cfg.debug)
                            completeFunc();
                    }
                },  //end 'ready' API
                error: function (errorFunc) {
                    if (wxVer >= '6.0.2') {
                        if (stateInfo.state == -1)
                            errorFunc(stateInfo.res);
                        else
                            cmdExecCB._fail = errorFunc;
                    }
                },  //end 'error' API
                checkJsApi: function (a) {
                    var b = function (a) {
                        var b = a.checkResult;
                        for (var c in b) {
                            var d = apiNameMapInv[c];
                            d && (b[d] = b[c], delete b[c])
                        }
                        return a
                    };
                    invokeCmd("checkJsApi", {
                        jsApiList: mapApiBridgeId(a.jsApiList)
                    }, function () {
                        return a._complete = function (a) {
                            if (isAndroid) {
                                var c = a.checkResult;
                                c && (a.checkResult = JSON.parse(c))
                            }
                            a = b(a)
                        }, a
                    }())
                },
                onMenuShareTimeline: function (a) {
                    bindEvent(apiNameMap.onMenuShareTimeline, {
                        complete: function () {
                            invokeCmd("shareTimeline", {
                                title: a.title || title,
                                desc: a.title || title,
                                img_url: a.imgUrl || "",
                                link: a.link || location.href,
                                type: a.type || "link",
                                data_url: a.dataUrl || ""
                            }, a)
                        }
                    }, a)
                },
                onMenuShareAppMessage: function (a) {
                    bindEvent(apiNameMap.onMenuShareAppMessage, {
                        complete: function () {
                            invokeCmd("sendAppMessage", {
                                title: a.title || title,
                                desc: a.desc || "",
                                link: a.link || location.href,
                                img_url: a.imgUrl || "",
                                type: a.type || "link",
                                data_url: a.dataUrl || ""
                            }, a)
                        }
                    }, a)
                },
                onMenuShareQQ: function (a) {
                    bindEvent(apiNameMap.onMenuShareQQ, {
                        complete: function () {
                            invokeCmd("shareQQ", {
                                title: a.title || title,
                                desc: a.desc || "",
                                img_url: a.imgUrl || "",
                                link: a.link || location.href
                            }, a)
                        }
                    }, a)
                },
                onMenuShareWeibo: function (a) {
                    bindEvent(apiNameMap.onMenuShareWeibo, {
                        complete: function () {
                            invokeCmd("shareWeiboApp", {
                                title: a.title || title,
                                desc: a.desc || "",
                                img_url: a.imgUrl || "",
                                link: a.link || location.href
                            }, a)
                        }
                    }, a)
                },
                onMenuShareQZone: function (a) {
                    bindEvent(apiNameMap.onMenuShareQZone, {
                        complete: function () {
                            invokeCmd("shareQZone", {
                                title: a.title || title,
                                desc: a.desc || "",
                                img_url: a.imgUrl || "",
                                link: a.link || location.href
                            }, a)
                        }
                    }, a)
                },
                startRecord: function (callbackObj) {
                    invokeCmd("startRecord", {}, callbackObj)
                },
                stopRecord: function (callbackObj) {
                    invokeCmd("stopRecord", {}, callbackObj)
                },
                onVoiceRecordEnd: function (callbackObj) {
                    bindEvent("onVoiceRecordEnd", callbackObj)
                },
                playVoice: function (callbackObj) {
                    invokeCmd("playVoice", {
                        localId: callbackObj.localId
                    }, callbackObj)
                },
                pauseVoice: function (callbackObj) {
                    invokeCmd("pauseVoice", {
                        localId: callbackObj.localId
                    }, callbackObj)
                },
                stopVoice: function (callbackObj) {
                    invokeCmd("stopVoice", {
                        localId: callbackObj.localId
                    }, callbackObj)
                },
                onVoicePlayEnd: function (callbackObj) {
                    bindEvent("onVoicePlayEnd", callbackObj)
                },
                uploadVoice: function (callbackObj) {
                    invokeCmd("uploadVoice", {
                        localId: callbackObj.localId,
                        isShowProgressTips: 0 == callbackObj.isShowProgressTips ? 0 : 1
                    }, callbackObj)
                },
                downloadVoice: function (callbackObj) {
                    invokeCmd("downloadVoice", {
                        serverId: callbackObj.serverId,
                        isShowProgressTips: 0 == callbackObj.isShowProgressTips ? 0 : 1
                    }, callbackObj)
                },
                translateVoice: function (callbackObj) {
                    invokeCmd("translateVoice", {
                        localId: callbackObj.localId,
                        isShowProgressTips: 0 == callbackObj.isShowProgressTips ? 0 : 1
                    }, callbackObj)
                },
                chooseImage: function (callbackObj) {
                    invokeCmd("chooseImage", {
                        scene: "1|2",
                        count: callbackObj.count || 9,
                        sizeType: callbackObj.sizeType || ["original", "compressed"],
                        sourceType: callbackObj.sourceType || ["album", "camera"]
                    }, function () {
                        callbackObj._complete = function (res) {
                            if (isAndroid) {
                                if (res.localIds)
                                    res.localIds = JSON.parse(res.localIds);
                            }
                        };

                        return callbackObj;
                    }())
                },
                getLocation: function (callbackObj) { },
                previewImage: function (callbackObj) {
                    invokeCmd(apiNameMap.previewImage, {
                        current: callbackObj.current,
                        urls: callbackObj.urls
                    }, callbackObj)
                },
                uploadImage: function (callbackObj) {
                    invokeCmd("uploadImage", {
                        localId: callbackObj.localId,
                        isShowProgressTips: 0 == callbackObj.isShowProgressTips ? 0 : 1
                    }, callbackObj)
                },
                downloadImage: function (callbackObj) {
                    invokeCmd("downloadImage", {
                        serverId: callbackObj.serverId,
                        isShowProgressTips: 0 == callbackObj.isShowProgressTips ? 0 : 1
                    }, callbackObj)
                },
                getLocalImgData: function (callbackObj) {
                    G === !1 ? (G = !0, invokeCmd("getLocalImgData", {
                        localId: callbackObj.localId
                    }, function () {
                        callbackObj._complete = function (a) {
                            if (G = !1, H.length > 0) {
                                var b = H.shift();
                                wx.getLocalImgData(b)
                            }
                        };
                        return callbackObj
                    }())) : H.push(callbackObj)
                },
                getNetworkType: function (callbackObj) {
                    var parseNetworkResult = function (res) {
                        var msg = res.errMsg, stype = res.subtype;
                        delete res.subtype;
                        res.errMsg = 'getNetworkType:ok';

                        if (stype) {
                            res.networkType = stype;
                        }
                        else {
                            stype = msg.substring(msg.indexOf(':') + 1);
                            switch (stype) {
                                case 'wifi':
                                case 'edge':
                                case 'wwan':
                                    res.networkType = stype;
                                    break;
                                default:
                                    res.errMsg = 'getNetworkType:fail';
                            }
                        }

                        return res;
                    };

                    invokeCmd('getNetworkType', {}, function () {
                        callbackObj._complete = function (res) {
                            res = parseNetworkResult(res);
                        };
                        return callbackObj;
                    }());
                },  //end 'getNetworkType' API
                openLocation: function (callbackObj) {
                    invokeCmd("openLocation", {
                        latitude: callbackObj.latitude,
                        longitude: callbackObj.longitude,
                        name: callbackObj.name || "",
                        address: callbackObj.address || "",
                        scale: callbackObj.scale || 28,
                        infoUrl: callbackObj.infoUrl || ""
                    }, callbackObj)
                },
                getLocation: function (callbackObj) {
                    callbackObj = callbackObj || {}, invokeCmd(apiNameMap.getLocation, {
                        type: callbackObj.type || "wgs84"
                    }, function () {
                        return callbackObj._complete = function (res) {
                            delete res.type
                        }, callbackObj
                    }())
                },
                hideOptionMenu: function (callbackObj) {
                    invokeCmd("hideOptionMenu", {}, callbackObj)
                },
                showOptionMenu: function (callbackObj) {
                    invokeCmd("showOptionMenu", {}, callbackObj)
                },
                closeWindow: function (callbackObj) {
                    callbackObj = callbackObj || {}, invokeCmd("closeWindow", {}, callbackObj)
                },
                hideMenuItems: function (callbackObj) {
                    invokeCmd("hideMenuItems", {
                        menuList: callbackObj.menuList
                    }, callbackObj)
                },
                showMenuItems: function (callbackObj) {
                    invokeCmd("showMenuItems", {
                        menuList: callbackObj.menuList
                    }, callbackObj)
                },
                hideAllNonBaseMenuItem: function (callbackObj) {
                    invokeCmd("hideAllNonBaseMenuItem", {}, callbackObj)
                },
                showAllNonBaseMenuItem: function (callbackObj) {
                    invokeCmd("showAllNonBaseMenuItem", {}, callbackObj)
                },
                scanQRCode: function (callbackObj) {
                    callbackObj = callbackObj || {};
                    invokeCmd("scanQRCode", {
                        needResult: callbackObj.needResult || 0,
                        scanType: callbackObj.scanType || ["qrCode", "barCode"]
                    }, function () {
                        callbackObj._complete = function (res) {
                            if (isIOS) {
                                var resObj = res.resultStr;
                                if (resObj) {
                                    var c = JSON.parse(resObj);
                                    res.resultStr = c && c.scan_code && c.scan_code.scan_result
                                }
                            }
                        };
                        return callbackObj
                    }())
                },
                openAddress: function (callbackObj) {
                    invokeCmd(apiNameMap.openAddress, {}, function () {
                        callbackObj._complete = function (a) {
                            a = getAddress(a)
                        };
                        return callbackObj
                    }())
                },
                openProductSpecificView: function (callbackObj) {
                    invokeCmd(apiNameMap.openProductSpecificView, {
                        pid: callbackObj.productId,
                        view_type: callbackObj.viewType || 0,
                        ext_info: callbackObj.extInfo
                    }, callbackObj)
                },
                addCard: function (callbackObj) {
                    //prepare card information
                    var cards = callbackObj.cardList;
                    var cardInfos = [];
                    for (var i = 0, len = cards.length; i < len; ++i) {
                        cardInfos.push({
                            card_id: cards[i].cardId,
                            card_ext: cards[i].cardExt
                        });
                    }
             
                    invokeCmd(apiNameMap.addCard, {
                        card_list: cardInfos
                    }, function () {
                        callbackObj._complete = function(res) {
                            var cards = res.card_list;
                            if (cards) {
                                cards = JSON.parse(cards);
                                for (var i = 0, len = cards.length; i < len; ++i) {
                                    var card = cards[i];
                                    card.cardId = card.card_id;
                                    card.cardExt = card.card_ext;
                                    card.isSuccess = card.is_succ ? true : false;
                                   
                                    delete card.card_id;
                                    delete card.card_ext;
                                    delete card.is_succ;
                                }
                               
                                res.cardList = cards;
                                delete res.card_list;
                            }
                        };
                       
                        return callbackObj;
                    }());
                },  //end 'addCard' API
                chooseCard: function (callbackObj) {
                    invokeCmd('chooseCard', {
                        app_id: cfg.appId,
                        location_id: callbackObj.shopId || '',
                        sign_type: callbackObj.signType || 'SHA1',
                        card_id: callbackObj.cardId || '',
                        card_type: callbackObj.cardType || '',
                        card_sign: callbackObj.cardSign,
                        time_stamp: callbackObj.timestamp + '',
                        nonce_str: callbackObj.nonceStr
                    }, function () {
                        callbackObj._complete = function (res) {
                            res.cardList = res.choose_card_info;
                            delete res.choose_card_info;
                        };
                        return callbackObj;
                    }());
                },  //end 'chooseCard' API
                openCard: function (callbackObj) {
                    var cards = callbackObj.cardList;
                    var cardInfos = [];
                    for (var i = 0, len = cards.length; i < len; ++i) {
                        cardInfos.push({
                            card_id: cards[i].cardId,
                            code: cards[i].code
                        });
                    }
             
                    invokeCmd(apiNameMap.openCard, {
                        card_list: cardInfos
                    }, callbackObj);
                },  //end 'openCard' API
                consumeAndShareCard: function (callbackObj) {
                    invokeCmd(apiNameMap.consumeAndShareCard, {
                        consumedCardId: callbackObj.cardId,
                        consumedCode: callbackObj.code
                    }, callbackObj)
                },
                chooseWXPay: function (callbackObj) {
                    invokeCmd(apiNameMap.chooseWXPay, buildPayParameter(callbackObj), callbackObj)
                },
                openEnterpriseRedPacket: function (callbackObj) {
                    invokeCmd(apiNameMap.openEnterpriseRedPacket, buildPayParameter(callbackObj), callbackObj)
                },
                startSearchBeacons: function (callbackObj) {
                    invokeCmd(apiNameMap.startSearchBeacons, {
                        ticket: callbackObj.ticket
                    }, callbackObj)
                },
                stopSearchBeacons: function (Beacon) {
                    invokeCmd(apiNameMap.stopSearchBeacons, {}, Beacon)
                },
                onSearchBeacons: function (Beacon) {
                    bindEvent(apiNameMap.onSearchBeacons, Beacon)
                },
                openEnterpriseChat: function (Beacon) {
                    invokeCmd("openEnterpriseChat", {
                        useridlist: Beacon.userIds,
                        chatname: Beacon.groupName
                    }, Beacon)
                }
            },
            J = 1,
            K = {};
        return doc.addEventListener("error", function (a) {
            if (!isAndroid) {
                var b = a.target,
                    c = b.tagName,
                    d = b.src;
                if ("IMG" == c || "VIDEO" == c || "AUDIO" == c || "SOURCE" == c) {
                    var e = -1 != d.indexOf("wxlocalresource://");
                    if (e) {
                        a.preventDefault(), a.stopPropagation();
                        var f = b["wx-id"];
                        if (f || (f = J++ , b["wx-id"] = f), K[f]) return;
                        K[f] = !0, wx.ready(function () {
                            wx.getLocalImgData({
                                localId: d,
                                success: function (a) {
                                    b.src = a.localData
                                }
                            })
                        })
                    }
                }
            }
        }, !0), doc.addEventListener("load", function (a) {
            if (!isAndroid) {
                var b = a.target,
                    c = b.tagName;
                b.src;
                if ("IMG" == c || "VIDEO" == c || "AUDIO" == c || "SOURCE" == c) {
                    var d = b["wx-id"];
                    d && (K[d] = !1)
                }
            }
        }, !0), b && (glob.wx = glob.jWeixin = I), I
    }
});