<template>
  <div id="app" class="flexDiv-v">
    <div class="header flexDiv-h" style="justify-content:center;min-width:1080px" v-show="!isAuthenticationPage">
      <div style="width:1080px;align-items:center;justify-content:space-between" class="flexDiv-h">
        <img src="./assets/img/sunrun.png" style="width:125px;height:32px;cursor:pointer" @click="$router.push('/home')" />
        <span>
          <span @click="gotoApiDocsPage" class="header-link">API文档</span>
          <router-link to="/logout" class="header-link">退出</router-link>
        </span>
      </div>
    </div>
    <router-view/>
    <span class="foot-link" v-show="!isAuthenticationPage">
      <a>关于尚云</a>
      <a>用户中心</a>
      <a>尚云官网</a>
      <br/> © 2008 - 2018 Sunrun Inc. All Rights Reserved
    </span>
  </div>
</template>

<script>
import env from "./utility/env";
export default {
  name: "app",
  data() {
    return {
      logon: false,
      logonUserData: null
    };
  },
  mounted() {},
  computed: {
    isAuthenticationPage: function() {
      return this.$route.path == "/login";
    }
  },
  methods: {
    gotoApiDocsPage() {
      var a = document.createElement("a");
      a.href = env.serverConfig.apiDocsServerEndPoint;
      a.target = "_blank";
      a.click();
    }
  }
};
</script>

<style lang="less" scoped>
.header {
  height: 40px;
  background-color: @color-theme;
  color: #a4aebd;
  z-index: 1000;
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

.header-link {
  text-decoration: none;
  color: white;
  font-size: 13px;
  margin-left: 20px;
}

.header-link:hover {
  text-decoration: underline;
}
</style>


