<template>
    <div class="flexDiv-v">
        <div class="editItemContainer">
            <app-selector></app-selector>
        </div>
        <div class="editItemContainer">
            <contract-selector/>
        </div>
        <div class="editItemContainer">
            <app-message-template-creator/>
        </div>
        <div class="flexDiv-h editItemContainer" style="align-items:center">
            <el-checkbox v-model="safe">保密</el-checkbox>
            <span class="text-font-minor" style="margin-left:20px">开启保密后，文章详情页面将印有收件人姓名</span>
        </div>
        <div class="flexDiv-h" style="margin-top:20px">
            <el-button type="primary" size="small">发送</el-button>
            <schedule-time-send >
                <el-button size="small" style="margin-left:10px;margin-right:10px">定时发送</el-button>
            </schedule-time-send>
            <el-button size="small">存为草稿</el-button>
            <el-button size="small">预览</el-button>
        </div>
    </div>
</template>

<script>
import appSelector from "./common/appSelector";
import contractSelector from "./common/contractSelector";
import appMessageTemplateCreator from "./common/appMessageTemplateCreator";
import scheduleTimeSend from "./common/scheduleTimeSend";
export default {
  components: {
    appSelector,
    contractSelector,
    appMessageTemplateCreator,
    scheduleTimeSend
  }
};
</script>

<style lang="less" scoped>

</style>


