<template>
  <div class="flexDiv-h div-root1">
    <div class="flexDiv-v" style="flex:1">
      <div class="text-font-normal" style="margin-bottom:20px">{{userName}}  您好，欢迎登录尚云企业应用管理平台。</div>
      <el-collapse :accordion="true">
        <el-collapse-item v-for="(item,index) in news" :key="index" :title="item.title">
          <div v-html="item.detail"></div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div class="flexDiv-v div-right" v-if="config">
      <img :src="config.enterpriseLogoMediaId|getMediaLink" class="img-log" />
      <div class="div-enterpriseName">{{config.enterpriseName}}</div>
      <div class="div-count text-font-normal">人员：
        <router-link to="/orgs">
          {{userCount}}人
        </router-link>
      </div>
      <div class="div-count text-font-normal">部门：
        <router-link to="/orgs">
          {{orgCount}}个
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import platformConfig from "./mixin/platformConfig";
import api from "../utility/api";
import helper from "../utility/helper";
export default {
  mixins: [platformConfig],
  data() {
    return {
      userName: null,
      orgArr: [],
      news: [
        {
          title: "这是一条测试新闻",
          detail:
            "与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。"
        },
        {
          title: "这是一条测试新闻",
          detail:
            "与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。"
        },
        {
          title: "这是一条测试新闻",
          detail:
            "与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。"
        },
        {
          title: "这是一条测试新闻",
          detail:
            "与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。"
        },
        {
          title: "这是一条测试新闻",
          detail:
            "与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。"
        },
        {
          title: "这是一条测试新闻",
          detail:
            "与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。"
        },
        {
          title: "这是一条测试新闻",
          detail:
            "与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。"
        }
      ]
    };
  },
  computed: {
    orgCount() {
      return this.orgArr.filter(i => i.type == "org").length;
    },
    userCount() {
      return this.orgArr.filter(i => i.type == "user").length;
    }
  },
  async mounted() {
    this.userName = helper.getCookie("userName");
    var orgs = await api.getOrg();
    this.orgArr = [];
    this.getOrgArr(orgs);
  },
  methods: {
    getOrgArr(org) {
      this.orgArr = this.orgArr || [];

      if (this.orgArr.indexOf(org) == -1) this.orgArr.push(org);

      org.users.forEach(u => {
        u.type = "user";
        this.orgArr.push(u);
      });
      org.subOrgs.forEach(j => {
        j.type = "org";
        this.orgArr.push(j);
        this.getOrgArr(j);
      });
    }
  }
};
</script>

<style scoped lang="less">
.div-root1 {
  padding-left: 40px;
  padding-right: 40px;
  padding-top: 30px;
  padding-bottom: 30px;
}

.div-right {
  border-left: 1px dotted @color-border-level2;
  width: 280px;
  padding-left: 10px;
  margin-left: 30px;
  align-items: center;
}

.img-log {
  width: 300px;
  height: 80px;
}

.div-enterpriseName {
  font-size: 14px;
  border-bottom: 1px solid @color-border-level2;
  color: @color-theme;
  margin-top: 10px;
  padding-top: 10px;
  padding-bottom: 15px;
  padding-left: 100px;
  padding-right: 100px;
}

.div-count {
  align-self: flex-start;
  margin-left: 10px;
  margin-top: 15px;
}

a {
  text-decoration: none;
  color: @color-theme;
}

a:hover {
  text-decoration: underline;
}
</style>


