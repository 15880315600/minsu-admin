<template>
  <div class="app-container">
    <div class="filter-container clearfix">
      <div>
        <label class="rm">账号</label>
        <el-input
          v-model.trim="listQuery.account"
          placeholder="请输入"
          style="width: 200px;"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
      </div>
      <div>
        <label class="lm20 rm">名字</label>
        <el-input
          v-model.trim="listQuery.name"
          placeholder="请输入"
          style="width: 200px;"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
      </div>
      <div>
        <label class="lm20 rm">电话</label>
        <el-input
          v-model.trim="listQuery.phone"
          placeholder="请输入"
          style="width: 200px;"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
      </div>
      <!-- <label class="lm20 rm">性别</label>
      <el-select v-model.trim="listQuery.sex" style="width: 140px" class="filter-item">
        <el-option key="" label="全部" value="" />
        <el-option key="0" label="男" value="0" />
        <el-option key="1" label="女" value="1" />
      </el-select> -->
      <div>
        <el-button class="lm20 filter-item" style="margin-left: 20px;" type="primary" @click="handleFilter">
          查询
        </el-button>
      </div>
      <div>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" @click="handleReset">
          重置
        </el-button>
      </div>
      <div class="fr">
        <el-button class="filter-item" icon="el-icon-plus" type="primary" @click="handleCreate">
          新增
        </el-button>
      </div>
    </div>

    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column type="index" width="50" label="编号" align="center" />
      <el-table-column label="账号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.account }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="姓名">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="手机号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.enableState == 1">启用</span>
          <span v-else-if="scope.row.enableState == 0">禁用</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button size="small" @click="handleUpdate(row)">
            修改
          </el-button>
          <!-- <el-button size="mini" type="danger" @click="handleUpdatePwd(row)">
            修改密码
          </el-button> -->
          <el-button size="small" v-if="row.canDelete"  type="danger" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.pageSize"
      @pagination="fetchData"
    />

    <el-dialog :title="dialogStatus" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-width="88px" style="width: 400px; margin-left:50px;">
        <el-form-item label="人员姓名" prop="name">
          <el-input v-model.trim="temp.name" placeholder="人员姓名" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model.trim="temp.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="账号" prop="account">
          <el-input v-model.trim="temp.account" placeholder="请输入账号" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model.trim="temp.password" type="password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item v-if="dialogStatus !== '添加管理员'" label="状态">
          <el-radio-group v-model.trim="temp.enableState">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="dialogStatus !== '添加管理员'" label="重置密码">
          <el-radio-group v-model.trim="temp.resetPWD">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='添加管理员'?createData():updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {
  adminList,
  adminUpdate,
  adminDetails
} from '@/api/admin'
import Pagination from '@/components/Pagination'

export default {
  components: {
    Pagination
  },
  directives: {

  },
  data() {
    return {
      list: null,
      listLoading: false,
      total: 0,
      roleList: [],
      listQuery: {
        page: 1,
        pageSize: 10
      },
      rules: {
        name: [{
          required: true,
          message: '请输入人员名称',
          trigger: 'blur'
        }],
        phone: [{
          required: true,
          message: '请输入手机号码',
          trigger: 'blur'
        }],
        account: [{
          required: true,
          message: '请输入登录账号',
          trigger: 'blur'
        }]
      },
      role: {},
      dialogStatus: '',
      dialogFormVisible: false,
      temp: {
        name: '',
        adminRole: '',
        phone: '',
        account: '',
        password: '',
        enableState: 1,
        resetPWD: 0,
        canDelete: 1
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() { // 查
      this.listLoading = true
      adminList(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleCreate() { // 添加按钮
      this.temp = {
        name: '',
        adminRole: '',
        phone: '',
        account: '',
        password: '',
        enableState: 1,
        resetPWD: 0
      }
      this.dialogStatus = '添加管理员' // 表单状态修改为创建
      this.dialogFormVisible = true // 控制隐藏显示
    },
    createData() { // 完成创建按钮
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          adminUpdate(this.temp, 'post').then(() => {
            this.dialogFormVisible = false
            this.fetchData()
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) { // 修改按钮
      this.temp.id = row.id
      this.temp.account = row.account
      this.temp.name = row.name
      this.temp.phone = row.phone
      this.temp.enableState = row.enableState
      this.temp.password = ''
      this.temp.resetPWD = 0
      this.dialogStatus = '修改管理员' // 表单状态修改为修改
      this.dialogFormVisible = true // 显示
      this.temp.canDelete = row.canDelete
    },
    updateData() { // 完成修改按钮
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          adminUpdate(this.temp, 'put').then(() => {
            this.dialogFormVisible = false
            this.fetchData()
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row) { // 删除按钮
      this.$confirm('确认删除 “' + row.name + '” 人员吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const setData = {}
        setData.id = row.id
        adminDetails(setData, 'delete').then(() => {
          this.fetchData()
          this.$notify({
            type: 'success',
            message: '删除成功!'
          })
        })
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.fetchData()
    },
    handleReset() {
      this.listQuery = {
        page: 1,
        pageSize: 10
      }
      this.fetchData()
    }
  }
}
</script>
