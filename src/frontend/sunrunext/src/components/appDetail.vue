<template>
  <div class="flexDiv-v">
      <sub-header>测试应用</sub-header>
    <div class="flexDiv-v app-main">
      <div class="flexDiv-v">
        <div class="flexDiv-h app-basic">
          <img style="width:60px;height:60px" :src="appDetail.logoUrl"/>
          <div class="flexDiv-v" style="margin-left:10px;justify-content:space-around;align-self:stretch">
            <div style="font-size:22px;">{{appDetail.name}}</div>
            <div class="text-font-normal">{{appDetail.desc}}</div>
          </div>
          <div class="flexDiv-v" style="flex:1;align-items:flex-end;justify-content:space-around;align-self:stretch">
            <el-checkbox  v-model="appDetail.enable" @change="appEnableChanged" >启用</el-checkbox>
            <el-checkbox v-model="appDetail.useInGroup" @change="appUseInGroupChanged">设为群应用</el-checkbox>
          </div>
        </div>
        <div class="flexDiv-v text-font-normal" >
          <el-row  style="padding-top:20px;padding-bottom:20px" >
              <el-col :span="3">应用ID</el-col>
              <el-col :span="10">{{appDetail._id}}</el-col>
          </el-row>
           <el-row v-show="!appDetail.useInGroup">
              <el-col :span="3">可见范围</el-col>
              <el-col :span="10">曹忠乾</el-col>
          </el-row>
        </div>
        <div class="flexDiv-h app-menu" >
          <app-visible v-show="!appDetail.useInGroup" :visible="appDetail.visible" @visibleChanged="appVisibleChanged"/>
          <app-home-url :homeUrl="appDetail.home_url" @urlChanged="appUrlChanged"/>
          <app-context-menu v-show="!appDetail.useInGroup" :appId="appDetail._id" :contextMenu="appDetail.contextMenu"/>
          <app-send-msg v-show="!appDetail.useInGroup"/>
          <app-receive-msg v-show="!appDetail.useInGroup"/>
          <app-auto-reply v-show="!appDetail.useInGroup"/>
          <app-s-s-o @iamProductNameChanged="appIamProductNameChanged" :iamProductName="appDetail.iamProductName"/>
        </div>
        <el-button type="text" style="margin-top:30px;color:red;align-self:flex-start">删除应用</el-button>
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
export default {
  data() {
    return {
      appId: null,
      appDetail: {}
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
    subHeader
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
      this.appDetail.logoUrl = `${api.fileTransferUrl}/${this.appDetail
        .avatar}`;
    },
    async appEnableChanged(value) {
      if (!value) {
        try {
          await this.$confirm("应用停用后，该应用在客户端中的消息将被删除", "提示", {
            confirmButtonText: "停用",
            cancelButtonText: "取消",
            type: "warning"
          });

          await this.updateApp(this.appDetail, "已停用", "停用出错");
          this.$router.go() - 1;
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

          await this.updateApp(this.appDetail, "已设置为群应用", "设置为群应用出错");
          this.refreshAppDetail();
        } catch (err) {
          this.$message({
            type: "info",
            message: "已取消操作"
          });
          this.appDetail.useInGroup = false;
        }
      } else {
        await this.updateApp(this.appDetail, "已设置为普通应用", "设置为普通应用出错");
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
    async appIamProductNameChanged(name) {
      this.appDetail.iamProductName = name;
      await this.updateApp(this.appDetail);
      this.refreshAppDetail();
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
</style>
