<template>
  <div class="flexDiv-h" style="flex:1">
    <div class="flexDiv-v div-aside">
      <el-input v-model="filterText " placeholder="搜索成员、部门" prefix-icon="el-icon-search" size="mini" />
      <el-tree v-loading="loading " :filter-node-method="filterNode " ref="tree" node-key="id" :render-content="renderTreaNode " @current-change="orgSelected " :default-expanded-keys="['0'] " :data="orgs " :highlight-current="true " :props="defaultProps " style="background:transparent;margin-top:10px"></el-tree>
    </div>
    <el-table :data="users " style="width:100%">
      <el-table-column prop="name" label="姓名" width="180">
      </el-table-column>
      <el-table-column prop="rank" label="职务" width="180">
      </el-table-column>
      <el-table-column prop="address" label="部门">
      </el-table-column>
      <el-table-column prop="mobile" label="手机">
      </el-table-column>
      <el-table-column prop="email" label="邮箱">
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import api from "../utility/api";
import Vue from "Vue";
export default {
  data() {
    return {
      orgs: [],
      users: [],
      sourceData: null,
      defaultProps: {
        children: "subOrgs",
        label: "name"
      },
      filterText: "",
      loading: false
    };
  },
  watch: {
    filterText(val) {
      console.log("fd");
      this.$refs.tree.filter(val);
    }
  },

  async mounted() {
    this.loading = true;
    this.sourceData = await api.getOrg();
    this.orgs.push(this.sourceData);
    var instance = this;

    Vue.nextTick(function() {
      instance.$refs.tree.setCurrentKey(instance.orgs[0].id);
      instance.orgSelected(instance.orgs[0], null);
      instance.loading = false;
    });
  },

  methods: {
    orgSelected(org, node) {
      this.users.length = 0;
      this.getOrgUser(org, this.users);
    },

    getOrgUser(org, users) {
      if (org.users && org.users.length > 0) {
        org.users.forEach(item => users.push(item));
      }

      if (org.subOrgs && org.subOrgs.length > 0) {
        org.subOrgs.forEach(item => this.getOrgUser(item, users));
      }
    },
    renderTreaNode(h, { node, data, store }) {
      return (
        <span style="flex:1;display:flex;align-items:center;font-size:14px;padding-right:8px;">
          <i
            class="el-icon-custom-group"
            style="color:#3E6A8F;margin-right:5px;font-size:18px"
          />
          <span>{node.label}</span>
        </span>
      );
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    }
  }
};
</script>
<style lang="less" scoped>
.div-aside {
  width: 240px;
  padding: 10px;
  border-right: 1px dotted @color-border-level2;
  background: #f9fafc;
  margin-right: 20px;
}
</style>
