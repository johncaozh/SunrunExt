<template>
    <div class="flexDiv-v" v-if="config">
        <div class="flexDiv-v editItemContainer">
            <div class="flexDiv-h" style="align-items:center">
                <span class="text-font-normal item-header">企业Logo</span>
                <el-upload :action="uploadUrl" :show-file-list="false" :on-success="handleLogoSuccess" :before-upload="beforeLogoUpload">
                    <div class="flexDiv-v div-uploader">
                        <img v-if="logoUrl" :src="logoUrl" class="avatar">
                        <i v-else class="el-icon-custom-camera" style="font-size:20px"></i>
                    </div>
                    <div slot="tip" class="text-font-minor">推荐尺寸702*180</div>
                </el-upload>
            </div>
            <div class="flexDiv-h" style="align-items:center;margin-top:20px">
                <span class="text-font-normal item-header">企业简称</span>
                <input class="input-borderless" type="text" v-model="config.enterpriseName" placeholder="在此输入企业简称" />
            </div>
        </div>
        <div class="flexDiv-v editItemContainer">
            <div class="flexDiv-h" style="align-items:center">
                <span class="text-font-normal item-header">企业成员</span>
                <input class="input-borderless" type="text" placeholder="当前没有企业成员" readonly="readonly" />
            </div>
            <div class="flexDiv-h" style="align-items:center;margin-top:20px">
                <span class="text-font-normal item-header">企业部门</span>
                <input class="input-borderless" type="text" placeholder="当前没有企业部门" readonly="readonly" />
            </div>
        </div>
        <div class="flexDiv-v editItemContainer">
            <div class="flexDiv-h" style="align-items:center">
                <span class="text-font-normal item-header">企业电话</span>
                <input class="input-borderless" type="text" v-model="config.enterprisePhone" placeholder="在此输入企业电话" />
            </div>
            <div class="flexDiv-h" style="align-items:center;margin-top:20px">
                <span class="text-font-normal item-header">企业地址</span>
                <input class="input-borderless" type="text" v-model="config.enterpriseAddress" placeholder="在此输入企业地址" />
            </div>
        </div>
        <span style="margin-top:20px">
            <el-button type="normal" @click="getConfig">取消</el-button>
            <el-button type="primary" @click="updateConfig(config)">保存</el-button>
        </span>
    </div>
</template>
<script>
import platformConfig from "../mixin/platformConfig";
export default {
  mixins: [platformConfig],
  data() {
    return {
      logoUrl: null
    };
  },
  watch: {
    config() {
      if (this.config && this.config.enterpriseLogoMediaId)
        this.logoUrl = `${api.fileTransferUrl}/${this.enterpriseLogoMediaId}`;
    }
  },
  methods: {
    async valueChanged(value) {
      await api.updateConfig(this.config);
      await api.getConfig();
    },
    handleLogoSuccess(res, file) {
      this.logoUrl = `${api.fileTransferUrl}/${res.data}`;
      this.config.enterpriseLogoMediaId = res.data;
    },
    beforeLogoUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传的Logo图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传的Logo图片大小不能超过 2MB!");
      }

      return isJPG && isLt2M;
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
