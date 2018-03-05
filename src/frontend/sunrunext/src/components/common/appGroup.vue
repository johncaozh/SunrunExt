<template>
  <div class="flexDiv-v">
    <div class="flexDiv-v" style="flex:1">
      <div class="div-title">应用分组</div>
      <div class="flexDiv-h div-addGroup" style="margin-bottom:20px" @click="createGroup">
        <i class="el-icon-plus icon-operate" style="margin-right:5px" /> 添加分组
      </div>
      <div class="flexDiv-v div-group" :class="{ 'div-group-grid': appsLayoutMode==2 }" v-for="(item,index) in processGroups" :key="index">
        <div class="flexDiv-h div-group-header">
          <div class="text-font-minor">{{item.name}}</div>
          <tooltip text="未分组的应用，以及往后新添加的应用，在客户端将默认显示在“其他应用”此分组下" style="margin-left:5px" v-show="item.name=='其他应用'" />
          <i class="el-icon-edit-outline icon-operate" style="flex:1;text-align:right" v-show="item.name!='其他应用'" @click="editGroup(item)">
          </i>
          <i class="el-icon-close icon-operate" style="margin-left:10px" v-show="item.name!='其他应用'" @click="removeGroup(item)">
          </i>
        </div>
        <div class="flexDiv-v" v-if="item.apps.length>0" :class="{'div-apps-container-grid':appsLayoutMode==2}">
          <div v-for="(app,appIndex) in item.apps" :key="appIndex" class="flexDiv-h div-app" :class="{ 'div-app-grid': appsLayoutMode==2 }">
            <img :src="app.avatar|getMediaLink" class="app-logo" :class="{'img-app-icon-grid':appsLayoutMode==2}" />
            <span class="app-name">{{app.name}}</span>
          </div>
        </div>
        <div class="text-font-normal" style="align-self:center;justify-self:center;padding:10px" v-else>该分组下无应用</div>
      </div>
    </div>
    <div class="flexDiv-h div-bottom-operate ">
      <el-popover ref="preview" placement="bottom-start" trigger="click">
        <iphone>
          <div class="flexDiv-v" style="height:100%">
            <div class="div-title-iphone">工作台</div>
            <div class="customScroll div-group-container-iphone">
              <div class="flexDiv-v div-group-iphone" v-for="(item,index) in processGroups" :key="index" v-if="item.apps.length>0" :class="{ 'div-group-iphone-grid': appsLayoutMode==2 }">
                <div class="flexDiv-h div-group-header-iphone text-font-minor" :class="{'div-group-header-iphone-grid ':appsLayoutMode==2}">
                  {{item.name}}
                </div>
                <div class="flexDiv-v" :class="{'div-apps-container-grid':appsLayoutMode==2}">
                  <div v-for="(app,appIndex) in item.apps" :key="appIndex" class="flexDiv-h div-app-iphone" :class="{ 'div-app-iphone-grid': appsLayoutMode==2 }" :style="{padding:appsLayoutMode==1?'10px':'0px'}">
                    <img :src="app.avatar|getMediaLink" class="app-logo" :class="{'img-app-icon-iphone-grid':appsLayoutMode==2}" />
                    <span :class="{'div-app-name-iphone-grid':appsLayoutMode==2,'app-name':appsLayoutMode==1}">{{app.name}}</span>
                  </div>
                </div>
              </div>
            </div>
            <span class="item-icon" style="background-position: -120px -275px;width: 220px;height: 32px;background-size: 900px 880px;">
            </span>
          </div>
        </iphone>
      </el-popover>
      <el-button size="small" @click="$router.go(-1)">取消</el-button>
      <el-button size="small" v-popover:preview>预览</el-button>
      <el-button size="small" type="primary" @click="save">保存</el-button>
    </div>
    <el-dialog :title="editingGroup?'编辑分组':'添加分组'" width="600px" :visible.sync="dialogVisible" style="padding:0px">
      <div class="flexDiv-h ">
        <div class="flexDiv-v">
          <div class="flexDiv-v div-group-dialog " v-for="(item,index) in processGroups" :key="index" v-if="item!=editingGroup">
            <div class="flexDiv-h div-group-header-dialog text-font-normal">
              {{item.name}}
            </div>
            <div class="flexDiv-v">
              <div v-for="(app,appIndex) in item.apps" :key="appIndex" class="flexDiv-h div-app-dialog" @click="clickApp(app,item)">
                <img :src="app.avatar|getMediaLink" class="app-logo" />
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
              <img :src="app.avatar|getMediaLink" class="app-logo" />
              <span class="app-name" style="flex:1">{{app.name}}</span>
              <i class="el-icon-close icon-operate" @click="removeApp(app)" />
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer ">
        <el-button @click="cancel" size="small">取消</el-button>
        <el-button type="primary" size="small" @click="confirm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from "../../utility/api";
import helper from "../../utility/helper";
import tooltip from "./tooltip";
import iphone from "./iphone";
export default {
  data() {
    return {
      appsLayoutMode: "1",
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
    tooltip,
    iphone
  },
  computed: {},
  props: {},
  async mounted() {
    if (this.$route.query.appsLayoutMode)
      this.appsLayoutMode = this.$route.query.appsLayoutMode;

    await this.getData();
  },
  watch: {},
  methods: {
    async getData() {
      this.sourceGroups = await api.getAppGroups();
      this.sourceApps = await api.getApps();
      this.processGroups = await api.getAppGroups();
      this.processApps = await api.getApps();

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
      app.groupId = this.editingGroup ? this.editingGroup._id : null;
      this.selectedApps.push(app);
      group.apps.removeByValue(app);
    },
    removeApp(app) {
      this.selectedApps.removeByValue(app);
      if (app.sourceGroup) {
        app.groupId = app.sourceGroup._id;
        app.sourceGroup.apps.push(app);
      } else {
        var defaultGroup = this.getDefaultGroup();
        app.groupId = null;
        defaultGroup.apps.push(app);
      }
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
    },

    cancel() {
      this.selectedApps.forEach(app => {
        if (app.sourceGroup) {
          app.groupId = app.sourceGroup._id;
          app.sourceGroup.apps.push(app);
        }
      });

      this.dialogVisible = false;
    },

    async save() {
      var promissArr = [];
      var addGroups = this.processGroups.filter(
        i => !i._id && i.name != "其他应用"
      );
      var updateGroups = this.processGroups.filter(i => {
        var sourceGroup = this.sourceGroups.find(j => j._id == i._id);

        if (sourceGroup == null) return false;
        return sourceGroup.name != i.name;
      });

      var deleteGroups = this.sourceGroups.filter(
        i => this.processGroups.find(j => j._id == i._id) == null
      );

      for (let i = 0; i < addGroups.length; i++) {
        promissArr.push(
          new Promise(async (resolve, reject) => {
            var group = addGroups[i];
            var result = await api.createAppGroup({
              name: group.name
            });

            group.apps.forEach(j => (j.groupId = result._id));
            resolve(result);
          })
        );
      }

      for (let i = 0; i < updateGroups.length; i++) {
        promissArr.push(
          new Promise(async (resolve, reject) => {
            var group = updateGroups[i];
            var result = await api.updateAppGroup(group._id, {
              name: group.name
            });

            resolve(result);
          })
        );
      }

      for (let i = 0; i < deleteGroups.length; i++) {
        promissArr.push(
          new Promise(async (resolve, reject) => {
            var group = deleteGroups[i];
            var result = await api.deleteAppGroup(group._id);
            resolve(result);
          })
        );
      }

      await Promise.all(promissArr);
      promissArr = [];

      var updateApps = this.processApps.filter(i => {
        var sourceApp = this.sourceApps.find(j => j._id == i._id);
        return sourceApp != null && sourceApp.groupId != i.groupId;
      });

      for (let i = 0; i < updateApps.length; i++) {
        promissArr.push(
          new Promise(async (resolve, reject) => {
            var app = updateApps[i];
            var result = await api.updateApp(app._id, {
              groupId: app.groupId
            });

            resolve(result);
          })
        );
      }

      await Promise.all(promissArr);

      this.$message({
        message: "保存成功",
        type: "success"
      });
    },

    removeGroup(group) {
      var prompt = `删除后，“${
        group.name
      }”分组下的应用将移至“其他应用”，你可重新进行分组。,`;
      this.$confirm(prompt, "提示", {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          this.processGroups.removeByValue(group);
          var defaultGroup = this.getDefaultGroup();
          group.apps.forEach(i => {
            i.groupId = null;
            defaultGroup.apps.push(i);
          });

          group.apps = [];
        })
        .catch(err => {});
    },

    getDefaultGroup() {
      return this.processGroups.find(i => i.name == "其他应用");
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

.div-group-grid {
  background: #f9f9fa;
}

.div-group:last-child {
  margin-bottom: 0px;
}

.div-group-header {
  padding: 4px;
  padding-left: 10px;
  background: #f9f9fa;
  align-items: center;
}

.div-group-header-dialog {
  padding: 5px;
  padding-left: 10px;
  align-items: center;
}

.div-group-header-iphone {
  padding: 5px;
  padding-left: 10px;
  align-items: center;
  background: #f9f9fa;
}

.div-group-header-iphone-grid {
  border-bottom: 1px solid #e4e6e9;
}

.div-group-dialog {
  width: 300px;
  border-bottom: 1px solid @color-border-level2;
}

.div-group-iphone-grid {
  background: white;
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

.div-app-grid {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: white;
  margin-left: 5px;
  margin-bottom: 5px;
  padding: 0px;
  width: 84px;
  height: 80px;
}

.div-app-iphone-grid {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: white;
  padding: 0px;
  position: relative;
  width: calc(~"25% - 1px");
  height: 64px;
  border-right: 1px solid #e4e6e9;
  border-bottom: 1px solid #e4e6e9;
}

.div-app-dialog {
  align-items: center;
  padding: 10px;
  cursor: pointer;
}

.div-app-iphone {
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

.div-title-iphone {
  background: @color-theme;
  color: white;
  text-align: center;
  padding: 7px;
}

.div-apps-container-grid {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
}

.img-app-icon-grid {
  width: 30px;
  height: 30px;
  margin-right: 0px;
  margin-bottom: 10px;
}

.img-app-icon-iphone-grid {
  width: 24px;
  height: 24px;
  margin-right: 0px;
}

.div-app-name-iphone-grid {
  -webkit-text-size-adjust: none;
  font-size: 12px;
  color: black;
  width: 90%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  -webkit-transform: scale(0.8);
}

.div-group-container-iphone {
  height: 325px;
  overflow-y: auto;
  overflow-x: hidden;
  padding-bottom: 10px;
}
</style>
