<template>
  <div class="flexDiv-v">
    <sub-header>{{appDetail.name}}</sub-header>
    <div class="flexDiv-v app-main">
      <div class="flexDiv-v">
        <div class="flexDiv-v">
          <div class="flexDiv-h app-basic" style="align-items:flex-start">
            <el-upload :with-credentials="true" v-if="isEditingNameDesc" class="avatar-uploader" style="border: 1px dashed #d9d9d9;height:60px" :action="uploadUrl" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
              <img v-if="editingAvatar" :src="editingAvatar|getMediaLink" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <img style="width:60px;height:60px" :src="appDetail.avatar|getMediaLink" v-else />
            <el-collapse-transition>
              <div v-show="isEditingNameDesc" style="margin-left:20px;">
                <el-input v-model="editingName" placeholder="在此输入应用名称" size="small" />
                <el-input v-model="editingDesc" type="textarea" size="small" style="margin-top:20px" :autosize="{ minRows: 2, maxRows: 4}" placeholder="在此输入应用描述" />
                <div class="flexDiv-h" style="margin-top:20px">
                  <el-button size="small" @click="isEditingNameDesc=false">取消</el-button>
                  <el-button size="small" type="primary" @click="updateAppNameDesc">完成</el-button>
                </div>
              </div>
            </el-collapse-transition>
            <div class="flexDiv-v" style="margin-left:10px;justify-content:space-around;align-self:flex-start" v-show="!isEditingNameDesc">
              <div class="flexDiv-h" style="font-size:22px;align-items:center">
                {{appDetail.name}}
                <i class="el-icon-edit i-edit " @click="editAppNameDesc" />
              </div>
              <div class="text-font-normal " style="margin-top:10px;">
                {{appDetail.desc}}
              </div>
            </div>
            <div class="flexDiv-v" style="flex:1;align-items:flex-end;align-self:stretch">
              <el-checkbox v-model="appDetail.enable" @change="appEnableChanged">启用</el-checkbox>
              <el-checkbox v-model="appDetail.useInGroup" @change="appUseInGroupChanged" style="margin-top:20px">设为群应用</el-checkbox>
            </div>
          </div>
        </div>
        <div class="flexDiv-v text-font-normal" style="margin-top:20px">
          <div class="flexDiv-h">
            <span style="width:100px;">应用ID</span>{{appDetail._id}}
          </div>
          <div class="flexDiv-h" style="margin-top:20px">
            <span style="width:100px;">可见范围</span>
            <div class="flexDiv-v" style="flex:1">
              <div class="flexDiv-h">
                <contract-selector :editable="isEditingOrgs" notEmptyLabel="" v-if="appDetail" :preSelectedOrgs="editingOrgs" ref="contractSelector" style="flex:1" />
                <el-button type="text" class="button-link" style="padding:0px" size="small" @click="editOrgs" v-show="!isEditingOrgs">编辑</el-button>
              </div>
              <el-collapse-transition>
                <div class="flexDiv-h" style="margin-top:20px" v-if="isEditingOrgs">
                  <el-button size="small" @click="cancelUpdateOrgs">取消</el-button>
                  <el-button size="small" type="primary" @click="updateOrgs">完成</el-button>
                </div>
              </el-collapse-transition>
            </div>
          </div>
        </div>
        <div class="flexDiv-h app-menu">
          <app-visible v-show="!appDetail.useInGroup" :visible="appDetail.visible" @visibleChanged="appVisibleChanged" />
          <app-home-url :homeUrl="appDetail.home_url" :homeIsInternelUrl="appDetail.home_url_isInternet" @urlChanged="appUrlChanged" @isInternelUrlChanged="appIsInternelUrlChanged" />
          <app-context-menu v-show="!appDetail.useInGroup" :appId="appId" :contextMenu='appDetail.contextMenu||""' />
          <app-send-msg v-show="!appDetail.useInGroup" :appId="appId" />
          <app-receive-msg v-show="!appDetail.useInGroup" :appId="appId" />
          <app-auto-reply v-show="!appDetail.useInGroup" :appId="appId" />
          <app-s-s-o @iamProductNameChanged="appIamProductNameChanged" :iamProductName="appDetail.iamProductName" />
        </div>
        <el-button type="text" style="margin-top:30px;color:red;align-self:flex-start" @click="deleteApp">删除应用</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import appSendMsg from "./common/appSendMsg";
import appHomeUrl from "./common/appHomeUrl";
import appVisible from "./common/appVisible";
import appReceiveMsg from "./common/appReceiveMsg";
import appContextMenu from "./common/appContextMenu";
import appAutoReply from "./common/appAutoReply";
import appSSO from "./common/appSSO";
import subHeader from "./common/subHeader";
import api from "../utility/api";
import contractSelector from "./common/contractSelector";
import upload from "./mixin/upload";
export default {
  mixins: [upload],
  data() {
    return {
      appId: "",
      appDetail: {},
      isEditingNameDesc: false,
      editingName: null,
      editingDesc: null,
      editingAvatar: null,
      isEditingOrgs: false,
      editingOrgs: []
    };
  },
  components: {
    appSendMsg,
    appHomeUrl,
    appVisible,
    appReceiveMsg,
    appContextMenu,
    appAutoReply,
    appSSO,
    subHeader,
    contractSelector
  },
  async mounted() {
    this.appId = this.$route.params.appId;
    this.refreshAppDetail();
  },

  methods: {
    async updateApp(param, successMsg, errorMsg) {
      try {
        var result = await api.updateApp(this.appId, param);
        successMsg = successMsg || "更新成功";
        this.$message({
          message: successMsg,
          type: "success"
        });
      } catch (err) {
        errorMsg = errorMsg || "更新失败";
        this.$message.error(errorMsg);
      }
    },
    async refreshAppDetail() {
      this.appDetail = await api.getAppDetail(this.appId);
      this.editingOrgs = this.appDetail.orgs;
    },
    async appEnableChanged(value) {
      if (!value) {
        try {
          await this.$confirm(
            "应用停用后，该应用在客户端中的消息将被删除",
            "提示",
            {
              confirmButtonText: "停用",
              cancelButtonText: "取消",
              type: "warning"
            }
          );

          await this.updateApp(this.appDetail, "已停用", "停用出错");
          this.$router.go(-1);
        } catch (err) {
          this.$message({
            type: "info",
            message: "已取消操作"
          });
          this.appDetail.enable = true;
        }
      } else {
        await this.updateApp(this.appDetail, "已启用", "启用出错");
        this.refreshAppDetail();
      }
    },
    async appUseInGroupChanged(value) {
      if (value) {
        try {
          await this.$confirm(
            "设置为群应用后，在工作台的入口将被移除，并且以下的菜单项除了主页地址仍可用外，其他均被屏蔽。确定继续操作？",
            "提示",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }
          );

          await this.updateApp(
            this.appDetail,
            "已设置为群应用",
            "设置为群应用出错"
          );
          this.refreshAppDetail();
        } catch (err) {
          this.$message({
            type: "info",
            message: "已取消操作"
          });
          this.appDetail.useInGroup = false;
        }
      } else {
        await this.updateApp(
          this.appDetail,
          "已设置为普通应用",
          "设置为普通应用出错"
        );
        this.refreshAppDetail();
      }
    },
    async appVisibleChanged(value) {
      this.appDetail.visible = value;
      await this.updateApp(this.appDetail);
      this.efreshAppDetail();
    },
    async appUrlChanged(url) {
      this.appDetail.home_url = url;
      await this.updateApp(this.appDetail);
      this.refreshAppDetail();
    },
    async appIsInternelUrlChanged(isInternetUrl) {
      this.appDetail.home_url_isInternet = isInternetUrl;
      await this.updateApp(this.appDetail);
      this.refreshAppDetail();
    },
    async appIamProductNameChanged(name) {
      this.appDetail.iamProductName = name;
      await this.updateApp(this.appDetail);
      this.refreshAppDetail();
    },
    async deleteApp() {
      try {
        await this.$confirm(
          "应用删除后，该应用的历史消息将被删除且不可恢复",
          "提示",
          {
            confirmButtonText: "删除",
            cancelButtonText: "取消",
            type: "warning"
          }
        );

        await api.deleteApp(this.appDetail._id);
        this.$router.go(-1);
      } catch (err) {
        this.$message({
          type: "info",
          message: "已取消操作"
        });
      }
    },
    editAppNameDesc() {
      this.editingName = this.appDetail.name;
      this.editingDesc = this.appDetail.desc;
      this.editingAvatar = this.appDetail.avatar;
      this.isEditingNameDesc = true;
    },
    async updateAppNameDesc() {
      if (
        this.editingName == null ||
        this.editingName == undefined ||
        this.editingName === ""
      ) {
        this.$message.err("应用名称不能为空");
        return;
      }

      await this.updateApp({
        name: this.editingName,
        desc: this.editingDesc,
        avatar: this.editingAvatar
      });

      await this.refreshAppDetail();

      this.isEditingNameDesc = false;
      this.$message({
        type: "success",
        message: "更新成功。"
      });
    },
    handleAvatarSuccess(res, file) {
      this.editingAvatar = res.data;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }

      return isJPG && isLt2M;
    },
    editOrgs() {
      this.editingOrgs = this.appDetail.orgs;
      this.isEditingOrgs = true;
    },
    updateOrgs() {
      this.updateApp({
        iamUserIds: this.$refs.contractSelector.selectedUserIds,
        iamOrgIds: this.$refs.contractSelector.selectedOrgIds
      });

      this.isEditingOrgs = false;
    },
    cancelUpdateOrgs() {
      this.editingOrgs = this.appDetail.orgs;
      this.$refs.contractSelector.resetSelectedOrgs();
      this.isEditingOrgs = false;
    }
  }
};
</script>

<style scoped lang="less">
el-header {
  height: auto;
}

el-main {
  height: auto;
}

.app-main {
  padding: 0 114px;
  padding-bottom: 30px;
}

.app-basic {
  border-bottom: 1px solid @color-border-level2;
  align-items: center;
  padding-top: 30px;
  padding-bottom: 30px;
  flex-wrap: wrap;
}

.app-menu {
  margin-top: 30px;
  padding-bottom: 30px;
  border-bottom: 1px solid @color-border-level2;
  flex-wrap: wrap;
}

.i-edit {
  color: @color-theme;
  font-size: 16px;
  margin-left: 20px;
  cursor: pointer;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  overflow: hidden;
  text-align: left;
  height: 60px;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
  height: 60px;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 60px;
  height: 60px;
  line-height: 60px;
  text-align: center;
}

.avatar {
  width: 60px;
  height: 60px;
  display: block;
}
</style>
