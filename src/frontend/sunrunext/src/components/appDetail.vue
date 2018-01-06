<template>
<div id="menuItemContainer">
    <app-send-msg />
    <app-send-msg />
    <app-send-msg />
</div>
</template>

<script>
import appSendMsg from "./common/appSendMsg";
export default {
  components: {
    appSendMsg
  }
};
</script>

<style scoped>
#menuItemContainer {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 20px;
}
</style>


