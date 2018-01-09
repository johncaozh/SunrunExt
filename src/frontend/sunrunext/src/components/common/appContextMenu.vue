<template>
  <el-card class="box-card" body-style="padding:20px">
    <div class="flexDiv-v">
      <div class="flexDiv-h" style="align-items:center">
        <i class="el-icon-custom-contextMenu menuIcon"/>自定义菜单
      </div>
      <div class="text-font-minor" style="margin-top:10px;height:60px">可在应用会话的底部配置七种类型的快捷操作菜单</div>
      <span >
        <el-button type="text" class="button-link" @click="$router.push('/apps/'+appId+'/contextMenu')">设置</el-button>
      </span>
    </div>
</el-card>
</template>

<script>
export default {
  props: {
    appId: {
      type: String,
      required: true
    },
    contextMenu: {
      type: String,
      required: true
    }
  }
};
</script>

<style scoped lang="less">
.box-card {
  width: 270px;
  height: 170px;
  margin-right: 12px;
  margin-bottom: 12px;
  border: 1px solid @color-border-level2;
  /* padding: 30px; */
}
</style>


