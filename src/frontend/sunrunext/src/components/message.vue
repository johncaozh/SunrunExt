<template>
  <div class="flexDiv-v" style="flex:1">
    <sub-header>
      <el-radio-group v-model="tab" size="mini">
        <el-radio-button label="发消息"></el-radio-button>
        <el-radio-button label="已发送"></el-radio-button>
        <el-radio-button label="素材库"></el-radio-button>
      </el-radio-group>
    </sub-header>
    <message-sender style="padding-left:100px;padding-right:100px;flex:1" v-if="tab=='发消息'" />
    <send-message-history v-if="tab=='已发送'" style="flex:1" />
    <message-template-material :canEdit="true" v-if="tab=='素材库'" style="flex:1" />
  </div>
</template>

<script>
import subHeader from "./common/subHeader";
import messageSender from "../components/messageSender";
import messageTemplateMaterial from "./common/appMessageTemplateMaterial";
import sendMessageHistory from "./common/appSendMessageHistory";
export default {
  data() {
    return {
      tab: "发消息"
    };
  },
  components: {
    subHeader,
    messageSender,
    sendMessageHistory,
    messageTemplateMaterial
  },
  mounted() {
    var tab = this.$route.query.tabIndex;
    if (tab == 1) this.tab = "发消息";
    else if (tab == 2) this.tab = "已发送";
    else if (tab == 3) this.tab = "素材库";
  }
};
</script>

<style lang="less" scoped>

</style>


