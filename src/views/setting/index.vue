<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <!-- 左侧内容 -->
          <el-tab-pane label="角色管理">
            <el-row style="height: 60px">
              <el-button
                icon="el-icon-plus"
                type="primary"
                size="small"
                @click="showDialog = true"
              >
                新增角色
              </el-button>
            </el-row>

            <!-- 表格 -->
            <el-table border="" :data="list">
              <el-table-column
                align="center"
                label="序号"
                width="120"
                type="index"
              />
              <el-table-column
                prop="name"
                align="center"
                label="角色名称"
                width="240"
              />
              <el-table-column prop="description" align="center" label="描述" />
              <el-table-column align="center" label="操作">
                <template slot-scope="{ row }">
                  <el-button size="small" type="success">分配权限</el-button>
                  <el-button
                    size="small"
                    type="primary"
                    @click="editRole(row.id)"
                    >编辑</el-button
                  >
                  <el-button
                    size="small"
                    type="danger"
                    @click="deleteRole(row.id)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>

            <!-- 分页组件 -->
            <el-row
              type="flex"
              justify="center"
              align="middle"
              style="height: 60px"
            >
              <!-- 分页组件 -->
              <el-pagination
                :current-page="page.page"
                :page-size="page.pagesize"
                :total="page.total"
                layout="prev,pager,next"
                @current-change="changePage"
              />
            </el-row>
          </el-tab-pane>

          <!-- 右侧内容 -->
          <el-tab-pane label="公司信息">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            />
            <el-form label-width="120px" style="margin-top: 50px">
              <el-form-item label="公司名称">
                <el-input
                  v-model="formData.name"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input
                  v-model="formData.companyAddress"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="公司电话">
                <el-input
                  v-model="formData.companyPhone"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input
                  v-model="formData.mailbox"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="备注">
                <el-input
                  v-model="formData.remarks"
                  type="textarea"
                  :rows="3"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <!-- 弹出层 -->
    <el-dialog title="编辑弹层" :visible="showDialog" @close="btnCancel">
      <el-form
        ref="roleForm"
        :model="roleForm"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model.trim="roleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description"></el-input>
        </el-form-item>
      </el-form>
      <!-- footer插槽 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="btnCancel">取消</el-button>
          <el-button size="small" type="primary" @click="btnOK">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRoleListApi,
  getCompanyInfoApi,
  deleteRoleApi,
  updateRoleApi,
  getRoleDetailApi,
  addRoleApi
} from '@/api/setting'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      list: [],
      page: {
        page: 1,
        pagesize: 10,
        total: 0 // 默认总数
      },
      formData: {
        // 公司信息
      },
      showDialog: false,
      // 专门接收新增或者编辑的编辑的表单数据
      roleForm: {},
      rules: {
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['companyId'])
  },
  created() {
    this.getRoleList()
    this.getCompanyInfo()
  },
  methods: {
    async getRoleList() {
      const { total, rows } = await getRoleListApi(this.page)
      this.page.total = total
      this.list = rows
    },
    changePage(newPage) {
      // newPage是当前点击的页码
      this.page.page = newPage
      // 再次调用接口获取页面
      this.getRoleList()
    },
    // 获取的公司的信息
    async getCompanyInfo() {
      this.formData = await getCompanyInfoApi(this.companyId)
    },
    // 删除角色
    async deleteRole(id) {
      try {
        await this.$confirm('确认删除该角色吗')
        // 只有点击了确定，才能进入下方
        // 调用删除接口
        await deleteRoleApi(id)
        // 重新加载数据
        this.getRoleList()
        // 提示成功
        this.$message.success('删除角色成功')
      } catch (error) {
        console.log(error)
      }
    },
    async editRole(id) {
      this.roleForm = await getRoleDetailApi(id)
      this.showDialog = true
    },
    async btnOK() {
      try {
        await this.$refs.roleForm.validate()
        if (this.roleForm.id) {
          // 修改数据
          await updateRoleApi(this.roleForm)
        } else {
          // 新增数据
          await addRoleApi(this.roleForm)
          console.log(this.roleForm)
        }
        // 重新拉取数据
        this.getRoleList()
        this.$message.success('操作成功')
        // 关闭弹层  =>  触发el-dialog的事件close事件
        this.showDialog = false
      } catch (error) {
        console.log(error)
      }
    },
    btnCancel() {
      this.$refs.roleForm.resetFields()
      this.roleForm = {}
      this.showDialog = false
    }
  }
}
</script>

<style>
</style>
