<template>
  <el-card class="box-card" body-style="padding:20px">
    <div class="flexDiv-v">
      <div class="flexDiv-h" style="align-items:center">
        <i class="el-icon-custom-sso menuIcon" />IAM单点登录
      </div>
      <div v-if="iamProductName" class="text-font-minor" style="margin-top:10px;height:60px">绑定的产品：{{iamProductName}}</div>
      <div v-else class="text-font-minor" style="margin-top:10px;height:60px">使用IAM帐号登录已有的Web网页（没有选中任何产品意味着不需要单点登录）</div>
      <span>
        <el-button type="text" class="button-link" @click="openDialog">{{iamProductName?"修改":"设置"}}</el-button>
      </span>
      <el-dialog :close-on-click-modal=false title="设置应用单点登录" width="500px" :visible.sync="dialogVisible">
        <span>请选择该应用使用IAM单点登录时用到的产品：</span>
        <el-select style="width:100%" size="small" v-model="tempIamProductName" clearable placeholder="请选择产品">
          <el-option v-for="item in products" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
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
import api from "../../utility/api";
export default {
  data() {
    return {
      innerIamProductName: "",
      tempIamProductName: "",
      dialogVisible: false,
      products: []
    };
  },
  props: {
    iamProductName: {
      type: String,
      required: false
    }
  },
  watch: {
    iamProductName() {
      this.innerIamProductName = this.iamProductName;
    }
  },
  async mounted() {
    await this.getProductList();
  },
  methods: {
    async getProductList() {
      var data = await api.getProducts();
      this.products = [];
      data.forEach(i => {
        this.products.push({
          label: i.name,
          value: i.name
        });
      });
    },
    openDialog() {
      this.tempIamProductName = this.innerIamProductName;
      this.dialogVisible = true;
    },

    submitForm(formName) {
      this.dialogVisible = false;
      this.innerIamProductName = this.tempIamProductName;
      this.$emit("iamProductNameChanged", this.innerIamProductName);
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
}
</style>
