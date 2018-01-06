<template>
<el-container>
  <el-aside width="260px">
    <el-container style="background:#F9FAFC;height:100%;border-right: 1px dotted #DCE1E6;">
      <el-header style="padding:10px;height:auto">
       <el-input 
    placeholder="搜索成员、部分"
    prefix-icon="el-icon-search"
    size="mini">
  </el-input>
      </el-header>
      <el-main style="padding:0px;flex:1">
        <el-tree node-key="iamOrgId" @node-click="orgSelected" :default-expanded-keys="[0]" :default-checked-keys="[0]" :data="orgs" :props="defaultProps" style="background:transparent" ></el-tree>
      </el-main>
    </el-container>
  </el-aside>
  <el-main style="padding:0 10px">
    <el-table
      :data="users"
      style="width: 100%">
      <el-table-column
        prop="name"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="rank"
        label="职务"
        width="180">
      </el-table-column>
      <el-table-column
        prop="address"
        label="部门">
      </el-table-column>
        <el-table-column
        prop="mobile"
        label="手机">
      </el-table-column>
       <el-table-column
        prop="email"
        label="邮箱">
      </el-table-column>
    </el-table></el-main>
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
      }
    };
  },

  async mounted() {
    this.sourceData = await api.getOrg();
    this.orgs.push(this.sourceData.data.data);
  },

  components: {},

  methods: {
    orgSelected(org, node, el) {
      // alert(JSON.stringify(org));
      // alert(JSON.stringify(org.users));
      // alert(JSON.stringify(org.users.length));
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
    }
  }
};
</script>

<style scoped>

</style>


