<template>
  <div class="flexDiv-v">
    <sub-header> {{appDetail.name}} - 添加关键词自动回复</sub-header>
    <app-message-template-creator />
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
      appDetail: null
    };
  },
  components: {
    appMessageTemplateCreator,
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


