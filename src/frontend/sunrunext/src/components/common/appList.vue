<template>
  <div class="flexDiv-v customScroll div-app-container">
    <div v-if="apps.length" v-for="(item,index) in apps" :key="index" class="flexDiv-h div-app" @click="selectApp(item)" :style="{background:item==selectedApp?'#2f5981':'transparent'}">
      <span v-if="item._id=='-1'" class="item-icon app-logo" style="background-position: -152px -794px;"></span>
      <img :src="item.avatar|getMediaLink" class="app-logo" v-else/>
      <span class="app-name" :style="{color:item==selectedApp?'white':'black'}">{{item.name}}</span>
    </div>
    <div v-else class="text-font-normal" style="align-self:center">当前没有应用</div>
  </div>
</template>

<script>
import api from "../../utility/api";
export default {
  data() {
    return {
      apps: [],
      selectedApp: null
    };
  },
  props: {
    showAllAppOption: {
      type: Boolean,
      required: false,
      default: false
    },
    preSelectedAppId: {
      type: String,
      required: false,
      default: null
    }
  },
  async mounted() {
    await this.getApps();
  },
  methods: {
    async getApps() {
      var res = await api.getApps();
      if (res.length > 0) {
        if (this.showAllAppOption) {
          this.apps.push({
            name: "全部消息",
            _id: "-1"
          });
        }

        res.forEach(app => {
          this.apps.push(app);
        });

        if (this.preSelectedAppId) {
          var selectedApp = this.apps.find(i => i._id == this.preSelectedAppId);
          this.selectApp(selectedApp);
        }
      }
    },
    async showDialog() {
      this.tempSelectedApp = this.selectedApp;
      this.dialogVisible = true;
    },
    selectApp(app) {
      if (this.selectedApp != app) {
        this.selectedApp = app;
        this.$emit("appChanged", this.selectedApp);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.div-app-container {
  border-right: 1px solid @color-border-level2;
  background: #f9fafc;
}

.div-app {
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 10px;
  padding-bottom: 10px;
  cursor: pointer;
  width: 170px;
  align-items: center;
  position: relative;
}

.div-app:hover {
  background: @color-border-level3;
}

.app-logo {
  width: 24px;
  height: 24px;
  border-radius: 3px;
  margin-right: 10px;
}
.app-name {
  font-size: 14px;
  line-height: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.app-all-message {
  width: 24px;
  height: 24px;
  background-position: -816px -314px;
}
</style>


