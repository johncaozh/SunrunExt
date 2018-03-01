<template>
  <el-card class="box-card" body-style="padding:20px">
    <div class="flexDiv-v">
      <div class="flexDiv-h" style="align-items:center">
        <i class="el-icon-custom-sendMessage menuIcon" />发送消息
      </div>
      <div class="text-font-minor" style="margin-top:10px;height:60px">使用管理工具中的“消息群发”或API发送消息</div>
      <span>
        <el-button type="text" class="button-link" @click="$router.push('/manager/message?tabIndex=1&appId='+appId)">发消息</el-button>
        <el-button type="text" class="button-link" @click="$router.push('/manager/message?tabIndex=2&appId='+appId)">历史消息</el-button>
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


