<template>
  <div class="app-container">
    <div class="filter-container clearfix">
      <div>
        <label class="rm">门店名</label>
        <el-input
          v-model.trim="listQuery.name"
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
      <div class="fr">
        <el-button class="filter-item" icon="el-icon-plus" type="primary" @click="handleCreate">
          新增
        </el-button>
      </div>
    </div>

    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column type="index" width="50" label="编号" align="center" />
      <el-table-column label="门店名" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="店面图">
        <template slot-scope="scope">
          <el-image
            style="width: 60px; height: 60px"
            :src="baseURL + scope.row.mainImage"
            :preview-src-list="srcList"
            @click="clickDqw(baseURL + scope.row.mainImage)"
          />
        </template>
      </el-table-column>

      <el-table-column label="店长名" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.masterName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="店长手机" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.masterTel }}</span>
        </template>
      </el-table-column>

      <el-table-column label="门店电话" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.landline }}</span>
        </template>
      </el-table-column>

      <el-table-column label="门店累计收入" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.incomeNumTotal }}</span>
        </template>
      </el-table-column>

      <el-table-column label="门店可提现营收" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.withdrawableIncome }}</span>
        </template>
      </el-table-column>

      <el-table-column label="门店类型" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.category == 1">发布</span>
          <span v-else-if="scope.row.category == 0">下架</span>
        </template>
      </el-table-column>

      <el-table-column label="门店状态" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.state == 1">在营</span>
          <span v-else-if="scope.row.state == 0">下架</span>
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
          <el-button size="small" type="danger" @click="handleDelete(row)">
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
  </div>
</template>

<script>
import {
  storeList,
  storeDetails
} from '@/api/store'

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
      srcList: [],
      listLoading: false,
      total: 0,
      date: [],
      category: [],
      listQuery: {
        page: 1,
        pageSize: 10,
        category: ''
      },
      categoryType: [{
        value: 1,
        label: '加盟店'
      }, {
        value: 0,
        label: '自营'
      }],
    }
  },
  created() {
    // 其他页面返回时，保存搜索状态
    var storeListQuery = JSON.parse(sessionStorage.getItem('storeListQuery'))
    if (storeListQuery) {
      this.listQuery = storeListQuery
      if (this.listQuery.startTime && this.listQuery.endTime) {
        var date2 = []
        date2[0] = this.listQuery.startTime
        date2[1] = this.listQuery.endTime
        this.date = date2
      }
      sessionStorage.setItem('storeListQuery', null) // 存入Session Storage缓存
    }
    this.fetchData()
    // this.categoryData()
  },
  methods: {
    fetchData() { // 查
      this.listLoading = true
      storeList(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.listLoading = false
      })
    },
    // categoryData() { // 查
    //   var setData = {}
    //   setData.dictionariesType = 'storeType'
    //   dictionariesAisList(setData).then(res => {
    //     this.category = res.data.storeType.childDictionaries
    //   })
    // },
    clickDqw(url) {
      const imgArr = []
      imgArr.push(url)
      this.srcList = imgArr
    },
    handleCreate() { // 添加按钮
      sessionStorage.setItem('storeListQuery', JSON.stringify(this.listQuery)) // 存入Session Storage缓存
      this.$router.push({
        path: '/store/storeUpdate'
      })
    },
    handleUpdate(row) { // 修改按钮
      sessionStorage.setItem('storeListQuery', JSON.stringify(this.listQuery)) // 存入Session Storage缓存
      this.$router.push({
        path: '/store/storeUpdate',
        query: {
          id: row.id
        }
      })
    },
    handleDelete(row) { // 删除按钮
      this.$confirm('确认删除该数据吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const setData = {}
        setData.id = row.id
        storeDetails(setData, 'delete').then(() => {
          this.fetchData()
          this.$notify({
            type: 'success',
            message: '删除成功!'
          })
        })
      })
    },
    addDate() {
      console.log(this.date)
      if (this.date) {
        this.listQuery.startTime = this.date[0]
        this.listQuery.endTime = this.date[1]
      } else {
        this.listQuery.startTime = ''
        this.listQuery.endTime = ''
      }
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

<style>
</style>
