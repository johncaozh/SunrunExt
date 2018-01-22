<template>
    <div class="flexDiv-v">
        <el-table :data="users" style="width: 100%" :empty-text="当前没有管理员">
            <el-table-column prop="name" label="姓名" width="180">
            </el-table-column>
            <el-table-column prop="rank" label="职务" width="180">
            </el-table-column>
            <el-table-column prop="address" label="部门">
            </el-table-column>
            <el-table-column prop="mobile" label="手机">
            </el-table-column>
            <el-table-column prop="email" label="邮箱">
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="flexDiv-h" style="align-items:center;margin-top:20px">
            <el-button type="primary" style="align-self:flex-start">添加管理员</el-button>
            <span class="text-font-minor" style="margin-left:10px">
                成为管理员后，具备对所有成员的查看和管理的权限，并且具备所有应用的发消息和管理的权限。
            </span>
        </div>
    </div>
</template>
<script>
export default {
  methods: {
    handleDelete(index, data) {}
  }
};
</script>
<style lang="less" scoped>

</style>
