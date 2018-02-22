<template>
  <div class="flexDiv-h">
    <app-list :showAllAppOption="true" @appChanged="appChanged" />
    <el-table :data="records" style="width: 100%;margin-left:20px">
      <el-table-column prop="type" :filter-multiple="false" label="状态" width="120" :filters="[{ text: '已发送', value: 'sent' }, { text: '定时发送', value: 'timing' }, { text: '草稿', value: 'draft' }]" :filter-method="filterTag" filter-placement="bottom-end">
        <template slot-scope="scope">
          <span v-if="scope.row.type=='sent'">
            <i class="el-icon-success icon-sent"></i>
            <span class="text-font-normal">已发送</span>
          </span>
          <span v-else-if="scope.row.type=='timing'">
            <i class="el-icon-time icon-timing"></i>
            <span class="text-font-normal">定时发送</span>
          </span>
          <span v-else-if="scope.row.type=='draft'">
            <i class="el-icon-custom-draft icon-draft"></i>
            <span class="text-font-normal">草稿</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="appMessageTemplate.type" label="消息类型" width="120">
        <template slot-scope="scope">
          {{scope.row.appMessageTemplate.type|appMessageTemplateTypeConverter()}}
        </template>
      </el-table-column>
      <el-table-column label="消息主题">
        <template slot-scope="scope">
          <span>
            {{scope.row.safe?'[保密]':''}} {{scope.row.appMessageTemplate|appMessageTemplateToStringConverter()}}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="时间" width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.type=='timing'">
            {{scope.row.schedulerDate|dateConverter("MM-DD HH:mm")}}
          </span>
          <span v-else>
            {{scope.row.updatedTime|dateConverter("MM-DD HH:mm")}}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="130">
        <template slot-scope="scope">
          <span v-if="scope.row.type=='timing'">
            <el-button style="padding:0px;" type="text" @click="scheduleTime(scope.row)">修改时间</el-button>
            <el-button style="padding:0px;margin-left:10px" type="text" @click="cancelTimingMessage(scope.row)">取消</el-button>
          </span>
          <span v-else-if="scope.row.type=='draft'">
            <el-button style="padding:0px;" type="text" @click="editMessage(scope.row)">编辑</el-button>
            <el-button style="padding:0px;margin-left:10px" type="text" @click="deleteMessage(scope.row)">删除</el-button>
          </span>
        </template>
      </el-table-column>
    </el-table>
    <schedule-time-send ref="timeScheduler" @dateSelected="dateSelected">
    </schedule-time-send>
    <el-dialog title="编辑" :close-on-click-modal=false width="1000px" :visible.sync="dialogVisible">
      <app-message-template-creator ref="templateCreator" :canOpenMaterial="false"  />
      <div slot="footer" class="dialog-footer ">
        <el-button @click="hideTempldateCreator">取消</el-button>
        <el-button type="primary" @click="saveTemplate">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import appList from "./appList";
import api from "../../utility/api";
import scheduleTimeSend from "./scheduleTimeSend";
import appMessageTemplateCreator from "./appMessageTemplateCreator";
export default {
  data() {
    return {
      records: [],
      selectedApp: null,
      selectedType: null,
      editingTemplate: null,
      dialogVisible: false
    };
  },
  components: {
    appList,
    scheduleTimeSend,
    appMessageTemplateCreator
  },
  async mounted() {
    await this.getRecords();
  },
  methods: {
    formatter(row, column) {
      return row.address;
    },
    filterTag(value, row) {
      return row.type == value;
    },
    async getRecords() {
      var filterAppId =
        this.selectedApp && this.selectedApp._id != "-1"
          ? this.selectedApp._id
          : null;

      this.records = await api.getAppSentMessageRecords(
        this.selectedType,
        filterAppId
      );
    },
    async appChanged(app) {
      this.selectedApp = app;
      await this.getRecords();
    },
    async cancelTimingMessage(message) {
      message.type = "draft";
      await api.updateAppSentMessageRecord(message._id, message);
      await this.getRecords();
    },
    async deleteMessage(message) {
      await api.deleteAppSentMessageRecord(message._id);
      await this.getRecords();
    },
    scheduleTime(message) {
      this.editingTemplate = message;
      this.$refs.timeScheduler.presetDate = message.schedulerDate;
      this.$refs.timeScheduler.showDialog();
    },
    async dateSelected(date) {
      if (this.editingTemplate) {
        this.editingTemplate.schedulerDate = date;
        await api.updateAppSentMessageRecord(
          this.editingTemplate._id,
          this.editingTemplate
        );

        await this.getRecords();
      }
    },
    editMessage(template) {
      this.dialogVisible = true;
      this.editingTemplate = template;
      this.$refs.templateCreator.template = template.appMessageTemplate;
    },
    hideTempldateCreator() {
      this.editingTemplate = null;
      this.dialogVisible = false;
    },
    async saveTemplate() {
      var data = this.$refs.templateCreator.save();

      if (data && this.editingTemplate) {
        await api.updateAppMessageTemplate(this.editingTemplate._id, data);
        this.editingTemplate = null;
        this.dialogVisible = false;
        await this.getRecords();
      }
    }
  }
};
</script>

<style lang="less" scoped>
.el-menu-vertical {
  width: 170px;
}

.icon-sent {
  font-size: 16px;
  color: #55d041;
}

.icon-timing {
  font-size: 16px;
  color: #fe6807;
}

.icon-draft {
  font-size: 16px;
  color: #aaabab;
}
</style>


