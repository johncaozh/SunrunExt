<template>
  <div class="flexDiv-h div-root" style="align-items:center;justify-content:center">
    <div class="flexDiv-v div-login " @click="showSystemLoginForm">
      <div class="flexDiv-v div-login-mode">
        <i class="el-icon-custom-tool i-icon-login" />
      </div>
      <div class="div-login-title">
        系统管理员登录
      </div>
    </div>
    <div style="width:100px"></div>
    <div class="flexDiv-v div-login " @click="gotoIamPage">
      <div class="flexDiv-v div-login-mode">
        <i class="el-icon-custom-verify i-icon-login" />
      </div>
      <div class="div-login-title">
        iam登录
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" title="系统管理员登录" width="500px">
      <el-form :model="systemLoginForm" ref="form">
        <el-form-item label="账号" prop="id" :rules="[ { required: true, message: '请输入管理员账号',trigger: 'blur'}] ">
          <el-input :autofocus="true" placeholder="请输入管理员账号" size="normal" v-model="systemLoginForm.id" @keyup.enter.native="confirmLogin" />
        </el-form-item>
        <el-form-item label="密码" prop="password" :rules="[ { required: true, message: '请输入管理员密码',trigger: 'blur'}] ">
          <el-input size="normal" type="password" placeholder="请输入管理员密码" v-model="systemLoginForm.password" @keyup.enter.native="confirmLogin" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer ">
        <el-button @click="cancelLogin">取消</el-button>
        <el-button type="primary" @click="confirmLogin">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from "../utility/api";
import env from "../utility/env";
import helper from "../utility/helper";
export default {
  data() {
    return {
      dialogVisible: false,
      systemLoginForm: {
        id: null,
        password: null
      },
      redirectUrl: null
    };
  },
  async mounted() {
    var st = this.$route.query.st;
    this.redirectUrl = this.$route.query.redirect;
    if (st) {
      await this.login({
        mode: "iam",
        st: st
      });
    }
  },
  methods: {
    async login(data, redirectUrl) {
      try {
        var loginUserData = await api.login(data);
        helper.setCookie("userId", loginUserData.userId);
        helper.setCookie("userName", loginUserData.userName);
        helper.setCookie("loginMode", data.mode);
        this.$router.push(this.redirectUrl || "/home");
      } catch (err) {
        this.$message({
          message: err.msg,
          type: "error"
        });
        return null;
      }
    },
    gotoIamPage() {
      var a = document.createElement("a");
      a.href = `${env.serverConfig.iamLoginRedirectUrl}?service=${
        window.location.href
      }`;
      a.click();
    },
    showSystemLoginForm() {
      this.systemLoginForm.id = null;
      this.systemLoginForm.password = null;
      this.dialogVisible = true;
    },
    confirmLogin() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          var postData = {
            mode: "system",
            userId: this.systemLoginForm.id,
            password: this.systemLoginForm.password
          };
          var logonUserData = await this.login(postData);
          this.dialogVisible = logonUserData == null;
        }
      });
    },
    cancelLogin() {
      this.dialogVisible = false;
      this.systemLoginForm.id = null;
      this.systemLoginForm.password = null;
    }
  }
};
</script>

<style lang="less" scoped>
.div-root {
  position: absolute;
  background: @color-theme;
  width: 100%;
  height: 100%;
}

.div-login {
  cursor: pointer;
  align-items: center;
}

.div-login:hover {
  transform: translateY(5px);
  transition-duration: 0.3s;
}

.div-login:hover .div-login-mode {
  box-shadow: 0px 0px 20px yellow;
}

.div-login-title {
  color: white;
  margin-top: 20px;
}

.div-login-mode {
  width: 80px;
  height: 80px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: white;
  color: @color-theme;
  box-shadow: 0px 0px 20px black;
}

.i-icon-login {
  font-size: 48px;
  color: @color-theme;
  margin-top: 10px;
}
</style>
