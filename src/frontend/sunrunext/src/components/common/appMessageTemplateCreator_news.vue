<template>
  <div class="flexDiv-h " style="align-items:flex-start">
    <div class="flexDiv-v editContainer" style="flex:1">
      <div class="editItemContainer" style="padding-top:0px;border-bottom:0px">
        <input type="text" v-model="editingNew.title" placeholder="在此输入标题" class="input-title" />
      </div>
      <quill-editor v-model="editingNew.html" ref="editor" style="height:300px;margin-bottom:68px;width:735px" :options="editorOption" />
      <el-upload :with-credentials="true" ref="imageUploader" :action="uploadUrl" :before-upload='beforeImageUpload' :on-success='uploadImageSuccess' style="display:none">
        <el-button size="small" type="primary" id="imageInput" v-loading.fullscreen.lock="fullscreenLoading" element-loading-text="插入中,请稍候">点击上传</el-button>
      </el-upload>
      <el-upload :with-credentials="true" ref="videoUploader" :action="uploadUrl_video" :before-upload='beforeVideoUpload' :on-success='uploadVideoSuccess' style="display:none">
        <el-button size="small" type="primary" id="videoInput" v-loading.fullscreen.lock="fullscreenLoading" element-loading-text="插入中,请稍候">点击上传</el-button>
      </el-upload>
      <div class="editItemContainer">
        <div class="flexDiv-h" style="align-items:flex-start">
          <el-upload :with-credentials="true" style="flex:1" :action="uploadUrl" :before-upload='beforeFileUpload' :on-success='uploadFileSuccess' :file-list="editingNew.files" :multiple="false">
            <i class="el-icon-custom-attachment" />
            <el-button type="text" class="button-link" style="padding:0px">{{editingNew.files.length>0?'继续添加...':'添加附件...'}}</el-button>
          </el-upload>
          <div class="flexDiv-h" style="flex:1;align-items:center">
            <i class="el-icon-custom-link-1" style="margin-right:5px;" />
            <input type="text" v-model="editingNew.link" placeholder="添加原文链接（选填，带http/https协议头的合法URL）" style="flex:1" />
          </div>
        </div>
      </div>
      <div class="editItemContainer">
        <span class="text-font-minor">
          <img :src="editingNew.mediaId|getMediaLink" style="width:120px;height:60px;" v-show="editingNew.mediaId" />
          <el-upload :with-credentials="true" :show-file-list="false" :on-success="handleCoverSuccess" :before-upload="beforeCoverUpload" v-loading="isUploading" style="display:inline-block" :action="uploadUrl">
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
          作者：
          <input type="text" v-model="editingNew.author" placeholder="选填" style="flex:1" />
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
            <img :src="item.mediaId|getMediaLink" style="width:250px;height:125px" v-show="item.mediaId">
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
            <img :src="item.mediaId|getMediaLink" style="width:40px;height:40px" v-show="item.mediaId">
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
import "../../assets/quill/quill.core.css";
import "../../assets/quill/quill.snow.css";
import "../../assets/quill/quill.bubble.css";
import { quillEditor } from "vue-quill-editor";
import Quill from "quill";
import upload from "../mixin/upload";
export default {
  mixins: [upload],
  data() {
    return {
      editingNew: {
        mediaId: null,
        title: null,
        abstract: null,
        link: null,
        authod: null,
        files: [],
        html: null
      },
      tempNews: [],
      isUploading: false,
      editorOption: {
        placeholder: "请在这里输入正文",
        theme: "snow"
      },
      addRange: [],
      fullscreenLoading: false
    };
  },
  components: {
    quillEditor
  },
  props: {
    news: {
      type: Array,
      required: true,
      default: null
    }
  },
  mounted() {
    // 为图片ICON绑定事件  getModule 为编辑器的内部属性
    this.$refs.editor.quill
      .getModule("toolbar")
      .addHandler("image", this.imgHandler);
    this.$refs.editor.quill
      .getModule("toolbar")
      .addHandler("video", this.videoHandler); // 为视频ICON绑定事件

    this.tempNews = [];
    this.news.forEach(i => {
      var cloneNew = JSON.parse(JSON.stringify(i));
      this.tempNews.push(cloneNew);
    });

    if (this.tempNews.length == 0) {
      this.addNew();
    }

    this.editingNew = this.tempNews[0];
  },
  methods: {
    createNew() {
      return {
        title: null,
        abstract: null,
        mediaId: null,
        link: null,
        author: null,
        files: [],
        html: null
      };
    },
    createFile(name, size, mediaId) {
      return {
        name: name,
        size: size,
        mediaId: mediaId
      };
    },
    handleCoverSuccess(res, file) {
      this.isUploading = false;
      this.editingNew.mediaId = res.data;
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

      if (!this.editingNew.html) {
        this.$message.error("请输入正文");
        return false;
      }

      if (!this.editingNew.mediaId) {
        this.$message.error("请添加封面图");
        return false;
      }

      if (this.editingNew.link && !helper.isUrl(this.editingNew.link)) {
        this.$message.error("原文链接请填写带http或https协议头的合法URL");
        return false;
      }

      for (let i = 0; i < this.tempNews.length; i++) {
        var currentNew = this.tempNews[i];
        if (!currentNew.title) {
          this.editingNew = currentNew;
          this.$message.error("请填写标题");
          return false;
        }

        if (!currentNew.html) {
          this.$message.error("请输入正文");
          return false;
        }

        if (!currentNew.mediaId) {
          this.editingNew = currentNew;
          this.$message.error("请添加封面图");
          return false;
        }

        if (currentNew.link && !helper.isUrl(currentNew.link)) {
          this.editingNew = currentNew;
          this.$message.error("原文链接请填写带http或https协议头的合法URL");
          return false;
        }
      }

      return true;
    },
    uploadVideoSuccess(res, file) {
      var url = helper.getMediaLink(res.data.mediaId);
      this.insertHtml(url, "video");
    },
    beforeVideoUpload(file) {
      const isvalidVideo =
        file.type === "video/rm" ||
        file.type === "video/rmvb" ||
        file.type === "video/wmv" ||
        file.type === "video/x-ms-wmv" ||
        file.type === "video/avi" ||
        file.type === "video/mpg" ||
        file.type === "video/mpeg" ||
        file.type === "video/mp4";

      const isLt20M = file.size / 1024 / 1024 < 20;

      if (!isvalidVideo) {
        this.$message.error(
          "上传的视频只能是 RM、RMVB、WMV、AVI、MPG、MPEG、MP4 格式!"
        );
      } else if (!isLt20M) {
        this.$message.error("上传的视频大小不能超过 20MB!");
      }

      var result = isvalidVideo && isLt20M;

      if (result) this.fullscreenLoading = true;

      return result;
    },
    uploadImageSuccess(res, file) {
      var url = helper.getMediaLink(res.data);
      this.insertHtml(url, "image");
    },
    beforeImageUpload(file) {
      const isvalidImage =
        file.type === "image/jpeg" ||
        file.type === "image/jpg" ||
        file.type === "image/png" ||
        file.type === "image/bmp";

      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isvalidImage) {
        this.$message.error("上传的图片只能是 JPEG、JPG、PNG、BMP");
      } else if (!isLt2M) {
        this.$message.error("上传的图片大小不能超过 2MB!");
      }

      var result = isvalidImage && isLt2M;

      if (result) this.fullscreenLoading = true;

      return result;
    },
    uploadFileSuccess(res, file) {
      this.editingNew.files.push({
        name: file.name,
        size: file.size,
        mediaId: res.data
      });
    },
    beforeFileUpload(file) {
      if (file.size === 0) {
        this.$message.error("禁止上传空文件");
        return false;
      }

      return true;
    },
    imgHandler(state) {
      this.addRange = this.$refs.editor.quill.getSelection();
      if (state) {
        let fileInput = document.getElementById("imageInput");
        fileInput.click();
      }
    },
    videoHandler(state) {
      this.addRange = this.$refs.editor.quill.getSelection();
      if (state) {
        let fileInput = document.getElementById("videoInput");
        fileInput.click();
      }
    },
    // 图片上传成功回调   插入到编辑器中
    insertHtml(url, uploadType) {
      this.fullscreenLoading = false;
      if (url != null && url.length > 0) {
        var editor = this.$refs.editor;
        this.addRange = editor.quill.getSelection();
        editor.quill.insertEmbed(
          this.addRange !== null ? this.addRange.index : 0,
          uploadType,
          url,
          Quill.sources.USER
        );
      } else {
        this.$message.error(`${uploadType}插入失败`);
      }

      this.$refs.imageUploader.clearFiles();
      this.$refs.videoUploader.clearFiles();
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
