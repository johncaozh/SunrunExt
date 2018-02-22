<template>
  <div id="app" class="flexDiv-v">
    <div class="header">
    </div>
    <router-view/>
    <span class="foot-link">
      <a>关于尚云</a>
      <a>用户中心</a>
      <a>尚云官网</a>
      <br/> © 2008 - 2018 Sunrun Inc. All Rights Reserved
    </span>
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

.foot-link {
  padding: 0px;
  font-size: 13px;
  text-align: center;
  padding-top: 20px;
  padding-bottom: 60px;
  color: #909399;
}
</style>


