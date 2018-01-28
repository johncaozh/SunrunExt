<template>
    <div class="iphone ">
        <div class="content">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
.iphone {
  background-image: url("../../assets/img/device-iphone.png");
  background-size: 246px 500px;
  height: 390px;
  width: 220px;
  padding-left: 13px;
  padding-right: 13px;
  padding-top: 55px;
  padding-bottom: 55px;
}

.content {
  width: 100%;
  height: 100%;
  background: white;
}
</style>


