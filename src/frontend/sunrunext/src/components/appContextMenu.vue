<template>
  <div class="flexDiv-v ">
      <sub-header>
        {{appDetail.name}} - 自定义菜单
      </sub-header>
      <div class="flexDiv-h app-main">
          <div style="flex:1">

          </div>
          <div class="flexDiv-v iphone">
              <div class="flexDiv-h iphone-title">{{appDetail.name}}</div>
              <div class="flexDiv-h iphone-content"></div>
              <div class="flexDiv-h iphone-contextMenu"></div>
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
      appId: "",
      appDetail: {}
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
.app-main {
  padding: 0 80px;
  padding-bottom: 30px;
  padding-top: 30px;
}

.iphone {
  background-image: url("../assets/img/device-iphone.png");
  background-size: 246px 500px;
  height: 390px;
  width: 226px;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 55px;
  padding-bottom: 55px;
}
.iphone-title {
  height: 32px;
  color: white;
  font-size: 13px;
  align-items: center;
  justify-content: center;
  background: @color-theme;
}

.iphone-content {
  flex: 1;
  background: #f5f7fa;
}

.iphone-contextMenu {
  height: 32px;
  color: @color-font-minor;
  font-size: 13px;
  align-items: center;
  justify-content: center;
  background: white;
  border-top: 1px solid @color-border-level3;
}
</style>


