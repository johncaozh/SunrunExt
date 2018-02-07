<template>
    <el-tooltip class="item" effect="light" :content="text" placement="top-start">
        <i class="el-icon-question text-font-normal" />
    </el-tooltip>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      required: true,
      default: null
    }
  }
};
</script>

