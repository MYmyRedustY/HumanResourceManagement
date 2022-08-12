<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 组织架构 -->
      <el-card class="tree-card">
        <!-- 用了一个行列布局 -->
        <!-- 给组件传值，传的是公司名 -->
        <TreeTool :tree-node="company" :is-root="true" @addDepts="addDepts" />
        <el-tree
          :data="departs"
          :props="defaultProps"
          :default-expand-all="true"
        >
          <TreeTool
            slot-scope="{ data }"
            :tree-node="data"
            @delDepts="getDepartments"
            @addDepts="addDepts"
          />
          <!-- 传入内容 插槽内容 会循环多次 有多少节点 就循环多少次 -->
          <!-- 作用域插槽 slot-scope="obj" 接收传递给插槽的数据   data 每个节点的数据对象-->
        </el-tree>
        <!-- 新增部门的弹窗 -->
        <add-dept
          :show-dialog="showDialog"
          :tree-node="node"
          :showDialog.sync="showDialog"
          @addDepts="getDepartments"
        />
      </el-card>
    </div>
  </div>
</template>

<script>
import TreeTool from './components/tree-tools.vue'
import { getDepartmentsApi } from '@/api/departments'
import { tranListToTreeData } from '@/utils'
import AddDept from './components/add-dept' // 引入新增部门组件
export default {
  components: {
    TreeTool,
    AddDept
  },
  data() {
    return {
      defaultProps: {
        label: 'name',
        children: 'children'
      },
      departs: [],
      company: {},
      showDialog: false, // 控制显示新增部门组件
      node: null // 记录点击添加的当前节点
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    async getDepartments() {
      const res = await getDepartmentsApi()
      this.company = { name: res.companyName, manager: '负责人', id: '' }
      this.departs = tranListToTreeData(res.depts, '')
    },
    addDepts(node) {
      // 先显示弹层
      this.showDialog = true
      // node是点击的当前的部门，这个部门应该记录下来，等会用来提交数据
      this.node = node
    }
  }
}
</script>

<style scoped>
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
</style>
