<template>
  <div class="flexDiv-h " style="align-items:flex-start">
    <div class="flexDiv-v editContainer" style="flex:1">
      <div class="editItemContainer" style="padding-top:0px">
        <input type="text" v-model="title" placeholder="在此输入标题" class="input-title" />
      </div>
      <div class="editItemContainer">
        <span class="text-font-minor">
          <el-button type="text" size="small" class="button-link" style="margin-right:10px;">添加视频</el-button>
          不超过20MB, 文件格式: rm, rmvb, wmv, avi, mpg, mpeg, mp4
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
      <div class="preview-media">
        <img>
      </div>
      <div class="text-font-minor preview-abstract" style="line-height:16px">
        {{abstract}}
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        mediaId: null,
        thumbMediaId: null,
        title: null,
        abstract: null
      };
    }
  };

</script>

<style lang="less" scoped>
  .editContainer {}

  .editItemContainer {
    border-bottom: 1px solid @color-border-level2;
    padding-top: 30px;
    padding-bottom: 30px;
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
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
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

  .preview-media{ 
    background: @color-border-level2;
    min-height: 120px;
    margin-top: 10px;
    margin-bottom: 10px;
  }

</style>
