! function (g, initFunc) {
    'function' == typeof define && (define.amd || define.cmd) ? define(function () {
        return initFunc(g)
    }) : initFunc(g, true)
}(this,
    function (glob, setGlobal) {
        function invokeCmd(cmd, param, callbackObj) {
            if (isAndroid) {
                function RndNum(n) {
                    var rnd = "";
                    for (var i = 0; i < n; i++)
                        rnd += Math.floor(Math.random() * 10);
                    return rnd;
                }
                var invokeCallbackFunctionName = "invokeCallback_" + RndNum(20);
                glob[invokeCallbackFunctionName] = function (res) {
                    completeBridgeInteraction(cmd, res, callbackObj);
                    delete glob[invokeCallbackFunctionName];
                };

                var params = JSON.stringify(normParameter(param));

                glob.SRJSBridge ? SRJSBridge.INVOKE(cmd, params, invokeCallbackFunctionName) : debugBridgeInteraction(cmd, callbackObj)
            } else {
                glob.SRJSBridge ? SRJSBridge.INVOKE(cmd, normParameter(param), function (res) {
                    completeBridgeInteraction(cmd, res, callbackObj);
                }) : debugBridgeInteraction(cmd, callbackObj)
            }
        }

        function bindEvent(targetItem, callbackObj, debugCallback) {
            if (isAndroid) {
                var callbackName = targetItem + "Callback";
                glob[callbackName] = function (res) {
                    if (debugCallback && debugCallback.trigger)
                        debugCallback.trigger(res);

                    completeBridgeInteraction(targetItem, res, callbackObj);
                };

                glob.SRJSBridge ? SRJSBridge.ON(targetItem, callbackName) : debugCallback ? debugBridgeInteraction(targetItem, debugCallback) : debugBridgeInteraction(targetItem, callbackObj);
            } else {
                glob.SRJSBridge ? SRJSBridge.ON(targetItem, function (res) {
                    if (debugCallback && debugCallback.trigger)
                        debugCallback.trigger(res);

                    completeBridgeInteraction(targetItem, res, callbackObj);
                }) : debugCallback ? debugBridgeInteraction(targetItem, debugCallback) : debugBridgeInteraction(targetItem, callbackObj);
            }
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
                timeStamp: obj.timestamp + '',
                nonceStr: obj.nonceStr,
                'package': obj.package,
                paySign: obj.paySign,
                signType: obj.signType || 'SHA1'
            };
        }

        function completeBridgeInteraction(cmd, res, callbackObj) {
            if (typeof res == "string") {
                res = JSON.parse(res);
            }

            var errMsg, resMsg;

            delete res.err_code;
            delete res.err_desc;
            delete res.err_detail;
            errMsg = res.errMsg;
            if (!errMsg) {
                errMsg = res.err_msg;
                delete res.err_msg;
                errMsg = parseResultMsg(cmd, errMsg, callbackObj);
                res.errMsg = errMsg;
            }

            callbackObj = callbackObj || {};
            if (callbackObj._complete) {
                callbackObj._complete(res);
                delete callbackObj._complete;
            }
            //debug, show command result
            if (cfg.debug && !callbackObj.isInnerInvoke) {
                alert(JSON.stringify(res, null, 4));
            }

            errMsg = res.errMsg || '';
            resMsg = errMsg.substring(errMsg.indexOf(':') + 1);
            switch (resMsg) {
                case 'ok':
                    callbackObj.success && callbackObj.success(res);
                    break;
                case 'cancel':
                    callbackObj.cancel && callbackObj.cancel(res);
                    break;
                default:
                    callbackObj.fail && callbackObj.fail(res);
            }

            callbackObj.complete && callbackObj.complete(res);
        }

        function parseResultMsg(cmd, errMsg) {
            var idx, cmdStr, msgStr;

            if (errMsg) {
                idx = errMsg.indexOf(':');

                switch (cmd) {
                    case "preVerifyJSAPI":
                        cmdStr = 'config';
                        break;
                    default:
                        cmdStr = errMsg.substring(0, idx).replace(/_/g, ' ').replace(/\b\w+\b/g, function (str) {
                            return str.substring(0, 1).toUpperCase() + str.substring(1)
                        });

                        cmdStr = cmdStr.substring(0, 1).toLowerCase() + cmdStr.substring(1);
                        cmdStr = cmdStr.replace(/ /g, '');
                } //end switch

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

        function debugBridgeInteraction(cmd, callbackObj) {
            if (cfg.debug && !callbackObj.isInnerInvoke) {
                if (callbackObj && callbackObj._complete)
                    delete callbackObj._complete;

                console.log('"' + cmd + '",', callbackObj || '');
            }
        }

        function reportSDK() {
            if (!('6.0.2' > srVer || sdkInfo.systemType < 0)) {
                var img = new Image;

                sdkInfo.appId = cfg.appId,
                    sdkInfo.initTime = timeInfo.initEndTime - timeInfo.initStartTime,
                    sdkInfo.preVerifyTime = timeInfo.preVerifyEndTime - timeInfo.preVerifyStartTime,
                    srAPI.getNetworkType({
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


        function regSRReadyFunc(readyFunc) {
            if (isSRBrowser)
                glob.SRJSBridge ? readyFunc() : doc.addEventListener && doc.addEventListener('SRJSBridgeReady', readyFunc, false);
        }


        function extendBridgeInteraction() {
            if (!srAPI.invoke) {
                srAPI.invoke = function (cmd, param, callbackFunc) {
                    if (glob.SRJSBridge)
                        SRJSBridge.INVOKE(cmd, normParameter(param), callbackFunc);
                };
                srAPI.on = function (targetItem, callbackFunc) {
                    if (glob.SRJSBridge)
                        SRJSBridge.ON(targetItem, callbackFunc);
                };
            }
        }



        var srAPI; //API object, C
        var isSRBrowser; //is weixin browser? t
        var isAndroid; //is android browser? u
        var isIOS; //is iphone or ipad browser? v
        var doc; //document object, q
        var title; //document title, r
        var nav; //navigator string, s
        var srVer; //weixin version, w
        var timeInfo; //timestamp information, x
        var sdkInfo; //sdk information, y
        var cfg; //config information, z
        var cmdExecCB; //command execution callback, A
        var stateInfo; //state information, B

        if (!glob.jWeixin) {
            doc = glob.document;
            title = doc.title;
            nav = navigator.userAgent.toLowerCase();
            // isSRBrowser = (nav.indexOf('micromessenger') != -1);
            isSRBrowser = true;
            isAndroid = (nav.indexOf('android') != -1);
            isIOS = (nav.indexOf('iphone') != -1 || nav.indexOf('ipad') != -1);

            srVer = function () {
                var m = nav.match(/micromessenger\/(\d+\.\d+\.\d+)/) || nav.match(/micromessenger\/(\d+\.\d+)/);
                return m ? m[1] : ''
            }();

            timeInfo = {
                initStartTime: getCurrentTimestamp(),
                initEndTime: 0,
                preVerifyStartTime: 0,
                preVerifyEndTime: 0
            };

            sdkInfo = {
                version: 1,
                appId: '',
                initTime: 0,
                preVerifyTime: 0,
                networkType: '',
                isPreVerifyOk: 1, //OK-0, FAIL-1
                systemType: isIOS ? 1 : isAndroid ? 2 : -1,
                clientVersion: srVer,
                url: encodeURIComponent(location.href)
            };

            cfg = {};
            cmdExecCB = {
                _completes: []
            };
            stateInfo = {
                state: 0, //-1:fail, 1:complete
                res: {} //result data
            };


            regSRReadyFunc(function () {
                timeInfo.initEndTime = getCurrentTimestamp();
            });



            srAPI = {

                config: function (paramObj) {
                    cfg = paramObj,
                        debugBridgeInteraction('config', paramObj);
                    var preVerifyAPI = (cfg.check === false) ? false : true;

                    regSRReadyFunc(function () {
                        //verify API
                        if (preVerifyAPI) {
                            //preform 'preVerifyJSAPI' command
                            invokeCmd("preVerifyJSAPI", {
                                jsApiList: cfg.jsApiList
                            }, function () {
                                //build command execution callback object
                                cmdExecCB._complete = function (res) {
                                    timeInfo.preVerifyEndTime = getCurrentTimestamp();
                                    stateInfo.state = 1;
                                    stateInfo.res = res;
                                };
                                cmdExecCB.success = function () {
                                    sdkInfo.isPreVerifyOk = 0;
                                };
                                cmdExecCB.fail = function (res) {
                                    cmdExecCB._fail ? cmdExecCB._fail(res) : cmdExecCB.state = -1;
                                };

                                var cbArray = cmdExecCB._completes; //a
                                cbArray.push(function () {
                                    if (!cfg.debug)
                                        reportSDK();
                                });
                                cmdExecCB.complete = function () {
                                    for (var i = 0, len = cbArray.length; i < len; ++i)
                                        cbArray[i]();

                                    cmdExecCB._completes = []; //clear registered complete callbacks
                                };

                                return cmdExecCB;
                            }());

                            timeInfo.preVerifyStartTime = getCurrentTimestamp();
                        } else {
                            stateInfo.state = 1;
                            var cbArray = cmdExecCB._completes;
                            for (var i = 0, len = cbArray.length; i < len; ++i)
                                cbArray[i]();

                            cmdExecCB._completes = [];
                        }
                    }); //end 'ready' function registration

                    if (cfg.beta)
                        extendBridgeInteraction();
                }, //end 'config' API



                ready: function (completeFunc) {
                    // if (stateInfo.state != 0) {
                    if (true) {
                        //api-call already finished
                        completeFunc();
                    } else {
                        cmdExecCB._completes.push(completeFunc);
                        if (!isSRBrowser && cfg.debug)
                            completeFunc();
                    }
                }, //end 'ready' API



                error: function (errorFunc) {
                    if (srVer >= '6.0.2') {
                        if (stateInfo.state == -1)
                            errorFunc(stateInfo.res);
                        else
                            cmdExecCB._fail = errorFunc;
                    }
                }, //end 'error' API



                checkJsApi: function (checkParam) {

                    invokeCmd('checkJsApi', {
                        jsApiList: checkParam.jsApiList
                    }, function () {
                        checkParam._complete = function (res) { };

                        return checkParam;
                    }());
                }, //end 'checkJsApi' API



                onMenuShareTimeline: function (shareParam) {
                    bindEvent("onMenuShareTimeline", {
                        complete: function () {
                            invokeCmd('shareTimeline', {
                                title: shareParam.title || title,
                                desc: shareParam.title || title,
                                img_url: shareParam.imgUrl || '',
                                link: shareParam.link || location.href
                            }, shareParam);
                        }
                    }, shareParam);
                }, //end 'onMenuShareTimeline' API



                onMenuShareAppMessage: function (shareParam) {
                    bindEvent("onMenuShareAppMessage", {
                        complete: function () {
                            invokeCmd('sendAppMessage', {
                                title: shareParam.title || title,
                                desc: shareParam.desc || '',
                                link: shareParam.link || location.href,
                                img_url: shareParam.imgUrl || '',
                                type: shareParam.type || 'link',
                                data_url: shareParam.dataUrl || ''
                            }, shareParam);
                        }
                    }, shareParam);
                }, //end 'onMenuShareAppMessage' API

                onMenuAddWidgets: function (shareParam) {
                    bindEvent("onMenuAddWidgets", {
                        complete: function () {
                            invokeCmd('addWidgets', {
                                widgets: shareParam
                            }, shareParam);
                        }
                    }, shareParam);
                }, //end 'onMenuAddWidgets' API

                onMenuShareWechat: function (shareParam) {
                    bindEvent("onMenuShareWechat", {
                        complete: function () {
                            invokeCmd('shareWechat', {
                                title: shareParam.title || title,
                                desc: shareParam.desc || '',
                                img_url: shareParam.imgUrl || '',
                                link: shareParam.link || location.href
                            }, shareParam);
                        }
                    }, shareParam);
                }, //end 'onMenuShareWechat' API

                onMenuShareQQ: function (shareParam) {
                    bindEvent("onMenuShareQQ", {
                        complete: function () {
                            invokeCmd('shareQQ', {
                                title: shareParam.title || title,
                                desc: shareParam.desc || '',
                                img_url: shareParam.imgUrl || '',
                                link: shareParam.link || location.href
                            }, shareParam);
                        }
                    }, shareParam);
                }, //end 'onMenuShareQQ' API



                onMenuShareWeibo: function (shareParam) {
                    bindEvent("onMenuShareWeibo", {
                        complete: function () {
                            invokeCmd('shareWeiboApp', {
                                title: shareParam.title || title,
                                desc: shareParam.desc || '',
                                img_url: shareParam.imgUrl || '',
                                link: shareParam.link || location.href
                            }, shareParam);
                        }
                    }, shareParam);
                }, //end 'onMenuShareWeibo' API

                onMenuFavorite: function (favoriteParam) {
                    bindEvent("onMenuFavorite", {
                        complete: function () {
                            invokeCmd('favorite', {
                                title: favoriteParam.title || title,
                                desc: favoriteParam.desc || '',
                                img_url: favoriteParam.imgUrl || '',
                                link: favoriteParam.link || location.href
                            }, favoriteParam);
                        }
                    }, favoriteParam);
                }, //end 'onMenuFavorite' API

                onMenuMail: function (mailParam) {
                    bindEvent("onMenuMail", {
                        complete: function () {
                            invokeCmd('mail', {
                                title: mailParam.title || title,
                                link: mailParam.link || location.href
                            }, mailParam);
                        }
                    }, mailParam);
                }, //end 'onMenuMail' API

                onMenuOpenByBrowser: function (openByBrowserParam) {
                    bindEvent("onMenuOpenByBrowser", {
                        complete: function () {
                            invokeCmd('openByBrowser', {
                                link: openByBrowserParam.link || location.href
                            }, openByBrowserParam);
                        }
                    }, openByBrowserParam);
                }, //end 'onMenuOpenByBrowser' API

                onHistoryBack: function (confirmParam) {
                    bindEvent("onHistoryBack", {
                        complete: function () {
                            return confirmParam.confirm();
                        }
                    }, confirmParam);
                }, //end 'onHistoryBack' API

                startRecord: function (callbackObj) {
                    invokeCmd('startRecord', {}, callbackObj);
                }, //end 'startRecord' API



                stopRecord: function (callbackObj) {
                    invokeCmd('stopRecord', {}, callbackObj);
                }, //end 'stopRecord' API



                onVoiceRecordEnd: function (callbackObj) {
                    bindEvent('onVoiceRecordEnd', callbackObj);
                }, //end 'onVoiceRecordEnd' API



                playVoice: function (callbackObj) {
                    invokeCmd('playVoice', {
                        localId: callbackObj.localId
                    }, callbackObj);
                }, //end 'playVoice' API



                pauseVoice: function (callbackObj) {
                    invokeCmd('pauseVoice', {
                        localId: callbackObj.localId
                    }, callbackObj);
                }, //end 'pauseVoice' API



                stopVoice: function (callbackObj) {
                    invokeCmd('stopVoice', {
                        localId: callbackObj.localId
                    }, callbackObj);
                }, //end 'stopVoice' API



                onVoicePlayEnd: function (callbackObj) {
                    bindEvent('onVoicePlayEnd', callbackObj);
                }, //end 'onVoicePlayEnd' API



                uploadVoice: function (callbackObj) {
                    invokeCmd('uploadVoice', {
                        localId: callbackObj.localId,
                        isShowProgressTips: (callbackObj.isShowProgressTips == 0) ? 0 : 1
                    }, callbackObj);
                }, //end 'uploadVoice' API



                downloadVoice: function (callbackObj) {
                    invokeCmd('downloadVoice', {
                        serverId: callbackObj.serverId,
                        isShowProgressTips: (callbackObj.isShowProgressTips == 0) ? 0 : 1
                    }, callbackObj);
                }, //end 'downloadVoice' API



                translateVoice: function (callbackObj) {
                    invokeCmd('translateVoice', {
                        localId: callbackObj.localId,
                        isShowProgressTips: (callbackObj.isShowProgressTips == 0) ? 0 : 1
                    }, callbackObj);
                }, //end 'translateVoice' API

                chooseImage: function (callbackObj) {
                    invokeCmd('chooseImage', {
                        scene: '1|2',
                        count: callbackObj.count || 9,
                        sizeType: callbackObj.sizeType || ['original', 'compressed']
                    }, function () {
                        callbackObj._complete = function (res) { };

                        return callbackObj;
                    }());
                }, //end 'chooseImage' API

                previewImage: function (callbackObj) {
                    invokeCmd("previewImage", {
                        current: callbackObj.current,
                        urls: callbackObj.urls
                    }, callbackObj);
                }, //end 'previewImage' API

                uploadImage: function (callbackObj) {
                    invokeCmd('uploadImage', {
                        localId: callbackObj.localId,
                        isShowProgressTips: (callbackObj.isShowProgressTips == 0) ? 0 : 1
                    }, callbackObj);
                }, //end 'uploadImage' API

                downloadImage: function (callbackObj) {
                    invokeCmd('downloadImage', {
                        serverId: callbackObj.serverId,
                        isShowProgressTips: (callbackObj.isShowProgressTips == 0) ? 0 : 1
                    }, callbackObj);
                }, //end 'downloadImage' API

                getImageInfo: function (callbackObj) {
                    invokeCmd('getImageInfo', {
                        localId: callbackObj.localId,
                        getThumb: callbackObj.getThumb || true,
                        maxThumbLength: callbackObj.maxThumbLength || 64
                    }, callbackObj);
                }, //end 'getImageInfo' API

                chooseFile: function (callbackObj) {
                    invokeCmd('chooseFile', {
                        count: callbackObj.count || 9,
                    }, function () {
                        callbackObj._complete = function (res) { };

                        return callbackObj;
                    }());
                }, //end 'chooseFile' API

                chooseFileFromCloudStorage: function (callbackObj) {
                    invokeCmd('chooseFileFromCloudStorage', {
                        count: callbackObj.count || 9,
                    }, function () {
                        callbackObj._complete = function (res) { };

                        return callbackObj;
                    }());
                }, //end 'chooseFileFromCloudStorage' API

                previewFile: function (callbackObj) {
                    invokeCmd("previewFile", {
                        serverId: callbackObj.serverId,
                        name: callbackObj.name,
                        size: callbackObj.size
                    }, callbackObj);
                }, //end 'previewFile' API

                printFile: function (callbackObj) {
                    invokeCmd("printFile", {
                        serverId: callbackObj.serverId,
                        name: callbackObj.name,
                        size: callbackObj.size
                    }, callbackObj);
                }, //end 'printFile' API

                favoriteFile: function (callbackObj) {
                    invokeCmd("favoriteFile", {
                        serverId: callbackObj.serverId,
                        name: callbackObj.name,
                    }, callbackObj);
                }, //end 'favoriteFile' API

                uploadFile: function (callbackObj) {
                    invokeCmd('uploadFile', {
                        localId: callbackObj.localId,
                        isShowProgressTips: (callbackObj.isShowProgressTips == 0) ? 0 : 1
                    }, callbackObj);
                }, //end 'uploadFile' API

                downloadFile: function (callbackObj) {
                    invokeCmd('downloadFile', {
                        serverId: callbackObj.serverId,
                        isShowProgressTips: (callbackObj.isShowProgressTips == 0) ? 0 : 1
                    }, callbackObj);
                }, //end 'downloadFile' API

                getFileInfo: function (callbackObj) {
                    invokeCmd('getFileInfo', {
                        localId: callbackObj.localId,
                    }, callbackObj);
                }, //end 'getFileInfo' API

                getNetworkType: function (callbackObj) {
                    var parseNetworkResult = function (res) {
                        var msg = res.errMsg,
                            stype = res.subtype;
                        delete res.subtype;
                        res.errMsg = 'getNetworkType:ok';

                        if (stype) {
                            res.networkType = stype;
                        } else {
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
                }, //end 'getNetworkType' API

                getWifiBSSID: function (callbackObj) {
                    invokeCmd('getWifiBSSID', {}, callbackObj);
                }, //end 'getWifiBSSID' API

                openLocation: function (callbackObj) {
                    invokeCmd('openLocation', {
                        latitude: callbackObj.latitude,
                        longitude: callbackObj.longitude,
                        name: callbackObj.name || '',
                        address: callbackObj.address || '',
                        scale: callbackObj.scale || 28,
                        infoUrl: callbackObj.infoUrl || ''
                    }, callbackObj);
                }, //end 'openLocation' API



                getLocation: function (callbackObj) {
                    callbackObj = callbackObj || {};

                    invokeCmd("getLocation", {
                        slient: callbackObj.slient,
                        withThumb: callbackObj.withThumb
                    }, function () {
                        callbackObj._complete = function (res) {
                            delete res.type;
                        };
                        return callbackObj;
                    }());
                }, //end 'getLocation' API



                hideOptionMenu: function (callbackObj) {
                    invokeCmd('hideOptionMenu', {}, callbackObj);
                }, //end 'hideOptionMenu' API



                showOptionMenu: function (callbackObj) {
                    invokeCmd('showOptionMenu', {}, callbackObj);
                }, //end 'showOptionMenu' API



                closeWindow: function (callbackObj) {
                    callbackObj = callbackObj || {};

                    invokeCmd('closeWindow', {
                        immediate_close: callbackObj.immediateClose || 0
                    }, callbackObj);
                }, //end 'closeWindow' API



                hideMenuItems: function (callbackObj) {
                    invokeCmd('hideMenuItems', {
                        menuList: callbackObj.menuList
                    }, callbackObj);
                }, //end 'hideMenuItems' API



                showMenuItems: function (callbackObj) {
                    invokeCmd('showMenuItems', {
                        menuList: callbackObj.menuList
                    }, callbackObj);
                }, //end 'showMenuItems' API



                hideAllNonBaseMenuItem: function (callbackObj) {
                    invokeCmd('hideAllNonBaseMenuItem', {}, callbackObj);
                }, //end 'hideAllNonBaseMenuItem' API

                showAllNonBaseMenuItem: function (callbackObj) {
                    invokeCmd('showAllNonBaseMenuItem', {}, callbackObj);
                }, //end 'showAllNonBaseMenuItem' API

                scanQRCode: function (callbackObj) {
                    callbackObj = callbackObj || {};

                    invokeCmd('scanQRCode', {
                        needResult: callbackObj.needResult || 0,
                        scanType: callbackObj.scanType || ['qrCode', 'barCode']
                    }, function () {
                        callbackObj._complete = function (res) {
                            if (isIOS && res.resultStr) {
                                var resObj = JSON.parse(res.resultStr);
                                res.resultStr = resObj;
                                return resObj.scan_code && resObj.scan_code.scan_result;
                            }
                        };

                        return callbackObj;
                    }());
                }, //end 'scanQRCode' API

                selectContact: function (callbackObj) {
                    invokeCmd("selectContact", {
                        mode: callbackObj.mode || "single", //single表示单选，multi表示多选
                        selectedUserIds: callbackObj.selectedUserIds || {},
                    }, callbackObj)
                }, //add "选择联系人" API

                getUserInfo: function (callbackObj) {
                    invokeCmd("getUserInfo", {
                        userId: callbackObj.userId
                    }, callbackObj)
                }, //add "获取用户信息" API

                redirectInApp: function (callbackObj) {
                    invokeCmd("redirectInApp", {
                        schema: callbackObj.schema
                    }, callbackObj);
                }, //add "应用内跳转信息" API

                openUserChat: function (callbackObj) {
                    invokeCmd("openUserChat", {
                        userId: callbackObj.userId
                    }, callbackObj);
                }, //add "打开用户会话" API

                openGroupChat: function (callbackObj) {
                    invokeCmd("openGroupChat", {
                        groupId: callbackObj.groupId
                    }, callbackObj);
                }, //add "打开群会话" API

                buildAndOpenGroupChat: function (callbackObj) {
                    callbackObj = callbackObj || {};

                    invokeCmd("buildAndOpenGroupChat", {
                        name: callbackObj.groupName || "未定义群名",
                        userIds: callbackObj.userIds || []
                    }, callbackObj)
                }, //add "创建并打开群会话" API

                openAppChat: function (callbackObj) {
                    invokeCmd("openAppChat", {
                        appId: callbackObj.appId
                    }, callbackObj);
                }, //add "打开应用会话" API

                openAudioVideoChat: function (callbackObj) {
                    invokeCmd("openAudioVideoChat", {
                        userId: callbackObj.userId
                    }, callbackObj);
                }, //add "打开音视频聊天" API

                passTGC: function (callbackObj) {
                    invokeCmd("passTGC", {
                        tgc: callbackObj.tgc
                    }, callbackObj);
                }, //add "传递TGC" API

                passST: function (callbackObj) {
                    invokeCmd("passST", {
                        st: callbackObj.st
                    }, callbackObj);
                }, //add "传递ST" API
            };

            if (setGlobal)
                glob.sr = srAPI;

            return srAPI;
        } //end api object initialize
    });