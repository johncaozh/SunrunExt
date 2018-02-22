<template>
  <div id="app">
    <el-container>
      <el-header style="padding:0px;height:100%">
        <div class="header">
        </div>
      </el-header>
      <el-main style="padding:0px;">
        <router-view/>
      </el-main>
      <el-footer style="padding:0px;font-size:13px;text-align:center;padding-top:20px;padding-bottom:60px;color:#909399">
        <el-container>
          <el-header style="padding:0px;height:100%">
            <span>
              <a>关于尚云</a>
              <a>用户中心</a>
              <a>尚云官网</a>
            </span>
          </el-header>
          <el-main style="padding:5px;">
            © 2008 - 2018 Sunrun Inc. All Rights Reserved
          </el-main>
        </el-container>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "app"
};
</script>

<style lang="less" scoped>
.header {
  height: 40px;
  background-color: @color-theme;
  color: #a4aebd;
  z-index: 1000;
  padding-left: 200px;
  padding-right: 200px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>


