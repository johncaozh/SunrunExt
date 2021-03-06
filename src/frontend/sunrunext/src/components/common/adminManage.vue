<template>
  <div class="flexDiv-h">
    <div class="flexDiv-v div-leftSide">
      <el-button size="small" @click="openCreateDialog" type="primary" style="margin:20px" :disabled="!selectedOrg">新建管理组</el-button>
      <el-tree ref="tree" :default-expand-all="true" :expand-on-click-node="false" :render-content="renderTreaNode" node-key="_id" :highlight-current="true" @current-change="selectedNodeClick" :data="orgs" :props="defaultProps" class="tree customScroll"></el-tree>
      <el-dialog width="400px" title="新建管理组" :visible.sync="dialogVisible">
        <el-form :model="form" ref="form">
          <el-form-item label="管理组名称" prop="name" :rules="[{ required: true, message: '管理组名称不能为空'},{ max:32, message: '管理组名不能超过32个字'}]">
            <el-input v-model="form.name" size="small" placeholder="请输入管理组名称" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer ">
          <el-button @click="dialogVisible=false" size="small">取消</el-button>
          <el-button type="primary" @click="craeteManagerGroup" size="small">创建</el-button>
        </div>
      </el-dialog>
    </div>
    <div style="flex:1" class="flexDiv-v">
      <div class="flexDiv-v" v-if="selectedOrg" style="flex:1">
        <div class="flexDiv-h editItemContainer">
          <span class="text-font-normal item-header">管理组名称</span>
          <input class="input-borderless" v-model="editingManagerGroup.name" type="text" placeholder="在此输入管理组名称" :readonly="!selectedOrg.parentId" />
        </div>
        <div class="flexDiv-h editItemContainer" v-if="editingManagerGroup.source">
          <span class="text-font-normal item-header">管理组成员</span>
          <div class="flexDiv-v" style="flex:1">
            <contract-selector emptyLabel="添加" notEmptyLabel="" ref="userSelector" :preSelectedOrgs="editingManagerGroup.selectedUsers" />
          </div>
        </div>
        <div class="flexDiv-h editItemContainer">
          <span class="text-font-normal item-header">通讯录权限</span>
          <manage-group style="flex:1" ref="manageGroup" :permissionOrgs="editingManagerGroup.selectedOrgs" />
        </div>
        <div class="flexDiv-h editItemContainer">
          <span class="text-font-normal item-header">应用权限</span>
          <manage-app style="flex:1" ref="manageApp" :permissionApps="editingManagerGroup.selectedApps" />
        </div>
        <div class="flexDiv-h" style="flex:1;align-items:flex-end;margin-bottom:20px;margin-top:20px">
          <el-button size="small" type="warning" @click="deleteMnagerGroup">删除</el-button>
          <el-button size="small" type="primary" @click="save">保存</el-button>
        </div>
      </div>
      <div v-else>
        请选择管理组
      </div>
    </div>
  </div>
</template>
<script>
import contractSelector from "./contractSelector";
import api from "../../utility/api";
import appSSOVue from "./appSSO.vue";
import manageGroup from "./manageGroup";
import manageApp from "./manageApp";
export default {
  data() {
    return {
      sourceOrgs: [],
      orgs: [],
      defaultProps: {
        children: "children",
        label: "name"
      },
      selectedOrg: null,
      dialogVisible: false,
      form: {
        name: ""
      },

      editingManagerGroup: {
        source: null,
        selectedUsers: [],
        selectedOrgs: [],
        selectedApps: [],
        name: ""
      }
    };
  },
  components: {
    contractSelector,
    manageGroup,
    manageApp
  },
  async mounted() {
    await this.refreshOrgs();
    this.setSelectedOrg(this.orgs[0]._id);
  },
  watch: {
    async selectedOrg() {
      this.editingManagerGroup.name = this.selectedOrg.name;
      this.editingManagerGroup.source = await api.getManagerGroupDetail(
        this.selectedOrg._id
      );

      this.editingManagerGroup.selectedOrgs = this.editingManagerGroup.source.orgs.map(
        i => i.detail
      );

      this.editingManagerGroup.selectedApps = this.editingManagerGroup.source.apps.map(
        i => i.detail
      );

      this.editingManagerGroup.selectedUsers = this.editingManagerGroup.source.users.map(
        i => i.detail
      );
    }
  },
  methods: {
    async refreshOrgs() {
      this.orgs = [];
      this.sourceOrgs = await api.getManagerGroups();
      var superGroup = this.sourceOrgs.find(i => i.parentId == null);
      if (superGroup) {
        this.processOrg(superGroup);
        this.orgs.push(superGroup);
      }
    },
    processOrg(org) {
      var childrenOrgs = this.sourceOrgs.filter(i => i.parentId == org._id);
      childrenOrgs.forEach(i => this.processOrg(i));
      org.children = childrenOrgs;
      return org;
    },
    renderTreaNode(h, { node, data, store }) {
      return (
        <span style="flex:1;display:flex;align-items:center;font-size:14px;padding-right:8px;">
          <i
            class="el-icon-custom-groupPeople"
            style="color:#3E6A8F;margin-right:5px;font-size:18px"
          />
          <span style="max-">{node.label}</span>
        </span>
      );
    },
    async selectedNodeClick(data, node) {
      this.selectedOrg = data;
    },

    openCreateDialog() {
      this.form.name = "";
      this.dialogVisible = true;
    },

    async craeteManagerGroup() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          this.dialogVisible = false;
          var postData = {
            parentId: this.selectedOrg._id,
            name: this.form.name
          };

          var result = await api.createManagerGroup(postData);
          if (result) {
            this.$message({
              type: "success",
              message: "创建成功"
            });
          }

          await this.refreshOrgs();
          this.setSelectedOrg(result._id);
        } else {
          return false;
        }
      });
    },

    getOrgById(id) {
      return this.sourceOrgs.find(i => i._id === id);
    },

    deleteMnagerGroup() {
      if (this.selectedOrg.parentId == null) {
        this.$message.error("禁止删除超级管理组");
        return;
      }

      this.$confirm(
        "删除管理组后将不可恢复，请谨慎操作。确定继续删除？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(async () => {
          var parentId = this.selectedOrg.parentId;
          var result = await api.deleteManagerGroup(this.selectedOrg._id);

          if (result) {
            this.$message({
              type: "success",
              message: "删除成功"
            });
          }

          await this.refreshOrgs();
          var parentNode = this.getOrgById(parentId);
          this.$refs.tree.setCurrentNode(parentNode);
        })
        .catch(err => {});
    },

    async save() {
      await this.saveAdminUsersConfig();
      await this.saveOrgsConfig();
      await this.saveAppsConfig();
      await this.saveAdminGroupName();
      await this.refreshOrgs();
      this.setSelectedOrg(this.selectedOrg._id);

      this.$message({
        type: "success",
        message: "更新成功"
      });
    },

    async saveAdminGroupName() {
      if (this.selectedOrg.name !== this.editingManagerGroup.name) {
        var data = {
          name: this.editingManagerGroup.name
        };
        await api.updateManagerGroup(this.selectedOrg._id, data);
      }
    },

    //管理组成员设置
    async saveAdminUsersConfig() {
      var promiseArr = [];
      var selectedUsers = this.$refs.userSelector.selectedUserIds;

      var addUsers = selectedUsers.filter(
        i =>
          this.editingManagerGroup.source.users.find(j => j.detail.id == i) ==
          null
      );

      var deleteUsers = this.editingManagerGroup.source.users.filter(
        i => selectedUsers.find(j => j == i.detail.id) == null
      );

      for (let i = 0; i < addUsers.length; i++) {
        promiseArr.push(
          new Promise(async (resolve, reject) => {
            var result = await api.createManagerGroupUser({
              userId: addUsers[i],
              groupId: this.selectedOrg._id
            });
            resolve(result);
          })
        );
      }

      for (let i = 0; i < deleteUsers.length; i++) {
        promiseArr.push(
          new Promise(async (resolve, reject) => {
            var result = await api.deleteManagerGroupUser(deleteUsers[i]._id);
            resolve(result);
          })
        );
      }
      if (promiseArr.length > 0) await Promise.all(promiseArr);
    },

    //保存通讯录权限设置
    async saveOrgsConfig() {
      var promiseArr = [];
      var selectedOrgs = this.$refs.manageGroup.selectedOrgs;
      var addOrgs = selectedOrgs.filter(
        i =>
          this.editingManagerGroup.source.orgs.find(j => j.detail.id == i.id) ==
          null
      );

      var deleteOrgs = this.editingManagerGroup.source.orgs.filter(
        i => selectedOrgs.find(j => j.id == i.detail.id) == null
      );

      var updateOrgs = this.editingManagerGroup.source.orgs.filter(i => {
        var target = selectedOrgs.find(
          j => j.id == i.detail.id && j.permission != i.detail.permission
        );

        if (target != null) {
          i.permission = target.permission;
        }

        return target != null;
      });

      for (let i = 0; i < addOrgs.length; i++) {
        promiseArr.push(
          new Promise(async (resolve, reject) => {
            var result = await api.createManagerGroupOrg({
              orgId: addOrgs[i].id,
              groupId: this.selectedOrg._id,
              permission: addOrgs[i].permission
            });

            resolve(result);
          })
        );
      }

      for (let i = 0; i < deleteOrgs.length; i++) {
        promiseArr.push(
          new Promise(async (resolve, reject) => {
            var result = await api.deleteManagerGroupOrg(deleteOrgs[i]._id);
            resolve(result);
          })
        );
      }

      for (let i = 0; i < updateOrgs.length; i++) {
        promiseArr.push(
          new Promise(async (resolve, reject) => {
            var result = await api.updateManagerGroupOrg(updateOrgs[i]._id, {
              permission: updateOrgs[i].permission
            });

            resolve(result);
          })
        );
      }

      if (promiseArr.length > 0) await Promise.all(promiseArr);
    },

    async saveAppsConfig() {
      var promiseArr = [];
      var selectedApps = this.$refs.manageApp.selectedApps;
      var addApps = selectedApps.filter(
        i =>
          this.editingManagerGroup.source.apps.find(
            j => j.detail._id == i._id
          ) == null
      );

      var deleteApps = this.editingManagerGroup.source.apps.filter(
        i => selectedApps.find(j => j._id == i.detail._id) == null
      );

      var updateApps = this.editingManagerGroup.source.apps.filter(i => {
        var target = selectedApps.find(
          j => j._id == i.detail._id && j.permission != i.detail.permission
        );

        if (target != null) {
          i.permission = target.permission;
        }

        return target != null;
      });

      for (let i = 0; i < addApps.length; i++) {
        promiseArr.push(
          new Promise(async (resolve, reject) => {
            var result = await api.createManagerGroupApp({
              appId: addApps[i]._id,
              groupId: this.selectedOrg._id,
              permission: addApps[i].permission
            });

            resolve(result);
          })
        );
      }

      for (let i = 0; i < deleteApps.length; i++) {
        promiseArr.push(
          new Promise(async (resolve, reject) => {
            var result = await api.deleteManagerGroupApp(deleteApps[i]._id);
            resolve(result);
          })
        );
      }

      for (let i = 0; i < updateApps.length; i++) {
        promiseArr.push(
          new Promise(async (resolve, reject) => {
            var result = await api.updateManagerGroupApp(updateApps[i]._id, {
              permission: updateApps[i].permission
            });

            resolve(result);
          })
        );
      }

      if (promiseArr.length > 0) await Promise.all(promiseArr);
    },

    setSelectedOrg(id) {
      var target = this.getOrgById(id);
      if (target != null) {
        this.selectedOrg = target;
        this.$refs.tree.setCurrentNode(target);
      }
    }
  }
};
</script>
<style lang="less" scoped>
.div-leftSide {
  width: 240px;
  margin-left: -20px;
  margin-right: 20px;
  border-right: 1px dotted @color-border-level2;
}

.item-header {
  font-size: 13px;
  width: 120px;
}

.input-borderless {
  padding: 0px;
}
</style>
