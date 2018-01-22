<template>
    <div class="flexDiv-h">
        <app-list/>
        <el-table :data="users" style="width: 100%">
            <el-table-column prop="name" label="状态" width="120">
            </el-table-column>
            <el-table-column prop="rank" label="消息类型" width="120">
            </el-table-column>
            <el-table-column prop="address" label="消息主题">
            </el-table-column>
            <el-table-column prop="mobile" label="时间" width="120">
            </el-table-column>
            <el-table-column prop="email" label="操作" width="120">
            </el-table-column>
            <el-table-column prop="tag" label="标签" width="100" :filters="[{ text: '家', value: '家' }, { text: '公司', value: '公司' }]" :filter-method="filterTag" filter-placement="bottom-end">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.tag === '家' ? 'primary' : 'success'" close-transition>{{scope.row.tag}}</el-tag>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import appList from "./appList";
export default {
  components: {
    appList
  },
  methods: {
    formatter(row, column) {
      return row.address;
    },
    filterTag(value, row) {
      return row.tag === value;
    }
  }
};
</script>

<style lang="less" scoped>
.el-menu-vertical {
  width: 170px;
}
</style>


