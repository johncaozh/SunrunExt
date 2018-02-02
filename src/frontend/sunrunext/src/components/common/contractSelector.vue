<template>
  <div style="align-items:flex-start" :class="{'flexDiv-v':direction=='v','flexDiv-h':direction=='h'}">
    <span v-if="selectedOrgs.length>0&&notEmptyLabel" class="text-font-normal" style="line-height:20px">{{notEmptyLabel}}</span>
    <div class="flexDiv-h " style="flex:1;flex-wrap:wrap">
      <div class="flexDiv-h div-org-selected" style="padding:2px;align-items:center" v-for="(item,index) in selectedOrgs" :key="index">
        <i class="el-icon-custom-group icon-org" v-show="item.type=='org'" style="margin-top:3px">
        </i>
        <i class="el-icon-custom-people icon-org" v-show="item.type=='user'" style="margin-top:3px">
        </i>
        <span style="flex:1" class="contract-name-selected">{{item.name}}</span>
        <i class="el-icon-close" style="font-size:14px;cursor:pointer;" @click="removeOrgFromSelectedOrgs(item)" />
      </div>
      <el-button class="button-link" type="text" style="padding:0px" @click="showDialog">{{selectedOrgs.length>0?editLabel:emptyLabel}}</el-button>
    </div>
    <el-dialog :title="emptyLabel" width="600px" :visible.sync="dialogVisible" style="padding:0px">
      <div class="flexDiv-h ">
        <div class="flexDiv-v">
          <el-input :disabled="selectAllOrgs" placeholder="搜索成员、部门" prefix-icon="el-icon-search" size="mini" v-model="filterText">
          </el-input>
          <el-tree :disabled="selectAllOrgs" :filter-node-method="filterNode" ref="tree" :expand-on-click-node="false" :render-content="renderTreaNode" node-key="id" :highlight-current="true" @node-click="nodeClick" :default-expanded-keys="[0]" :data="orgs" :props="defaultProps" class="tree customScroll"></el-tree>
        </div>
        <div class="flexDiv-v div-tempSelectedOrg">
          <div class="text-font-normal" style="margin-top:3px;margin-bottom:12px">
            已选择部分或成员
          </div>
          <div style="height:400px;overflow-y:auto" class="customScroll">
            <div v-for="(item,index) in tempSelectedOrgs" :style="{opacity:item.disabled?0.3:1}" :key="index" style="align-items:center;margin-bottom:3px;" class="flexDiv-h">
              <i class="el-icon-custom-group icon-org" v-show="item.type=='org'">
              </i>
              <i class="el-icon-custom-people icon-org" v-show="item.type=='user'">
              </i>
              <span style="flex:1">{{item.name}}</span>
              <i class="el-icon-close" style="font-size:16px;cursor:pointer" :style="{cursor:item.disabled?'none':'pointer'}" @click="removeOrg(item)" />
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer ">
        <span style="flex:1">
          <el-button class="button-link" type="text" @click="switchSelectAllState">{{selectAllOrgs?"取消全选":"全选"}}</el-button>
          <el-tooltip class="item" effect="light" content="可一键选择在你的通讯录管理权限内，且属于此应用可见范围的所有成员和部门" placement="top-start">
            <i class="el-icon-question text-font-normal" />
          </el-tooltip>
        </span>
        <el-button @click="dialogVisible=false" size="small">取消</el-button>
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
      tempSelectedOrgs: [],
      dialogVisible: false,
      loading: false,
      defaultProps: {
        children: "children",
        label: "name"
      },
      filterText: "",
      selectAllOrgs: false,
      tempSelectedOrgs_beforeSelectAll: []
    };
  },
  computed: {
    selectedUserIds: function() {
      return this.selectedOrgs.filter(i => i.type == "user").map(j => {
        return j.id;
      });
    },
    selectedOrgIds: function() {
      return this.selectedOrgs.filter(i => i.type == "org").map(j => {
        return j.id;
      });
    },
    allSelectedOrgIds: function() {
      return this.selectedOrgs.map(j => {
        return j.id;
      });
    }
  },
  props: {
    emptyLabel: {
      type: String,
      default: "选择发送范围",
      required: false
    },
    notEmptyLabel: {
      type: String,
      default: "应用范围：",
      required: false
    },
    editLabel: {
      type: String,
      default: "修改",
      required: false
    },
    preSelectedOrgs: {
      type: Array,
      default: null,
      required: false
    },
    disabledOrgs: {
      type: Array,
      default: null,
      required: false
    },
    selectValidate: {
      type: Function,
      default: null,
      required: false
    },
    direction: {
      type: String,
      default: "h",
      required: false
    }
  },
  async mounted() {
    await this.getOrgs();
    this.processOrgs(this.orgs[0]);
    this.getOrgArr(this.orgs[0]);

    if (this.disabledOrgs) {
      this.disabledOrgs.forEach(i => {
        var target = this.getTarget(i.id, i.type);
        if (target) target.disabled = true;
      });
    }

    if (this.preSelectedOrgs) {
      this.preSelectedOrgs.forEach(i => {
        var target = this.getTarget(i.id, i.type);
        if (target) {
          target.selected = true;
          this.selectedOrgs.push(target);
        }
      });
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
    selectAllOrgs() {
      this.sourceOrgs.disabled = this.selectAllOrgs;
    },
    preSelectedOrgs() {
      this.preSelectedOrgs.forEach(i => {
        var target = this.getTarget(i.id, i.type);
        if (target) {
          target.selected = true;
          this.selectedOrgs.push(target);
        }
      });
    }
  },
  methods: {
    processOrgs(org) {
      org.type = "org";
      org.selected = false;
      org.children = org.children || [];
      if (org.subOrgs && org.subOrgs.length > 0) {
        org.subOrgs.forEach(i => {
          this.processOrgs(i);
          i.type = "org";
          i.selected = false;
          org.children.push(i);
        });
      }

      if (org.users && org.users.length > 0) {
        org.users.forEach(i => {
          i.type = "user";
          i.selected = false;
          org.children.push(i);
        });
      }
    },
    async getOrgs() {
      if (this.loading) return;
      this.sourceOrgs = await api.getOrg();
      this.sourceOrgs.disabled = this.selectAllOrgs;
      this.orgs.push(this.sourceOrgs);
      this.loading = false;
    },
    getOrgArr(org) {
      this.orgArr = this.orgArr || [];
      org.users.forEach(u => {
        this.orgArr.push(u);
      });
      org.subOrgs.forEach(j => {
        this.orgArr.push(j);
        this.getOrgArr(j);
      });
    },
    getTarget(id, type) {
      var target = this.orgArr.find(i => i.id === id && i.type == type);
      return target;
    },
    async showDialog() {
      this.tempSelectedOrgs = [];
      this.selectedOrgs.forEach(i => {
        this.tempSelectedOrgs.push(i);
      });
      this.dialogVisible = true;
    },
    confirmDialog() {
      this.selectedOrgs = this.tempSelectedOrgs;
      this.dialogVisible = false;
    },
    async nodeClick(data, node, component) {
      if (data.selected) {
        this.tempSelectedOrgs.removeByValue(data);
      } else {
        if (this.selectValidate) {
          var result = await this.selectValidate(data);
          if (!result) return;
        }

        this.tempSelectedOrgs.push(data);
      }

      data.selected = !data.selected;
    },
    renderTreaNode(h, { node, data, store }) {
      var iconClass =
        data.type == "org" ? "el-icon-custom-group" : "el-icon-custom-people";
      var selectedIconStyle = data.selected ? "display:block" : "display:none";
      return (
        <span style="flex:1;display:flex;align-items:center;font-size:14px;padding-right:8px;">
          <i
            class={iconClass}
            style="color:#3E6A8F;margin-right:5px;font-size:18px"
          />
          <span>{node.label}</span>
          <i class="el-icon-check" style={selectedIconStyle} />
        </span>
      );
    },
    removeOrg(item) {
      if (item.disabled) return;

      item.selected = false;
      this.tempSelectedOrgs.removeByValue(item);

      if (this.selectAllOrgs) {
        this.switchSelectAllState();
      }
    },
    removeOrgFromSelectedOrgs(item) {
      this.selectedOrgs.removeByValue(item);
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    switchSelectAllState() {
      if (this.selectAllOrgs) {
        this.selectAllOrgs = false;
        this.tempSelectedOrgs = this.tempSelectedOrgs_beforeSelectAll;
      } else {
        this.selectAllOrgs = true;
        this.tempSelectedOrgs_beforeSelectAll = this.tempSelectedOrgs;
        this.tempSelectedOrgs = [];
        this.tempSelectedOrgs.push({
          id: -1,
          name: "全部可选成员",
          type: "org"
        });
      }
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
  height: 400px;
  width: 300px;
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


