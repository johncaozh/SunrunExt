<template>
  <div class="flexDiv-h">
    <span v-if="selectedOrgs.length>0&&notEmptyLabel" class="text-font-normal" style="line-height:20px">{{notEmptyLabel}}</span>
    <div class="flexDiv-v " style="flex:1;flex-wrap:wrap">
      <div class="flexDiv-v" v-if="fullPermissionOrgs.length>0" style="margin-bottom:20px">
        <div class="text-font-minor">具有管理权限</div>
        <div class="flexDiv-h" style="flex:1;flex-wrap:wrap;margin-top:10px">
          <div class="flexDiv-h div-org-selected" style="padding:2px;align-items:center" v-for="(item,index) in fullPermissionOrgs" :key="index">
            <i class="el-icon-custom-group icon-org" style="margin-top:3px">
            </i>
            <span style="flex:1" class="contract-name-selected">{{item.name}}</span>
          </div>
        </div>
      </div>
      <div class="flexDiv-v" v-if="viewPermissionOrgs.length>0" style="margin-bottom:20px">
        <div class="text-font-minor">仅具有查看权限</div>
        <div class="flexDiv-h" style="flex:1;flex-wrap:wrap;margin-top:10px">
          <div class="flexDiv-h div-org-selected" style="padding:2px;align-items:center" v-for="(item,index) in viewPermissionOrgs" :key="index">
            <i class="el-icon-custom-group icon-org" style="margin-top:3px">
            </i>
            <span style="flex:1" class="contract-name-selected">{{item.name}}</span>
          </div>
        </div>
      </div>
      <el-button class="button-link" type="text" style="padding:0px;align-self:flex-start" @click="showDialog">{{selectedOrgs.length>0?editLabel:emptyLabel}}</el-button>
    </div>
    <el-dialog :title="emptyLabel" width="600px" :visible.sync="dialogVisible" style="padding:0px">
      <el-tree :render-after-expand="true" ref="tree" :expand-on-click-node="false" :render-content="renderTreeNode" node-key="id" :highlight-current="true" :default-expanded-keys="[-1]" :data="orgs" :props="defaultProps" class="tree customScroll"></el-tree>
      <div slot="footer" class="dialog-footer ">
        <span style="flex:1">
          <el-tooltip class="item" effect="light" content="创建者、超级管理员拥有企业的全局通讯录的管理权限。分级管理员只能管理相应的部分通讯录，并且其发消息等操作只能在其通讯录管理权限下进行。" placement="top-start">
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
      sourceOrgs: null,
      orgArr: [], //一维的组织架构
      orgs: [],
      selectedOrgs: [],
      dialogVisible: false,
      loading: false,
      defaultProps: {
        children: "children",
        label: "name"
      }
    };
  },
  computed: {
    fullPermissionOrgs: function() {
      return this.selectedOrgs.filter(i => i.fullPermission);
    },
    viewPermissionOrgs: function() {
      return this.selectedOrgs.filter(
        i => !i.fullPermission && i.viewPermission
      );
    }
  },
  props: {
    emptyLabel: {
      type: String,
      default: "设置通讯录权限",
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
    permissionOrgs: {
      type: Array,
      default: null,
      required: false
    }
  },
  async mounted() {
    await this.getOrgs();
    this.processOrgs(this.orgs[0]);
    this.getOrgArr(this.orgs[0]);
    this.resetOrgsState();
  },
  watch: {
    permissionOrgs() {
      this.orgArr.forEach(i => {
        i.fullPermission = false;
        i.viewPermission = false;
      });

      this.resetOrgsState();
    }
  },
  methods: {
    resetOrgsState() {
      if (this.permissionOrgs) {
        this.permissionOrgs.forEach(i => {
          var target = this.getTarget(i.id, i.type);
          if (target) {
            if (i.permission == 1) {
              target.fullPermission = false;
              target.viewPermission = true;
            } else if (i.permission == 2) {
              target.fullPermission = true;
              target.viewPermission = true;
            } else {
              target.fullPermission = false;
              target.viewPermission = false;
            }
          }
        });
      }

      this.confirmDialog();
    },
    processOrgs(org) {
      org.fullPermission = false;
      org.viewPermission = false;

      org.children = org.children || [];
      if (org.subOrgs && org.subOrgs.length > 0) {
        org.subOrgs.forEach(i => {
          i.fullPermission = false;
          i.viewPermission = false;
          org.children.push(i);
        });
      }
    },
    async getOrgs() {
      if (this.loading) return;
      this.sourceOrgs = await api.getOrg();
      this.orgs.push(this.sourceOrgs);
      this.loading = false;
    },
    getOrgArr(org) {
      this.orgArr = this.orgArr || [];
      org.subOrgs.forEach(j => {
        this.orgArr.push(j);
        this.getOrgArr(j);
      });
    },
    getTarget(id) {
      var target = this.orgArr.find(i => i.id === id);
      return target;
    },
    async showDialog() {
      this.resetOrgsState();
      this.dialogVisible = true;
    },

    confirmDialog() {
      this.selectedOrgs = this.orgArr.filter(
        i => i.fullPermission || i.viewPermission
      );

      this.selectedOrgs.forEach(j => {
        if (j.fullPermission) j.permission = 2;
        else if (j.viewPermission) j.permission = 1;
      });
      this.dialogVisible = false;
    },

    cancelDialog() {
      this.orgs.forEach(i => {
        i.fullPermission = false;
        i.viewPermission = false;
      });

      this.resetOrgsState();
      this.dialogVisible = false;
    },

    renderTreeNode(h, { node, data, store }) {
      return (
        <span style="flex:1;display:flex;align-items:center;font-size:14px;padding-right:8px;">
          <i
            class="el-icon-custom-group"
            style="color:#3E6A8F;margin-right:5px;font-size:18px"
          />
          <span style="flex:1">{node.label}</span>
          <el-checkbox
            checked={data.viewPermission}
            disabled={data.fullPermission}
            on-change={e => this.viewPermissionChanged(data, node, e)}
          >
            {" "}
            查看
          </el-checkbox>
          <el-checkbox
            on-input={this.sync}
            checked={data.fullPermission}
            on-change={e => this.fullPermissionChanged(data, node, e)}
          >
            {" "}
            管理
          </el-checkbox>
        </span>
      );
    },

    fullPermissionChanged(data, node, e) {
      data.fullPermission = !data.fullPermission;
      data.viewPermission = data.fullPermission;
    },
    viewPermissionChanged(data, node, e) {
      data.viewPermission = !data.viewPermission;
    }
  }
};
</script>

<style lang="less" scoped>
.div-app-container {
  align-items: flex-start;
  justify-content: flex-start;
  flex-wrap: wrap;
}

.div-app {
  border: 1px solid @color-border-level2;
  border-radius: 4px;
  padding: 10px;
  cursor: pointer;
  width: 160px;
  margin-bottom: 10px;
  margin-right: 10px;
  align-items: center;
  position: relative;
}

.div-app:hover {
  border: 1px solid @color-theme;
}

.app-logo {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  margin-right: 10px;
}

.app-logo-selected {
  width: 24px;
  height: 24px;
  border-radius: 2px;
  margin-right: 10px;
}

.div-org-selected {
  border: 1px solid @color-border-level2;
  align-items: center;
  margin-right: 10px;
  margin-bottom: 5px;
}

.app-name {
  font-size: 14px;
  color: @color-theme;
  line-height: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.app-name-selected {
  font-size: 14px;
  color: @color-theme;
  line-height: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 10px;
}

.div-selected {
  background: rgba(0, 0, 0, 0.3);
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0px;
  top: 0px;
  border-radius: 4px;
  border: 1px solid @color-theme;
  display: none;
  justify-content: center;
  align-items: center;
}

.icon-selected {
  color: #008ffa;
  font-size: 32px;
  fill: white;
  z-index: 10;
}

.div-white {
  background: white;
  width: 18px;
  height: 18px;
  align-self: center;
  position: absolute;
}

.tree {
  background: transparent;
  height: 300px;
  overflow-y: auto;
  margin-top: 10px;
}

.div-tempSelectedOrg {
  flex: 1;
  border-left: 1px solid @color-border-level2;
  margin-left: 20px;
  padding-left: 20px;
}

.icon-org {
  color: #3e6a8f;
  margin-right: 5px;
  font-size: 18px;
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
</style>


