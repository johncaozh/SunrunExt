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
      await api.logout();
      helper.deleteCookie("userId");
      helper.deleteCookie("userName");
      var a = document.createElement("a");
      a.href = `${env.serverConfig.iamLogoutRedirectUrl}?service=${
        window.location.href
      }`;
      a.click();
    } else {
      this.$router.push("/login");
    }
  }
};
</script>

<style lang="less" scoped>

</style>
