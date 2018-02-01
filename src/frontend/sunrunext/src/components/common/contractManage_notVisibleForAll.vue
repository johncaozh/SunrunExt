<template>
  <div class="flexDiv-v">
    <div class="div-title">限制查看所有人</div>
    <div class="flexDiv-h div-content">
      <div class="div-container-selector">
        <contract-selector ref="contractSelector" emptyLabel="添加" notEmptyLabel="" editLabel="编辑" :selectValidate="checkValidate" :preSelectedOrgs="selectedOrgs" />
      </div>
      <div class="text-font-minor" style="margin-left:20px;margin-right:20px;align-self:center">对右侧成员隐藏</div>
      <div class="flexDiv-v div-container-selector">
        <div class="flexDiv-h text-font-minor" style="flex:1;align-items:center;justify-content:center;margin-top:-20px">
          所有人
        </div>
        <div class="div-container-whiteList">
          <contract-selector ref="whiteListContractSelector" direction="v" notEmptyLabel="除以下白名单成员：" emptyLabel="添加白名单" editLabel="编辑" :preSelectedOrgs="selectedWhiteListOrgs" />
        </div>
      </div>
    </div>
    <div style="padding-top:20px;padding-bottom:20px">
      <el-button size="small" @click="$router.go(-1)">取消</el-button>
      <el-button type="primary" @click="save" size="small">保存</el-button>
    </div>
  </div>
</template>
<script>
import contractSelector from "./contractSelector";
import api from "../../utility/api";
export default {
  data() {
    return {
      ruleId: null,
      type: "notVisibleForAll",
      selectedOrgs: [],
      rules: [],
      selectedWhiteListOrgs: [],
      whiteListRules: []
    };
  },
  async mounted() {
    this.ruleId = this.$route.query.ruleId;
    if (this.ruleId) {
      this.rules = await api.getOrgSpecials(this.type, this.ruleId, null);
      this.rules.forEach(i => {
        this.selectedOrgs.push(i.detail);
      });

      this.whiteListRules = await api.getOrgSpecialWhiteList(this.ruleId);
      this.whiteListRules.forEach(i => {
        this.selectedWhiteListOrgs.push(i.detail);
      });
    }
  },
  components: {
    contractSelector
  },
  methods: {
    async checkValidate(org) {
      if (org && org.id) {
        var targets = await api.getOrgSpecials(
          this.type,
          null,
          org.id,
          org.type
        );

        if (targets.length > 0) {
          this.$message.error("此成员已经设置限制，不能重复设置");
        }

        return targets.length == 0;
      }
      return false;
    },
    async save() {
      if (!this.ruleId) {
        this.ruleId = new Date().getTime();
      }
      var tempSelectedOrgs = this.$refs.contractSelector.selectedOrgs;
      var tempSelectedWhiteListOrgs = this.$refs.whiteListContractSelector
        .selectedOrgs;
      var deletedOrgs = this.rules.filter(
        i => tempSelectedOrgs.find(j => j.id == i.detail.id) == null
      );

      var addOrgs = tempSelectedOrgs.filter(
        i => this.selectedOrgs.find(j => j.id == i.id) == null
      );

      var deletedWhiteListOrgs = this.whiteListRules.filter(
        i => tempSelectedWhiteListOrgs.find(j => j.id == i.detail.id) == null
      );

      var addWhiteListOrgs = tempSelectedWhiteListOrgs.filter(
        i => this.whiteListRules.find(j => j.id == i.id) == null
      );

      var instance = this;
      var promiseArr = [];
      for (let i = 0; i < deletedOrgs.length; i++) {
        promiseArr.push(
          new Promise(async (resolve, reject) => {
            var result = await api.deleteOrgSpecial(deletedOrgs[i]._id);
            resolve(result);
          })
        );
      }

      for (let i = 0; i < addOrgs.length; i++) {
        promiseArr.push(
          new Promise(async (resolve, reject) => {
            var result = await api.createOrgSpecial({
              id: addOrgs[i].id,
              type: instance.type,
              ruleId: instance.ruleId,
              orgType: addOrgs[i].type
            });
            resolve(result);
          })
        );
      }

      for (let i = 0; i < deletedWhiteListOrgs.length; i++) {
        promiseArr.push(
          new Promise(async (resolve, reject) => {
            var result = await api.deleteOrgSpecialWhiteList(
              deletedWhiteListOrgs[i]._id
            );
            resolve(result);
          })
        );
      }

      for (let i = 0; i < addWhiteListOrgs.length; i++) {
        promiseArr.push(
          new Promise(async (resolve, reject) => {
            var result = await api.createOrgSpecialWhiteList({
              id: addWhiteListOrgs[i].id,
              ruleId: instance.ruleId,
              orgType: addWhiteListOrgs[i].type
            });
            resolve(result);
          })
        );
      }

      Promise.all(promiseArr);
      this.$router.go(-1);
    }
  }
};
</script>
<style lang="less" scoped>
.div-title {
  padding-top: 10px;
  padding-bottom: 10px;
}

.div-content {
  border-bottom: 1px solid @color-border-level2;
  border-top: 1px solid @color-border-level2;
  padding-top: 20px;
  padding-bottom: 20px;
  flex: 1;
}

.div-container-selector {
  padding: 20px;
  border: 1px solid @color-border-level2;
  min-height: 200px;
  flex: 1;
}

.div-container-whiteList {
  padding-top: 20px;
  border-top: 1px solid @color-border-level2;
}
</style>
