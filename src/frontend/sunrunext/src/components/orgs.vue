<template>
  <el-container>
    <el-aside width="260px">
      <el-container style="background:#F9FAFC;height:100%;border-right: 1px dotted #DCE1E6;">
        <el-header style="padding:10px;height:auto">
          <el-input v-model="filterText" placeholder="搜索成员、部门" prefix-icon="el-icon-search" size="mini">
          </el-input>
        </el-header>
        <el-main style="padding:0px;flex:1">
          <el-tree :filter-node-method="filterNode" ref="tree" node-key="id" :render-content="renderTreaNode" :highlight-current="true" @node-click="orgSelected" :default-expanded-keys="[0]" :default-checked-keys="[0]" :data="orgs" :props="defaultProps" style="background:transparent"></el-tree>
        </el-main>
      </el-container>
    </el-aside>
    <el-main style="padding:0 10px">
      <el-table :data="users" style="width: 100%">
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
    </el-main>
  </el-container>
</template>
<script>
import api from "../utility/api";
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
      filterText: ""
    };
  },
  watch: {
    filterText(val) {
      console.log("fd");
      this.$refs.tree.filter(val);
    }
  },

  async mounted() {
    this.sourceData = await api.getOrg();
    this.orgs.push(this.sourceData);
  },

  components: {},

  methods: {
    orgSelected(org, node, el) {
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

<style scoped>

</style>
