<template>
<div id="menuItemContainer">
    <app-send-msg :key="1"/>
    <app-send-msg :key="2"/>
    <app-send-msg :key="3"/>
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


