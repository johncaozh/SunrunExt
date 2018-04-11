sr.ready(function () {
  // 1 判断当前版本是否支持指定 JS 接口，支持批量判断
  document.querySelector('#checkJsApi').onclick = function () {
    sr.checkJsApi({
      jsApiList: [
        'getNetworkType',
        'previewImage'
      ],
      success: function (res) {
        alert(JSON.stringify(res));
      }
    });
  };

  // 2 分享接口
  // 2.1监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口
  document.querySelector('#onMenuShareTimeline').onclick = function () {
    sr.onMenuShareTimeline({
      title: '尚融超融合JS API',
      link: 'http://movie.douban.com/subject/25785114/',
      imgUrl: 'http://demo.open.weixin.qq.com/jssdk/images/p2166127561.jpg',
      trigger: function (res) {
        // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
        alert('用户点击分享到朋友圈');
      },
      success: function (res) {
        alert('已分享');
      },
      cancel: function (res) {
        alert('已取消');
      },
      fail: function (res) {
        alert(JSON.stringify(res));
      }
    });
    alert('已注册获取“分享到朋友圈”状态事件');
  };

  // 2.2监听“分享给朋友”，按钮点击、自定义分享内容及分享结果接口
  document.querySelector('#onMenuShareAppMessage').onclick = function () {
    sr.onMenuShareAppMessage({
      title: '尚融超融合JS API',
      desc: 'testing',
      link: 'http://movie.douban.com/subject/25785114/',
      imgUrl: 'http://demo.open.weixin.qq.com/jssdk/images/p2166127561.jpg',
      trigger: function (res) {
        // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
        alert('用户点击发送给朋友');
      },
      success: function (res) {
        alert('已分享');
      },
      cancel: function (res) {
        alert('已取消');
      },
      fail: function (res) {
        alert(JSON.stringify(res));
      }
    });
    alert('已注册获取“发送给朋友”状态事件');
  };

  // 2.2监听“添加小部件”，按钮点击、自定义小部件内容及分享结果接口
  document.querySelector('#onMenuAddWidgets').onclick = function () {
    sr.onMenuAddWidgets({
      widgets: [{
        title: "测试小部件",
        desc: "用于测试",
        height: 200,
        url: "http://10.11.13.252:8080/project",
      }],
      trigger: function (res) {
        // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
        alert('用户点击添加小部件');
      },
      success: function (res) {
        alert('已添加小部件');
      },
      cancel: function (res) {
        alert('已取消');
      },
      fail: function (res) {
        alert(JSON.stringify(res));
      }
    });
    alert('已注册获取“小部件”状态事件');
  };

  // 2.3监听“分享到微信”，按钮点击、自定义分享内容及分享结果接口
  document.querySelector('#onMenuShareWechat').onclick = function () {
    sr.onMenuShareAppMessage({
      title: '尚融超融合JS API',
      desc: 'testing',
      link: 'http://movie.douban.com/subject/25785114/',
      imgUrl: 'http://demo.open.weixin.qq.com/jssdk/images/p2166127561.jpg',
      trigger: function (res) {
        // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
        alert('用户点击分享到微信');
      },
      success: function (res) {
        alert('已分享');
      },
      cancel: function (res) {
        alert('已取消');
      },
      fail: function (res) {
        alert(JSON.stringify(res));
      }
    });
    alert('已注册获取“分享到 微信”状态事件');
  };

  // 2.4监听“分享到QQ”按钮点击、自定义分享内容及分享结果接口
  document.querySelector('#onMenuShareQQ').onclick = function () {
    sr.onMenuShareQQ({
      title: '尚融超融合JS API',
      desc: 'testing',
      link: 'http://movie.douban.com/subject/25785114/',
      imgUrl: 'http://img3.douban.com/view/movie_poster_cover/spst/public/p2166127561.jpg',
      trigger: function (res) {
        alert('用户点击分享到QQ');
      },
      complete: function (res) {
        alert(JSON.stringify(res));
      },
      success: function (res) {
        alert('已分享');
      },
      cancel: function (res) {
        alert('已取消');
      },
      fail: function (res) {
        alert(JSON.stringify(res));
      }
    });
    alert('已注册获取“分享到 QQ”状态事件');
  };

  // 2.5监听“分享到微博”按钮点击、自定义分享内容及分享结果接口
  document.querySelector('#onMenuShareWeibo').onclick = function () {
    sr.onMenuShareWeibo({
      title: '尚融超融合JS API',
      desc: 'testing',
      link: 'http://movie.douban.com/subject/25785114/',
      imgUrl: 'http://img3.douban.com/view/movie_poster_cover/spst/public/p2166127561.jpg',
      trigger: function (res) {
        alert('用户点击分享到微博');
      },
      complete: function (res) {
        alert(JSON.stringify(res));
      },
      success: function (res) {
        alert('已分享');
      },
      cancel: function (res) {
        alert('已取消');
      },
      fail: function (res) {
        alert(JSON.stringify(res));
      }
    });
    alert('已注册获取“分享到微博”状态事件');
  };

  // 2.6监听“收藏”按钮点击、自定义收藏内容及收藏结果接口
  document.querySelector('#onMenuFavorite').onclick = function () {
    sr.onMenuFavorite({
      title: '尚融超融合JS API',
      desc: 'testing',
      link: 'http://movie.douban.com/subject/25785114/',
      imgUrl: 'http://img3.douban.com/view/movie_poster_cover/spst/public/p2166127561.jpg',
      trigger: function (res) {
        alert('用户点击收藏');
      },
      complete: function (res) {
        alert(JSON.stringify(res));
      },
      success: function (res) {
        alert('已收藏');
      },
      cancel: function (res) {
        alert('已取消');
      },
      fail: function (res) {
        alert(JSON.stringify(res));
      }
    });
    alert('已注册获取“收藏”状态事件');
  };

  // 2.7监听“邮件”按钮点击、自定义邮件内容及邮件结果接口
  document.querySelector('#onMenuMail').onclick = function () {
    sr.onMenuMail({
      title: '尚融超融合JS API',
      link: 'http://movie.douban.com/subject/25785114/',
      trigger: function (res) {
        alert('用户点击邮件');
      },
      complete: function (res) {
        alert(JSON.stringify(res));
      },
      success: function (res) {
        alert('已发送');
      },
      cancel: function (res) {
        alert('已取消');
      },
      fail: function (res) {
        alert(JSON.stringify(res));
      }
    });
    alert('已注册获取“邮件”状态事件');
  };

  // 2.8监听“浏览器打开”按钮点击、自定义浏览器打开内容及浏览器打开结果接口
  document.querySelector('#onMenuOpenByBrowser').onclick = function () {
    sr.onMenuOpenByBrowser({
      link: 'http://movie.douban.com/subject/25785114/',
      trigger: function (res) {
        alert('用户点击浏览器打开');
      },
      complete: function (res) {
        alert(JSON.stringify(res));
      },
      success: function (res) {
        alert('已打开');
      },
      cancel: function (res) {
        alert('已取消');
      },
      fail: function (res) {
        alert(JSON.stringify(res));
      }
    });
    alert('已注册获取“浏览器打开”状态事件');
  };

  // 3 音频接口
  var voice = {
    localId: '',
    serverId: ''
  };

  var bindedVoiceRecordEnd = false;
  var bindedVoicePlayEnd = false;

  // 3.1 开始录音
  document.querySelector('#startRecord').onclick = function () {
    sr.startRecord({
      cancel: function () {
        alert('用户拒绝授权录音');
      }
    });

    if (!bindedVoiceRecordEnd) {
      bindedVoiceRecordEnd = true;
      // 监听录音自动停止
      sr.onVoiceRecordEnd({
        complete: function (res) {
          voice.localId = res.localId;
          alert('录音时间已超过一分钟');
        }
      });
    }
  };

  // 3.2 停止录音
  document.querySelector('#stopRecord').onclick = function () {
    sr.stopRecord({
      success: function (res) {
        voice.localId = res.localId;
      },
      fail: function (res) {
        alert(JSON.stringify(res));
      }
    });
  };

  // 3.3 播放音频
  document.querySelector('#playVoice').onclick = function () {
    if (voice.localId == '') {
      alert('请先使用 startRecord 接口录制一段声音');
      return;
    }
    sr.playVoice({
      localId: voice.localId
    });

    if (!bindedVoicePlayEnd) {
      bindedVoicePlayEnd = true;
      // 监听录音播放停止
      sr.onVoicePlayEnd({
        complete: function (res) {
          alert('录音（' + res.localId + '）播放结束');
        }
      });
    }
  };

  // 3.4 暂停播放音频
  document.querySelector('#pauseVoice').onclick = function () {
    sr.pauseVoice({
      localId: voice.localId
    });
  };

  // 3.5 停止播放音频
  document.querySelector('#stopVoice').onclick = function () {
    sr.stopVoice({
      localId: voice.localId
    });
  };

  // 3.6 上传语音
  document.querySelector('#uploadVoice').onclick = function () {
    if (voice.localId == '') {
      alert('请先使用 startRecord 接口录制一段声音');
      return;
    }
    sr.uploadVoice({
      localId: voice.localId,
      success: function (res) {
        alert('上传语音成功，serverId 为' + res.serverId);
        voice.serverId = res.serverId;
      }
    });
  };

  // 3.7 下载语音
  document.querySelector('#downloadVoice').onclick = function () {
    if (voice.serverId == '') {
      alert('请先使用 uploadVoice 上传声音');
      return;
    }
    sr.downloadVoice({
      serverId: voice.serverId,
      success: function (res) {
        alert('下载语音成功，localId 为' + res.localId);
        voice.localId = res.localId;
      }
    });
  };

  // 3.8 识别音频并返回识别结果
  document.querySelector('#translateVoice').onclick = function () {
    if (voice.localId == '') {
      alert('请先使用 startRecord 接口录制一段声音');
      return;
    }
    sr.translateVoice({
      localId: voice.localId,
      complete: function (res) {
        if (res.hasOwnProperty('translateResult')) {
          alert('识别结果：' + res.translateResult);
        } else {
          alert('无法识别');
        }
      }
    });
  };


  // 4 图片接口
  var images = {
    localIds: [],
    serverIds: []
  };

  // 4.1 拍照、本地选图
  document.querySelector('#chooseImage').onclick = function () {
    sr.chooseImage({
      success: function (res) {
        images.localIds = res.localIds;
        alert('已选择 ' + res.localIds.length + ' 张图片');
      }
    });
  };

  // 4.2 图片预览
  document.querySelector('#previewImage').onclick = function () {
    sr.previewImage({
      current: 'http://img5.douban.com/view/photo/photo/public/p1353993776.jpg',
      urls: [
        'http://img3.douban.com/view/photo/photo/public/p2152117150.jpg',
        'http://img5.douban.com/view/photo/photo/public/p1353993776.jpg',
        'http://img3.douban.com/view/photo/photo/public/p2152134700.jpg'
      ]
    });
  };

  // 4.3 上传图片
  document.querySelector('#uploadImage').onclick = function () {
    if (images.localIds.length == 0) {
      alert('请先使用 chooseImage 接口选择图片');
      return;
    }
    var i = 0,
      length = images.localIds.length;
    images.serverIds = [];

    function upload() {
      sr.uploadImage({
        localId: images.localIds[i],
        success: function (res) {
          i++;
          //alert('已上传：' + i + '/' + length);
          images.serverIds.push(res.serverId);
          if (i < length) {
            upload();
          }
        },
        fail: function (res) {
          alert(JSON.stringify(res));
        }
      });
    }
    upload();
  };

  // 4.4 下载图片
  document.querySelector('#downloadImage').onclick = function () {
    if (images.serverIds.length === 0) {
      alert('请先使用 uploadImage 上传文件');
      return;
    }
    var i = 0,
      length = images.serverIds.length;
    images.localIds = [];

    function download() {
      sr.downloadImage({
        serverId: images.serverIds[i],
        success: function (res) {
          i++;
          alert('已下载：' + i + '/' + length);
          images.localIds.push(res.localId);
          if (i < length) {
            download();
          }
        }
      });
    }
    download();
  };

  // 4.5 获取图片信息
  document.querySelector('#getImageInfo').onclick = function () {
    if (images.localIds.length == 0) {
      alert('请先使用 chooseImage 接口选择图片');
      return;
    }
    var i = 0,
      length = images.localIds.length;
    images.serverIds = [];

    function getInfo() {
      sr.getImageInfo({
        localId: images.localIds[i],
        getThumb: true,
        maxThumbLength: 64,
        success: function (res) {
          alert(`第 ${i} 个图片的信息:
                 图片名：${res.fileName}
                 图片长度：${res.fileSize}
                 图片缩略图Base64：${res.thumbBase64}
          `);
          i++;
          if (i < length) {
            getInfo();
          }
        },
        fail: function (res) {
          alert(JSON.stringify(res));
        }
      });
    }
    getInfo();
  };

  // 5 文件接口
  var files = {
    localIds: [],
    serverIds: []
  };

  // 5.1 选择文件
  document.querySelector('#chooseFile').onclick = function () {
    sr.chooseFile({
      success: function (res) {
        files.localIds = res.localIds;
        alert('已选择 ' + res.localIds.length + ' 个文件');
      }
    });
  };

  // 5.2 从云盘选择文件
  document.querySelector('#chooseFileFromCloudStorage').onclick = function () {
    sr.chooseFileFromCloudStorage({
      success: function (res) {
        var firstFile = res.serverFiles[0];
        var serverId = firstFile.serverId; //s3 object key
        var name = firstFile.name; //文件名
        var size = firstFile.size; //文件大小
        files.serverIds = res.serverFiles.map(i => i.serverId);
        alert('已选择 ' + res.serverFiles.length + ' 个文件');
      }
    });
  };

  // 5.3 文件预览
  document.querySelector('#previewFile').onclick = function () {
    sr.previewFile({
      serverId: 's3 object key',
      name: "test.doc",
      size: 1048576
    });
  };

  // 5.4 文件打印
  document.querySelector('#printFile').onclick = function () {
    sr.printFile({
      serverId: 's3 object key',
      name: "test.doc",
      size: 1048576
    });
  };

  // 5.5 收藏文件
  document.querySelector('#favoriteFile').onclick = function () {
    sr.favoriteFile({
      serverId: 's3 object key',
      name: "test.doc",
    });
  };

  // 5.6 上传文件
  document.querySelector('#uploadFile').onclick = function () {
    if (files.localIds.length == 0) {
      alert('请先使用 chooseFile 接口选择文件');
      return;
    }
    var i = 0,
      length = files.localIds.length;
    files.serverIds = [];

    function upload() {
      sr.uploadFile({
        localId: files.localIds[i],
        success: function (res) {
          i++;
          //alert('已上传：' + i + '/' + length);
          files.serverIds.push(res.serverId);
          if (i < length) {
            upload();
          }
        },
        fail: function (res) {
          alert(JSON.stringify(res));
        }
      });
    }
    upload();
  };

  // 5.7 下载文件
  document.querySelector('#downloadFile').onclick = function () {
    if (files.serverIds.length === 0) {
      alert('请先使用 uploadImage 上传图片');
      return;
    }
    var i = 0,
      length = files.serverIds.length;
    files.localIds = [];

    function download() {
      sr.downloadFile({
        serverId: files.serverIds[i],
        success: function (res) {
          i++;
          alert('已下载：' + i + '/' + length);
          files.localIds.push(res.localId);
          if (i < length) {
            download();
          }
        }
      });
    }
    download();
  };

  // 5.8 获取文件信息
  document.querySelector('#getFileInfo').onclick = function () {
    if (files.localIds.length == 0) {
      alert('请先使用 chooseFile 接口选择文件');
      return;
    }
    var i = 0,
      length = files.localIds.length;
    files.serverIds = [];

    function getInfo() {
      sr.getFileInfo({
        localId: files.localIds[i],
        success: function (res) {
          alert(`第 ${i} 个文件的信息:
                 文件名：${res.fileName}
                 文件长度：${res.fileSize}
          `);
          i++;
          if (i < length) {
            getInfo();
          }
        },
        fail: function (res) {
          alert(JSON.stringify(res));
        }
      });
    }
    getInfo();
  };

  // 6 设备信息接口
  // 6.1 获取当前网络状态
  document.querySelector('#getNetworkType').onclick = function () {
    sr.getNetworkType({
      success: function (res) {
        alert(res.networkType);
      },
      fail: function (res) {
        alert(JSON.stringify(res));
      }
    });
  };

  // 7 地理位置接口
  // 7.1 查看地理位置
  document.querySelector('#openLocation').onclick = function () {
    sr.openLocation({
      latitude: 23.171956,
      longitude: 113.461739,
      name: '创新大厦C3',
      address: '广州市科学城',
      scale: 14,
      infoUrl: 'http://gzsunrun.cn'
    });
  };

  // 7.2 获取当前地理位置
  document.querySelector('#getLocation').onclick = function () {
    sr.getLocation({
      success: function (res) {
        alert(`经度：${res.longitude}，纬度:${res.latitude}`);
      },
      cancel: function (res) {
        alert('用户拒绝授权获取地理位置');
      }
    });
  };

  // 8 界面操作接口
  var bindedHistoryBack = false;

  // 8.1 隐藏右上角菜单
  document.querySelector('#hideOptionMenu').onclick = function () {
    sr.hideOptionMenu();
  };

  // 8.2 显示右上角菜单
  document.querySelector('#showOptionMenu').onclick = function () {
    sr.showOptionMenu();
  };

  // 8.3 批量隐藏菜单项
  document.querySelector('#hideMenuItems').onclick = function () {
    sr.hideMenuItems({
      menuList: [
        'menuItem:readMode', // 阅读模式
        'menuItem:share:timeline', // 分享到朋友圈
        'menuItem:copyUrl' // 复制链接
      ],
      success: function (res) {
        alert('已隐藏“阅读模式”，“分享到朋友圈”，“复制链接”等按钮');
      },
      fail: function (res) {
        alert(JSON.stringify(res));
      }
    });
  };

  // 8.4 批量显示菜单项
  document.querySelector('#showMenuItems').onclick = function () {
    sr.showMenuItems({
      menuList: [
        'menuItem:readMode', // 阅读模式
        'menuItem:share:timeline', // 分享到朋友圈
        'menuItem:copyUrl' // 复制链接
      ],
      success: function (res) {
        alert('已显示“阅读模式”，“分享到朋友圈”，“复制链接”等按钮');
      },
      fail: function (res) {
        alert(JSON.stringify(res));
      }
    });
  };

  // 8.5 隐藏所有非基本菜单项
  document.querySelector('#hideAllNonBaseMenuItem').onclick = function () {
    sr.hideAllNonBaseMenuItem({
      success: function () {
        alert('已隐藏所有非基本菜单项');
      }
    });
  };

  // 8.6 显示所有被隐藏的非基本菜单项
  document.querySelector('#showAllNonBaseMenuItem').onclick = function () {
    sr.showAllNonBaseMenuItem({
      success: function () {
        alert('已显示所有非基本菜单项');
      }
    });
  };

  // 8.7 关闭当前窗口
  document.querySelector('#closeWindow').onclick = function () {
    sr.closeWindow();
  };

  // 8.8 程序内跳转到
  document.querySelector('#redirectInApp').onclick = function () {
    sr.redirectInApp({
      schema: "dfs://testing"
    });
  };

  // 8.9 监听页面返回事件
  document.querySelector('#onHistoryBack').onclick = function () {
    if (!bindedHistoryBack) {
      bindedHistoryBack = true;
      sr.onHistoryBack({
        confirm: function (res) {
          alert('监听到页面返回事件，点击确定返回上一页。');
          return true;
        }
      });
    }
  };

  // 9 二维码
  // 9.1.1 扫描二维码并由融合客户端处理结果
  document.querySelector('#scanQRCode0').onclick = function () {
    sr.scanQRCode();
  };
  // 9.1.2 扫描二维码并返回结果给页面处理
  document.querySelector('#scanQRCode1').onclick = function () {
    sr.scanQRCode({
      needResult: 1,
      desc: 'scanQRCode desc',
      success: function (res) {
        alert(JSON.stringify(res));
      }
    });
  };

  // 10 用户接口
  // 10.1 通讯录选人
  document.querySelector('#selectContact').onclick = function () {
    sr.selectContact({
      selectContact: ["czq"],
      success: function (res) {
        alert(JSON.stringify(res));
      }
    });
  };

  //10.2 获取用户信息
  document.querySelector('#getUserInfo').onclick = function () {
    sr.getUserInfo({
      userId: "czq",
      success: function (res) {
        alert(JSON.stringify(res));
      }
    });
  };

  // 11 会话接口
  // 11.1 打开用户会话
  document.querySelector('#openUserChat').onclick = function () {
    sr.openUserChat({
      userId: "czq", //需要具体的用户Id
      success: function (res) {
        alert("打开用户会话成功");
      },
      fail: function (res) {
        alert("打开用户会话失败");
      }
    });
  };

  // 11.2 打开群会话
  document.querySelector('#openGroupChat').onclick = function () {
    sr.openGroupChat({
      groupId: "473248328404320", //需要具体的RoomId
      success: function (res) {
        alert("打开群会话成功");
      },
      fail: function (res) {
        alert("打开群会话失败");
      }
    });
  };

  // 11.3 创建并打开群会话
  document.querySelector('#buildAndOpenGroupChat').onclick = function () {
    sr.buildAndOpenGroupChat({
      groupName: "未定义群名",
      userIds: ["czq", "yss", "cdl", "hxc"],
      success: function (res) {
        alert("创建并打开群会话成功");
      },
      fail: function (res) {
        alert("创建并打开群会话失败");
      }
    });
  };

  // 11.4 打开应用会话
  document.querySelector('#openAppChat').onclick = function () {
    sr.openAppChat({
      appId: "473248328404320", //需要具体的appId
      success: function (res) {
        alert("打开应用会话成功");
      },
      fail: function (res) {
        alert("打开应用会话失败");
      }
    });
  };

  // 11.5 打开音视频聊天
  document.querySelector('#openAudioVideoChat').onclick = function () {
    sr.openAudioVideoChat({
      userId: "czq", //需要具体的用户Id
      success: function (res) {
        alert("打开音视频聊天成功");
      },
      fail: function (res) {
        alert("打开音视频聊天失败");
      }
    });
  };
});

sr.error(function (res) {
  alert(res.errMsg);
});