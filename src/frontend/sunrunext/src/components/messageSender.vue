<template>
    <div class="flexDiv-v">
        <div class="editItemContainer">
            <app-selector ref="appSelector"></app-selector>
        </div>
        <div class="editItemContainer">
            <contract-selector ref="contractSelector" />
        </div>
        <div class="editItemContainer">
            <app-message-template-creator ref="appMessageTemplateCreator" />
        </div>
        <div class="flexDiv-h editItemContainer" style="align-items:center">
            <el-checkbox v-model="safe">保密</el-checkbox>
            <span class="text-font-minor" style="margin-left:20px">开启保密后，文章详情页面将印有收件人姓名</span>
        </div>
        <div class="flexDiv-h" style="margin-top:20px">
            <el-button type="primary" size="small" @click="sentMessageRecord">发送</el-button>
            <schedule-time-send @dateSelected="createSentTimingMessageRecord">
                <el-button size="small" style="margin-left:10px;margin-right:10px">定时发送</el-button>
            </schedule-time-send>
            <el-button size="small" @click="createSentDraftMessageRecord">存为草稿</el-button>
            <el-button size="small" @click="previewTemplate">预览</el-button>
        </div>
    </div>
</template>

<script>
import appSelector from "./common/appSelector";
import contractSelector from "./common/contractSelector";
import appMessageTemplateCreator from "./common/appMessageTemplateCreator";
import scheduleTimeSend from "./common/scheduleTimeSend";
import api from "../utility/api";
export default {
  data() {
    return {
      safe: false,
      showPreviewLayout: false
    };
  },
  components: {
    appSelector,
    contractSelector,
    appMessageTemplateCreator,
    scheduleTimeSend
  },
  methods: {
    async sentMessageRecord() {
      var record = await this.generateMessageRecord();
      if (record) {
        record.type = "sent";
        await this.createSentMessageRecord(record);
      }
    },
    async createSentTimingMessageRecord(scheduleDate) {
      var record = await this.generateMessageRecord();
      if (record) {
        record.type = "timing";
        record.schedulerDate = scheduleDate;
        await this.createSentMessageRecord(record);
      }
    },
    async createSentDraftMessageRecord() {
      var record = await this.generateMessageRecord();
      if (record) {
        record.type = "draft";
        await this.createSentMessageRecord(record);
      }
    },
    async createSentMessageRecord(record) {
      await api.createAppSentMessageRecord(record);
      this.$router.replace("./message?tabIndex=2");
    },
    async generateMessageRecord() {
      var record = {};
      var appSelector = this.$refs.appSelector;
      if (!appSelector.selectedApp) {
        this.$message.error("请选择要发送消息的应用");
        return null;
      }

      record.app = appSelector.selectedApp._id;

      var contractSelector = this.$refs.contractSelector;
      if (
        !contractSelector.allSelectedOrgIds ||
        contractSelector.allSelectedOrgIds.length == 0
      ) {
        this.$message.error("请指定消息发送范围");
        return null;
      }
      record.receivers = contractSelector.allSelectedOrgIds;

      var messageTemplateCreator = this.$refs.appMessageTemplateCreator;
      var templateData = messageTemplateCreator.save();
      if (!templateData) {
        return null;
      }

      var createdTemplateData = await api.createAppMessageTemplate(
        templateData
      );

      record.appMessageTemplate = createdTemplateData._id;
      record.safe = this.safe;

      return record;
    },

    previewTemplate() {
      this.showPreviewLayout = true;
    }
  }
};
</script>

<style lang="less" scoped>

</style>


