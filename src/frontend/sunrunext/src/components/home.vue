<template>
    <div class="flexDiv-h div-root">
        <el-collapse style="flex:1">
            <el-collapse-item v-for="(item,index) in news" :key="index" :title="item.title">
                <div v-html="item.detail"></div>
            </el-collapse-item>
        </el-collapse>
        <div class="flexDiv-v div-right">

        </div>
    </div>
</template>

<<script>
export default {
  data(){
      return {
          news:[{
              title:'这是一条测试新闻',
              detail:'与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。'
          },{
              title:'这是一条测试新闻',
              detail:'与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。'
          },{
              title:'这是一条测试新闻',
              detail:'与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。'
          },{
              title:'这是一条测试新闻',
              detail:'与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。'
          },{
              title:'这是一条测试新闻',
              detail:'与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。'
          },{
              title:'这是一条测试新闻',
              detail:'与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。'
          },{
              title:'这是一条测试新闻',
              detail:'与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。'
          }]
      };
  }
}
</script>

<style scoped lang="less">
.div-root {
  padding-left: 40px;
  padding-right: 40px;
  padding-top: 30px;
  padding-bottom: 30px;
}

.div-right {
  border-left: 1px dotted @color-border-level2;
  width: 320px;
  padding-left: 30px;
  margin-left: 40px;
}
</style>


