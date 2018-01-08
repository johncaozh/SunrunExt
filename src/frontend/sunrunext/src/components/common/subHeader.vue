<template>
    <div class="subHeader">
        <span style="padding:0 10px;font-size:14px;cursor:pointer" class="subHeader" @click="$router.go(-1)">
            <i class="el-icon-d-arrow-left" style="font-size:16px;line-height:30px;"/>
            后退
        </span> 
        <div class="title">
            <slot/>
        </div>
    </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
.subHeader {
  background-color: #f5f5f5;
  height: 40px;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-bottom: 1px solid #dce1e6;
}

.title {
  display: flex;
  flex-direction: row;
  align-items: center;
  align-self: center;
  justify-content: center;
  flex: 1;
  margin-left: -60px;
}
</style>


