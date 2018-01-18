<template>
  <div class="flexDiv-v" v-if="appDetail">
    <sub-header> {{appDetail.name}} - {{groupName?"编辑":"添加"}}关键词自动回复</sub-header>
    <div class="flexDiv-v" style="padding-left:120px;padding-right:120px;padding-top:10px;padding-bottom:30px">
      <el-form :model="form" ref="form" :rules="formRule">
        <el-form-item label="规则名" prop="name">
          <el-input size="small" v-model="form.name" placeholder="请输入规则名" />
        </el-form-item>
        <el-form-item label="关键字" prop="rules">
          <div class="flexDiv-v" style="width:100%">
            <el-input v-model="item.keyword" placeholder="请输入关键字" class="input-with-select" size="small" v-for="(item,index) in form.rules" :key="index" style="margin-bottom:10px">
              <el-select v-model="item.type" slot="prepend" placeholder="请选择" style="width:100px">
                <el-option label="包含" value="match"></el-option>
                <el-option label="完全匹配" value="exactMatch"></el-option>
              </el-select>
              <el-button slot="append" icon="el-icon-delete" @click="removeRule(item)" v-if="form.rules.length>1"></el-button>
            </el-input>
            <el-button class="button-link" type="text" style="align-self:flex-start" v-show="form.rules.length<10" @click="addRule">添加</el-button>
          </div>
        </el-form-item>
      </el-form>
      <app-message-template-creator ref="messageTemplateCreator" :template="appMessageTemplate" />
      <div class="flexDiv-h editItemContainer" style="align-items:center">
        <el-checkbox v-model="safe">保密</el-checkbox>
        <span class="text-font-minor" style="margin-left:20px">开启保密后，文章详情页面将印有收件人姓名</span>
      </div>
      <el-button type="primary" style="align-self:flex-start;margin-top:20px" @click="save">保存</el-button>
    </div>
  </div>
</template>

<script>
import appMessageTemplateCreator from "./common/appMessageTemplateCreator";
import subHeader from "./common/subHeader";
import api from "../utility/api";
export default {
  data() {
    var checkName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("规则名不能为空"));
      }

      if (value.length > 32) {
        return callback(new Error("规则名不能超过32个字符"));
      }

      return callback();
    };

    var checkRules = (rule, value, callback) => {
      if (this.form.rules.length == 0) {
        return callback(new Error("请添加关键字规则"));
      }

      this.form.rules.forEach(i => {
        if (!i.keyword) return callback(new Error("关键字不能为空"));
      });

      return callback();
    };
    return {
      appId: null,
      appDetail: null,
      safe: false,
      form: {
        name: null,
        rules: []
      },
      formRule: {
        name: [
          {
            validator: checkName,
            trigger: "blur"
          }
        ],
        rules: [
          {
            validator: checkRules,
            trigger: "blur"
          }
        ]
      },
      groupName: null,
      removeRules: [],
      appMessageTemplate: null
    };
  },
  components: {
    appMessageTemplateCreator,
    subHeader
  },
  async mounted() {
    this.appId = this.$route.params.appId;
    this.groupName = this.$route.query.groupName;
    this.appDetail = await api.getAppDetail(this.appId);

    if (this.groupName) {
      var instance = this;
      var targetRuleGroup = this.appDetail.autoReplyRules.keywordRules.find(
        i => i.name == instance.groupName
      );

      if (targetRuleGroup) {
        this.form.name = this.groupName;
        this.appMessageTemplate = targetRuleGroup.appMessageTemplate;
        targetRuleGroup.rules.forEach(i => {
          this.form.rules.push({
            keyword: i.keyword,
            type: i.type,
            _id: i._id
          });
        });

        if (targetRuleGroup.rules.length > 0)
          this.safe = targetRuleGroup.rules[0].safe;
      }
    }

    if (this.form.rules.length == 0) {
      this.addRule();
    }
  },
  methods: {
    createRule() {
      return {
        type: "match",
        keyword: ""
      };
    },
    addRule() {
      var newRule = this.createRule();
      this.form.rules.push(newRule);
    },
    removeRule(rule) {
      this.form.rules.removeByValue(rule);

      if (rule._id) {
        this.removeRules.push(rule);
      }
    },
    async save() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          var data = this.$refs.messageTemplateCreator.save();

          if (data) {
            var appMessageTemplate = this.appMessageTemplate;
            if (this.appMessageTemplate) {
              appMessageTemplate = await api.updateAppMessageTemplate(
                this.appMessageTemplate._id,
                data
              );
            } else {
              appMessageTemplate = await api.createAppMessageTemplate(data);
            }
            var promiseArr = [];

            this.form.rules.forEach(rule => {
              var instance = this;
              var p = new Promise(async function(resolve, reject) {
                var autoReplyRuleData = {
                  name: instance.form.name,
                  type: rule.type,
                  keyword: rule.keyword,
                  safe: instance.safe,
                  appId: instance.appId,
                  appMessageTemplateId: appMessageTemplate._id
                };

                var result = null;

                if (rule._id) {
                  result = await api.updateAppAutoReplyRule(
                    rule._id,
                    autoReplyRuleData
                  );
                } else {
                  result = await api.createAppAutoReplyRule(autoReplyRuleData);
                }

                resolve(result);
              });

              promiseArr.push(p);
            });

            this.removeRules.forEach(rule => {
              var instance = this;
              var p = new Promise(async function(resolve, reject) {
                var result = await api.deleteAppAutoReplyRule(rule._id);
                resolve(result);
              });

              promiseArr.push(p);
            });

            await Promise.all(promiseArr);
            this.$router.go(-1);
          }
        } else {
          return false;
        }
      });
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
</style>


