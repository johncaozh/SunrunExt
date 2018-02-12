<template>
  <div id='root'>
    <div id='menu'>
      <el-menu theme="dark" :default-active="defaultActive" mode="horizontal" :router="true" class="menu" style="border-bottom:0px"
        text-color="#2F5981" active-text-color="#36648F">
        <el-menu-item index="/home" class="menuItem">首页</el-menu-item>
        <el-menu-item index="/orgs" class="menuItem">组织架构</el-menu-item>
        <el-menu-item index="/apps" class="menuItem">企业应用</el-menu-item>
        <el-menu-item index="/manager" class="menuItem">管理工具</el-menu-item>
        <el-menu-item index="/enterprise" class="menuItem">我的企业</el-menu-item>
      </el-menu>
    </div>
    <div id="content" style="margin-top:20px;background:white;width:1080px;min-height:600px;padding:0px;align-self:center;    border-radius: 4px;webkit-box-shadow: 0 1px 2px 0 rgba(0,0,0,.15);">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  export default {
    computed: {
      defaultActive: function () {
        console.log(this.$route.path);
        var index1 = this.$route.path.indexOf("/");
        var index2 = this.$route.path.indexOf("/", index1 + 1);
        return index2 != -1 ? this.$route.path.slice(index1, index2 - index1) : this.$route.path.slice(index1);
      }
    }
  };

</script>

<style scoped>
  #root {
    display: flex;
    flex-direction: column;
  }

  #menu {
    display: flex;
    justify-content: center;
    background: white;
    -webkit-box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
  }

  #content {
    flex: 1;
  }

  .menuItem {
    padding-left: 65px;
    padding-top: 20px;
    padding-bottom: 20px;
    padding-right: 50px;
    height: 0px;
    line-height: 0px;
  }

</style>
