<template>
  <div class="app-container">
    <div class="filter-container clearfix">
      <div>
        <label class="rm">公告标题</label>
        <el-input
          v-model.trim="listQuery.name"
          placeholder="请输入"
          style="width: 200px;"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
      </div>
      <div>
        <label class="lm20 rm">修改/添加时间</label>
        <el-date-picker
          v-model.trim="date"
          type="daterange"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd HH:mm:ss"
          :default-time="['00:00:00', '23:59:59']"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
          @change="addDate"
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
      <el-table-column label="公告标题" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      
      <el-table-column label="公告内容" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.desc }}</span>
        </template>
      </el-table-column>
      
      <el-table-column label="展示状态" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.state == 1">发布</span>
          <span v-else-if="scope.row.state == 0">下架</span>
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
  noticeList,
  noticeDetails
} from '@/api/notice'  
  
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
      }
    }
  },
  created() {
    // 其他页面返回时，保存搜索状态
    var noticeListQuery = JSON.parse(sessionStorage.getItem('noticeListQuery'))
    if (noticeListQuery) {
      this.listQuery = noticeListQuery
      if (this.listQuery.startTime && this.listQuery.endTime) {
        var date2 = []
        date2[0] = this.listQuery.startTime
        date2[1] = this.listQuery.endTime
        this.date = date2
      }
      sessionStorage.setItem('noticeListQuery', null) // 存入Session Storage缓存
    }
    this.fetchData()
    // this.categoryData()
  },
  methods: {
    fetchData() { // 查
      this.listLoading = true
      noticeList(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.listLoading = false
      })
    },
    // categoryData() { // 查
    //   var setData = {}
    //   setData.dictionariesType = 'noticeType'
    //   dictionariesAisList(setData).then(res => {
    //     this.category = res.data.noticeType.childDictionaries
    //   })
    // },
    clickDqw(url) {
      const imgArr = []
      imgArr.push(url)
      this.srcList = imgArr
    },
    handleCreate() { // 添加按钮
      sessionStorage.setItem('noticeListQuery', JSON.stringify(this.listQuery)) // 存入Session Storage缓存
      this.$router.push({
        path: '/notice/noticeUpdate'
      })
    },
    handleUpdate(row) { // 修改按钮
      sessionStorage.setItem('noticeListQuery', JSON.stringify(this.listQuery)) // 存入Session Storage缓存
      this.$router.push({
        path: '/notice/noticeUpdate',
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
        noticeDetails(setData, 'delete').then(() => {
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
