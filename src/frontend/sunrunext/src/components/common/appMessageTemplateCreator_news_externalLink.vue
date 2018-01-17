<template>
  <div class="flexDiv-h " style="align-items:flex-start">
    <div class="flexDiv-v editContainer" style="flex:1">
      <div class="editItemContainer" style="padding-top:0px">
        <input type="text" v-model="editingNew.title" placeholder="在此输入标题" class="input-title" />
      </div>
      <div class="editItemContainer">
        <span class="text-font-minor">
          <img :src="editingNew.mediaUrl" style="width:120px;height:60px;" v-show="editingNew.mediaId" />
          <el-upload :show-file-list="false" :on-success="handleCoverSuccess" :before-upload="beforeCoverUpload" v-loading="isUploading" style="display:inline-block" :action="uploadUrl">
            <el-button type="text" class="button-link" style="margin-right:10px;">{{editingNew.mediaId?"更改":"添加封面图"}}</el-button>
          </el-upload>
          <span v-show="!editingNew.mediaId">
            建议尺寸:1068*534
          </span>
        </span>
      </div>
      <div class="editItemContainer">
        <div class="flexDiv-h">
          摘要：
          <textarea v-model="editingNew.abstract" placeholder="选填" />
        </div>
      </div>
      <div class="editItemContainer">
        <div class="flexDiv-h">
          外链：
          <input type="text" v-model="editingNew.link" placeholder="请输入合法的消息链接（带http/https协议头的合法URL）" style="flex:1" />
        </div>
      </div>
    </div>
    <div class="flexDiv-v" style=" margin-left: 20px;" v-show="tempNews.length>0">
      <div v-for="(item,index) in tempNews" :key="index" class="new-container" @click="editNew(item)">
        <div v-if="index==0" class="main-new" :style="{ border:item==editingNew?'1px solid #2f5981':'' }">
          <div class="text-font-normal main-new-title" style="line-height:18px" v-if="tempNews.length==1">
            {{item.title?item.title:'标题'}}
          </div>
          <div class="main-new-media" style="position:relative">
            <div class="main-new-media-placeholder" v-show="!item.mediaId" />
            <img :src="item.mediaUrl" style="width:250px;height:125px" v-show="item.mediaId">
            <div class="text-font-normal main-new-title-overConver" v-if="tempNews.length>1">
              {{item.title?item.title:'标题'}}
            </div>
          </div>
          <div class="text-font-minor main-new-abstract" style="line-height:16px" v-if="tempNews.length==1">
            {{item.abstract}}
          </div>
        </div>
        <div class="flexDiv-h minor-new" v-else :style="{ border:item==editingNew?'1px solid #2f5981':'' }">
          <div class="minor-new-title">
            {{item.title?item.title:'标题'}}
          </div>
          <div style="">
            <div class="main-new-media-placeholder" style="width:40px;height:40px;min-height:40px" v-show="!item.mediaId" />
            <img :src="item.mediaUrl" style="width:40px;height:40px" v-show="item.mediaId">
          </div>
        </div>
        <div class="flexDiv-h new-tool">
          <i class="el-icon-arrow-up icon-tool" v-if="index>0" style="margin-right:10px;" @click.stop="moveNew(index,index-1)" />
          <i class="el-icon-arrow-down icon-tool" style="flex:1" v-show="index<tempNews.length-1" @click.stop="moveNew(index,index+1)" />
          <div style="flex:1" />
          <i class="el-icon-delete icon-tool" @click.stop="removeNew(item)" />
        </div>
      </div>
      <div class="flexDiv-h new-add" @click="addNew" v-show="tempNews.length<8">
        <i class="el-icon-plus icon-add" />
      </div>
    </div>
  </div>
</template>

<script>
import api from "../../utility/api";
import helper from "../../utility/helper";
export default {
  data() {
    return {
      editingNew: {
        mediaId: null,
        mediaUrl: null,
        title: null,
        abstract: null,
        link: null
      },
      uploadUrl: api.fileTransferUrl,
      tempNews: [],
      isUploading: false
    };
  },
  components: {},
  props: {
    news: {
      type: Array,
      required: true,
      default: null
    }
  },
  mounted() {
    this.addNew();
  },
  watch: {
    news() {
      this.tempNews = [];
      this.news.forEach(i => {
        var cloneNew = JSON.parse(JSON.stringify(i));
        this.tempNews.push(cloneNew);
      });

      if (this.tempNews.length == 0) {
        this.addNew();
      }
    }
  },
  methods: {
    createNew() {
      return {
        title: null,
        abstract: null,
        mediaId: null,
        link: null
      };
    },
    handleCoverSuccess(res, file) {
      this.isUploading = false;
      this.editingNew.mediaId = res.data;
      this.editingNew.mediaUrl = `${api.fileTransferUrl}/${this.editingNew
        .mediaId}`;
    },
    beforeCoverUpload(file) {
      console.log(file.type);
      const isvalidImage =
        file.type === "image/jpeg" ||
        file.type === "image/jpg" ||
        file.type === "image/png" ||
        file.type === "image/bmp";

      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isvalidImage) {
        this.$message.error("上传的封面只能是 JPEG、JPG、PNG、BMP");
      } else if (!isLt2M) {
        this.$message.error("上传的封面大小不能超过 2MB!");
      }

      var result = isvalidImage && isLt2M;

      if (result) this.isUploading = true;

      return result;
    },
    addNew() {
      this.editingNew = this.createNew();
      this.tempNews.push(this.editingNew);
    },
    removeNew(targetNew) {
      this.$confirm("确定删除此消息？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.tempNews.removeByValue(targetNew);
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          // this.$message({
          //   type: "info",
          //   message: "已取消删除"
          // });
        });
    },
    moveNew(old_index, new_index) {
      this.tempNews.move(old_index, new_index);
    },
    editNew(targetNew) {
      this.editingNew = targetNew;
    },
    checkDataValid() {
      if (!this.editingNew.title) {
        this.$message.error("请填写标题");
        return false;
      }

      if (!this.editingNew.mediaId) {
        this.$message.error("请添加封面图");
        return false;
      }

      if (!helper.isUrl(this.editingNew.link)) {
        this.$message.error("外链请填写带http或https协议头的合法URL");
        return false;
      }

      for (let i = 0; i < this.tempNews.length; i++) {
        var currentNew = this.tempNews[i];
        if (!currentNew.title) {
          this.editingNew = currentNew;
          this.$message.error("请填写标题");
          return false;
        }

        if (!currentNew.mediaId) {
          this.editingNew = currentNew;
          this.$message.error("请添加封面图");
          return false;
        }

        if (!helper.isUrl(currentNew.link)) {
          this.editingNew = currentNew;
          this.$message.error("外链请填写带http或https协议头的合法URL");
          return false;
        }
      }

      return true;
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

input {
  outline: none;
  overflow-x: hidden;
  overflow-y: auto;
  width: 100%;
  border: 0px;
}

.input-title {
  color: @color-theme;
  font-size: 23px;
}

.input-title::-webkit-input-placeholder {
  color: @color-theme;
}

textarea {
  border: 0px;
  background: transparent;
  resize: none;
  outline: none;
  overflow-x: hidden;
  overflow-y: auto;
  flex: 1;
  height: 60px;
  word-wrap: break-word;
  word-break: break-all;
  padding-top: 3px;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}

textarea::-webkit-input-placeholder {
  color: @color-font-placeholder;
}

.new-container {
  position: relative;
}

.main-new {
  border: 1px solid @color-border-level2;
  padding: 10px;
  width: 250px;
  min-height: 125px;
  cursor: pointer;
}

.main-new-title {
  font-size: 16px;
  word-wrap: break-word;
  margin-bottom: 10px;
}

.main-new-title-overConver {
  font-size: 16px;
  word-wrap: break-word;
  line-height: 14px;
  color: white;
  position: absolute;
  position: absolute;
  bottom: 10px;
  left: 10px;
  right: 10px;
  z-index: 9;
  margin-bottom: 0;
  margin-top: 0;
}

.main-new-abstract {
  word-wrap: break-word;
  margin-top: 10px;
}

.main-new-media {
  line-height: 0px;
}

.main-new-media-placeholder {
  min-height: 125px;
  background: @color-font-minor;
}

.minor-new {
  border: 1px solid @color-border-level2;
  border-top: 0px;
  padding: 10px;
  align-items: center;
  line-height: 0px;
  cursor: pointer;
}

.minor-new-title {
  font-size: 13px;
  max-height: 40px;
  flex: 1;
  line-height: 20px;
  width: 200px;
  text-overflow: ellipsis;
  overflow: hidden;
  -webkit-box-orient: vertical;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  height: auto;
  word-wrap: break-word;
  word-break: break-word;
}

.new-tool {
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 5px;
  padding-bottom: 5px;
  background-color: #000;
  opacity: 0.5;
  bottom: 1px;
  left: 1px;
  width: 250px;
  position: absolute;
  justify-content: flex-end;
  display: none;
}

.new-container:hover .new-tool {
  display: flex;
}

.icon-tool {
  font-size: 18px;
  color: @color-font-placeholder;
  cursor: pointer;
}

.icon-tool:hover {
  color: white;
}

.new-add {
  border: 1px solid @color-border-level2;
  border-top: 0px;
  justify-content: center;
  align-items: center;
  padding: 10px;
  cursor: pointer;
}

.icon-add {
  font-size: 24px;
  color: @color-theme;
}
</style>
