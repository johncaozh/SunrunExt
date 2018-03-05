<template>
  <div class="flexDiv-v">
    <div class="flexDiv-h editItemContainer">
      <span class="text-font-normal item-header">隐藏的部门/成员</span>
      <div class="flexDiv-v" style="flex:1">
        <div class="flexDiv-h">
          <el-button class="button-link" type="text" style="padding:0px" @click="$router.push('/enterprise/contract/notvisibleForAll')">添加</el-button>
          <span class="text-font-minor" style="margin-left:10px">被隐藏的部门或者成员，不会显示在公司通讯录中</span>
        </div>
        <div v-for="(item,index) in notVisibleForAlls" :key="index" class="flexDiv-h div-item-container">
          <contract-list :selectedOrgs="item.orgs" style="flex:1" />
          <el-button class="button-link" type="text" @click="$router.push('/enterprise/contract/notVisibleForAll?ruleId='+item.ruleId)">编辑</el-button>
          <el-button class="button-link" type="text" @click="deleteRule(item)">删除</el-button>
        </div>
      </div>
    </div>
    <div class="flexDiv-h editItemContainer">
      <span class="text-font-normal item-header">限制查看外部门</span>
      <div class="flexDiv-v" style="flex:1">
        <div class="flexDiv-h">
          <el-button class="button-link" type="text" style="padding:0px" @click="$router.push('/enterprise/contract/onlyVisibleForDepartment')">添加</el-button>
          <span class="text-font-minor" style="margin-left:10px">被限制的部门，只能看到本部门的通讯录</span>
        </div>
        <div v-for="(item,index) in onlyVisibleForDepartments" :key="index" class="flexDiv-h div-item-container">
          <contract-list :selectedOrgs="item.orgs" style="flex:1" />
          <el-button class="button-link" type="text" @click="$router.push('/enterprise/contract/onlyVisibleForDepartment?ruleId='+item.ruleId)">编辑</el-button>
          <el-button class="button-link" type="text" @click="deleteRule(item)">删除</el-button>
        </div>
      </div>
    </div>
    <div class="flexDiv-h editItemContainer">
      <span class="text-font-normal item-header">限制查看所有人</span>
      <div class="flexDiv-v" style="flex:1">
        <div class="flexDiv-h">
          <el-button class="button-link" type="text" style="padding:0px" @click="$router.push('/enterprise/contract/hideAddressBook')">添加</el-button>
          <span class="text-font-minor" style="margin-left:10px">被限制的部门或者成员，不能看到企业所有通讯录</span>
        </div>
        <div v-for="(item,index) in hideAddressBooks" :key="index" class="flexDiv-h div-item-container">
          <contract-list :selectedOrgs="item.orgs" style="flex:1" />
          <el-button class="button-link" type="text" @click="$router.push('/enterprise/contract/hideAddressBook?ruleId='+item.ruleId)">编辑</el-button>
          <el-button class="button-link" type="text" @click="deleteRule(item)">删除</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import api from "../../utility/api";
import contractList from "./contractList";
export default {
  data() {
    return {
      notVisibleForAlls: [],
      onlyVisibleForDepartments: [],
      hideAddressBooks: []
    };
  },
  components: {
    contractList
  },
  async mounted() {
    await this.loadData();
  },
  methods: {
    async loadData() {
      var datas = await api.getOrgSpecials();
      this.notVisibleForAlls = this.groupByRuleId(
        datas.filter(i => {
          return i.type == "notVisibleForAll";
        })
      );
      this.onlyVisibleForDepartments = this.groupByRuleId(
        datas.filter(i => {
          return i.type == "onlyVisibleForDepartment";
        })
      );
      this.hideAddressBooks = this.groupByRuleId(
        datas.filter(i => {
          return i.type == "hideAddressBook";
        })
      );
    },
    groupByRuleId(arr) {
      var groupObject = {};
      arr.forEach(i => {
        groupObject[i.ruleId] = groupObject[i.ruleId] || {};
        groupObject[i.ruleId].orgs = groupObject[i.ruleId].orgs || [];
        groupObject[i.ruleId].origins = groupObject[i.ruleId].origins || [];
        groupObject[i.ruleId].orgs.push(i.detail);
        groupObject[i.ruleId].origins.push(i);
      });

      var groupArr = [];
      for (var p in groupObject) {
        groupArr.push({
          ruleId: p,
          orgs: groupObject[p].orgs,
          origins: groupObject[p].origins
        });
      }

      return groupArr;
    },
    deleteRule(item) {
      this.$confirm("确定删除这条限制规则吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          var promiseArr = [];
          for (var i = 0; i < item.origins.length; i++) {
            promiseArr.push(
              new Promise(async (resolve, reject) => {
                var result = await api.deleteOrgSpecial(item.origins[i]._id);
                resolve(result);
              })
            );
          }

          await Promise.all(promiseArr);
          await this.loadData();
        })
        .catch(err => {});
    }
  }
};
</script>
<style lang="less" scoped>
.item-header {
  font-size: 13px;
  width: 150px;
}

.div-uploader {
  width: 236px;
  height: 62px;
  align-items: center;
  justify-content: center;
  border: 1px solid @color-border-level2;
}

.div-item-container {
  border: 1px solid @color-border-level2;
  padding: 10px;
  margin-top: 10px;
}
</style>
