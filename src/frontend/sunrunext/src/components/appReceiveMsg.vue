<template>
  <div class="flexDiv-v ">
    <sub-header>
      {{appDetail.name}} - API接收消息
    </sub-header>
    <div class="flexDiv-v div-main">
      <el-form :model="form" ref="form" :rules="formRules">
        <div class="text-font-normal" style="font-size:16px;margin-bottom:20px">接收消息服务器配置</div>
        <el-form-item prop="receiveMsg_url">
          <div class="text-font-minor">URL填写的URL需要正确响应企业微信验证URL的请求。</div>
          <el-input size="small" v-model="form.receiveMsg_url" placeholder="以http://或者https://开头" />
        </el-form-item>
        <el-form-item prop="receiveMsg_url_token" :rules="[ { required: true, message: '请输入Token',trigger: 'blur'}] ">
          <div class="text-font-minor">Token（可由企业任意填写，用于生成签名）</div>
          <el-input size="small" v-model="form.receiveMsg_url_token" />
        </el-form-item>
        <el-form-item prop="receiveMsg_url_encodingAESKey" :rules="[ { required: true, message: '请输入EncodingAESKey',trigger: 'blur'}] ">
          <div class="text-font-minor">EncodingAESKey（用于消息体的加密，是AES密钥的Base64编码）</div>
          <el-input size="small" v-model="form.receiveMsg_url_encodingAESKey" />
        </el-form-item>
        <div class="flexDiv-v div-msgType">
          <div class="text-font-normal" style="font-size:16px;margin-bottom:20px">
            选择需要接收的消息事件类型
          </div>
          <div class="flexDiv-h">
            <el-checkbox v-model="form.receiveMsg_user">用户发送的普通消息</el-checkbox>
            <el-checkbox v-model="form.receiveMsg_contextMenu">自定义菜单操作</el-checkbox>
            <el-checkbox v-model="form.receiveMsg_location">上报地理位置</el-checkbox>
            <el-checkbox v-model="form.receiveMsg_enterApp">上报进入应用事件</el-checkbox>
          </div>
        </div>
      </el-form>
      <div style="margin-top:20px">
        <el-button type="primary" size="small" @click="confirmForm">确定</el-button>
        <el-button @click="cancelForm" size="small">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import subHeader from "./common/subHeader";
import api from "../utility/api";
import validator from "validator";

export default {
  data() {
    var checkUrl = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入正确的URL地址"));
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
      appId: "",
      appDetail: {},
      form: {
        receiveMsg_url: "",
        receiveMsg_url_token: "",
        receiveMsg_url_encodingAESKey: "",
        receiveMsg_user: false,
        receiveMsg_contextMenu: false,
        receiveMsg_location: false,
        receiveMsg_enterApp: false
      },
      formRules: {
        receiveMsg_url: [
          {
            validator: checkUrl,
            trigger: "blur"
          }
        ]
      }
    };
  },

  components: {
    subHeader
  },

  methods: {
    async updateApp(param, successMsg, errorMsg) {
      try {
        var result = await api.updateApp(this.appId, param);
        successMsg = successMsg || "更新成功";
        this.$message({
          message: successMsg,
          type: "success"
        });
      } catch (err) {
        errorMsg = errorMsg || "更新失败";
        this.$message.error(errorMsg);
      }
    },
    cancelForm() {
      this.$refs.form.resetFields();
      this.initForm();
    },
    confirmForm() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          await this.updateApp(this.form, "保存成功", "保存失败");
          this.appDetail = await api.getAppDetail(this.appId);
          this.initForm();
        }
      });
    },
    initForm() {
      this.form.receiveMsg_url = this.appDetail.receiveMsg_url;
      this.form.receiveMsg_url_token = this.appDetail.receiveMsg_url_token;
      this.form.receiveMsg_url_encodingAESKey = this.appDetail.receiveMsg_url_encodingAESKey;
      this.form.receiveMsg_user = this.appDetail.receiveMsg_user;
      this.form.receiveMsg_contextMenu = this.appDetail.receiveMsg_contextMenu;
      this.form.receiveMsg_location = this.appDetail.receiveMsg_location;
      this.form.receiveMsg_enterApp = this.appDetail.receiveMsg_enterApp;
    }
  },

  async mounted() {
    this.appId = this.$route.params.appId;
    this.appDetail = await api.getAppDetail(this.appId);
    this.initForm();
  }
};
</script>

<style lang="less" scoped>
.div-main {
  padding-top: 30px;
  padding-bottom: 30px;
  padding-left: 120px;
  padding-right: 120px;
}

.div-msgType {
  margin-top: 40px;
  border-top: 1px solid @color-border-level2;
  border-bottom: 1px solid @color-border-level2;
  padding-top: 20px;
  padding-bottom: 20px;
}
</style>
