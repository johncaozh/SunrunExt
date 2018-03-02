<template>
  <div class="flexDiv-h">
    <el-button>系统管理员登录</el-button>
    <el-button @click="gotoIamPage">iam登录</el-button>
  </div>
</template>

<script>
import api from "../utility/api";
import env from "../utility/env";
import helper from "../utility/helper";
export default {
  async mounted() {
    var st = this.$route.query.st;
    if (st) {
      await this.login({
        mode: "iam",
        st: st
      });
    }
  },
  methods: {
    async login(data) {
      var loginUserData = await api.login(data);
      
      if (!loginUserData) {
        this.$message({
          message: "登录失败",
          type: "error"
        });
        return;
      }

      helper.setCookie("userId", loginUserData.userId);
      helper.setCookie("userName", loginUserData.userName);
      this.$router.push("/home");
    },
    gotoIamPage() {
      var a = document.createElement("a");
      a.href = `${env.serverConfig.iamLoginRedirectUrl}?service=${
        window.location.href
      }`;
      a.click();
    }
  }
};
</script>

<style lang="less" scoped>

</style>
