<template>
  <div class="flexDiv-v ">
    <sub-header>
      {{appDetail.name}} - 自定义菜单
    </sub-header>
    <div class="flexDiv-h app-main">
      <div class="flexDiv-v app-context">
        <div v-if="isEditing" class="flexDiv-v editing">
          <el-form :model="editingMenu" style="font-size: 14px;color: #606266;" :rules="rootMenuRule">
            <i class="el-icon-delete icon icon-delete" @click="removeRoorMenu" />
            <el-form-item label="主菜单" prop="name">
              <el-input size="small" v-model="editingMenu.name" />
            </el-form-item>
            <div style="background:white;padding:15px" class="flexDiv-v" v-show="editingMenu.subMenus.length==0">
              <el-form-item prop="type">
                <div class="flexDiv-h">
                  菜单类型：
                  <el-select size="small" v-model="editingMenu.type" placeholder="请选择">
                    <el-option v-for="item in menuItemTypes" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </div>
              </el-form-item>
              <el-form-item prop="url" v-if="editingMenu.type=='view'">
                <div class="flexDiv-h">
                  网页地址：
                  <el-input size="small" style="flex:1" v-model="editingMenu.url" />
                </div>
              </el-form-item>
              <div class="flexDiv-h" v-else-if="editingMenu.type=='send_message'">
                编辑消息体
              </div>
              <div class="flexDiv-h" v-else>
                <span v-if="!appDetail.receiveMsg_url">添加此事件，需要先设置接收消息服务器
                  <el-button type="text" class="button-link">去设置</el-button>
                </span>
              </div>
            </div>
            <div style="background:white;padding:15px;margin-top:10px" v-for="(subMenu,index) in editingMenu.subMenus" :key="index">
              <el-form :rules="subMenuRule" :model="subMenu">
                <i class="el-icon-delete icon icon-delete" @click="removeSubMenu(subMenu)" />
                <el-form-item label="子菜单" prop="name">
                  <el-input v-model="subMenu.name" size="small"></el-input>
                </el-form-item>
                <el-form-item prop="type">
                  <div class="flexDiv-h">
                    菜单类型：
                    <el-select size="small" v-model="subMenu.type" placeholder="请选择">
                      <el-option v-for="item in menuItemTypes" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </div>
                </el-form-item>
                <el-form-item prop="url" v-if="subMenu.type=='view'">
                  <div class="flexDiv-h">
                    网页地址：
                    <el-input size="small" style="flex:1" v-model="subMenu.url" />
                  </div>
                </el-form-item>
                <div class="flexDiv-h" v-else-if="subMenu.type=='send_message'">
                  编辑消息体
                </div>
                <div style="align-items:center" class="flexDiv-h" v-else>
                  <span v-if="!appDetail.receiveMsg_url">添加此事件，需要先设置接收消息服务器
                    <el-button type="text" class="button-link">去设置</el-button>
                  </span>
                </div>
              </el-form>
            </div>
            <el-button type="text" class="button-link" @click="addSubMenu" v-show="editingMenu.subMenus.length<5">添加子菜单（最多5个）</el-button>
          </el-form>
        </div>
        <div class="flexDiv-v" v-else>
          <div v-for="(item,index) in appDetail.contextMenus" :key="index">
            {{item.name}}
          </div>
          <div class="mainMenu" @click="addMenu">
            添加主菜单（最多三个）
          </div>
        </div>
      </div>
      <div class="flexDiv-v iphone">
        <div class="flexDiv-h iphone-title">{{appDetail.name}}</div>
        <div class="flexDiv-h iphone-content"></div>
        <div class="flexDiv-h iphone-contextMenu">
          <i class="el-icon-custom-voice icon" />
          <div class="inputText" />
          <i class="el-icon-custom-emotion icon" style="padding-right:0px" />
          <i class="el-icon-custom-add icon" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import subHeader from "./common/subHeader";
  import api from "../utility/api";
  import validator from "validator";

  export default {
    data() {
      var checkRootMenuName = (rule, value, callback) => {
        if (!value) {
          return callback(new Error("请输入主菜单名字"));
        }

        var chineseCharCount = this.getChineseChartCount(value);
        var asciiCharCount = this.getAsciiChartCount(value);

        var exceed = chineseCharCount + asciiCharCount / 2 > 4;
        if (exceed) {
          return callback("主菜单名字不多于4个汉字或8个字母");
        } else {
          return callback();
        }
      };
      var checkSubMenuName = (rule, value, callback) => {
        if (!value) {
          return callback(new Error("请输入子菜单名字"));
        }

        var chineseCharCount = this.getChineseChartCount(value);
        var asciiCharCount = this.getAsciiChartCount(value);

        var exceed = chineseCharCount + asciiCharCount / 2 > 8;
        if (exceed) {
          return callback("子菜单名字不多于8个汉字或16个字母");
        } else {
          return callback();
        }
      };

      var checkUrl = (rule, value, callback) => {
        if (!value) {
          return callback(new Error("请输入跳转的网页地址"));
        }

        if (!value.startsWith("http://") && !value.startsWith("https://")) {
          return callback(new Error("请填写带http或https协议头的合法URL"));
        }

        var isUrl = validator.isURL(value, ["http", "https"]);

        if (isUrl) {
          return callback();
        } else {
          return callback(new Error("请填写带http或https协议头的合法URL"));
        }
      };

      return {
        appId: "",
        appDetail: {},
        isEditing: false,
        rootMenuRule: {
          name: [{
            validator: checkRootMenuName,
            trigger: "blur"
          }],
          url: [{
            validator: checkUrl,
            trigger: "blur"
          }]
        },
        subMenuRule: {
          name: [{
            validator: checkSubMenuName,
            trigger: "blur"
          }],
          url: [{
            validator: checkUrl,
            trigger: "blur"
          }]
        },
        editingMenu: {
          appId: "",
          name: "",
          type: "view",
          url: "",
          key: "",
          parentId: "",
          subMenus: []
        },
        menuItemTypes: [{
            label: "跳转到网页",
            value: "view"
          },
          {
            label: "点击",
            value: "click"
          },
          {
            label: "发送消息",
            value: "send_message"
          },
          {
            label: "扫描推事件",
            value: "scancode"
          },
          {
            label: "系统拍照",
            value: "pic_photo"
          },
          {
            label: "系统相册",
            value: "pic_album"
          },
          {
            label: "系统拍照或相册",
            value: "pic_photo_album"
          },
          {
            label: "地理位置选择器",
            value: "location_select"
          }
        ]
      };
    },

    components: {
      subHeader
    },

    methods: {
      addMenu() {
        this.isEditing = true;
      },
      createMenu(appId, parentMenuId, name, type, url, key) {
        return {
          name: name,
          type: type,
          url: url,
          key: key,
          parentId: parentMenuId,
          appId: appId
        };
      },
      addSubMenu() {
        this.editingMenu.subMenus = this.editingMenu.subMenus || [];
        var subMenu = this.createMenu(
          this.editingMenu.appId,
          this.editingMenu._id,
          "",
          "view",
          "",
          ""
        );
        this.editingMenu.subMenus.push(subMenu);
      },
      removeSubMenu(subMenu) {
        this.editingMenu.subMenus.removeByValue(subMenu);
      },
      removeRoorMenu() {
        if (this.editingMenu.id) {

        }

        this.editingMenu.name = "";
        this.editingMenu.type = "view";
        this.editingMenu.url = "";
        this.editingMenu.subMenus = [];
        this.isEditing = false;
      },
      getChineseChartCount(content) {
        var re = /[\u4E00-\u9FA5]/g;

        if (re.test(content)) {
          return content.match(re).length;
        }

        return 0;
      },
      getAsciiChartCount(content) {
        var re = /[\x00-\xff]/g;
        if (re.test(content)) {
          return content.match(re).length;
        }

        return 0;
      }
    },

    async mounted() {
      this.appId = this.$route.params.appId;
      this.appDetail = await api.getAppDetail(this.appId);
    }
  };

</script>

<style lang="less" scoped>
  .app-main {
    padding: 0 80px;
    padding-bottom: 30px;
    padding-top: 30px;
  }

  .app-context {
    flex: 1;
    margin-right: 40px;
  }

  .iphone {
    background-image: url("../assets/img/device-iphone.png");
    background-size: 246px 500px;
    height: 390px;
    width: 226px;
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 55px;
    padding-bottom: 55px;
  }

  .iphone-title {
    height: 32px;
    color: white;
    font-size: 13px;
    align-items: center;
    justify-content: center;
    background: @color-theme;
  }

  .iphone-content {
    flex: 1;
    background: #ebebeb;
  }

  .iphone-contextMenu {
    height: 32px;
    color: @color-font-minor;
    font-size: 13px;
    align-items: center;
    justify-content: center;
    background: #f5f5f7;
    border-top: 1px solid @color-border-level3;
  }

  .icon {
    font-size: 20px;
    color: #7e8189;
    padding: 4px;
  }

  .inputText {
    background: white;
    height: 22px;
    border: 1px solid @color-border-level3;
    flex: 1;
  }

  .mainMenu {
    font-size: 16px;
    color: @color-theme;
    padding-left: 10px;
    padding-bottom: 30px;
    padding-top: 30px;
    border-top: 1px solid @color-border-level3;
    border-bottom: 1px solid @color-border-level3;
    cursor: pointer;
  }

  .mainMenu:hover {
    background: #ebebeb;
  }

  .editing {
    background: #ebebeb;
    padding: 15px;
  }

  .icon-delete {
    position: relative;
    float: right;
    z-index: 999;
    cursor: pointer;
  }

</style>
