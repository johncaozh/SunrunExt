<template>
  <div class="flexDiv-h " style="align-items:flex-start">
    <div class="flexDiv-v editContainer" style="flex:1">
      <div class="editItemContainer" style="padding-top:0px">
        <input type="text" v-model="title" placeholder="在此输入标题" class="input-title" />
      </div>
      <div class="editItemContainer">
        <span class="text-font-minor">
          <img :src="thumbMediaUrl" style="width:100px" v-show="mediaId" />
          <el-upload :show-file-list="false" :on-success="handleVideoSuccess" :before-upload="beforeVideoUpload" v-loading="isUploading" style="display:inline-block" :action="uploadUrl">
            <el-button type="text" class="button-link" style="margin-right:10px;">{{mediaId?"更改":"添加视频"}}</el-button>
          </el-upload>
          <span v-show="!mediaId">
            不超过20MB, 文件格式: rm, rmvb, wmv, avi, mpg, mpeg, mp4
          </span>
        </span>
      </div>
      <div class="editItemContainer">
        <div class="flexDiv-h">
          摘要：
          <textarea v-model="abstract" placeholder="选填" />
        </div>
      </div>
    </div>
    <div class="flexDiv-v previewContainer">
      <div class="text-font-normal preview-title" style="line-height:18px">
        {{title}}
      </div>
      <div class="preview-media" style="position:relative">
        <div class="preview-media-placeholder" v-show="!mediaId" />
        <img :src="thumbMediaUrl" style="width:250px" v-show="mediaId">
        <i class="el-icon-custom-play icon-video-play" @click="showingPlayer=true" v-show="mediaId" />
      </div>
      <div class="text-font-minor preview-abstract" style="line-height:16px">
        {{abstract}}
      </div>
    </div>
    <el-dialog :visible.sync="showingPlayer" width="680px" append-to-body>
      <video-player class="video-player-box" ref="videoPlayer" :options="playerOptions" :playsinline="true">
      </video-player>
    </el-dialog>
  </div>
</template>

<script>
import api from "../../utility/api";
import { videoPlayer } from "vue-video-player";
import "../../assets/custom-theme.css";
import "../../assets/video-js.css";
export default {
  data() {
    return {
      mediaId: null,
      thumbMediaId: null,
      title: null,
      abstract: null,
      isUploading: false,
      mediaUrl: null,
      thumbMediaUrl: null,
      uploadUrl: api.fileTransferUrl_video,
      showingPlayer: false,
      playerOptions: {
        width: "640px",
        language: "zh-CN",
        playbackRates: [0.7, 1.0, 1.5, 2.0],
        sources: [
          {
            type: "video/mp4",
            src: ""
          }
        ],
        poster: "",
        autoplay: true
      }
    };
  },
  components: {
    videoPlayer
  },
  props: {
    videoMessageContext: {
      type: Object,
      required: true
    }
  },
  mounted() {
    if (this.videoMessageContext) {
      this.mediaId = this.videoMessageContext.mediaId;
      this.thumbMediaId = this.videoMessageContext.thumbMediaId;
      this.title = this.videoMessageContext.title;
      this.abstract = this.videoMessageContext.abstract;
      this.mediaUrl = this.videoMessageContext.mediaUrl;
      this.thumbMediaUrl = this.videoMessageContext.thumbMediaUrl;
      this.isUploading = false;
      this.playerOptions.sources[0].src = this.mediaUrl;
      this.playerOptions.poster = this.thumbMediaUrl;
    }
  },
  methods: {
    handleVideoSuccess(res, file) {
      this.isUploading = false;
      this.mediaId = res.data.mediaId;
      this.thumbMediaId = res.data.thumbMediaId;
      this.mediaUrl = `${api.fileTransferUrl}/${this.mediaId}`;
      this.thumbMediaUrl = `${api.fileTransferUrl}/${this.thumbMediaId}`;
      this.playerOptions.sources[0].src = this.mediaUrl;
      this.playerOptions.poster = this.thumbMediaUrl;
    },
    beforeVideoUpload(file) {
      console.log(file.type);
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

      if (result) this.isUploading = true;

      return result;
    },
    checkDataValid() {
      if (!this.mediaId) {
        this.$message.error("请上传视频");
        return false;
      }

      if (!this.title) {
        this.$message.error("请输入标题");
        return false;
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

.previewContainer {
  border: 1px solid @color-border-level2;
  padding: 10px;
  width: 250px;
  min-height: 125px;
  margin-left: 20px;
}

.input-title {
  border: 0px;
  color: @color-theme;
  outline: none;
  overflow-x: hidden;
  overflow-y: auto;
  font-size: 23px;
  width: 100%;
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

.preview-title {
  font-size: 16px;
  word-wrap: break-word;
}

.preview-abstract {
  word-wrap: break-word;
}

.preview-media {
  margin-top: 10px;
  margin-bottom: 10px;
}

.preview-media-placeholder {
  min-height: 120px;
  background: @color-font-minor;
}

.icon-video-play {
  font-size: 36px;
  color: @color-font-minor;
  cursor: pointer;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.icon-video-play:hover {
  color: @color-theme;
  transform-origin: 0.5, 0.5;
}

.div-video-play {
  z-index: 999;
  width: 1920px;
  height: 900px;
  position: absolute;
  top: 0px;
  left: 0px;
  justify-content: center;
  align-items: center;
}
</style>
