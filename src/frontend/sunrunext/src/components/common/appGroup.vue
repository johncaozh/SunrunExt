<template>
  <div class="flexDiv-v">
    <div class="flexDiv-v" style="flex:1">
      <div class="div-title">应用分组</div>
      <div class="flexDiv-h div-addGroup" style="margin-bottom:20px" @click="createGroup">
        <i class="el-icon-plus icon-operate" style="margin-right:5px" /> 添加分组
      </div>
      <div class="flexDiv-v div-group" v-for="(item,index) in processGroups" :key="index">
        <div class="flexDiv-h div-group-header">
          <div class="text-font-normal">{{item.name}}</div>
          <tooltip text="未分组的应用，以及往后新添加的应用，在客户端将默认显示在“其他应用”此分组下" style="margin-left:5px" v-show="item.name=='其他应用'" />
          <i class="el-icon-edit-outline icon-operate" style="flex:1;text-align:right" v-show="item.name!='其他应用'" @click="editGroup(item)">
          </i>
          <i class="el-icon-close icon-operate" style="margin-left:10px" v-show="item.name!='其他应用'">
          </i>
        </div>
        <div class="flexDiv-v" v-if="item.apps.length>0">
          <div v-for="(app,appIndex) in item.apps" :key="appIndex" class="flexDiv-h div-app">
            <img v-lazy="app.logoUrl" class="app-logo" />
            <span class="app-name" style="flex:1">{{app.name}}</span>
          </div>
        </div>
        <div class="text-font-normal" style="align-self:center;justify-self:center;padding:10px" v-else>该分组下无应用</div>
      </div>
    </div>
    <div class="flexDiv-h div-bottom-operate ">
      <el-button size="small">取消</el-button>
      <el-button size="small">预览</el-button>
      <el-button size="small" type="primary">保存</el-button>
    </div>
    <el-dialog :title="editingGroup?'编辑分组':'添加分组'" width="600px" :visible.sync="dialogVisible" style="padding:0px">
      <div class="flexDiv-h ">
        <div class="flexDiv-v">
          <div class="flexDiv-v div-group-dialog" v-for="(item,index) in processGroups" :key="index" v-if="item!=editingGroup">
            <div class="flexDiv-h div-group-header-dialog text-font-normal">
              {{item.name}}
            </div>
            <div class="flexDiv-v">
              <div v-for="(app,appIndex) in item.apps" :key="appIndex" class="flexDiv-h div-app-dialog" @click="clickApp(app,item)">
                <img v-lazy="app.logoUrl" class="app-logo" />
                <span class="app-name" style="flex:1">{{app.name}}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="flexDiv-v div-selectedApps-container">
          <div class="text-font-minor" style="margin-top:5px">
            分组名称
          </div>
          <el-input size="small" v-model="editingGroupName" placeholder="选填" style="margin-top:3px;margin-bottom:12px;" />
          <div class="text-font-minor" style="margin-top:3px;">
            已选应用
          </div>
          <div class="flexDiv-v">
            <div v-for="(app,index) in selectedApps" :key="index" class="flexDiv-h div-app-dialog-selected ">
              <img v-lazy="app.logoUrl" class="app-logo" />
              <span class="app-name" style="flex:1">{{app.name}}</span>
              <i class="el-icon-close icon-operate" @click="removeApp(app)" />
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer ">
        <el-button @click="dialogVisible=false" size="small">取消</el-button>
        <el-button type="primary" size="small" @click="confirm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from "../../utility/api";
import helper from "../../utility/helper";
import appSSOVue from "./appSSO.vue";
import tooltip from "./tooltip";
export default {
  data() {
    return {
      dialogVisible: false,
      loading: false,
      sourceApps: [],
      sourceGroups: [],
      processApps: [],
      processGroups: [],
      editingGroup: null,
      selectedApps: [],
      editingGroupName: null
    };
  },
  components: {
    tooltip
  },
  computed: {},
  props: {},
  async mounted() {
    await this.getData();
  },
  watch: {},
  methods: {
    async getData() {
      this.sourceGroups = await api.getAppGroups();
      this.sourceApps = await api.getApps();
      this.processGroups = await api.getAppGroups();
      this.processApps = await api.getApps();

      this.sourceApps.forEach(i => {
        i.logoUrl = `${api.fileTransferUrl}/${i.avatar}`;
      });

      this.processApps.forEach(i => {
        i.logoUrl = `${api.fileTransferUrl}/${i.avatar}`;
      });

      this.processGroups.forEach(i => {
        i.apps = this.processApps.filter(j => j.groupId === i._id);
      });

      var appsNotInGroups = this.processApps.filter(
        j => j.groupId == null || j.groupId == undefined
      );

      if (appsNotInGroups.length > 0) {
        this.processGroups.push({
          name: "其他应用",
          apps: appsNotInGroups
        });
      }
    },
    createGroup() {
      this.editingGroup = null;
      this.selectedApps = [];
      this.editingGroupName = null;
      this.dialogVisible = true;
    },
    editGroup(group) {
      this.editingGroup = group;
      this.editingGroupName = group.name;
      this.selectedApps = [];
      group.apps.forEach(i => {
        this.selectedApps.push(i);
      });
      this.dialogVisible = true;
    },
    clickApp(app, group) {
      app.sourceGroup = group;
      this.selectedApps.push(app);
      group.apps.removeByValue(app);
    },
    removeApp(app) {
      this.selectedApps.removeByValue(app);
      if (app.sourceGroup) app.sourceGroup.apps.push(app);
    },

    confirm() {
      if (this.editingGroupName == null) {
        this.$message.error("分组名称不能为空");
        return;
      }

      if (this.editingGroupName == "其他应用") {
        this.$message.error("分组名称不能设置为 其他应用");
        return;
      }

      if (this.editingGroup) {
        this.editingGroup.name = this.editingGroupName;
        this.editingGroup.apps = this.selectedApps;
      } else {
        this.processGroups.splice(0, 0, {
          name: this.editingGroupName,
          apps: this.selectedApps
        });
      }

      this.dialogVisible = false;
    }
  }
};
</script>

<style lang="less" scoped>
.div-title {
  padding-top: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid @color-border-level2;
}
.div-bottom-operate {
  border-top: 1px solid @color-border-level2;
  padding-top: 20px;
  padding-bottom: 20px;
  margin-top: 20px;
}

.div-addGroup {
  border: 1px solid @color-border-level2;
  width: 360px;
  height: 40px;
  align-items: center;
  justify-content: center;
  color: @color-theme;
  font-size: 13px;
  cursor: pointer;
  margin-top: 20px;
}

.div-addGroup:hover {
  border: 1px solid @color-theme;
}

.div-group {
  width: 360px;
  border: 1px solid @color-border-level2;
  margin-bottom: 20px;
}

.div-group:last-child {
  margin-bottom: 0px;
}

.div-group-header {
  padding: 5px;
  padding-left: 10px;
  background: #f9f9fa;
  align-items: center;
}

.div-group-header-dialog {
  padding: 5px;
  padding-left: 10px;
  align-items: center;
}

.div-group-dialog {
  width: 300px;
  border-bottom: 1px solid @color-border-level2;
}

.div-group-dialog:last-child {
  border-bottom: 0px;
}

.icon-operate {
  cursor: pointer;
  font-size: 16px;
}

.div-app {
  align-items: center;
  padding: 10px;
}

.div-app-dialog {
  align-items: center;
  padding: 10px;
  cursor: pointer;
}

.div-app-dialog-selected {
  align-items: center;
  padding-top: 10px;
  padding-bottom: 10px;
}

.div-app-dialog:hover {
  background: @color-border-level1;
}

.app-logo {
  width: 20px;
  height: 20px;
  border-radius: 2px;
  margin-right: 10px;
}

.app-name {
  font-size: 13px;
  line-height: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.div-selectedApps-container {
  border-left: 1px solid @color-border-level2;
  margin-left: 20px;
  padding-left: 20px;
  flex: 1;
}
</style>


