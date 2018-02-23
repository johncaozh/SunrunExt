<template>
  <div class="flexDiv-h">
    <span v-if="selectedApps.length>0&&notEmptyLabel" class="text-font-normal" style="line-height:20px">{{notEmptyLabel}}</span>
    <div class="flexDiv-v " style="flex:1;flex-wrap:wrap">
      <div class="flexDiv-v" v-if="fullPermissionApps.length>0" style="margin-bottom:20px">
        <div class="text-font-minor">具有管理权限</div>
        <div class="flexDiv-h" style="flex:1;flex-wrap:wrap;margin-top:10px">
          <div class="flexDiv-h div-app-selected" style="padding:2px;align-items:center" v-for="(item,index) in fullPermissionApps" :key="index">
            <img :src="item.avatar|getMediaLink" class="app-logo" />
            <span style="flex:1" class="contract-name-selected">{{item.name}}</span>
          </div>
        </div>
      </div>
      <div class="flexDiv-v" v-if="sendMessagePermissionApps.length>0" style="margin-bottom:20px">
        <div class="text-font-minor">仅具有发消息权限</div>
        <div class="flexDiv-h" style="flex:1;flex-wrap:wrap;margin-top:10px">
          <div class="flexDiv-h div-app-selected" style="padding:2px;align-items:center" v-for="(item,index) in sendMessagePermissionApps" :key="index">
            <img :src="item.avatar|getMediaLink" class="app-logo" />
            <span style="flex:1" class="contract-name-selected">{{item.name}}</span>
          </div>
        </div>
      </div>
      <el-button class="button-link" type="text" style="padding:0px;align-self:flex-start" @click="showDialog">{{selectedApps.length>0?editLabel:emptyLabel}}</el-button>
    </div>
    <el-dialog :title="emptyLabel" width="600px" :visible.sync="dialogVisible" style="padding:0px;">
      <div class="flexDiv-v customScroll">
        <div class="flexDiv-h div-app" v-for="(item,index) in apps" :key="index">
          <img :src="item.avatar|getMediaLink" class="app-logo" />
          <span class="app-name" style="flex:1">{{item.name}}</span>
          <el-checkbox :disabled="item.fullPermission" v-model="item.sendMessagePermission">发消息</el-checkbox>
          <el-checkbox v-model="item.fullPermission" @change="fullPermissionChanged(item)">管理</el-checkbox>
        </div>
      </div>
      <div slot="footer" class="dialog-footer ">
        <span style="flex:1">
          <el-tooltip class="item" effect="light" content="分为发消息权限和管理权限。拥有管理权限默认则拥有发消息权限。创建者、超级管理员拥有企业全部应用的管理权限。分级管理员可细化分配应用的发消息或管理权限。" placement="top-start">
            <i class="el-icon-question text-font-normal" />
          </el-tooltip>
        </span>
        <el-button @click="cancelDialog" size="small">取消</el-button>
        <el-button type="primary" size="small" @click="confirmDialog">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from "../../utility/api";
export default {
  data() {
    return {
      dialogVisible: false,
      loading: false,
      apps: [],
      selectedApps: []
    };
  },
  computed: {
    fullPermissionApps() {
      return this.selectedApps.filter(i => i.fullPermission);
    },
    sendMessagePermissionApps() {
      return this.selectedApps.filter(
        i => !i.fullPermission && i.sendMessagePermission
      );
    }
  },
  props: {
    emptyLabel: {
      type: String,
      default: "设置应用权限",
      required: false
    },
    notEmptyLabel: {
      type: String,
      default: "",
      required: false
    },
    editLabel: {
      type: String,
      default: "编辑",
      required: false
    },
    permissionApps: {
      type: Array,
      default: null,
      required: false
    }
  },
  async mounted() {
    await this.getApps();
    this.resetAppsState();
  },
  watch: {
    permissionApps() {
      this.apps.forEach(i => {
        i.fullPermission = false;
        i.sendMessagePermission = false;
      });
      this.resetAppsState();
    }
  },
  methods: {
    fullPermissionChanged(item) {
      item.sendMessagePermission = item.fullPermission;
    },
    resetAppsState() {
      if (this.permissionApps) {
        this.permissionApps.forEach(i => {
          var target = this.getTargetApp(i._id);
          if (target) {
            if (i.permission == 1) {
              target.fullPermission = false;
              target.sendMessagePermission = true;
            } else if (i.permission == 2) {
              target.fullPermission = true;
              target.sendMessagePermission = true;
            } else {
              target.fullPermission = false;
              target.sendMessagePermission = false;
            }
          }
        });
      }

      this.confirmDialog();
    },
    getTargetApp(id) {
      return this.apps.find(i => i._id === id);
    },

    async getApps() {
      if (this.loading) return;
      var apps = await api.getApps();
      apps.forEach(i => {
        i.sendMessagePermission = false;
        i.fullPermission = false;
      });

      this.apps = apps;
      this.loading = false;
    },
    async showDialog() {
      this.resetAppsState();
      this.dialogVisible = true;
    },

    confirmDialog() {
      this.selectedApps = this.apps.filter(
        i => i.fullPermission || i.sendMessagePermission
      );

      this.selectedApps.forEach(j => {
        if (j.fullPermission) j.permission = 2;
        else if (j.sendMessagePermission) j.permission = 1;
      });

      this.dialogVisible = false;
    },

    cancelDialog() {
      this.apps.forEach(i => {
        i.fullPermission = false;
        i.sendMessagePermission = false;
      });
      this.resetAppsState();
      this.dialogVisible = false;
    }
  }
};
</script>

<style lang="less" scoped>
.app-logo {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  margin-right: 10px;
}

.app-name {
  font-size: 14px;
  color: @color-theme;
  line-height: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.div-white {
  background: white;
  width: 18px;
  height: 18px;
  align-self: center;
  position: absolute;
}

.dialog-footer {
  border-top: 1px solid @color-border-level2;
  padding-top: 15px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  text-align: left;
}

.contract-name-selected {
  font-size: 14px;
  min-width: 30px;
  max-width: 60px;
  color: @color-theme;
  line-height: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 10px;
}

.app-logo {
  width: 24px;
  height: 24px;
  border-radius: 3px;
  margin-right: 10px;
}
.app-name {
  font-size: 14px;
  line-height: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.div-app-selected {
  border: 1px solid @color-border-level2;
  align-items: center;
  margin-right: 10px;
  margin-bottom: 5px;
}

.div-app {
  align-items: center;
  border-bottom: 1px solid @color-border-level2;
  padding: 10px;
}

.div-app:last-child {
  border-bottom: 0px;
}

.div-app:hover {
  background: @color-border-level2;
}
</style>


