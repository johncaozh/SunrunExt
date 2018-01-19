<template>
    <div class="flexDiv-h div-item-container">
        <div class="flexDiv-h div-item" @click="$router.push('./contractSync')">
            <span class="item-icon" style="background-position: -97px -386px;">
            </span>
            <div class="flexDiv-v" style="flex:1" >
                <span class="item-header">通讯录同步</span>
                <span class="text-font-minor item-desc">可通过API接口管理通讯录，同时可设置查看或编辑权限，管理更加方便</span>
            </div>
        </div>
        <div class="flexDiv-h div-item" @click="$router.push('./message')">
            <span class="item-icon" style="background-position: -551px -210px;">
            </span>
            <div class="flexDiv-v" style="flex:1">
                <span class="item-header">消息群发</span>
                <span class="text-font-minor item-desc">可通过自定义的消息型应用给成员群发消息</span>
            </div>
        </div>
        <div class="flexDiv-h div-item">
            <span class="item-icon" style="background-position: -420px -463px;">
            </span>
            <div class="flexDiv-v" style="flex:1">
                <span class="item-header">用户消息</span>
                <span class="text-font-minor item-desc">可查看成员通过应用发送的消息，并进行回复</span>
            </div>
        </div>
        <div class="flexDiv-h div-item">
            <span class="item-icon" style="background-position:-140px -463px;">
            </span>
            <div class="flexDiv-v" style="flex:1">
                <span class="item-header">素材库</span>
                <span class="text-font-minor item-desc">可将重要常用的素材存放在此，方便管理员发送消息</span>
            </div>
        </div>
        <div class="flexDiv-h div-item">
            <span class="item-icon" style="background-position: -551px -140px;">
            </span>
            <div class="flexDiv-v" style="flex:1">
                <span class="item-header">使用分析</span>
                <span class="text-font-minor item-desc">可通过使用分析查看成员、管理员和应用的使用情况</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {};
</script>

<style scoped lang="less">
.div-item-container {
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  padding-left: 150px;
  padding-right: 150px;
  padding-top: 50px;
}

.div-item {
  border: 1px solid @color-border-level2;
  border-radius: 4px;
  padding: 16px;
  cursor: pointer;
  width: 348px;
  margin-bottom: 16px;
}

.div-item:hover {
  border: 1px solid @color-theme;
}

.item-header {
  font-size: 14px;
  color: @color-theme;
}

.item-desc {
  margin-top: 5px;
}
</style>


