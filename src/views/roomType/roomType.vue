<template>
  <div class="app-container">
    <div class="filter-container clearfix">
      <div>
        <label class="rm">类型名</label>
        <el-input
          v-model.trim="listQuery.name"
          placeholder="请输入"
          style="width: 200px;"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
      </div>

      <div>
        <el-button class="filter-item" style="margin-left: 20px;" type="primary" @click="handleFilter">
          查询
        </el-button>
      </div>
      <div>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" @click="handleReset">
          重置
        </el-button>
      </div>

      <div class="fr">
        <el-button class="filter-item" style="margin-left: 10px;" icon="el-icon-plus" type="primary" @click="handleCreate">
          新增
        </el-button>
      </div>
      <div class="fr">
        <el-button class="filter-item" style="margin-left: 10px;" icon="el-icon-delete" type="primary" @click="handleBatchDelete">
          批量删除
        </el-button>
      </div>

    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      @selection-change="handleSelectionChange"
    >

      <el-table-column type="selection" width="40" align="center" />
      <el-table-column type="index" width="50" label="序号" align="center" />

      <el-table-column align="center" label="类型名" width="160">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>


	  <el-table-column label="创建时间" align="center" width="90">
	    <template slot-scope="scope">
	      <span>{{ scope.row.createTime }}</span>
	    </template>
	  </el-table-column>

      <el-table-column label="操作" align="center" width="120" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-dropdown>
            <span style=" cursor: pointer;color: #409EFF;">
              <i class="el-icon-edit el-icon--left" />操作<i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-if="row.roomStatus == 0" @click.native="handleStatusUpdate(row,1)">上架</el-dropdown-item>
              <el-dropdown-item v-if="row.roomStatus == 1" @click.native="handleStatusUpdate(row,0)">下架</el-dropdown-item>
              <el-dropdown-item @click.native="handleUpdate(row)">修改</el-dropdown-item>
              <el-dropdown-item @click.native="handleDelete(row)">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
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

  </div>
</template>

<script>

import {
  roomTypeList,
  roomTypeDelete
} from '@/api/roomType'
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
      temp: {},
      pushClass: [],
      category: [],
      multipleSelection: [],
      dictionariesAis: [],
      listQuery: {
        page: 1,
        pageSize: 10,
        salesFlag: '',
        priceFlag: '',
        line: ''
      },
      dialogFormVisible: false
    }
  },
  created() {
    // 其他页面返回时，保存搜索状态
    var roomTypeListQuery = JSON.parse(sessionStorage.getItem('roomTypeListQuery'))
    if (roomTypeListQuery) {
      this.listQuery = roomTypeListQuery
      sessionStorage.setItem('roomTypeListQuery', null) // 存入Session Storage缓存
    }
    this.fetchData()
  },

  methods: {
    fetchData() { // 查
      this.listLoading = true
      roomTypeList(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total

        this.listLoading = false
      })
    },
    getData() {
      pushClassificationList({
        page: 1,
        pageSize: 100
      }).then(res => {
        this.pushClass = res.data.records
        this.dialogFormVisible = true
      })
    },
    handleCreate() { // 添加按钮
      sessionStorage.setItem('roomTypeData', null) // 存入Session Storage缓存
      sessionStorage.setItem('roomTypeListQuery', JSON.stringify(this.listQuery)) // 存入Session Storage缓存
      this.$router.push({
        path: this.redirect || '/roomType/roomTypeUpdate'
      })
    },
    handleUpdate(row) { // 修改按钮
      sessionStorage.setItem('roomTypeListQuery', JSON.stringify(this.listQuery)) // 存入Session Storage缓存
      // sessionStorage.setItem('roomData', JSON.stringify(row)) // 存入Session Storage缓存
      this.$router.push({
        path: '/roomType/roomTypeUpdate',
        query: {
          id: row.id
        }
      })
    },
    handleStatusUpdate(row, sta) {
      var setData = {}
      setData.id = row.id
      setData.status = sta
      this.$confirm('此操作修改产品状态, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        upDownRoom(setData).then(() => {
          this.fetchData()
          this.$notify({
            type: 'success',
            message: '操作成功!'
          })
        })
      })
    },
    handlePush(row) { // 推送按钮
      this.getData()
      this.temp = {
        roomTypeId: row.id,
      }
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          roomDeliveryUpdate(this.temp, 'post').then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            this.fetchData()
          })
        }
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleDelete(row) { // 删除按钮
      var setData = {}
      setData.id = row.id
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        roomDelete(setData).then(() => {
          this.fetchData()
          this.$notify({
            type: 'success',
            message: '删除成功!'
          })
        })
      })
    },
    handleBatchDelete() {
      var str = ''
      var that = this
      const length = this.multipleSelection.length
      this.multipleSelection.forEach((item, index) => {
        if (index == length - 1) {
          str += item.id
        } else {
          str += item.id + ','
        }
      })
      const setData = {}
      setData.ids = str
      if (!str) {
        this.$message.error('请选择您要删除的产品~')
        return
      }
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        roomBatchDelete(setData).then(res => {
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
      this.date = []
      this.listQuery = {
        page: 1,
        pageSize: 10
      }
      this.fetchData()
    }
  }
}
</script>
