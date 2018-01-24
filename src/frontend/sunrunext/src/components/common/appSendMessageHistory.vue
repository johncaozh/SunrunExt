<template>
  <div class="flexDiv-h">
    <app-list :showAllAppOption="true" @appChanged="appChanged" />
    <el-table :data="records" style="width: 100%">
      <el-table-column prop="type" :filter-multiple="false" label="状态" width="120" :filters="[{ text: '已发送', value: 'sent' }, { text: '定时发送', value: 'timing' }, { text: '草稿', value: 'draft' }]" :filter-method="filterTag" filter-placement="bottom-end">
        <template slot-scope="scope">
          <span v-if="scope.row.type=='sent'">
            <i class="el-icon-success icon-sent"></i>
            <span class="text-font-normal">已发送</span>
          </span>
          <span v-if="scope.row.type=='timing'">
            <i class="el-icon-time icon-timing"></i>
            <span class="text-font-normal">定时发送</span>
          </span>
          <span v-if="scope.row.type=='draft'">
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
            <el-button style="padding:0px;" type="text">修改时间</el-button>
            <el-button style="padding:0px;margin-left:10px" type="text">取消</el-button>
          </span>
          <span v-else-if="scope.row.type='draft'">
            <el-button style="padding:0px;" type="text">编辑</el-button>
            <el-button style="padding:0px;margin-left:10px" type="text">删除</el-button>
          </span>
        </template>
      </el-table-column>

    </el-table>
  </div>
</template>

<script>
import appList from "./appList";
import api from "../../utility/api";
export default {
  data() {
    return {
      records: [],
      selectedApp: null,
      selectedType: null
    };
  },
  components: {
    appList
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


