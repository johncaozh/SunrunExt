<template>
  <div class="flexDiv-v" v-if="config">
    <div class="flexDiv-v editItemContainer">
      <div class="flexDiv-h" style="align-items:center">
        <span class="text-font-normal item-header">企业Logo</span>
        <el-upload :with-credentials="true" :action="uploadUrl" :show-file-list="false" :on-success="handleLogoSuccess" :before-upload="beforeLogoUpload">
          <div class="flexDiv-v div-uploader">
            <img v-if="config.enterpriseLogoMediaId" :src="config.enterpriseLogoMediaId|getMediaLink" class="img-log">
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
        <input class="input-borderless" type="text" readonly="readonly" v-model="userCount" placeholder="当前没有企业成员" />
      </div>
      <div class="flexDiv-h" style="align-items:center;margin-top:20px">
        <span class="text-font-normal item-header">企业部门</span>
        <input class="input-borderless" type="text" placeholder="当前没有企业部门" readonly="readonly" v-model="orgCount" />
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
    <span style="margin-top:20px;margin-bottom:20px">
      <el-button type="normal" size="small" @click="getConfig">取消</el-button>
      <el-button type="primary" size="small" @click="updateConfig(config)">保存</el-button>
    </span>
  </div>
</template>
<script>
import platformConfig from "../mixin/platformConfig";
import api from "../../utility/api";
import upload from "../mixin/upload.js";
export default {
  mixins: [platformConfig, upload],
  data() {
    return {
      orgArr: []
    };
  },
  computed: {
    orgCount() {
      var count = this.orgArr.filter(i => i.type == "org").length;
      return `${count} 个部门`;
    },
    userCount() {
      var count = this.orgArr.filter(i => i.type == "user").length;
      return `${count} 个成员`;
    }
  },
  async mounted() {
    var orgs = await api.getOrg();
    this.orgArr = [];
    this.getOrgArr(orgs);
  },
  methods: {
    getOrgArr(org) {
      this.orgArr = this.orgArr || [];

      if (this.orgArr.indexOf(org) == -1) this.orgArr.push(org);

      org.users.forEach(u => {
        u.type = "user";
        this.orgArr.push(u);
      });
      org.subOrgs.forEach(j => {
        j.type = "org";
        this.orgArr.push(j);
        this.getOrgArr(j);
      });
    },
    async valueChanged(value) {
      await api.updateConfig(this.config);
      await api.getConfig();
    },
    handleLogoSuccess(res, file) {
      this.config.enterpriseLogoMediaId = res.data;
    },
    beforeLogoUpload(file) {
      const isvalidImage =
        file.type === "image/jpeg" ||
        file.type === "image/jpg" ||
        file.type === "image/png" ||
        file.type === "image/bmp";

      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isvalidImage) {
        this.$message.error("上传的Logo只能是 JPEG、JPG、PNG、BMP");
      } else if (!isLt2M) {
        this.$message.error("上传的Logo大小不能超过 2MB!");
      }

      var result = isvalidImage && isLt2M;

      if (result) this.isUploading = true;

      return result;
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

.img-log {
  width: 236px;
  height: 62px;
}
</style>
