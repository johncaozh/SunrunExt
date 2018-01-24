<template>
    <div>
        <sub-header></sub-header>
        <div class="flexDiv-v div-root">
            <div class="flexDiv-h editItemContainer">
                <span class="item-icon" style="background-position: -481px -70px;border-radius:0px;margin-right:16px" />
                <div class="flexDiv-v" style="justify-content:space-between">
                    <span style="font-size:20px">开放API接口</span>
                    <span class="text-font-normal">可通过使用平台提供的API接口，轻松实现消息推送、文件上传、文件预览等功能</span>
                </div>
            </div>
            <div class="flexDiv-h editItemContainer" style="align-items:center">
                <span class="text-font-normal item-header">IM消息推送接口</span>
                <input class="input-borderless" type="text" placeholder="在此输入IM消息推送接口地址" />
            </div>
            <div class="flexDiv-h editItemContainer" style="align-items:center">
                <span class="text-font-normal item-header">文件上传接口</span>
                <input class="input-borderless" type="text" placeholder="在此文件上传接口地址" />
            </div>
            <div class="flexDiv-h editItemContainer" style="align-items:center">
                <span class="text-font-normal item-header">文件预览接口</span>
                <input class="input-borderless" type="text" placeholder="在此输入文件预览接口" />
            </div>
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
  width: 120px;
}
</style>


