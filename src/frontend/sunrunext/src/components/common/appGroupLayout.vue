<template>
  <div class="flexDiv-v" v-if="processGroups.length>1">
    <div class="flexDiv-v div-group" :class="{ 'div-group-grid': appsLayoutMode==2 }" v-for="(item,index) in processGroups" :key="index">
      <div class="flexDiv-h div-group-header">
        <div class="text-font-minor">{{item.name}}</div>
      </div>
      <div class="flexDiv-v" v-if="item.apps.length>0" :class="{'div-apps-container-grid':appsLayoutMode==2}">
        <div v-for="(app,appIndex) in item.apps" :key="appIndex" class="flexDiv-h div-app" :class="{ 'div-app-grid': appsLayoutMode==2 }">
          <img :src="app.avatar|getMediaLink" class="app-logo" :class="{'img-app-icon-grid':appsLayoutMode==2}" />
          <span class="app-name">{{app.name}}</span>
        </div>
      </div>
      <div class="text-font-normal" style="align-self:center;justify-self:center;padding:10px" v-else>该分组下无应用</div>
    </div>
  </div>
</template>

<script>
import api from "../../utility/api";
import helper from "../../utility/helper";
export default {
  data() {
    return {
      processApps: [],
      processGroups: []
    };
  },
  components: {},
  computed: {},
  props: {
    appsLayoutMode: {
      type: String,
      required: false,
      default: "1"
    }
  },
  async mounted() {
    await this.getData();
  },
  watch: {},
  methods: {
    async getData() {
      this.processGroups = await api.getAppGroups();
      this.processApps = await api.getApps();
      this.processGroups.forEach(i => {
        i.apps = this.processApps.filter(j => j.groupId === i._id);
      });

      var appsNotInGroups = this.processApps.filter(
        j => j.groupId == null || j.groupId == undefined
      );

      if (appsNotInGroups.length > 0) {
        this.processGroups.push({
          name: "其他应用",
          apps: appsNotInGroups
        });
      }
    }
  }
};
</script>

<style lang="less" scoped>
.div-bottom-operate {
  border-top: 1px solid @color-border-level2;
  padding-top: 20px;
  padding-bottom: 20px;
  margin-top: 20px;
}

.div-addGroup {
  border: 1px solid @color-border-level2;
  width: 360px;
  height: 40px;
  align-items: center;
  justify-content: center;
  color: @color-theme;
  font-size: 13px;
  cursor: pointer;
  margin-top: 20px;
}

.div-addGroup:hover {
  border: 1px solid @color-theme;
}

.div-group {
  width: 360px;
  border: 1px solid @color-border-level2;
  margin-bottom: 20px;
}

.div-group-grid {
  background: #f9f9fa;
}

.div-group:last-child {
  margin-bottom: 0px;
}

.div-group-header {
  padding: 4px;
  padding-left: 10px;
  background: #f9f9fa;
  align-items: center;
}

.icon-operate {
  cursor: pointer;
  font-size: 16px;
}

.div-app {
  align-items: center;
  padding: 10px;
}

.div-app-grid {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: white;
  margin-left: 5px;
  margin-bottom: 5px;
  padding: 0px;
  width: 84px;
  height: 80px;
}

.app-logo {
  width: 20px;
  height: 20px;
  border-radius: 2px;
  margin-right: 10px;
}

.app-name {
  font-size: 13px;
  line-height: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.div-selectedApps-container {
  border-left: 1px solid @color-border-level2;
  margin-left: 20px;
  padding-left: 20px;
  flex: 1;
}

.div-apps-container-grid {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
}

.img-app-icon-grid {
  width: 30px;
  height: 30px;
  margin-right: 0px;
  margin-bottom: 10px;
}
</style>
