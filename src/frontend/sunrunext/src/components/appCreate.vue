<template>
  <el-container>
    <el-header>
      <sub-header>
        创建应用
      </sub-header>
    </el-header>
    <el-main>
      <el-form :model="form" ref="form" class="creatApp" :rules="formRule">
        <el-form-item label="应用Logo" :rules="[ { required: true, message: '产品Logo不能为空'}] " prop="avatar">
          <div class="avatar-container">
            <el-upload class="avatar-uploader" style="border: 1px dashed #d9d9d9;height:60px" :action="uploadUrl" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
              <img v-if="logoUrl" :src="logoUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <span class="minorText" style="margin-left:10px;font-size:12px;color:@color-font-minor">
              只能上传jpg/png文件，且不超过500kb
            </span>
          </div>
        </el-form-item>
        <el-form-item label="应用名称" :rules="[ { required: true, message: '产品名称不能为空'}] " prop="name">
          <el-input v-model="form.name" auto-complete="off" size="small"></el-input>
        </el-form-item>
        <el-form-item label="应用介绍（选填）" prop="desc">
          <el-input v-model="form.desc" auto-complete="off" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="应用模式：" prop="useInGroup">
          <div style="width:100%">
            <el-radio v-model="form.useInGroup" label=false>普通应用</el-radio>
            <el-radio v-model="form.useInGroup" label=true>群应用</el-radio>
          </div>
        </el-form-item>
        <el-form-item label="可见范围：" prop="iamUserIds">
          <contract-selector ref="contractSelector" emptyLabel="选择部门/成员" style="width:100% " :notEmptyLabel="null " />
        </el-form-item>
        <el-button type="primary " class="commit " @click="submitForm " style="margin-bottom:20px">创建应用</el-button>
      </el-form>
    </el-main>
  </el-container>
</template>

<script>
import subHeader from "./common/subHeader";
import api from "../utility/api";
import contractSelector from "./common/contractSelector";
export default {
  data() {
    var checkRules = (rule, value, callback) => {
      if (this.form.iamUserIds.length == 0 && this.form.iamOrgIds.length == 0) {
        return callback(new Error("请选择部门/成员"));
      }

      return callback();
    };
    return {
      formRule: {
        iamUserIds: [
          {
            validator: checkRules,
            trigger: "blur"
          }
        ],
        iamOrgIds: [
          {
            validator: checkRules,
            trigger: "blur"
          }
        ]
      },
      form: {
        name: null,
        desc: null,
        avatar: null,
        useInGroup: "false",
        iamUserIds: [],
        iamOrgIds: []
      },
      logoUrl: null,
      uploadUrl: api.fileTransferUrl
    };
  },
  components: {
    subHeader,
    contractSelector
  },

  methods: {
    handleAvatarSuccess(res, file) {
      this.logoUrl = `${api.fileTransferUrl}/${res.data}`;
      this.form.avatar = res.data;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }

      return isJPG && isLt2M;
    },
    submitForm() {
      this.form.iamUserIds = this.$refs.contractSelector.selectedUserIds;
      this.form.iamOrgIds = this.$refs.contractSelector.selectedOrgIds;

      this.$refs["form"].validate(valid => {
        if (valid) {
          api.createApp(this.form);
          this.$router.go(-1);
        } else {
          return false;
        }
      });
    }
  }
};
</script>``

<style lang="less" scoped>
.creatApp {
  width: 350px;
  margin: 0 auto;
}

.avatar-container {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  overflow: hidden;
  text-align: left;
  height: 60px;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
  height: 60px;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 60px;
  height: 60px;
  line-height: 60px;
  text-align: center;
}

.avatar {
  width: 60px;
  height: 60px;
  display: block;
}

.commit {
  margin-top: 20px;
  width: 100%;
}
</style>
