<template>
    <div class="flexDiv-v" style="flex:1">
        <sub-header></sub-header>
        <div class="flexDiv-h" style="flex:1">
            <div class="flexDiv-v div-aside">
                <el-input v-model="filterText " placeholder="搜索节点" prefix-icon="el-icon-search" size="mini" />
                <el-tree :default-expanded-keys="['/']" :expand-on-click-node="false" v-loading="loading" lazy :load="loadNodeChildren" :filter-node-method="filterNode" ref="tree" node-key="id" :render-content="renderTreaNode" @node-click="nodeClick" :highlight-current="true" :props="defaultProps" style="background:transparent;margin-top:10px"></el-tree>
            </div>
            <el-table :data="selectedNode.children" style="width:100%" v-if="selectedNode">
                <el-table-column prop="name" label="Name" width="280">
                </el-table-column>
                <el-table-column prop="value" label="Value" width="280">
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" type="danger" @click="remove(scope.row)">删除</el-button>
                        <el-button size="mini" @click="editNode( scope.row)">编辑</el-button>
                        <el-button size="mini" type="success" @click="copyNodePath(scope.row)">复制</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog width="400px" :title="editingNode? '编辑': '新建'" :visible.sync="dialogVisible " @close="cancelForm">
            <el-form :model="form" ref="form">
                <el-form-item label="name" prop="name" :rules="[{ required: true, message: 'name不能为空'},{ max:32, message: 'name不能超过32个字'}] ">
                    <el-input v-model="form.name" size="small" placeholder="请输入name " :readonly="editingNode!=null" />
                </el-form-item>
                <el-form-item label="value" prop="value">
                    <el-input v-model="form.value" size="small" placeholder="请输入value（可为空） " />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelForm" size="small ">取消</el-button>
                <el-button type="primary " @click="commitForm " size="small ">创建</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import api from "../utility/api";
import subHeader from "./common/subHeader";
import Vue from "Vue";
export default {
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "name"
      },
      filterText: "",
      loading: false,
      form: {
        name: "",
        value: ""
      },
      selectedNode: null,
      editingNode: null,
      dialogVisible: false
    };
  },
  components: {
    subHeader
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },

  methods: {
    async getNodeChilren(node) {
      try {
        var children = await api.zk_getChildren(node.path);
        var formatedChildren = [];
        children.forEach(i => {
          var childNodePath =
            node.path === "/" ? `${node.path}${i}` : `${node.path}/${i}`;

          formatedChildren.push({
            name: i,
            id: childNodePath,
            path: childNodePath,
            value: null,
            children: []
          });
        });

        var getValuePromises = [];
        formatedChildren.forEach(node => {
          getValuePromises.push(
            new Promise(async function(resolve, reject) {
              try {
                node.value = await api.zk_getData(node.path);
                resolve(node.value);
              } catch (error) {
                reject(error);
              }
            })
          );
        });

        await Promise.all(getValuePromises);
        return formatedChildren;
      } catch (error) {
        this.$message.error(error);
        return [];
      }
    },

    async createNode(path, value) {
      try {
        path = this.filterText;
        await api.zk_createNode(path, "testvalue");
        this.$message.info("创建成功");
      } catch (err) {
        this.$message.error(err);
      }
    },
    async mkdir(path) {
      try {
        path = this.filterText;
        await api.zk_mkdir(path);
        this.$message.info("创建成功");
      } catch (err) {
        this.$message.error(err);
      }
    },

    async setData(path) {
      try {
        path = this.filterText;
        await api.zk_setData(path, "test");
        this.$message.info("设置成功");
      } catch (err) {
        this.$message.error(err);
      }
    },

    renderTreaNode(h, { node, data, store }) {
      return (
        <span style="flex:1;display:flex;align-items:center;font-size:14px;padding-right:8px;">
          <i
            class="el-icon-custom-group"
            style="color:#3E6A8F;margin-right:5px;font-size:18px"
          />
          <span style="flex:1">{node.label}</span>
          <span style="margin-left:10px">
            <i
              class="el-icon-plus"
              on-click={() => this.addNode()}
              title="增加子节点"
              style="font-size:18px;margin-left:5px"
            />
          </span>
        </span>
      );
    },

    async remove(node) {
      try {
        await this.$confirm("删除后将不可恢复，确定继续操作吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });
        try {
          await api.zk_remove(node.path);
          this.selectedNode.children.removeByValue(node);
          this.$message.info("删除成功");
        } catch (err1) {
          this.$message.error(err1);
        }
      } catch (err) {
        this.$message.info("已取消操作。");
      }
    },

    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    
    copyNodePath(node) {
      var instance = this;
      this.$copyText(node.path).then(
        function(e) {
          instance.$message.success("已复制到剪贴板。");
        },
        function(e) {
          instance.$message.error(null, "复制到剪贴板失败。");
        }
      );
    },
    editNode(node) {
      this.editingNode = node;
      this.form.name = node.name;
      this.form.value = node.value;
      this.dialogVisible = true;
    },
    addNode() {
      this.editingNode = null;
      this.form.name = "";
      this.form.value = "";
      this.dialogVisible = true;
    },
    async commitForm() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          if (this.editingNode) {
            try {
              await api.zk_setData(this.editingNode.path, this.form.value);
              this.editingNode.value = this.form.value;
              this.$message.success("修改成功。");
              this.dialogVisible = false;
              this.$refs.form.resetFields();
            } catch (error) {
              this.$message.error(error);
            }
          } else {
            try {
              var connectChar = this.selectedNode.path.endsWith("/") ? "" : "/";
              var path = `${this.selectedNode.path}${connectChar}${
                this.form.name
              }`;
              await api.zk_createNode(path, this.form.value);
              this.selectedNode.children.push({
                id: path,
                name: this.form.name,
                path: path,
                value: this.form.value
              });
              this.$message.success("新增成功。");
              this.$refs.form.resetFields();
              this.dialogVisible = false;
            } catch (error) {
              this.$message.error(error);
            }
          }
        }
      });
    },
    cancelForm() {
      this.$refs.form.resetFields();
      this.dialogVisible = false;
    },
    async nodeClick(data, node, component) {
      this.selectedNode = data;
      this.selectedNode.children = await this.getNodeChilren(this.selectedNode);
    },
    async loadNodeChildren(node, resolve) {
      if (node.level == 0) {
        resolve([
          {
            name: "根节点",
            id: "/",
            path: "/",
            children: []
          }
        ]);

        return;
      }

      this.selectedNode = node.data;
      this.selectedNode.children = await this.getNodeChilren(node.data);
      resolve(this.selectedNode.children);
    }
  }
};
</script>
<style lang="less" scoped>
.div-aside {
  width: 240px;
  padding: 10px;
  border-right: 1px dotted @color-border-level2;
  background: #f9fafc;
  margin-right: 20px;
}
</style>


