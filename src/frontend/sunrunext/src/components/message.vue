<template>
    <div class="flexDiv-v">
        <sub-header>
            <el-radio-group v-model="tab" size="mini">
                <el-radio-button label="发消息"></el-radio-button>
                <el-radio-button label="已发送"></el-radio-button>
                <el-radio-button label="素材库"></el-radio-button>
            </el-radio-group>
        </sub-header>
        <message-sender style="padding-left:100px;padding-right:100px"/>
    </div>
</template>

<script>
import subHeader from "./common/subHeader";
import messageSender from "../components/messageSender";
export default {
  data() {
    return {
      tab: null
    };
  },
  components: {
    subHeader,
    messageSender
  }
};
</script>

<style lang="less" scoped>

</style>


