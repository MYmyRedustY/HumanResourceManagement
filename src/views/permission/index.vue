<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools>
        <template v-slot:after>
          <el-button
            type="primary"
            size="small"
            @click="addPermission(row.id, 1)"
          >
            添加权限
          </el-button>
        </template>
      </page-tools>
      <!-- 表格 -->
      <el-table :data="list" row-key="id" border>
        <el-table-column label="名称" prop="name" style="width: 90%" />
        <el-table-column
          align="center"
          label="标识"
          prop="code"
          style="width: 90%"
        />
        <el-table-column align="center" label="描述" style="width: 90%" />
        <el-table-column align="center" label="操作">
          <template v-slot="{ row }">
            <el-button
              v-if="row.type === 1"
              type="text"
              @click="addPermission(row.id, 2)"
            >
              添加
            </el-button>
            <el-button type="text" @click="editPermission(row.id)">
              编辑
            </el-button>
            <el-button type="text" @click="delPermission(row.id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新增和编辑弹层 -->
    <el-dialog :visible="showDialog" :title="showText">
      <el-form
        ref="perForm"
        :model="formData"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="名称">
          <el-input v-model="formData.name" style="width: 90%" />
        </el-form-item>
        <el-form-item label="标识">
          <el-input v-model="formData.code" style="width: 90%" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="formData.description" style="width: 90%" />
        </el-form-item>
        <el-form-item label="操作">
          <el-switch
            v-model="formData.enVisible"
            active-value="1"
            inactive-value="0"
          />
        </el-form-item>
      </el-form>
      <!-- 确定取消 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" type="primary" @click="btnOK">确定</el-button>
          <el-button size="small" @click="btnCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {
  getPermissionListApi,
  addPermissionApi,
  updatePermissionApi,
  delPermissionApi,
  getPermissionDetailApi
} from '@/api/permission'
import { tranListToTreeData } from '@/utils'
export default {
  name: 'PermissionIndex',
  data() {
    return {
      list: [],
      showDialog: false,
      formData: {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      },
      rules: {
        name: [
          { required: true, message: '权限名称不能为空', trigger: 'blur' }
        ],
        code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {
    showText() {
      return this.formData.id ? '编辑' : '新增'
    }
  },
  created() {
    this.getPermissoinList()
  },
  methods: {
    async getPermissoinList() {
      this.list = tranListToTreeData(await getPermissionListApi(), '0')
    },
    // 删除操作
    async delPermission(id) {
      try {
        await this.$confirm('确定要删除该数据吗')
        await delPermissionApi(id)
        this.getPermissoinList()
        this.$message.success('删除成功')
      } catch (error) {
        console.log(error)
      }
    },
    btnOK() {
      this.$refs.perForm
        .validate()
        .then(() => {
          if (this.formData.id) {
            updatePermissionApi(this.formData)
          } else {
            addPermissionApi(this.formData)
          }
        })
        .then(() => {
          //  提示消息
          this.$message.success(this.formData.id ? '编辑成功' : '新增成功')
          this.getPermissionList()
          this.showDialog = false
        })
    },
    btnCancel() {
      this.formData = {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      }
      this.$refs.perForm.resetFields()
      this.showDialog = false
    },
    addPermission(pid, type) {
      console.log(22)
      this.formData.pid = pid
      this.formData.type = type
      this.showDialog = true
    },
    async editPermission(id) {
      this.formData = await getPermissionDetailApi(id)
      this.showDialog = true
    }
  }
}
</script>

<style>
</style>
