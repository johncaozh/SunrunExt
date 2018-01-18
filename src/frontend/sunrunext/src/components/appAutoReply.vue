<template>
  <div class="flexDiv-v">
    <sub-header> {{appDetail.name}} - 消息自动回复</sub-header>
    <div style="padding-left:120px;padding-right:120px">
      <div class="flexDiv-h editItemContainer" style="align-items:center">
        <el-button type="text" class="button-link" style="margin-right:10px" @click="$router.push('/apps/'+appId+'/autoReply/new')" v-if="!appDetail.autoReplyRules.defaultRule">添加消息自动回复</el-button>
        <span class="text-font-minor" v-if="!appDetail.autoReplyRules.defaultRule">设置成员发送任意消息后应用回复的内容</span>
        <span class="text-font-minor" style="font-size:13px;margin-right:10px" v-if="appDetail.autoReplyRules.defaultRule">消息自动回复</span>
        <div class="flexDiv-h" style="align-items:center;flex:1" v-if="appDetail.autoReplyRules.defaultRule">
          <span v-if="appDetail.autoReplyRules.defaultRule.appMessageTemplateId.type=='text'">
            文本消息
          </span>
          <span v-else-if="appDetail.autoReplyRules.defaultRule.appMessageTemplateId.type=='news'">
            图文消息
          </span>
          <span v-else-if="appDetail.autoReplyRules.defaultRule.appMessageTemplateId.type=='externalLinkNews'">
            外链图文消息
          </span>
          <span v-else-if="appDetail.autoReplyRules.defaultRule.appMessageTemplateId.type=='photo'">
            图片消息
          </span>
          <span v-else-if="appDetail.autoReplyRules.defaultRule.appMessageTemplateId.type=='voice'">
            语音消息
          </span>
          <span v-else-if="appDetail.autoReplyRules.defaultRule.appMessageTemplateId.type=='video'">
            视频消息
          </span>
          <span v-else-if="appDetail.autoReplyRules.defaultRule.appMessageTemplateId.type=='file'">
            文件消息
          </span>
        </div>
        <span v-if="appDetail.autoReplyRules.defaultRule">
          <el-button size="mini" @click="$router.push('/apps/'+appId+'/autoReply/new')">编辑</el-button>
          <el-button size="mini" type="danger" @click="deleteDefaultAutoReplyRule(appDetail.autoReplyRules.defaultRule)">删除</el-button>
        </span>
      </div>
      <div class="flexDiv-v editItemContainer" style="justify-content:flex-start" :style="{'border-bottom':appDetail.autoReplyRules.keywordRules.length>0?'0px':'1px solid #E4E7ED'}">
        <div class="flexDiv-h" style="align-items:center">
          <span class="text-font-minor" style="font-size:13px;margin-right:10px" v-show="appDetail.autoReplyRules.keywordRules.length>0">关键词自动回复</span>
          <el-button type="text" class="button-link" style="margin-right:10px;" @click="$router.push('/apps/'+appId+'/autoReply/newKeyword')">{{appDetail.autoReplyRules.keywordRules.length>0?"继续添加":"添加关键词自动回复"}}</el-button>
          <span class="text-font-minor">设置成员发送关键词消息后应用回复的内容</span>
        </div>
        <el-table :data="appDetail.autoReplyRules.keywordRules" style="width: 100%" v-show="appDetail.autoReplyRules.keywordRules.length>0">
          <el-table-column prop="name" label="规则名" width="180">
          </el-table-column>
          <el-table-column prop="rules" label="关键字">
            <template slot-scope="scope">
              <div class="flexDiv-h">
                <div class="div-rule" v-for="(item,index) in scope.row.rules" :key="index">
                  {{item.keyword}}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-button size="mini" @click="$router.push('/apps/'+appId+'/autoReply/newKeyword?groupName='+scope.row.name)">编辑</el-button>
              <el-button size="mini" type="danger" @click="deleteAutoReplyRuleGroup(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import subHeader from "./common/subHeader";
import api from "../utility/api";
export default {
  data() {
    return {
      appId: null,
      appDetail: null
    };
  },
  components: {
    subHeader
  },
  async mounted() {
    this.appId = this.$route.params.appId;
    await this.refreshAppDetail();
  },
  methods: {
    async deleteDefaultAutoReplyRule(rule) {
      await this.deleteAutoReplyRule(rule._id);
      await this.deleteAppMessageTemplate(rule.appMessageTemplateId._id);
      await this.refreshAppDetail();
    },
    async deleteAutoReplyRuleGroup(ruleGroup) {
      var promiseArr = [];
      var instance = this;
      ruleGroup.rules.forEach(i => {
        var p = new Promise(async function(resolve, reject) {
          var result = await instance.deleteAutoReplyRule(i._id);
          resolve(result);
        });

        promiseArr.push(p);
      });

      var p = new Promise(async function(resolve, reject) {
        var result = await instance.deleteAppMessageTemplate(
          ruleGroup.appMessageTemplate._id
        );
        resolve(result);
      });

      promiseArr.push(p);
      await Promise.all(promiseArr);
      this.refreshAppDetail();
    },
    async deleteAutoReplyRule(id) {
      return await api.deleteAppAutoReplyRule(id);
    },
    async deleteAppMessageTemplate(id) {
      return await api.deleteAppMessageTemplate(id);
    },
    async refreshAppDetail() {
      this.appDetail = await api.getAppDetail(this.appId);
    }
  }
};
</script>

<style lang="less" scoped>
.editItemContainer {
  border-bottom: 1px solid @color-border-level2;
  padding-top: 20px;
  padding-bottom: 20px;
}

.div-rule {
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 2px;
  padding-bottom: 2px;
  border: 1px solid @color-border-level2;
  margin-right: 10px;
  border-radius: 3px;
}
</style>


