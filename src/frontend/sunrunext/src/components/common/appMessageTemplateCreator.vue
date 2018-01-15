<template>
  <el-tabs class="el-tabs">
    <el-tab-pane>
      <span slot="label" class="label">
        <i class="el-icon-custom-text icon"></i> 文字</span>
      <textarea placeholder="直接开始输入..." maxlength="600" />
    </el-tab-pane>
    <el-tab-pane>
      <span slot="label" class="label">
        <i class="el-icon-custom-news icon"></i> 图文</span>
      <div class="flexDiv-v border">
        <i class="el-icon-plus icon-plus "></i>
        添加图文
      </div>
    </el-tab-pane>
    <el-tab-pane>
      <span slot="label" class="label">
        <i class="el-icon-custom-news icon"></i> 外链图文</span>
      <div class="flexDiv-v border">
        <i class="el-icon-plus icon-plus "></i>
        添加外链图文
      </div>
    </el-tab-pane>
    <el-tab-pane>
      <span slot="label" class="label">
        <i class="el-icon-custom-photo icon"></i> 图片</span>
      <div>
        <div v-if="photoMessageContext.imageUrl" style="align-items:flex-end">
          <div class="boder" style="padding:10px">
            <img :src="photoMessageContext.imageUrl" style="max-width:300px;max-height:300px;">
            <el-button type="text" class="button-link" size="small" @click="cleanPhotoMessageContext">删除</el-button>
          </div>
        </div>
        <div class="flexDiv-h" style="align-items:center" v-else>
          <el-upload class="avatar-uploader" :action="uploadUrl" :show-file-list="false" :on-success="handlePhotoSuccess" :before-upload="beforePhotoUpload"
            v-loading="photoMessageContext.isUploading">
            <img v-if="photoMessageContext.imageUrl" :src="photoMessageContext.imageUrl" class="avatar">
            <div class="flexDiv-v border" v-else>
              <i class="el-icon-plus icon-plus "></i>
              添加图片
            </div>
          </el-upload>
          <span class="upload-prompt">格式支持jpeg、jpg、png、bmp四种图片格式，文件大小不超过5MB</span>
        </div>
      </div>
    </el-tab-pane>
    <el-tab-pane>
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
            <audio :src="voiceMessageContext.mediaUrl" ref="voicePlayer" style="width:200px;height:40px;" />
          </div>
          <el-button type="text" style="margin-left:10px;" class="button-link" size="small" @click="cleanVoiceMessageContext">删除</el-button>
        </div>
        <div class="flexDiv-h" style="align-items:center" v-else>
          <el-upload class="avatar-uploader" :action="uploadUrl_audio" :show-file-list="false" :on-success="handleVoiceSuccess" :before-upload="beforeVoiceUpload"
            :on-error="handleVoiceError" v-loading="voiceMessageContext.isUploading">
            <div class="flexDiv-v border">
              <i class="el-icon-plus icon-plus "></i>
              添加语音
            </div>
          </el-upload>
          <span class="upload-prompt">格式支持mp3、wma、wav、amr，文件大小不超过5MB，语音时长不超过1分钟</span>
        </div>
      </div>
    </el-tab-pane>
    <el-tab-pane>
      <span slot="label" class="label">
        <i class="el-icon-custom-video icon"></i> 视频</span>
      <div class="flexDiv-v border" @click="editVideoTemplate">
        <i class="el-icon-plus icon-plus "></i>
        添加视频
      </div>
      <el-dialog :close-on-click-modal=false title="编辑视频模板" width="900px" :visible.sync="videoMessageContext.isVideoDialogVisible">
        <app-message-template-creator_video/>
        <div slot="footer" class="dialog-footer ">
          <el-button @click="dialogVisible=false">取消</el-button>
          <el-button type="primary"  @click="submitForm('urlForm')">保存</el-button>
        </div>
      </el-dialog>
    </el-tab-pane>
    <el-tab-pane>
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
          <el-upload class="avatar-uploader" :action="uploadUrl" :show-file-list="false" :on-success="handleFileSuccess" :before-upload="beforeFileUpload"
            :on-error="handleFileError" v-loading="fileMessageContext.isUploading">
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
</template>

<script>
  import api from "../../utility/api";
  import fileIcon from "./fileIcon.vue";
  import appMessageTemplateCreator_video from "./appMessageTemplateCreator_video";
  export default {
    data() {
      return {
        photoMessageContext: {
          isUploading: false,
          imageUrl: null,
          mediaId: null
        },
        voiceMessageContext: {
          isUploading: false,
          mediaId: null, //amr媒体ID
          duration: 0, //秒为单位
          fileName: null,
          mediaUrl: null
        },
        fileMessageContext: {
          isUploading: false,
          mediaId: null,
          fileSize: 0, //秒为单位
          fileName: null,
          mediaUrl: null
        },
        videoMessageContext: {
          mediaId: null,
          thumbMediaId: null,
          title: null,
          abstract: null,
          isVideoDialogVisible: false
        },
        uploadUrl: api.fileTransferUrl,
        uploadUrl_audio: api.fileTransferUrl_audio
      };
    },

    components: {
      fileIcon,
      appMessageTemplateCreator_video
    },

    methods: {
      handlePhotoSuccess(res, file) {
        this.photoMessageContext.isUploading = false;
        this.photoMessageContext.mediaId = res.data;
        this.photoMessageContext.imageUrl = URL.createObjectURL(file.raw);
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
        this.photoMessageContext.imageUrl = null;
      },
      handleVoiceSuccess(res, file) {
        this.voiceMessageContext.isUploading = false;
        this.voiceMessageContext.fileName = file.name;
        this.voiceMessageContext.mediaId = res.data.mediaId;
        this.voiceMessageContext.duration = res.data.duration;
        this.voiceMessageContext.mediaUrl = `${api.fileTransferUrl}/${this
        .voiceMessageContext.mediaId}`;
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
        this.voiceMessageContext.mediaUrl = `${api.fileTransferUrl}/${this
        .fileMessageContext.mediaId}`;
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
        a.href = this.fileMessageContext.mediaUrl;
        a.click();
      },
      editVideoTemplate() {
        this.videoMessageContext.isVideoDialogVisible = true;
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
    min-height: 300px;
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
    height: 240px;
    word-break: break-all;
    color: @color-font-minor;
    outline: none;
    overflow-x: hidden;
    overflow-y: auto;
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  }

  textarea::-webkit-input-placeholder {
    color: @color-font-placeholder;
  }

  .border {
    float: left;
    border: 1px solid @color-border-level2;
    border-radius: 5px;
    padding: 95px;
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

</style>
