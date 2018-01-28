<template>
    <div class="flexDiv-v" v-if="config">
        <div class="flexDiv-h editItemContainer">
            <span class="text-font-normal item-header">客户端启动页</span>
            <div class="flexDiv-v">
                <div class="flexDiv-h">
                    <el-popover ref="popover1" placement="bottom-start" trigger="click">
                        <iphone>
                            <div style="background:white;" />
                        </iphone>
                    </el-popover>
                    <el-radio @change="valueChanged" v-model="config.clientSplashScreenMode" label="1">默认</el-radio>
                    <el-button v-popover:popover1 size="small" type="text" class="button-link" style="padding:0px;margin-left:10px">预览</el-button>
                </div>
                <div class="flexDiv-h" style="margin-top:20px;align-items:center">
                    <el-radio @change="valueChanged" v-model="config.clientSplashScreenMode" label="2">自定义</el-radio>
                    <!-- <el-upload :action="uploadUrl" style="margin-left:10px" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                        <div class="flexDiv-v div-uploader">
                            <img v-if="logoUrl" :src="logoUrl" class="avatar">
                            <i v-else class="el-icon-custom-camera" style="font-size:20px"></i>
                        </div>
                        <div slot="tip" class="text-font-minor">推荐尺寸702*180</div>
                    </el-upload> -->
                    <el-button size="small" type="text" class="button-link" style="padding:0px;margin-left:10px">预览</el-button>
                </div>
                <el-popover ref="popover1" placement="top-start" title="标题" width="200" trigger="hover" content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
                </el-popover>

                <el-popover ref="popover2" placement="bottom" title="标题" width="200" trigger="click" content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
                </el-popover>
            </div>
        </div>
        <div class="flexDiv-h editItemContainer">
            <span class="text-font-normal item-header">工作台显示</span>
            <div class="flexDiv-v">
                <span>
                    <el-radio @change="valueChanged" v-model="config.appsLayoutMode" label="1">列表模式</el-radio>
                </span>
                <span style="margin-top:10px;margin-bottom:20px">
                    <el-radio @change="valueChanged" v-model="config.appsLayoutMode" label="2">宫格模式</el-radio>
                </span>
                <div class="editItemContainer flexDiv-h" style="padding-bottom:0px;border-bottom:0px;border-top:1px solid #E4E7ED">
                    <el-button type="text" class="button-link" style="padding:0px">设置应用分组</el-button>
                    <span class="text-font-minor" style="margin-left:10px">应用较多时，可根据类别和使用频率对应用分组和排序</span>
                </div>
            </div>
        </div>
        <div class="flexDiv-h editItemContainer">
            <span class="text-font-normal item-header"></span>
            <div class="flexDiv-v">
                <el-checkbox class="button-link" @change="valueChanged" v-model="config.sendEmailOrSNS">开启</el-checkbox>
                <span class="text-font-minor" style="margin-top:10px">未使用融合客户端的成员收到聊天消息和应用消息，通过短信或邮件提醒他们</span>
            </div>
        </div>

    </div>
</template>
<script>
import platformConfig from "../mixin/platformConfig";
import api from "../../utility/api";
import iphone from "./iphone";
export default {
  mixins: [platformConfig],
  components: {
    iphone
  },
  methods: {
    async valueChanged(value) {
      await api.updateConfig(this.config);
      await api.getConfig();
    }
  }
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
