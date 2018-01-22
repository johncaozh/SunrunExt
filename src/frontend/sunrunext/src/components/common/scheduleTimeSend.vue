<template>
    <div>
        <div @click="showDialog">
            <slot></slot>
        </div>
        <el-dialog title="定时发送" :close-on-click-modal=false width="500px" :visible.sync="isDialogVisible">
            <div class="flexDiv-v">
                <span>选择定时发送的时间：</span>
                <span style="margin-top:10px;margin-bottom:10px">
                    <el-date-picker :clearable="false" size="small" v-model="selectedDate" type="date" placeholder="选择日期" style="margin-right:10px">
                    </el-date-picker>
                    <el-time-picker :clearable="false" size="small" v-model="selectedDate" placeholder="选择时间点">
                    </el-time-picker>
                </span>
                <span>该消息将于 {{selectedDate|dateConverter('YYYY-MM-DD HH:mm:ss')}} 发出。</span>
            </div>
            <div slot="footer" class="dialog-footer ">
                <el-button @click="isDialogVisible=false" size="small">取消</el-button>
                <el-button type="primary" @click="confirm" size="small">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import moment from "moment";
export default {
  data() {
    return {
      isDialogVisible: false,
      selectedDate: null
    };
  },
  props: {
    presetDate: {
      type: String,
      required: false,
      default: null
    }
  },
  methods: {
    showDialog() {
      if (this.presetDate) {
        this.selectedDate = presetDate;
      } else {
        this.selectedDate = moment()
          .add(1, "hours")
          .toDate();
      }

      this.isDialogVisible = true;
    },
    confirm() {
      if (moment(this.selectedDate).isBefore(moment())) {
        this.$message.error("定时发送时间必须大于当前时间");
        return;
      }

      this.isDialogVisible = false;
      this.$emit("dateSelected", this.selectedDate);
    }
  }
};
</script>
<style scoped>

</style>

