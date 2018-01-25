<template>
    <div class="flexDiv-v">
        <div class="flexDiv-h editItemContainer">
            <span class="text-font-normal item-header">消息阅读状态</span>
            <div class="flexDiv-v">
                <el-checkbox class="button-link" v-model="config.gotResponseWhenFriendReadMsg">开启</el-checkbox>
                <span class="text-font-minor" style="margin-top:10px">开启后，企业内的所有消息都可以获取对方是否阅读了消息的状态</span>
            </div>
        </div>
        <div class="flexDiv-h editItemContainer">
            <span class="text-font-normal item-header">开启全员群</span>
            <div class="flexDiv-v">
                <el-checkbox class="button-link" v-model="config.autoBuildEnterpriseIMGroup">开启</el-checkbox>
                <span class="text-font-minor" style="margin-top:10px">企业全员群，新入职员工自动加入此群，离职员工自动退出群</span>
            </div>
        </div>
        <div class="flexDiv-h editItemContainer">
            <span class="text-font-normal item-header">自动创建部门群</span>
            <div class="flexDiv-v">
                <el-checkbox class="button-link" v-model="config.autoBuildDepartmentIMGroup">开启</el-checkbox>
                <span class="text-font-minor" style="margin-top:10px">根据部门创建群聊，方便部门内沟通</span>
            </div>
        </div>
        <div class="flexDiv-h editItemContainer">
            <span class="text-font-normal item-header">可视指挥</span>
            <div class="flexDiv-v">
                <el-checkbox class="button-link" v-model="config.autoGotoVisiualModeInGroupSession">开启</el-checkbox>
                <span class="text-font-minor" style="margin-top:10px">进入群后自动进入可视指挥模式</span>
            </div>
        </div>
    </div>
</template>
<script>
import platformConfig from "../mixin/platformConfig";
export default {
  mixins: [platformConfig]
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
