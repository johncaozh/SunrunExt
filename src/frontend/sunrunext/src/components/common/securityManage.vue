<template>
    <div class="flexDiv-v" v-if="config">
        <div class="flexDiv-h editItemContainer">
            <span class="text-font-normal item-header">群聊显示水印</span>
            <div class="flexDiv-v">
                <el-checkbox class="button-link" @change="valueChanged" v-model="config.showWatermarkerInGroupSession">开启</el-checkbox>
                <span class="text-font-minor" style="margin-top:10px">群聊背景显示成员姓名，防止截屏泄密</span>
            </div>
        </div>
        <div class="flexDiv-h editItemContainer">
            <span class="text-font-normal item-header">通讯录水印</span>
            <div class="flexDiv-v">
                <el-checkbox class="button-link" @change="valueChanged" v-model="config.showWatermarkerInAdressBook">开启</el-checkbox>
                <span class="text-font-minor" style="margin-top:10px">通讯录与个人信息背景显示成员姓名，防止截屏泄密</span>
            </div>
        </div>
    </div>
</template>
<script>
import platformConfig from "../mixin/platformConfig";
import api from "../../utility/api";
export default {
  mixins: [platformConfig],
  methods: {
    async valueChanged(value) {
      await api.updateConfig(this.config);
      await api.getConfig();
    }
  },
};
</script>
<style lang="less" scoped>
.item-header {
  font-size: 13px;
  width: 120px;
}

.div-uploader {
  width: 236px;
  height: 62px;
  align-items: center;
  justify-content: center;
  border: 1px solid @color-border-level2;
}
</style>
