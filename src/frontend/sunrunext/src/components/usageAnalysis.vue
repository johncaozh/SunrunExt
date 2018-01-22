<template>
    <div class="flexDiv-v">
        <sub-header>
            使用分析
        </sub-header>
        <el-menu default-active="1" class="el-menu-vertical" @open="handleOpen" @close="handleClose">
            <el-menu-item index="1">
                成员使用统计
            </el-menu-item>
            <el-menu-item index="2">
                成员使用记录
            </el-menu-item>
            <el-menu-item index="3">
                管理端操作日志
            </el-menu-item>
            <el-menu-item index="4">
                应用使用分析
            </el-menu-item>
        </el-menu>
    </div>
</template>
<script>
import subHeader from "./common/subHeader";
export default {
  components: {
    subHeader
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
}
</style>
