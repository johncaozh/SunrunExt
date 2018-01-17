<template>
  <div class="flexDiv-v">
    <sub-header> {{appDetail.name}} - 消息自动回复</sub-header>
    <div style="padding-left:120px;padding-right:120px">
      <div class="flexDiv-h editItemContainer" style="align-items:center">
        <el-button type="text" class="button-link" style="margin-right:10px" @click="$router.push('/apps/'+appId+'/autoReply/new')">添加消息自动回复</el-button>
        <span class="text-font-minor">设置成员发送任意消息后应用回复的内容</span>
      </div>
      <div class="flexDiv-h editItemContainer" style="align-items:center">
        <el-button type="text" class="button-link" style="margin-right:10px" @click="$router.push('/apps/'+appId+'/autoReply/newKeyword')">添加关键词自动回复</el-button>
        <span class="text-font-minor">设置成员发送关键词消息后应用回复的内容</span>
      </div>
    </div>
  </div>
</template>

<script>
import subHeader from "./common/subHeader";
import api from "../utility/api";
export default {
  data() {
    return {
      appId: null,
      appDetail: null
    };
  },
  components: {
    subHeader
  },
  async mounted() {
    this.appId = this.$route.params.appId;
    this.appDetail = await api.getAppDetail(this.appId);
  }
};
</script>

<style lang="less" scoped>
.editItemContainer {
  border-bottom: 1px solid @color-border-level2;
  padding-top: 20px;
  padding-bottom: 20px;
}
</style>


