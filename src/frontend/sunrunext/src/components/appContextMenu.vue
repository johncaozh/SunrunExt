<template>
  <div class="flexDiv-v ">
    <sub-header>
      {{appDetail.name}} - 自定义菜单
    </sub-header>
    <div class="flexDiv-h app-main">
      <div class="flexDiv-v app-context">
        <div v-if="isEditing" class="flexDiv-v editing">
          <el-form :model="editingMenu" style="font-size: 14px;color: #606266;flex:1" :rules="rootMenuRule" ref="editingMenu">
            <i class="el-icon-delete icon icon-delete" @click="removeRootMenu(true)" />
            <el-form-item label="主菜单" prop="name">
              <el-input size="small" v-model="editingMenu.name" />
            </el-form-item>
            <div style="background:white;padding:15px" class="flexDiv-v" v-show="editingMenu.subMenuItems.length==0">
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
            <el-form :rules="subMenuRule" :model="subMenu" :ref="subMenu.name+index" style="background:white;padding:15px;margin-top:10px" v-for="(subMenu,index) in editingMenu.subMenuItems" :key="index">
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
            <el-button type="text" class="button-link" @click="addSubMenu" v-show="editingMenu.subMenuItems.length<5">添加子菜单（最多5个）</el-button>
          </el-form>
          <span style="margin-top:20px">
            <el-button type="primary" size="small" @click="saveRootMenu('editingMenu')">保存</el-button>
            <el-button type="text" size="small" class="button-link" @click="removeRootMenu(false)">取消</el-button>
          </span>
        </div>
        <div class="flexDiv-v" v-else>
          <div v-for="(item,index) in appDetail.contextMenus" :key="index" class="mainMenu">
            <i class="el-icon-edit-outline icon icon-edit" @click="editMenu(item)" />
            <div class="flexDiv-v">
              <span class="text-font-normal">
                菜单{{index}}
              </span>
              <span style="line-height:40px;">
                {{item.name}}
              </span>
              <span style="line-height:20px;font-size:14px;" v-for="(subMenu,index) in item.subMenuItems" :key="index">
                {{subMenu.name}}
              </span>
            </div>
          </div>
          <div class="addMainMenu" @click="addMenu" v-show="!appDetail.contextMenus||appDetail.contextMenus.length<3">
            添加主菜单（最多三个）
          </div>
        </div>
      </div>
      <div class="flexDiv-v iphone">
        <div class="flexDiv-h iphone-title">{{appDetail.name}}</div>
        <div class="flexDiv-h iphone-content"></div>
        <div class="flexDiv-h iphone-subMenuItems">
          <div v-for="(item,index) in appDetail.contextMenus" :key="index" class="flexDiv-v subMenuItems" v-bind:style="{ opacity:item.subMenuItems.length>0?1:0 }">
            <div class="flexDiv-v">
              <div class="subMenu" v-for="(subMenu,subMenuIndex) in item.subMenuItems" :key="subMenuIndex">
                {{subMenu.name||"未设置"}}
              </div>
            </div>
            <div class="subMenuItems-triangle" />
          </div>
        </div>
        <div class="flexDiv-h iphone-contextMenu">
          <div class="flexDiv-h" style="flex:1;align-items:center" v-if="!appDetail.contextMenus||appDetail.contextMenus.length==0">
            <i class="el-icon-custom-voice icon" />
            <div class="inputText" />
            <i class="el-icon-custom-emotion icon" style="padding-right:0px" />
            <i class="el-icon-custom-add icon" />
          </div>

          <div class="flexDiv-h" v-else style="flex:1;align-items:center">
            <i class="el-icon-custom-callKeyboard icon" />
            <div v-for="(item,index) in appDetail.contextMenus" :key="index" class="flexDiv-h menuItemInToobar">
              <i class="el-icon-custom-contextMenuMore icon" style="font-size:2px;margin-top:2px;" v-if="item.subMenuItems.length>0" /> {{item.name||"未设置"}}
            </div>
          </div>
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
        name: [
          {
            validator: checkRootMenuName,
            trigger: "blur"
          }
        ],
        url: [
          {
            validator: checkUrl,
            trigger: "blur"
          }
        ]
      },
      subMenuRule: {
        name: [
          {
            validator: checkSubMenuName,
            trigger: "blur"
          }
        ],
        url: [
          {
            validator: checkUrl,
            trigger: "blur"
          }
        ]
      },
      editingMenu: {
        _id: null,
        appId: "",
        name: "",
        type: "view",
        url: "",
        parentId: "",
        subMenuItems: []
      },
      menuItemTypes: [
        {
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
      ],
      waitToDeleteSubMenuItems: []
    };
  },

  components: {
    subHeader
  },

  methods: {
    addMenu() {
      this.isEditing = true;
      this.appDetail.contextMenus.push(this.editingMenu);
    },
    editMenu(rootMenu) {
      var index = this.appDetail.contextMenus.indexOf(rootMenu);
      var json = JSON.stringify(rootMenu);
      this.editingMenu = JSON.parse(json);
      this.appDetail.contextMenus[index] = this.editingMenu;
      this.isEditing = true;
      this.waitToDeleteSubMenuItems = [];
    },
    createMenu(
      id,
      appId,
      parentMenuId,
      name,
      type = "view",
      url,
      messageTemplateId
    ) {
      var menu = {
        _id: id,
        name: name,
        type: type,
        url: url,
        parentId: parentMenuId,
        appId: appId
      };

      if (type == "view") {
        menu.url = url;
      } else if (type == "send_message") {
        menu.messageTemplateId = messageTemplateId;
      }

      return menu;
    },
    addSubMenu() {
      this.editingMenu.subMenuItems = this.editingMenu.subMenuItems || [];
      var subMenu = this.createMenu(
        null,
        this.editingMenu.appId,
        this.editingMenu._id,
        "",
        "view",
        "",
        ""
      );
      this.editingMenu.subMenuItems.push(subMenu);
    },
    removeSubMenu(subMenu) {
      if (subMenu._id) {
        this.waitToDeleteSubMenuItems.push(subMenu);
      }
      this.editingMenu.subMenuItems.removeByValue(subMenu);
    },
    async removeRootMenu(confirm) {
      var closure = this;
      var removeAction = async function(remove) {
        if (remove && closure.editingMenu._id) {
          await api.deleteAppContextMenu(closure.editingMenu._id);
        }

        closure.appDetail.contextMenus.removeByValue(closure.editingMenu);
        closure.editingMenu.name = "";
        closure.editingMenu.type = "view";
        closure.editingMenu.url = "";
        closure.editingMenu.subMenuItems = [];
        closure.isEditing = false;
        closure.waitToDeleteSubMenuItems = [];
      };

      if (confirm && this.editingMenu.name) {
        var prompt = `删除后，“${
          this.editingMenu.name
        }”下设置的内容都将被删除，是否继续?',`;
        this.$confirm(prompt, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(async () => {
            await removeAction(true);
          })
          .catch(err => {});
      } else {
        await removeAction(false);
      }
    },
    async saveRootMenu(formName) {
      var validators = [];
      var rootMenuValidator = this.getValidatorPromise(formName);
      validators.push(rootMenuValidator);

      for (let i = 0; i < this.editingMenu.subMenuItems.length; i++) {
        var subMenu = this.editingMenu.subMenuItems[i];
        var refName = `${subMenu.name}${i}`;
        var subMenuValidator = this.getValidatorPromise(refName);
        validators.push(subMenuValidator);
      }

      var results = await Promise.all(validators);
      var pass = true;
      for (let j = 0; j < results.length; j++) {
        pass = pass && results[j];
      }

      if (pass) {
        var rootMenu = this.createMenu(
          this.editingMenu._id,
          this.appId,
          null,
          this.editingMenu.name,
          this.editingMenu.type,
          this.editingMenu.url,
          this.editingMenu.messageTemplateId
        );

        var returnRootMenu = null;
        if (rootMenu._id) {
          returnRootMenu = await api.updateAppContextMenu(
            rootMenu._id,
            rootMenu
          );
        } else {
          returnRootMenu = await api.createAppContextMenu(rootMenu);
        }
        for (let i = 0; i < this.editingMenu.subMenuItems.length; i++) {
          var subMenu = this.editingMenu.subMenuItems[i];
          subMenu = this.createMenu(
            subMenu._id,
            this.appId,
            returnRootMenu._id,
            subMenu.name,
            subMenu.type,
            subMenu.url,
            subMenu.messageTemplateId
          );

          if (subMenu._id) {
            await api.updateAppContextMenu(subMenu._id, subMenu);
          } else {
            await api.createAppContextMenu(subMenu);
          }
        }

        for (let i = 0; i < this.waitToDeleteSubMenuItems.length; i++) {
          await api.deleteAppContextMenu(this.waitToDeleteSubMenuItems[i]._id);
        }

        this.removeRootMenu(false);
      }
    },
    getValidatorPromise(formName) {
      return new Promise((resolve, reject) => {
        var ref = this.$refs[formName];
        if (ref.length) {
          ref = ref[0];
        }
        ref.validate(valid => {
          resolve(valid);
        });
      });
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
  },
  watch: {
    async isEditing() {
      if (!this.isEditing) {
        this.appDetail = await api.getAppDetail(this.appId);
      }
    }
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
  background: #f9f9fa;
}

.iphone-subMenuItems {
  background: #f9f9fa;
  padding-left: 26px;
  justify-content: space-around;
  align-items: flex-end;
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
}

.addMainMenu {
  font-size: 16px;
  color: @color-theme;
  padding-left: 10px;
  padding-bottom: 30px;
  padding-top: 30px;
  border-top: 1px solid @color-border-level3;
  // border-bottom: 1px solid @color-border-level3;
  cursor: pointer;
}

.addMainMenu:hover {
  background: #f9f9fa;
}

.editing {
  background: #f9f9fa;
  padding: 15px;
  min-height: 470px;
}

.icon-delete {
  position: relative;
  float: right;
  z-index: 999;
  cursor: pointer;
}

.menuContainerInToobar {
  align-items: center;
  flex: 1;
  justify-content: space-around;
}

.menuItemInToobar {
  font-size: 10px;
  border-left: 1px solid @color-border-level3;
  flex: 1;
  text-align: center;
  justify-content: center;
  align-items: center;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.subMenuItems {
  border: 1px solid #dcdde0;
  flex: 1;
  color: #f9f9fa;
  margin-left: 2px;
  margin-right: 2px;
  margin-bottom: 10px;
  background: white;
  justify-content: center;
  border-radius: 5px;
  position: relative;
  max-width: 60%;
}

.subMenuItems-triangle {
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 8px solid white;
  margin-bottom: -8px;
  align-self: center;
}

.subMenu {
  line-height: 30px;
  font-size: 10px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  text-align: center;
  color: @color-font-minor;
  border-bottom: 1px solid #dcdde0;
  margin-left: 2px;
  margin-right: 2px;
}

.subMenu:last-child {
  line-height: 30px;
  font-size: 10px;
  color: @color-font-minor;
  border-bottom: 0px solid #dcdde0;
}

.icon-edit {
  position: relative;
  float: right;
  z-index: 999;
  cursor: pointer;
}
</style>
