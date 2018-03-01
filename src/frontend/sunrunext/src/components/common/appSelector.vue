<template>
  <div class="flexDiv-h" style="align-items:center">
    <span v-if="selectedApp" class="text-font-normal">应用名称：</span>
    <div class="flexDiv-h div-app-selected" v-if="selectedApp">
      <img :src="selectedApp.avatar|getMediaLink" class="app-logo-selected" />
      <span class="app-name-selected">{{selectedApp.name}}</span>
    </div>
    <el-button class="button-link" type="text" @click="showDialog">{{selectedApp?"修改":emptyLabel}}</el-button>
    <el-dialog :title="emptyLabel" width="618px" :visible.sync="dialogVisible" style="padding:0px">
      <div class="flexDiv-h div-app-container">
        <div v-for="(item,index) in apps" :key="index" class="flexDiv-h div-app" @click="selectApp(item)">
          <img :src="item.avatar|getMediaLink" class="app-logo" />
          <span class="app-name">{{item.name}}</span>
          <div class="div-selected" :style="{display:tempSelectedApp==item?'flex':'none'}">
            <div class="div-white " />
            <i class="el-icon-circle-check icon-selected" />
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer ">
        <el-button @click="dialogVisible=false" size="small">取消</el-button>
        <el-button type="primary" size="small" @click="confirmDialog" :disabled="!tempSelectedApp">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from "../../utility/api";
export default {
  data() {
    return {
      selectedApp: null,
      tempSelectedApp: null,
      apps: [],
      dialogVisible: false,
      loading: false
    };
  },
  props: {
    emptyLabel: {
      type: String,
      default: "选择需要发消息的应用",
      required: false
    },
    preSelectedAppId: {
      type: String,
      default: null,
      required: false
    }
  },
  async mounted() {
    await this.getApps();
  },
  methods: {
    async getApps() {
      if (this.loading) return;

      var res = await api.getApps();
      this.apps = res;

      if (this.preSelectedAppId)
        this.selectedApp = this.apps.find(i => i._id == this.preSelectedAppId);

      this.loading = false;
    },
    async showDialog() {
      this.tempSelectedApp = this.selectedApp;
      this.dialogVisible = true;
    },
    selectApp(app) {
      this.tempSelectedApp = app;
    },
    confirmDialog() {
      this.selectedApp = this.tempSelectedApp;
      this.dialogVisible = false;
    }
  }
};
</script>

<style lang="less" scoped>
.div-app-container {
  align-items: flex-start;
  justify-content: flex-start;
  flex-wrap: wrap;
}

.div-app {
  border: 1px solid @color-border-level2;
  border-radius: 4px;
  padding: 10px;
  cursor: pointer;
  width: 160px;
  margin-bottom: 10px;
  margin-right: 10px;
  align-items: center;
  position: relative;
}

.div-app:hover {
  border: 1px solid @color-theme;
}

.app-logo {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  margin-right: 10px;
}

.app-logo-selected {
  width: 24px;
  height: 24px;
  border-radius: 2px;
  margin-right: 10px;
}

.div-app-selected {
  border: 1px solid @color-border-level2;
  align-items: center;
  margin-right: 10px;
}

.app-name {
  font-size: 14px;
  color: @color-theme;
  line-height: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.app-name-selected {
  font-size: 14px;
  color: @color-theme;
  line-height: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 10px;
}

.div-selected {
  background: rgba(0, 0, 0, 0.3);
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0px;
  top: 0px;
  border-radius: 4px;
  border: 1px solid @color-theme;
  display: none;
  justify-content: center;
  align-items: center;
}

.icon-selected {
  color: #008ffa;
  font-size: 32px;
  fill: white;
  z-index: 10;
}

.div-white {
  background: white;
  width: 18px;
  height: 18px;
  align-self: center;
  position: absolute;
}
</style>


