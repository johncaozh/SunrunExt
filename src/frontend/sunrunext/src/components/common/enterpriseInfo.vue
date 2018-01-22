<template>
    <div class="flexDiv-v">
        <div class="flexDiv-v editItemContainer">
            <div class="flexDiv-h" style="align-items:center">
                <span class="text-font-normal item-header">企业Logo</span>
                <el-upload :action="uploadUrl" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                    <div class="flexDiv-v div-uploader">
                        <img v-if="logoUrl" :src="logoUrl" class="avatar">
                        <i v-else class="el-icon-custom-camera" style="font-size:20px"></i>
                    </div>
                    <div slot="tip" class="text-font-minor">推荐尺寸702*180</div>
                </el-upload>
            </div>
            <div class="flexDiv-h" style="align-items:center;margin-top:20px">
                <span class="text-font-normal item-header">企业简称</span>
                <input class="input-borderless" type="text" placeholder="在此输入IAM服务器地址" />
            </div>
        </div>
        <div class="flexDiv-v editItemContainer">
            <div class="flexDiv-h" style="align-items:center">
                <span class="text-font-normal item-header">企业成员</span>
                <input class="input-borderless" type="text" placeholder="在此输入同步接口的AppKey" />
            </div>
            <div class="flexDiv-h" style="align-items:center;margin-top:20px">
                <span class="text-font-normal item-header">企业部门</span>
                <input class="input-borderless" type="text" placeholder="在此输入IAM服务器地址" />
            </div>
        </div>
        <div class="flexDiv-v editItemContainer">
            <div class="flexDiv-h" style="align-items:center">
                <span class="text-font-normal item-header">企业电话</span>
                <input class="input-borderless" type="text" placeholder="在此输入同步接口的AppKey" />
            </div>
            <div class="flexDiv-h" style="align-items:center;margin-top:20px">
                <span class="text-font-normal item-header">企业地址</span>
                <input class="input-borderless" type="text" placeholder="在此输入IAM服务器地址" />
            </div>
        </div>
    </div>
</template>
<script>
export default {};
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
