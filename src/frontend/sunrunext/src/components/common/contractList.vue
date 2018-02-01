<template>
  <div class="flexDiv-h" style="align-items:center">
    <div class="flexDiv-h " style="flex:1;flex-wrap:wrap">
      <div class="flexDiv-h div-org-selected" style="padding:2px;align-items:center" v-for="(item,index) in selectedOrgs" :key="index">
        <i class="el-icon-custom-group icon-org" v-show="item.type=='org'" style="margin-top:3px">
        </i>
        <i class="el-icon-custom-people icon-org" v-show="item.type=='user'" style="margin-top:3px">
        </i>
        <span style="flex:1" class="contract-name-selected">{{item.name}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    selectedOrgs: {
      type: Array,
      default: null,
      required: true
    }
  }
};
</script>

<style lang="less" scoped>
.div-org-selected {
  border: 1px solid @color-border-level2;
  align-items: center;
  margin-right: 10px;
  margin-bottom: 5px;
}

.icon-org {
  color: #3e6a8f;
  margin-right: 5px;
  font-size: 18px;
}

.contract-name-selected {
  font-size: 14px;
  min-width: 30px;
  max-width: 60px;
  color: @color-theme;
  line-height: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 10px;
}
</style>


