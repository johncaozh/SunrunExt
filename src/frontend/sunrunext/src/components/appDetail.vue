<template>
  <el-container>
    <el-header>
      <sub-header>测试应用</sub-header>
    </el-header>
    <el-main style="padding:0 114px">
      <div class="flexDiv-v">
        <div class="flexDiv-h" style="align-items:center;padding-top:10px;padding-bottom:30px;border-bottom:1px solid gray">
          <img style="width:60px;height:60px" />
          <div class="flexDiv-v" style="margin-left:10px;justify-content:space-around;align-self:stretch">
            <div style="font-size:22px;">测试应用</div>
            <div style="font-size:15px;">测试应用描述</div>
          </div>
          <div class="flexDiv-v" style="flex:1;align-items:flex-end;justify-content:space-around;align-self:stretch">
            <el-switch inactive-text="已关闭" />
            <el-switch inactive-text="设为群应用" />
          </div>
        </div>
        <div class="flexDiv-v">
          <el-row  style="padding-top:20px;padding-bottom:20px">
              <el-col :span="3">应用ID</el-col>
              <el-col :span="10">4739284903284908329480239</el-col>
          </el-row>
           <el-row>
              <el-col :span="3">可见范围</el-col>
              <el-col :span="10">4739284903284908329480239</el-col>
          </el-row>
        </div>
        <div id="menuItemContainer" style="margin-top:30px">
          <app-send-msg />
          <app-send-msg />
          <app-send-msg />
          <app-send-msg />
          <app-send-msg />
          <app-send-msg />
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import appSendMsg from "./common/appSendMsg";
import subHeader from "./common/subHeader";
export default {
  components: {
    appSendMsg,
    subHeader
  }
};
</script>

<style scoped>
#menuItemContainer {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

el-header {
  height: auto;
}

el-main {
  height: auto;
}
</style>
