<template>
    <div class="flexDiv-h">
        <el-menu default-active="1" class="el-menu-vertical" @open="handleOpen" @close="handleClose" :router="true">
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


