<template>
  <div class="app-container">
    <div class="filter-container clearfix">
      <div>
        <label class="rm">用户名</label>
        <el-input
          v-model.trim="listQuery.name"
          placeholder="请输入"
          style="width: 200px;"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
      </div>
      <div>
        <label class="lm20 rm">手机号</label>
        <el-input
          v-model.trim="listQuery.phone"
          placeholder="请输入"
          style="width: 200px;"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
      </div>
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
      <!-- <div class="fr">
        <el-button class="filter-item" icon="el-icon-plus" type="primary" @click="handleCreate">
          新增
        </el-button>
      </div> -->
    </div>

    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column type="index" width="50" label="编号" align="center" />
      <el-table-column align="center" label="用户名">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>

      <!-- <el-table-column align="center" label="头像">
        <template slot-scope="scope">
          <el-image style="width: 60px; height: 60px" :src="baseURL + scope.row.userImg" />
        </template>
      </el-table-column> -->

      <el-table-column label="手机号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>

      <el-table-column label="邮箱" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.eMail }}</span>
        </template>
      </el-table-column>

      <el-table-column label="余额" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.balance }}</span>
        </template>
      </el-table-column>

      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>




      <!-- <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button size="mini" @click="handleUpdatePwd(row)">
            重置密码
          </el-button>
          <el-button v-if="row.userState == 0" size="small" type="primary" @click="handleUpdateS(row)">
            启用
          </el-button>
          <el-button v-else size="small" type="danger" @click="handleUpdateE(row)">
            禁用
          </el-button>
          <el-button size="small" type="danger" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.pageSize"
      @pagination="fetchData"
    />

  </div>
</template>

<script>
import {
  userList,
  userDetails,
  userEditPwd,
  userEnable,
  userDisable
} from '@/api/userManagement'
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
      listQuery: {
        page: 1,
        pageSize: 10,
        userState: ''
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() { // 查
      this.listLoading = true
      userList(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.listLoading = false
      })
    },
    // handleUpdateS(row) { // 启用按钮
    //   this.$confirm('确认要启用该用户吗?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     const setData = {}
    //     setData.userId = row.id
    //     userEnable(setData).then(() => {
    //       this.fetchData()
    //       this.$notify({
    //         type: 'success',
    //         message: '操作成功!'
    //       })
    //     })
    //   })
    // },
    // handleUpdateE(row) { // 禁用按钮
    //   this.$confirm('确认要禁用该用户吗?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     const setData = {}
    //     setData.userId = row.id
    //     userDisable(setData).then(() => {
    //       this.fetchData()
    //       this.$notify({
    //         type: 'success',
    //         message: '操作成功!'
    //       })
    //     })
    //   })
    // },
    // handleUpdatePwd(row) {
    //   this.$confirm('确认要重置该密码的登录密码吗?(123456)', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     const setData = {}
    //     setData.userId = row.id
    //     userEditPwd(setData).then(() => {
    //       this.$notify({
    //         type: 'success',
    //         message: '重置成功!'
    //       })
    //     })
    //   })
    // },
    // handleDelete(row) { // 删除按钮
    //   this.$confirm('确认删除 “' + row.userName + '” 人员吗?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     const setData = {}
    //     setData.id = row.id
    //     userDetails(setData, 'delete').then(() => {
    //       this.fetchData()
    //       this.$notify({
    //         type: 'success',
    //         message: '删除成功!'
    //       })
    //     })
    //   })
    // },
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
