<template>
  <el-card class="box-card" body-style="padding:20px">
    <div class="flexDiv-v">
      <div class="flexDiv-h" style="align-items:center">
        <i class="el-icon-custom-userMessage menuIcon"/>接收消息
      </div>
      <div class="text-font-minor" style="margin-top:10px;height:60px">接收用户发送的普通消息以及菜单操作、进入应用、上报地理位置等事件信息</div>
      <span >
        <el-button type="text" class="button-link">查看消息</el-button>
        <el-button type="text" class="button-link">设置API接收</el-button>
      </span>
    </div>
</el-card>
</template>

<script>
export default {};
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


