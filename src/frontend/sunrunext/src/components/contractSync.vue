<template>
    <div>
        <sub-header></sub-header>
        <div class="flexDiv-v div-root">
            <div class="flexDiv-h editItemContainer">
                <span class="item-icon" style="background-position: -97px -386px;border-radius:0px;margin-right:16px" />
                <div class="flexDiv-v" style="justify-content:space-between">
                    <span style="font-size:20px">通讯录同步</span>
                    <span class="text-font-normal">可通过API接口同步IAM组织架构</span>
                </div>
            </div>
            <div class="flexDiv-h editItemContainer" style="align-items:center">
                <span class="text-font-normal item-header">IAM地址</span>
                <input type="text" placeholder="在此输入IAM服务器地址" />
            </div>
            <div class="flexDiv-h editItemContainer" style="align-items:center">
                <span class="text-font-normal item-header">AppKey</span>
                <input type="text" placeholder="在此输入同步接口的AppKey" />
            </div>
            <div class="flexDiv-h editItemContainer" style="align-items:center">
                <span class="text-font-normal item-header">AppSecret</span>
                <input type="text" placeholder="在此输入同步接口的AppSecret" />
            </div>
            <el-button type="primary" style="margin-top:20px;align-self:flex-start">同步</el-button>
        </div>
    </div>
</template>

<script>
import subHeader from "./common/subHeader";
export default {
  components: {
    subHeader
  }
};
</script>

<style lang="less" scoped>
.div-root {
  padding-left: 150px;
  padding-right: 150px;
}

.item-header {
  font-size: 13px;
  width: 75px;
}

input {
  border: 0px;
  flex: 1;
  padding-top: 5px;
  padding-bottom: 5px;
  font-size: 13px;
  outline: none;
}

input::-webkit-input-placeholder {
  color: @color-theme;
}

input::-webkit-input-placeholder {
  color: @color-font-minor;
}
</style>


