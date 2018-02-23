<template>
  <div id="menuItemContainer">
    <div style="color:#909399;font-size:12px">应用列表</div>
    <div id="apps">
      <el-card class="app" v-for="(item, index) in apps" v-bind:key="index" body-style="padding:10px" @click.native="$router.push('/apps/'+item._id+'/detail')">
        <div style="display:flex;align-items:center">
          <img style="width:40px;height:40px" :src="item.avatar|getMediaLink" />
          <span style="margin-left:10px">{{item.name}}</span>
        </div>
      </el-card>
      <el-card class="app" body-style="padding:10px" @click.native="$router.push('/apps/create')">
        <div style="display:flex;align-items:center">
          <div style="width:40px;height:40px;border:1px solid #C0C0C0;display:flex;justify-content:center;align-items:center;color:#C0C0C0">
            <i class="el-icon-plus" style="font-size:24px" />
          </div>
          <span class="name" style="margin-left:10px;color:@color-theme">添加应用</span>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import appSendMsg from "./common/appSendMsg";
import api from "../utility/api";
export default {
  data() {
    return {
      apps: []
    };
  },
  components: {
    appSendMsg
  },
  async mounted() {
    var res = await api.getApps();
    this.apps = res;
  }
};
</script>

<style scoped lang="less">
#menuItemContainer {
  padding-top: 30px;
  padding-left: 210px;
  padding-right: 200px;
  display: flex;
  flex-direction: column;
}

#apps {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.app {
  width: 200px;
  height: 60px;
  padding: 0px;
  margin-right: 20px;
  margin-top: 20px;
  cursor: pointer;
}

.name {
  color: @color-theme;
}
</style>
