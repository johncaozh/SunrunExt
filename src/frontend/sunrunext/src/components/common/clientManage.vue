<template>
    <div class="flexDiv-v">
        <div class="flexDiv-h editItemContainer">
            <span class="text-font-normal item-header">客户端启动页</span>
            <div class="flexDiv-v">
                <div class="flexDiv-h">
                    <el-radio>默认</el-radio>
                    <el-button size="small" type="text" class="button-link" style="padding:0px;margin-left:10px">预览</el-button>
                </div>
                <div class="flexDiv-h" style="margin-top:20px;align-items:center">
                    <el-radio>自定义</el-radio>
                    <!-- <el-upload :action="uploadUrl" style="margin-left:10px" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                        <div class="flexDiv-v div-uploader">
                            <img v-if="logoUrl" :src="logoUrl" class="avatar">
                            <i v-else class="el-icon-custom-camera" style="font-size:20px"></i>
                        </div>
                        <div slot="tip" class="text-font-minor">推荐尺寸702*180</div>
                    </el-upload> -->
                    <el-button size="small" type="text" class="button-link" style="padding:0px;margin-left:10px">预览</el-button>
                </div>
            </div>
        </div>
        <div class="flexDiv-h editItemContainer">
            <span class="text-font-normal item-header">工作台显示</span>
            <div class="flexDiv-v">
                <span>
                    <el-radio>列表模式</el-radio>
                </span>
                <span style="margin-top:10px;margin-bottom:20px">
                    <el-radio>宫格模式</el-radio>
                </span>
                <div class="editItemContainer flexDiv-h" style="padding-bottom:0px;border-bottom:0px;border-top:1px solid #E4E7ED">
                    <el-button type="text" class="button-link" style="padding:0px">设置应用分组</el-button>
                    <span class="text-font-minor" style="margin-left:10px">应用较多时，可根据类别和使用频率对应用分组和排序</span>
                </div>
            </div>
        </div>
        <div class="flexDiv-h editItemContainer">
            <span class="text-font-normal item-header">未使用成员提醒</span>
            <div class="flexDiv-v">
                <el-checkbox class="button-link">开启</el-checkbox>
                <span class="text-font-minor" style="margin-top:10px">未使用企业微信的成员收到聊天消息和应用消息，通过短信或邮件提醒他们</span>
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
