<template>
    <div class="flexDiv-v">
        <div class="editItemContainer">
            <app-selector></app-selector>
        </div>
        <div class="editItemContainer">
            <contract-selector/>
        </div>
    </div>
</template>

<script>
import appSelector from "./common/appSelector";
import contractSelector from "./common/contractSelector";
export default {
  components: {
    appSelector,
    contractSelector
  }
};
</script>

<style lang="less" scoped>

</style>


