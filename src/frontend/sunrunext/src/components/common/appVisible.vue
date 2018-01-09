<template>
  <el-card class="box-card" body-style="padding:20px">
    <div class="flexDiv-v">
      <div class="flexDiv-h" style="align-items:center">
        <i class="el-icon-view menuIcon"/>应用可视设置
      </div>
      <div class="text-font-minor" style="margin-top:10px;height:60px">勾选该选项后，可隐藏当前应用在工作台的入口</div>
      <span >
        <el-checkbox v-model="hideEndpoint" style="line-height:40px" class="button-link" @change="hideEndpointChanged">在工作台隐藏此应用</el-checkbox>
      </span>
    </div>
</el-card>
</template>

<script>
export default {
  data() {
    return {
      hideEndpoint: false
    };
  },
  props: {
    visible: {
      type: Boolean,
      required: true,
      default: true
    }
  },
  methods: {
    hideEndpointChanged(value) {
      this.$emit("visibleChanged", !value);
    }
  },
  watch: {
    visible() {
      this.hideEndpoint = !this.visible;
    }
  }
};
</script>

<style scoped lang="less">
.box-card {
  width: 270px;
  height: 170px;
  margin-right: 12px;
  margin-bottom: 12px;
  border: 1px solid @color-border-level2;
  /* padding: 30px; */
}
</style>


