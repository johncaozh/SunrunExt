<template>
  <el-card class="box-card" body-style="padding:20px">
    <div class="flexDiv-v">
      <div class="flexDiv-h" style="align-items:center;">
        <i class="el-icon-custom-workspace menuIcon" />应用主页
      </div>
      <div v-if="url" class="text-font-minor" style="margin-top:10px;height:60px">应用主页：{{url}}</div>
      <div v-else class="text-font-minor" style="margin-top:10px;height:60px">从工作台点击进入的网页URL（如果没有设置，则点击后跳转到应用会话页面）</div>
      <span>
        <el-button type="text" class="button-link" @click="openDialog">{{url?"修改":"设置应用主页"}}</el-button>
      </span>
      <el-dialog :close-on-click-modal=false title="设置应用主页地址" width="500px" :visible.sync="dialogVisible">
        <el-form :model="urlForm" :rules="urlRule" ref="urlForm">
          <el-form-item label="主页地址（以http://或https://开头的URL）" prop="url">
            <el-input v-model="urlForm.url" size="small" :autofocus=true prefix-icon="el-icon-location-outline" />
            <div class="flexDiv-h" style="align-items:center">
              <el-checkbox v-model="urlForm.isInternelUrl">识别为外网地址
              </el-checkbox>
              <tooltip text="当主页地址为外网地址时，融合客户端在任何的网络环境（内外网），都将以非代理的方式直接访问应用。" style="margin-left:20px" />
            </div>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer ">
          <el-button @click="dialogVisible=false" size="small">取消</el-button>
          <el-button type="primary" size="small" @click="submitForm('urlForm')">提交</el-button>
        </div>
      </el-dialog>
    </div>
  </el-card>
</template>

<script>
import validator from "validator";
import tooltip from "./tooltip";
export default {
  data() {
    var checkUrl = (rule, value, callback) => {
      if (!value) {
        return callback();
      }

      if (!value.startsWith("http://") && !value.startsWith("https://")) {
        return callback(new Error("请填写带http或https协议头的合法URL"));
      }

      var isUrl = validator.isURL(value, ["http", "https"]);

      if (isUrl) {
        return callback();
      } else {
        return callback(new Error("请填写带http或https协议头的合法URL"));
      }
    };

    return {
      url: "",
      isInternelUrl: false,
      dialogVisible: false,
      urlForm: {
        url: "",
        isInternelUrl: false
      },
      urlRule: {
        url: [
          {
            validator: checkUrl,
            trigger: "blur"
          }
        ]
      }
    };
  },
  components: {
    tooltip
  },
  props: {
    homeUrl: {
      type: String,
      required: false
    },
    homeIsInternelUrl: {
      type: Boolean,
      required: false
    }
  },
  watch: {
    homeUrl() {
      this.url = this.homeUrl;
    },
    homeIsInternelUrl() {
      this.isInternelUrl = this.homeIsInternelUrl;
    }
  },
  methods: {
    openDialog() {
      this.urlForm.url = this.url;
      this.urlForm.isInternelUrl = this.isInternelUrl;
      this.dialogVisible = true;
    },

    submitForm(formName) {
      this.$refs[formName].validate(valid => { 
        if (valid) {
          this.dialogVisible = false;
          this.url = this.urlForm.url;
          this.isInternelUrl = this.urlForm.isInternelUrl;
          this.$emit("urlChanged", this.url);
          this.$emit("isInternelUrlChanged", this.isInternelUrl);
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
.box-card {
  width: 270px;
  height: 170px;
  margin-right: 12px;
  margin-bottom: 12px;
  border: 1px solid @color-border-level2;
  /* padding: 30px; */
}
</style>
