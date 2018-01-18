<template>
  <div class="flexDiv-v" v-if="appDetail">
    <sub-header> {{appDetail.name}} - {{appDetail.autoReplyRules.defaultRule?'编辑':'添加'}}消息自动回复</sub-header>
    <div class="flexDiv-v" style="padding-left:120px;padding-right:120px;padding-top:30px">
      <app-message-template-creator ref="messageTemplateCreator" :template="appDetail.autoReplyRules.defaultRule?appDetail.autoReplyRules.defaultRule.appMessageTemplateId:null" />
      <div class="flexDiv-h editItemContainer" style="align-items:center">
        <el-checkbox v-model="safe">保密</el-checkbox>
        <span class="text-font-minor" style="margin-left:20px">开启保密后，文章详情页面将印有收件人姓名</span>
      </div>
      <el-button type="primary" style="align-self:flex-start;margin-top:20px" @click="save">保存</el-button>
    </div>
  </div>
</template>

<script>
import appMessageTemplateCreator from "./common/appMessageTemplateCreator";
import subHeader from "./common/subHeader";
import api from "../utility/api";
export default {
  data() {
    return {
      appId: null,
      appDetail: null,
      safe: false
    };
  },
  components: {
    appMessageTemplateCreator,
    subHeader
  },
  async mounted() {
    this.appId = this.$route.params.appId;
    this.appDetail = await api.getAppDetail(this.appId);

    if (appDetail.autoReplyRules.defaultRule)
      this.safe = appDetail.autoReplyRules.defaultRule.safe;
  },
  methods: {
    async save() {
      var data = this.$refs.messageTemplateCreator.save();

      if (data) {
        if (this.appDetail.autoReplyRules.defaultRule) {
          await api.updateAppMessageTemplate(
            this.appDetail.autoReplyRules.defaultRule.appMessageTemplateId._id,
            data
          );

          var autoReplyRuleData = {
            safe: this.safe
          };

          await api.updateAppAutoReplyRule(
            this.appDetail.autoReplyRules.defaultRule._id,
            autoReplyRuleData
          );
        } else {
          var appMessageTemplate = await api.createAppMessageTemplate(data);

          var autoReplyRuleData = {
            name: null,
            type: null,
            keyword: null,
            safe: this.safe,
            appId: this.appId,
            appMessageTemplateId: appMessageTemplate._id
          };

          await api.createAppAutoReplyRule(autoReplyRuleData);
        }

        this.$router.go(-1);
      }
    }
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


