<template>

</template>

<script>
import api from "../utility/api";
import env from "../utility/env";
import helper from "../utility/helper";
export default {
  async mounted() {
    var userId = helper.getCookie("userId");
    if (userId) {
      try {
        await api.logout();
        helper.delCookie("userId");
        helper.delCookie("userName");
        var mode = helper.getCookie("loginMode");
        helper.delCookie("loginMode");

        if (mode == "iam") {
          var a = document.createElement("a");
          a.href = `${env.serverConfig.iamLogoutRedirectUrl}?service=${
            window.location.href
          }`;
          a.click();
        } else {
          this.$router.push("/login");
        }
      } catch (err) {
        this.$router.push("/login");
      }
    } else {
      this.$router.push("/login");
    }
  }
};
</script>

<style lang="less" scoped>

</style>
