<template>
    <div class="flexDiv-h">
        <el-menu :default-active="selectedTemplateType" class="el-menu-vertical" @select="handleSelect">
            <el-menu-item index="text">
                <i class="el-icon-custom-text"></i>
                <span slot="title">文字</span>
            </el-menu-item>
            <el-menu-item index="news">
                <i class="el-icon-custom-news"></i>
                <span slot="title">图文</span>
            </el-menu-item>
            <el-menu-item index="externalLinkNews">
                <i class="el-icon-custom-externalLinkNews"></i>
                <span slot="title">外链图文</span>
            </el-menu-item>
            <el-menu-item index="photo">
                <i class="el-icon-custom-photo"></i>
                <span slot="title">图片</span>
            </el-menu-item>
            <el-menu-item index="voice">
                <i class="el-icon-custom-voiceMessage"></i>
                <span slot="title">语音</span>
            </el-menu-item>
            <el-menu-item index="video">
                <i class="el-icon-custom-video"></i>
                <span slot="title">视频</span>
            </el-menu-item>
            <el-menu-item index="file">
                <i class="el-icon-custom-file"></i>
                <span slot="title">文件</span>
            </el-menu-item>
        </el-menu>
        <div class="flexDiv-v" style="flex:1;padding-left:20px;padding-right:30px;padding-bottom:10px">
            <div class="flexDiv-h editItemContainer" style="align-items:center;padding-top:20px;padding-bottom:20px">
                <el-button style="margin-right:10px;" icon="el-icon-plus" size="small" v-show="canEdit" @click="showTemplateCreator">添加{{selectedTemplateType|appMessageTemplateTypeConverter()}}</el-button>
                <span style="flex:1" class="text-font-minor">共 {{templates.length}} 条</span>
                <el-input v-model="filterText" placeholder="搜索" prefix-icon="el-icon-search" size="small" style="width:250px">
                </el-input>
            </div>
            <div style="flex:1;" class="flexDiv-v">
                <div class="flexDiv-v " v-if="templates.length>0">
                    <div @click="selectTemplate(item)" :style="{cursor:canEdit?'normal':'pointer'}" class="flexDiv-h editItemContainer" style="align-items:center;padding-top:20px;padding-bottom:20px" v-for="(item,index) in templates" :key="index">
                        <span class="text-font-normal" style="flex:1">
                            <div v-if="selectedTemplateType=='text'">
                                {{item.data.content}}
                            </div>
                            <div class="flexDiv-h" v-else-if="selectedTemplateType=='news'||selectedTemplateType=='externalLinkNews'">
                                <img :src="item.data.news[0].mediaUrl" style="width:107px;height:54px"> {{item.data.content}}
                                <ul>
                                    <li v-for="(item1,index1) in item.data.news" :key="index1">
                                        {{item1.title}}
                                    </li>
                                </ul>
                            </div>
                            <div class="flexDiv-h" v-else-if="selectedTemplateType=='photo'">
                                <img :src="item.data.imageUrl" style="width:100px;height:100px">
                            </div>
                            <div class="flexDiv-h" style="align-items:center" v-else-if="selectedTemplateType=='voice'">
                                <div class="flexDiv-h border" style="padding:10px;margin-right:10px;" @click="playVoice('voicePlayer'+index)">
                                    <i class="el-icon-custom-voiceMessage icon-voiceMessage"></i>
                                </div>
                                <span style="flex:1">{{item.data.fileName}}</span>
                                <span class="text-font-minor" style="margin-right:20px;">{{item.data.duration}}"</span>
                                <audio :src="item.data.mediaUrl" :ref="'voicePlayer'+index" style="width:200px;height:40px;" />
                            </div>
                            <div class="flexDiv-h" style="align-items:center" v-else-if="selectedTemplateType=='video'">
                                <div class="flexDiv-v previewContainer">
                                    <div class="text-font-normal preview-title" style="line-height:18px">
                                        {{item.data.title}}
                                    </div>
                                    <div class="preview-media" style="position:relative">
                                        <img :src="item.data.thumbMediaUrl" style="width:250px">
                                        <i class="el-icon-custom-play icon-video-play" @click="playVideo(item)" />
                                    </div>
                                    <div class="text-font-minor preview-abstract" style="line-height:16px">
                                        {{item.data.abstract}}
                                    </div>
                                </div>
                            </div>
                            <div class="flexDiv-h" style="align-items:center" v-else-if="selectedTemplateType=='file'">
                                <file-icon :file-name="item.data.fileName" @click.native="downloadFile(item.data.mediaUrl)" />
                                <span style="flex:1">{{item.data.fileName}}</span>
                                <span class="text-font-minor" style="text-font-minor;margin-right:20px">{{item.data.fileSize|sizeUnitConverter(item.data.fileSize)}}</span>
                            </div>
                        </span>
                        <span class="text-font-minor">
                            {{item.createdTime|dateConverter()}}
                        </span>
                        <span style="margin-left:20px" v-if="canEdit">
                            <el-button size="small" type="text" class="button-link" style="padding:0px" @click="editTemplate(item)">编辑</el-button>
                            <el-button type="text" size="small" class="button-link" style="padding:0px;margin-left:20px" @click="deleteTemplate(item)">删除</el-button>
                        </span>
                        <i class="icon-selected el-icon-check" v-show="item==selectedTemplate"></i>
                    </div>
                </div>
                <div class="flexDiv-v div-empty" v-else>
                    <i class="el-icon-custom-text icon-empty" v-if="selectedTemplateType=='text'"></i>
                    <i class="el-icon-custom-news icon-empty" v-else-if="selectedTemplateType=='news'"></i>
                    <i class="el-icon-custom-externalLinkNews icon-empty" v-else-if="selectedTemplateType=='externalLinkNews'"></i>
                    <i class="el-icon-custom-photo icon-empty" v-else-if="selectedTemplateType=='photo'"></i>
                    <i class="el-icon-custom-voiceMessage icon-empty" v-else-if="selectedTemplateType=='voice'"></i>
                    <i class="el-icon-custom-video icon-empty" v-else-if="selectedTemplateType=='video'"></i>
                    <i class="el-icon-custom-file icon-empty" v-else-if="selectedTemplateType=='file'"></i>
                    <span class="text-font-minor">暂无素材</span>
                </div>
            </div>
        </div>
        <el-dialog :title="selectedTemplateType|appMessageTemplateTypeConverter()" :close-on-click-modal=false width="1000px" :visible.sync="dialogVisible">
            <app-message-template-creator ref="templateCreator" :canOpenMaterial="false" :templateType="selectedTemplateType" />
            <div slot="footer" class="dialog-footer ">
                <el-button @click="hideTempldateCreator">取消</el-button>
                <el-button type="primary" @click="saveTemplate">保存</el-button>
            </div>
        </el-dialog>
        <el-dialog :visible.sync="showingPlayer" width="680px" append-to-body @close="videoClosed">
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
import fileIcon from "./fileIcon";
export default {
  data() {
    return {
      selectedTemplateType: "text",
      templates: [],
      filterText: null,
      dialogVisible: false,
      showingPlayer: false,
      editingTemplate: null,
      selectedTemplate: null,
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
  props: {
    canEdit: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  beforeCreate() {
    this.$options.components.appMessageTemplateCreator = () =>
      import("./appMessageTemplateCreator.vue");
  },
  components: {
    videoPlayer,
    fileIcon
  },
  async mounted() {
    await this.getTemplates();
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key);
      console.log(keyPath);
      this.selectedTemplateType = key;
      this.getTemplates();
    },
    async getTemplates() {
      this.templates = await api.getAppMessageTemplates(
        this.selectedTemplateType,
        true
      );
    },
    showTemplateCreator() {
      this.dialogVisible = true;
    },
    async saveTemplate() {
      var data = this.$refs.templateCreator.save();

      if (data) {
        data.showInMaterialLibrary = true;
        if (this.editingTemplate) {
          await api.updateAppMessageTemplate(this.editingTemplate._id, data);
          this.editingTemplate = null;
        } else {
          await api.createAppMessageTemplate(data);
        }
        this.dialogVisible = false;
        await this.getTemplates();
      }
    },
    playVoice(name) {
      var audioPlayer = this.$refs[name][0];

      if (audioPlayer.paused) {
        audioPlayer.play();
      } else {
        audioPlayer.pause();
      }
    },
    playVideo(video) {
      this.playerOptions.sources[0].src = video.data.mediaUrl;
      this.playerOptions.poster = video.data.thumbMediaUrl;
      this.showingPlayer = true;
    },
    videoClosed() {
      //   this.$refs.videoPlayer.pause();
    },
    downloadFile(downloadUrl) {
      var a = document.createElement("a");
      a.href = downloadUrl;
      a.click();
    },
    async deleteTemplate(template) {
      await api.deleteAppMessageTemplate(template._id);
      await this.getTemplates();
    },
    editTemplate(template) {
      this.dialogVisible = true;
      this.editingTemplate = template;
      this.$refs.templateCreator.template = template;
    },
    hideTempldateCreator() {
      this.editingTemplate = null;
      this.dialogVisible = false;
    },
    selectTemplate(template) {
      if (!this.canEdit) {
        this.selectedTemplate = template;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.el-menu-vertical {
  width: 170px;
}

.div-empty {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  align-items: center;
}

.icon-empty {
  font-size: 64px;
  color: @color-font-minor;
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

.previewContainer {
  border: 1px solid @color-border-level2;
  padding: 10px;
  width: 250px;
  min-height: 125px;
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

.icon-selected {
  font-size: 24px;
  color: @color-theme;
  margin-left: 20px;
}
</style>
