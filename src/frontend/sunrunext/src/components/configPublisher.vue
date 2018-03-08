<template>
    <div>
        <sub-header></sub-header>
        <div class="flexDiv-h" style="flex:1">
            <div class="flexDiv-v div-aside">
                <el-input v-model="filterText " placeholder="配置节点" prefix-icon="el-icon-search" size="mini" />
                <el-tree v-loading="loading " :filter-node-method="filterNode" ref="tree" node-key="id" :render-content="renderTreaNode" @current-change="orgSelected" :data="treeData" :highlight-current="true" :props="defaultProps " style="background:transparent;margin-top:10px"></el-tree>
                <el-button @click="mkdir">mkdir</el-button>
                <el-button @click="createNode">createnode</el-button>
                <el-button @click="setData">setData</el-button>
                <el-button @click="getData">getData</el-button>
            </div>
            <!-- <el-table :data="users " style="width:100%">
                <el-table-column prop="name" label="Name" width="280">
                </el-table-column>
                <el-table-column prop="value" label="Value" width="280">
                </el-table-column>
                <el-table-column prop="email" label="操作">
                </el-table-column>
            </el-table> -->
        </div>
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
      rootNode: {
        name: "根目录",
        id: "/",
        path: "/",
        children: null
      },
      selectedNode: null,
      filterText: "",
      treeData: [],
      loading: false
    };
  },
  components: {
    subHeader
  },
  watch: {
    filterText(val) {
      //   this.$refs.tree.filter(val);
    }
  },

  async mounted() {
    this.loading = true;
    await this.expandNode(this.rootNode);
    this.treeData.push(this.rootNode);
    var instance = this;

    Vue.nextTick(function() {
      instance.$refs.tree.setCurrentKey(instance.treeData[0].id);
      instance.loading = false;
    });
  },

  methods: {
    async expandNode(node) {
      this.selectedNode = node;
      var children = await api.zk_getChildren(node.path);
      node.children = [];
      children.forEach(i => {
        node.children.push({
          name: i,
          id: node.path === "/" ? `${node.path}${i}` : `${node.path}/${i}`,
          path: node.path === "/" ? `${node.path}${i}` : `${node.path}/${i}`
        });
      });
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

    async getData(path) {
      try {
        path = this.filterText;
        var value = await api.zk_getData(path);
        this.$message.info(value);
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
          <span>{node.label}</span>
          <span>
            <el-button
              size="mini"
              type="text"
              on-click={() => this.append(data)}
            >
              添加子目录
            </el-button>
            <el-button
              size="mini"
              type="text"
              on-click={async () => await this.remove(node, data)}
            >
              删除
            </el-button>
          </span>
        </span>
      );
    },

    async remove(node, data) {
      try {
        await api.zk_remove(data.path);
        this.$message.info("删除成功");
      } catch (err) {
        this.$message.error(err);
      }
    },

    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    orgSelected(org, node) {
      this.filterText = org.path;
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


