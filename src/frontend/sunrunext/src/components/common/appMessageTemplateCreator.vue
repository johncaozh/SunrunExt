<template>
  <div style="position:relative">
    <el-tabs class="el-tabs" v-model="activeName">
      <el-tab-pane name="text">
        <span slot="label" class="label">
          <i class="el-icon-custom-text icon"></i> 文字</span>
        <textarea placeholder="直接开始输入..." v-model="textMessageContext.content" />
      </el-tab-pane>
      <el-tab-pane name="news">
        <span slot="label" class="label">
          <i class="el-icon-custom-news icon"></i> 图文</span>
        <div class="flexDiv-h" v-if="newsMessageContext.news.length>0">
          <div class="flexDiv-v">
            <div v-for="(item,index) in newsMessageContext.news" :key="index" class="new-container">
              <div v-if="index==0" class="main-new">
                <div class="text-font-normal main-new-title" style="line-height:18px" v-if="newsMessageContext.news.length==1">
                  {{item.title?item.title:'标题'}}
                </div>
                <div class="main-new-media" style="position:relative">
                  <div class="main-new-media-placeholder" v-show="!item.mediaId" />
                  <img :src="item.mediaId|getMediaLink" style="width:250px;height:125px" v-show="item.mediaId">
                  <div class="text-font-normal main-new-title-overConver" v-if="newsMessageContext.news.length>1">
                    {{item.title?item.title:'标题'}}
                  </div>
                </div>
                <div class="text-font-minor main-new-abstract" style="line-height:16px" v-if="newsMessageContext.news.length==1">
                  {{item.abstract}}
                </div>
              </div>
              <div class="flexDiv-h minor-new" v-else>
                <div class="minor-new-title">
                  {{item.title?item.title:'标题'}}
                </div>
                <div style="">
                  <div class="main-new-media-placeholder" style="width:40px;height:40px;min-height:40px" v-show="!item.mediaId" />
                  <img :src="item.mediaId|getMediaLink" style="width:40px;height:40px" v-show="item.mediaId">
                </div>
              </div>
            </div>
          </div>
          <el-button type="text" class="button-link" style="margin-left:10px;align-self:flex-end;padding:0px" @click="editNewsTemplate">编辑</el-button>
        </div>
        <div class="flexDiv-v border" @click="editNewsTemplate" v-else>
          <i class="el-icon-plus icon-plus "></i>
          添加图文
        </div>
        <el-dialog append-to-body :close-on-click-modal=false title="编辑图文模板" width="1070px" :visible.sync="newsMessageContext.isDialogVisible">
          <app-message-template-creator_news ref="newsEditor" :news="newsMessageContext.news" />
          <div slot="footer" class="dialog-footer ">
            <el-button @click="newsMessageContext.isDialogVisible=false">取消</el-button>
            <el-button type="primary" @click="saveNewsTemplate">保存</el-button>
          </div>
        </el-dialog>
      </el-tab-pane>
      <el-tab-pane name="externalLinkNews">
        <span slot="label" class="label">
          <i class="el-icon-custom-externalLinkNews icon"></i> 外链图文</span>
        <div class="flexDiv-h" v-if="externalLinkNewsMessageContext.news.length>0">
          <div class="flexDiv-v">
            <div v-for="(item,index) in externalLinkNewsMessageContext.news" :key="index" class="new-container">
              <div v-if="index==0" class="main-new">
                <div class="text-font-normal main-new-title" style="line-height:18px" v-if="externalLinkNewsMessageContext.news.length==1">
                  {{item.title?item.title:'标题'}}
                </div>
                <div class="main-new-media" style="position:relative">
                  <div class="main-new-media-placeholder" v-show="!item.mediaId" />
                  <img :src="item.mediaId|getMediaLink" style="width:250px;height:125px" v-show="item.mediaId">
                  <div class="text-font-normal main-new-title-overConver" v-if="externalLinkNewsMessageContext.news.length>1">
                    {{item.title?item.title:'标题'}}
                  </div>
                </div>
                <div class="text-font-minor main-new-abstract" style="line-height:16px" v-if="externalLinkNewsMessageContext.news.length==1">
                  {{item.abstract}}
                </div>
              </div>
              <div class="flexDiv-h minor-new" v-else>
                <div class="minor-new-title">
                  {{item.title?item.title:'标题'}}
                </div>
                <div style="">
                  <div class="main-new-media-placeholder" style="width:40px;height:40px;min-height:40px" v-show="!item.mediaId" />
                  <img :src="item.mediaId|getMediaLink" style="width:40px;height:40px" v-show="item.mediaId">
                </div>
              </div>
            </div>
          </div>
          <el-button type="text" class="button-link" style="margin-left:10px;align-self:flex-end;padding:0px" @click="editExternalLinkNewsTemplate">编辑</el-button>
        </div>
        <div class="flexDiv-v border" @click="editExternalLinkNewsTemplate" v-else>
          <i class="el-icon-plus icon-plus "></i>
          添加外链图文
        </div>
        <el-dialog append-to-body :close-on-click-modal=false title="编辑外链图文模板" width="900px" :visible.sync="externalLinkNewsMessageContext.isDialogVisible">
          <app-message-template-creator_news_external-link ref="externalLinkNewsEditor" :news="externalLinkNewsMessageContext.news" />
          <div slot="footer" class="dialog-footer ">
            <el-button @click="externalLinkNewsMessageContext.isDialogVisible=false">取消</el-button>
            <el-button type="primary" @click="saveExternalLinkNewsTemplate">保存</el-button>
          </div>
        </el-dialog>
      </el-tab-pane>
      <el-tab-pane name="photo">
        <span slot="label" class="label">
          <i class="el-icon-custom-photo icon"></i> 图片</span>
        <div>
          <div v-if="photoMessageContext.mediaId" style="align-items:flex-end">
            <div class="boder" style="padding:10px">
              <img :src="photoMessageContext.mediaId|getMediaLink" style="max-width:300px;max-height:300px;">
              <el-button type="text" class="button-link" size="small" @click="cleanPhotoMessageContext">删除</el-button>
            </div>
          </div>
          <div class="flexDiv-h" style="align-items:center" v-else>
            <el-upload class="avatar-uploader" :action="uploadUrl" :show-file-list="false" :on-success="handlePhotoSuccess" :before-upload="beforePhotoUpload" v-loading="photoMessageContext.isUploading">
              <img v-if="photoMessageContext.mediaId" :src="photoMessageContext.mediaId|getMediaLink" class="avatar">
              <div class="flexDiv-v border" v-else>
                <i class="el-icon-plus icon-plus "></i>
                添加图片
              </div>
            </el-upload>
            <span class="upload-prompt">格式支持jpeg、jpg、png、bmp四种图片格式，文件大小不超过5MB</span>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane name="voice">
        <span slot="label" class="label">
          <i class="el-icon-custom-voiceMessage icon"></i> 语音</span>
        <div>
          <div v-if="voiceMessageContext.mediaId" class="flexDiv-h" style="align-items:flex-end">
            <div class="border" style="padding:10px;width:200px;">
              <div class="flexDiv-h border" style="padding:10px;margin-right:10px;" @click="playVoice">
                <i class="el-icon-custom-voiceMessage icon-voiceMessage"></i>
              </div>
              <div class="flexDiv-v">
                <span>{{voiceMessageContext.fileName}}</span>
                <span class="text-font-minor">{{voiceMessageContext.duration}}"</span>
              </div>
              <audio :src="voiceMessageContext.mediaId|getMediaLink" ref="voicePlayer" style="width:200px;height:40px;" />
            </div>
            <el-button type="text" style="margin-left:10px;" class="button-link" size="small" @click="cleanVoiceMessageContext">删除</el-button>
          </div>
          <div class="flexDiv-h" style="align-items:center" v-else>
            <el-upload class="avatar-uploader" :action="uploadUrl_audio" :show-file-list="false" :on-success="handleVoiceSuccess" :before-upload="beforeVoiceUpload" :on-error="handleVoiceError" v-loading="voiceMessageContext.isUploading">
              <div class="flexDiv-v border">
                <i class="el-icon-plus icon-plus "></i>
                添加语音
              </div>
            </el-upload>
            <span class="upload-prompt">格式支持mp3、wma、wav、amr，文件大小不超过5MB，语音时长不超过1分钟</span>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane name="video">
        <span slot="label" class="label">
          <i class="el-icon-custom-video icon"></i> 视频</span>
        <div class="flexDiv-h" style="align-items:flex-end">
          <div class="flexDiv-v video-preview-container" v-if="videoMessageContext.mediaId">
            <div class="text-font-normal video-preview-title" style="line-height:18px">
              {{videoMessageContext.title}}
            </div>
            <div class="video-preview-media" style="position:relative">
              <img :src="videoMessageContext.thumbMediaId|getMediaLink" style="width:250px">
            </div>
            <div class="text-font-minor video-preview-abstract" style="line-height:16px">
              {{videoMessageContext.abstract}}
            </div>
          </div>
          <div class="flexDiv-v border" @click="editVideoTemplate" v-else>
            <i class="el-icon-plus icon-plus "></i>
            添加视频
          </div>
          <el-button type="text" class="button-link" style="margin-left:10px;padding:0px" @click="editVideoTemplate" v-show="videoMessageContext.mediaId">编辑</el-button>
        </div>
        <el-dialog append-to-body :close-on-click-modal=false title="编辑视频模板" width="900px" :visible.sync="videoMessageContext.isDialogVisible">
          <app-message-template-creator_video ref="videoEditor" :videoMessageContext="videoMessageContext" />
          <div slot="footer" class="dialog-footer ">
            <el-button @click="videoMessageContext.isDialogVisible=false">取消</el-button>
            <el-button type="primary" @click="saveVideoTemplate">保存</el-button>
          </div>
        </el-dialog>
      </el-tab-pane>
      <el-tab-pane name="file">
        <span slot="label" class="label">
          <i class="el-icon-custom-file icon"></i> 文件</span>
        <div>
          <div v-if="fileMessageContext.mediaId" class="flexDiv-h" style="align-items:flex-end">
            <div class="flexDiv-h border" style="padding:10px;justify-content:flex-start">
              <file-icon :file-name="fileMessageContext.fileName" @click="downloadFile" />
              <div class="flexDiv-v">
                <span>{{fileMessageContext.fileName}}</span>
                <span class="text-font-minor">{{fileMessageContext.fileSize|sizeUnitConverter(fileMessageContext.fileSize)}}</span>
              </div>
            </div>
            <el-button type="text" style="margin-left:10px;" class="button-link" size="small" @click="cleanFileMessageContext">删除</el-button>
          </div>
          <div class="flexDiv-h" style="align-items:center" v-else>
            <el-upload class="avatar-uploader" :action="uploadUrl" :show-file-list="false" :on-success="handleFileSuccess" :before-upload="beforeFileUpload" :on-error="handleFileError" v-loading="fileMessageContext.isUploading">
              <div class="flexDiv-v border">
                <i class="el-icon-plus icon-plus "></i>
                添加文件
              </div>
            </el-upload>
            <span class="upload-prompt">文件大小不超过20MB</span>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-button v-if="canOpenMaterial" class="button-link el-button-material" type="text" @click="messageTemplateMaterialContext.isDialogVisible=true">素材库</el-button>
    <el-dialog v-if="canOpenMaterial" append-to-body :close-on-click-modal=false title="从素材库中选择" width="1000px" :visible.sync="messageTemplateMaterialContext.isDialogVisible">
      <app-message-template-material ref="messageTemplateMaterial" />
      <div slot="footer" class="dialog-footer ">
        <el-button @click="messageTemplateMaterialContext.isDialogVisible=false">取消</el-button>
        <el-button type="primary" @click="gotFromMessageTemplateMaterial">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from "../../utility/api";
import fileIcon from "./fileIcon.vue";
import appMessageTemplateCreator_video from "./appMessageTemplateCreator_video";
import appMessageTemplateCreator_news from "./appMessageTemplateCreator_news";
import appMessageTemplateCreator_news_externalLink from "./appMessageTemplateCreator_news_externalLink";
import appMessageTemplateMaterial from "./appMessageTemplateMaterial";
import upload from "../mixin/upload";
import helper from "../../utility/helper";
export default {
  mixins: [upload],
  data() {
    return {
      activeName: "text",
      textMessageContext: {
        content: null
      },
      photoMessageContext: {
        isUploading: false,
        mediaId: null
      },
      voiceMessageContext: {
        isUploading: false,
        mediaId: null, //amr媒体ID
        duration: 0, //秒为单位
        fileName: null
      },
      fileMessageContext: {
        isUploading: false,
        mediaId: null,
        fileSize: 0, //秒为单位
        fileName: null
      },
      videoMessageContext: {
        mediaId: null,
        thumbMediaId: null,
        title: null,
        abstract: null,
        isDialogVisible: false
      },
      newsMessageContext: {
        news: [],
        isDialogVisible: false
      },
      externalLinkNewsMessageContext: {
        news: [],
        isDialogVisible: false
      },
      messageTemplateMaterialContext: {
        isDialogVisible: false
      }
    };
  },

  components: {
    fileIcon,
    appMessageTemplateCreator_video,
    appMessageTemplateCreator_news_externalLink,
    appMessageTemplateCreator_news,
    appMessageTemplateMaterial
  },

  props: {
    template: {
      type: Object,
      required: false,
      default: null
    },
    canOpenMaterial: {
      type: Boolean,
      required: false,
      default: true
    },
    templateType: {
      required: false,
      type: String,
      default: null
    }
  },
  watch: {
    templateType() {
      if (this.templateType) {
        this.activeName = this.templateType;
      }
    },
    template() {
      this.resetTemplate();
    },
    "textMessageContext.content": function(newVal, oldVal) {
      if (
        this.textMessageContext.content &&
        this.textMessageContext.content.length > 600
      ) {
        this.$message({
          type: "error",
          message: "最多输入600字"
        });
        this.textMessageContext.content = this.textMessageContext.content.slice(
          0,
          600
        );
      }
    }
  },
  mounted() {
    this.resetTemplate();
  },

  methods: {
    resetTemplate() {
      if (this.template) {
        this.activeName = this.template.type;

        if (this.activeName == "text") {
          this.textMessageContext.content = this.template.data.content;
        } else if (this.activeName == "news") {
          this.newsMessageContext.news = this.template.data.news;
        } else if (this.activeName == "externalLinkNews") {
          this.externalLinkNewsMessageContext.news = this.template.data.news;
        } else if (this.activeName == "photo") {
          this.photoMessageContext.mediaId = this.template.data.mediaId;
        } else if (this.activeName == "voice") {
          this.voiceMessageContext.mediaId = this.template.data.mediaId;
          this.voiceMessageContext.fileName = this.template.data.fileName;
          this.voiceMessageContext.duration = this.template.data.duration;
        } else if (this.activeName == "video") {
          this.videoMessageContext.mediaId = this.template.data.mediaId;
          this.videoMessageContext.thumbMediaId = this.template.data.thumbMediaId;
          this.videoMessageContext.title = this.template.data.title;
          this.videoMessageContext.abstract = this.template.data.abstract;
        } else if (this.activeName == "file") {
          this.videoMessageContext.mediaId = this.template.data.mediaId;
          this.videoMessageContext.fileSize = this.template.data.fileSize;
          this.videoMessageContext.fileName = this.template.data.fileName;
        }
      }
    },
    handlePhotoSuccess(res, file) {
      this.photoMessageContext.isUploading = false;
      this.photoMessageContext.mediaId = res.data;
    },
    beforePhotoUpload(file) {
      const isvalidPhoto =
        file.type === "image/jpeg" ||
        file.type === "image/jpg" ||
        file.type === "image/png" ||
        file.type === "image/bmp";

      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isvalidPhoto) {
        this.$message.error("上传的图片只能是 JPEG、JPG、PNG、BMP 格式!");
      } else if (!isLt2M) {
        this.$message.error("上传的图片大小不能超过 2MB!");
      }

      var result = isvalidPhoto && isLt2M;

      if (result) this.photoMessageContext.isUploading = true;

      return result;
    },
    cleanPhotoMessageContext() {
      this.photoMessageContext.isUploading = false;
      this.photoMessageContext.mediaId = null;
    },
    handleVoiceSuccess(res, file) {
      this.voiceMessageContext.isUploading = false;
      this.voiceMessageContext.fileName = file.name;
      this.voiceMessageContext.mediaId = res.data.mediaId;
      this.voiceMessageContext.duration = res.data.duration;
    },
    handleVoiceError(err, file, fileList) {
      this.voiceMessageContext.isUploading = false;

      if (err.status == 413) this.$message.error("语音时长不能超过一分钟");
    },
    beforeVoiceUpload(file) {
      const isvalidVoice =
        file.type === "audio/mp3" ||
        file.type === "audio/wma" ||
        file.type === "audio/wav" ||
        file.type === "audio/amr";

      const isLt2M = file.size / 1024 / 1024 < 5;

      if (!isvalidVoice) {
        this.$message.error("上传的语音只能是 MP3、WMA、WAV、AMR 格式!");
      } else if (!isLt2M) {
        this.$message.error("上传的语音大小不能超过 5MB!");
      }

      var result = isvalidVoice && isLt2M;

      if (result) this.voiceMessageContext.isUploading = true;

      return result;
    },
    cleanVoiceMessageContext() {
      this.voiceMessageContext.mediaId = null;
      this.voiceMessageContext.isUploading = false;
    },
    playVoice() {
      var audioPlayer = this.$refs.voicePlayer;

      if (audioPlayer.paused) {
        audioPlayer.play();
      } else {
        audioPlayer.pause();
      }
    },
    handleFileSuccess(res, file) {
      this.fileMessageContext.isUploading = false;
      this.fileMessageContext.fileName = file.name;
      this.fileMessageContext.mediaId = res.data;
      this.fileMessageContext.fileSize = file.size;
    },
    handleFileError(err, file, fileList) {
      this.voiceMessageContext.isUploading = false;
      this.$message.error("上传文件出错");
    },
    beforeFileUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 20;

      if (!isLt2M) {
        this.$message.error("上传的文件大小不能超过 20MB!");
      }

      if (isLt2M) this.fileMessageContext.isUploading = true;
      return isLt2M;
    },
    cleanFileMessageContext() {
      this.fileMessageContext.mediaId = null;
      this.fileMessageContext.isUploading = false;
    },
    downloadFile() {
      var a = document.createElement("a");
      a.href = helper.getMediaLink(this.fileMessageContext.mediaId);
      a.click();
    },
    editVideoTemplate() {
      this.videoMessageContext.isDialogVisible = true;
    },
    saveVideoTemplate() {
      var pass = this.$refs.videoEditor.checkDataValid();
      if (!pass) return;

      this.videoMessageContext.mediaId = this.$refs.videoEditor.mediaId;
      this.videoMessageContext.thumbMediaId = this.$refs.videoEditor.thumbMediaId;
      this.videoMessageContext.title = this.$refs.videoEditor.title;
      this.videoMessageContext.abstract = this.$refs.videoEditor.abstract;
      this.videoMessageContext.isDialogVisible = false;
    },
    editExternalLinkNewsTemplate() {
      this.externalLinkNewsMessageContext.isDialogVisible = true;
    },
    saveExternalLinkNewsTemplate() {
      var pass = this.$refs.externalLinkNewsEditor.checkDataValid();

      if (pass) {
        this.externalLinkNewsMessageContext.news = [];
        this.$refs.externalLinkNewsEditor.tempNews.forEach(i => {
          this.externalLinkNewsMessageContext.news.push(i);
        });
        this.externalLinkNewsMessageContext.isDialogVisible = false;
      }
    },
    editNewsTemplate() {
      this.newsMessageContext.isDialogVisible = true;
    },
    saveNewsTemplate() {
      var pass = this.$refs.newsEditor.checkDataValid();

      if (pass) {
        this.newsMessageContext.news = [];
        this.$refs.newsEditor.tempNews.forEach(i => {
          this.newsMessageContext.news.push(i);
        });
        this.newsMessageContext.isDialogVisible = false;
      }
    },
    save() {
      var data = null;
      if (this.activeName == "text") {
        if (!this.textMessageContext.content) {
          this.$message.error("消息内容不能为空");
          return null;
        }
        data = this.textMessageContext;
      } else if (this.activeName == "news") {
        if (this.newsMessageContext.news.length == 0) {
          this.$message.error("请编辑图文消息");
          return null;
        }
        data = this.newsMessageContext;
      } else if (this.activeName == "externalLinkNews") {
        if (this.externalLinkNewsMessageContext.news.length == 0) {
          this.$message.error("请编辑外链图文消息");
          return null;
        }

        data = this.externalLinkNewsMessageContext;
      } else if (this.activeName == "photo") {
        if (!this.photoMessageContext.mediaId) {
          this.$message.error("请上传图片");
          return null;
        }

        data = this.photoMessageContext;
      } else if (this.activeName == "voice") {
        if (!this.voiceMessageContext.mediaId) {
          this.$message.error("请上传语音");
          return null;
        }

        data = this.voiceMessageContext;
      } else if (this.activeName == "video") {
        var result = this.$refs.videoEditor.checkDataValid();
        if (!result) return null;
        data = this.videoMessageContext;
      } else if (this.activeName == "file") {
        if (!this.fileMessageContext.mediaId) {
          this.$message.error("请上传文件");
          return null;
        }

        data = this.fileMessageContext;
      }

      return {
        type: this.activeName,
        data: data
      };
    },
    gotFromMessageTemplateMaterial() {
      var selectedTemplate = this.$refs.messageTemplateMaterial
        .selectedTemplate;

      this.activeName = selectedTemplate.type;
      if (this.activeName == "text") {
        this.textMessageContext.content = selectedTemplate.data.content;
      } else if (this.activeName == "news") {
        this.newsMessageContext.news = selectedTemplate.data.news;
      } else if (this.activeName == "externalLinkNews") {
        this.externalLinkNewsMessageContext.news = this.template.data.news;
      } else if (this.activeName == "photo") {
        this.photoMessageContext.mediaId = selectedTemplate.data.mediaId;
      } else if (this.activeName == "voice") {
        this.voiceMessageContext.mediaId = selectedTemplate.data.mediaId;
        this.voiceMessageContext.fileName = selectedTemplate.data.fileName;
        this.voiceMessageContext.duration = selectedTemplate.data.duration;
      } else if (this.activeName == "video") {
        this.videoMessageContext.mediaId = selectedTemplate.data.mediaId;
        this.videoMessageContext.thumbMediaId =
          selectedTemplate.data.thumbMediaId;
        this.videoMessageContext.title = selectedTemplate.data.title;
        this.videoMessageContext.abstract = selectedTemplate.data.abstract;
      } else if (this.activeName == "file") {
        this.videoMessageContext.mediaId = selectedTemplate.data.mediaId;
        this.videoMessageContext.fileSize = selectedTemplate.data.fileSize;
        this.videoMessageContext.fileName = selectedTemplate.data.fileName;
      }

      this.messageTemplateMaterialContext.isDialogVisible = false;
    }
  }
};
</script>

<style lang="less" scoped>
.el-tabs {
  padding-left: 15px;
  padding-right: 15px;
  padding-bottom: 15px;
  background: #fbfbfb;
  min-height: 280px;
}

.icon {
  font-size: 14px;
  color: @color-font-minor;
}

.icon-plus {
  font-size: 32px;
  color: @color-theme;
}

.icon-voiceMessage {
  font-size: 20px;
  color: @color-theme;
}

.label {
  font-size: 14px;
  color: @color-font-minor;
}

textarea {
  border: 0px;
  background: transparent;
  font-size: 14px;
  resize: none;
  width: 100%;
  height: 100%;
  height: 200px;
  word-break: break-all;
  color: @color-font-minor;
  outline: none;
  overflow-x: hidden;
  overflow-y: auto;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}

textarea::-webkit-input-placeholder {
  color: @color-font-placeholder;
}

.border {
  float: left;
  border: 1px solid @color-border-level2;
  border-radius: 5px;
  width: 270px;
  height: 210px;
  font-size: 14px;
  background: white;
  color: @color-theme;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.border:hover {
  border: 1px solid @color-theme;
}

.upload-prompt {
  margin-left: 10px;
  max-width: 300px;
  word-wrap: break-word;
  color: @color-font-minor;
  font-size: 12px;
}

.avatar-uploader .el-upload {
  border: 1px solid @color-border-level2;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.video-preview-container {
  border: 1px solid @color-border-level2;
  padding: 10px;
  width: 250px;
  min-height: 125px;
}

.video-preview-media {
  margin-top: 10px;
  margin-bottom: 10px;
}

.video-preview-title {
  font-size: 16px;
  word-wrap: break-word;
}

.video-preview-abstract {
  word-wrap: break-word;
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

.el-button-material {
  position: absolute;
  top: 1px;
  right: 15px;
}
</style>
