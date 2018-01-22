<template>
    <div class="flexDiv-h">
        <el-menu default-active="1" class="el-menu-vertical" @open="handleOpen" @close="handleClose">
            <el-menu-item index="1">
                <i class="el-icon-custom-text"></i>
                <span slot="title">文字</span>
            </el-menu-item>
            <el-menu-item index="2">
                <i class="el-icon-custom-news"></i>
                <span slot="title">图文</span>
            </el-menu-item>
            <el-menu-item index="3">
                <i class="el-icon-custom-externalLinkNews"></i>
                <span slot="title">外链图文</span>
            </el-menu-item>
            <el-menu-item index="4">
                <i class="el-icon-custom-photo"></i>
                <span slot="title">图片</span>
            </el-menu-item>
            <el-menu-item index="5">
                <i class="el-icon-custom-voiceMessage"></i>
                <span slot="title">语音</span>
            </el-menu-item>
            <el-menu-item index="6">
                <i class="el-icon-custom-video"></i>
                <span slot="title">视频</span>
            </el-menu-item>
            <el-menu-item index="7">
                <i class="el-icon-custom-file"></i>
                <span slot="title">文件</span>
            </el-menu-item>
        </el-menu>
    </div>
</template>

<script>
export default {
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  }
};
</script>

<style lang="less" scoped>
.el-menu-vertical{
    width: 170px;
}
</style>


