<template>
    <div class="flexDiv-h">
        <el-menu :default-active="defaultActive" class="el-menu-vertical" @open="handleOpen" @close="handleClose" :router="true" style="background:#F9FAFC">
            <el-menu-item index="/enterprise/enterpriseInfo">
                <span slot="title">企业信息</span>
            </el-menu-item>
            <el-menu-item index="/enterprise/admin">
                <span slot="title">权限管理</span>
            </el-menu-item>
            <el-menu-item index="/enterprise/chatSession">
                <span slot="title">聊天管理</span>
            </el-menu-item>
            <el-menu-item index="/enterprise/contract">
                <span slot="title">通讯录管理</span>
            </el-menu-item>
            <el-menu-item index="/enterprise/security">
                <span slot="title">安全与保密</span>
            </el-menu-item>
            <el-menu-item index="/enterprise/client">
                <span slot="title">客户端设置</span>
            </el-menu-item>
        </el-menu>
        <keep-alive>
            <router-view style="flex:1;padding-left:20px;padding-right:20px">
            </router-view>
        </keep-alive>
    </div>
</template>

<script>
export default {
  computed: {
    defaultActive: function() {
      var index1 = this.$route.path.indexOf("/");
      var index2 = this.$route.path.indexOf("/", index1 + 1);
      var index3 = this.$route.path.indexOf("/", index2 + 1);
      
      return index3 == -1
        ? this.$route.path
        : this.$route.path.slice(index1, index3 - index1);
    }
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  }
};
</script>

<style lang="less" scoped>
.el-menu-vertical {
  width: 170px;
  min-height: 600px;
}
</style>


