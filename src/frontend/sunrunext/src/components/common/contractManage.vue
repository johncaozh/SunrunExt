<template>
    <div class="flexDiv-v">
        <div class="flexDiv-h editItemContainer">
            <span class="text-font-normal item-header">隐藏的部门/成员</span>
            <el-button class="button-link" type="text" style="padding:0px">添加</el-button>
            <span class="text-font-minor" style="margin-left:10px">被隐藏的部门或者成员，不会显示在公司通讯录中</span>
        </div>
        <div class="flexDiv-h editItemContainer">
            <span class="text-font-normal item-header">限制查看外部门</span>
            <el-button class="button-link" type="text" style="padding:0px">添加</el-button>
            <span class="text-font-minor" style="margin-left:10px">被限制的部门，只能看到本部门的通讯录</span>
        </div>
        <div class="flexDiv-h editItemContainer">
            <span class="text-font-normal item-header">限制查看所有人</span>
            <el-button class="button-link" type="text" style="padding:0px" @click="$router.push('/enterprise/contract/hideAddressBook')">添加</el-button>
            <span class="text-font-minor" style="margin-left:10px">被限制的部门或者成员，不能看到企业所有通讯录</span>
        </div>
    </div>
</template>
<script>
export default {};
</script>
<style lang="less" scoped>
.item-header {
  font-size: 13px;
  width: 150px;
}

.div-uploader {
  width: 236px;
  height: 62px;
  align-items: center;
  justify-content: center;
  border: 1px solid @color-border-level2;
}
</style>
