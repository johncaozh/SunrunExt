<template>
  <div class="flexDiv-v">
    <div class="div-title">限制查看外部门</div>
    <div class="flexDiv-h div-content">
      <div class="flexDiv-v div-container-selector">
        <contract-selector style="flex:1" ref="contractSelector" emptyLabel="添加部门或成员" notEmptyLabel="" editLabel="编辑" :selectValidate="checkValidate" :preSelectedOrgs="selectedOrgs" />
        <div class=" div-container-whiteList">
          <contract-selector ref="whiteListContractSelector_from" direction="v" notEmptyLabel="除以下白名单部门／成员：" emptyLabel="添加白名单" editLabel="编辑" :preSelectedOrgs="selectedWhiteListOrgs_from" />
        </div>
      </div>
      <div class="text-font-minor" style="margin-left:20px;margin-right:20px;align-self:center">只允许查看</div>
      <div class="flexDiv-v div-container-selector">
        <div class="flexDiv-h text-font-minor" style="flex:1;align-items:center;justify-content:center;margin-top:-20px">
          本部门通讯录
        </div>
        <div class="div-container-whiteList">
          <contract-selector ref="whiteListContractSelector_to" direction="v" notEmptyLabel="并额外可见以下部门／成员：" emptyLabel="添加额外可见的部门／成员" editLabel="编辑" :preSelectedOrgs="selectedWhiteListOrgs_to" />
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
      type: "onlyVisibleForDepartment",
      selectedOrgs: [],
      rules: [],
      selectedWhiteListOrgs_from: [],
      whiteListRules_from: [],
      selectedWhiteListOrgs_to: [],
      whiteListRules_to: []
    };
  },
  async mounted() {
    this.ruleId = this.$route.query.ruleId;
    if (this.ruleId) {
      this.rules = await api.getOrgSpecials(this.type, this.ruleId, null);
      this.rules.forEach(i => {
        this.selectedOrgs.push(i.detail);
      });

      var tempWhiteListRules = await api.getOrgSpecialWhiteList(this.ruleId);

      this.whiteListRules_from = tempWhiteListRules.filter(
        i => i.role == "from"
      );

      this.whiteListRules_from.forEach(i => {
        this.selectedWhiteListOrgs_from.push(i.detail);
      });

      this.whiteListRules_to = tempWhiteListRules.filter(i => i.role == "to");

      this.whiteListRules_to.forEach(i => {
        this.selectedWhiteListOrgs_to.push(i.detail);
      });
    }
  },
  components: {
    contractSelector
  },
  methods: {
    async checkValidate(org) {
      if (org && org.id) {
        var targets = await api.getOrgSpecials(this.type, null, org.id);

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
      var tempSelectedWhiteListOrgs_from = this.$refs
        .whiteListContractSelector_from.selectedOrgs;
      var tempSelectedWhiteListOrgs_to = this.$refs.whiteListContractSelector_to
        .selectedOrgs;
      var deletedOrgs = this.rules.filter(
        i => tempSelectedOrgs.find(j => j.id == i.detail.id) == null
      );

      var addOrgs = tempSelectedOrgs.filter(
        i => this.selectedOrgs.find(j => j.id == i.id) == null
      );

      var deletedWhiteListOrgs_from = this.whiteListRules_from.filter(
        i =>
          tempSelectedWhiteListOrgs_from.find(j => j.id == i.detail.id) == null
      );

      var addWhiteListOrgs_from = tempSelectedWhiteListOrgs_from.filter(
        i => this.whiteListRules_from.find(j => j.id == i.id) == null
      );

      var deletedWhiteListOrgs_to = this.whiteListRules_to.filter(
        i => tempSelectedWhiteListOrgs_to.find(j => j.id == i.detail.id) == null
      );

      var addWhiteListOrgs_to = tempSelectedWhiteListOrgs_to.filter(
        i => this.whiteListRules_to.find(j => j.id == i.id) == null
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

      for (let i = 0; i < deletedWhiteListOrgs_from.length; i++) {
        promiseArr.push(
          new Promise(async (resolve, reject) => {
            var result = await api.deleteOrgSpecialWhiteList(
              deletedWhiteListOrgs_from[i]._id
            );
            resolve(result);
          })
        );
      }

      for (let i = 0; i < addWhiteListOrgs_from.length; i++) {
        promiseArr.push(
          new Promise(async (resolve, reject) => {
            var result = await api.createOrgSpecialWhiteList({
              id: addWhiteListOrgs_from[i].id,
              ruleId: instance.ruleId,
              orgType: addWhiteListOrgs_from[i].type,
              role: "from"
            });
            resolve(result);
          })
        );
      }

      for (let i = 0; i < deletedWhiteListOrgs_to.length; i++) {
        promiseArr.push(
          new Promise(async (resolve, reject) => {
            var result = await api.deleteOrgSpecialWhiteList(
              deletedWhiteListOrgs_to[i]._id
            );
            resolve(result);
          })
        );
      }

      for (let i = 0; i < addWhiteListOrgs_to.length; i++) {
        promiseArr.push(
          new Promise(async (resolve, reject) => {
            var result = await api.createOrgSpecialWhiteList({
              id: addWhiteListOrgs_to[i].id,
              ruleId: instance.ruleId,
              orgType: addWhiteListOrgs_to[i].type,
              role: "to"
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
