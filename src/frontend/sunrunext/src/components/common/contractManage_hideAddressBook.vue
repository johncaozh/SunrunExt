<template>
    <div class="flexDiv-v">
        <div class="div-title">限制查看所有人</div>
        <div class="div-content">
            <div class="div-container-selector">
                <contract-selector ref="contractSelector" emptyLabel="添加" notEmptyLabel="" editLabel="编辑" :selectValidate="checkValidate" :preSelectedOrgs="selectedOrgs" />
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
      type: "hideAddressBook",
      selectedOrgs: []
    };
  },
  async mounted() {
    this.ruleId = this.$route.query.ruleId;
    if (this.ruleId) {
      this.selectedOrgs = await api
        .getOrgSpecials(this.type, this.ruleId, null)
        .map(i => {
          i.id;
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
      var deletedOrgs = this.selectedOrgs.filter(
        i => tempSelectedOrgs.find(j => j.id == i.id) == null
      );

      var addOrgs = tempSelectedOrgs.filter(
        i => this.selectedOrgs.find(j => j.id == i.id) == null
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
              ruleId: instance.ruleId
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
  min-height: 100px;
}
</style>
