<template>
  <el-card class="box-card" body-style="padding:20px">
    <div class="flexDiv-v">
      <div class="flexDiv-h" style="align-items:center">
        <i class="el-icon-custom-reply menuIcon" />自动回复
      </div>
      <div class="text-font-minor" style="margin-top:10px;height:60px">通过接收用户的消息，可配置规则进行自动回复</div>
      <span>
        <el-button type="text" class="button-link" @click="$router.push('/apps/'+appId+'/autoReply')">设置</el-button>
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


