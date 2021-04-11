<template>
  <div class="app-container">
    <div class="filter-container clearfix">
      <div>
        <label class="rm">门店</label>
        <el-select v-model.trim="listQuery.storeId" style="width: 280px" class="filter-item" @change="handleFilter">
          <el-option v-for="item in storeList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </div>
      <div>
        <label class="lm20 rm">房间号</label>
        <el-input v-model.trim="listQuery.roomNo" placeholder="请输入" style="width: 200px;" class="filter-item"
          @keyup.enter.native="handleFilter" />
      </div>

      <div>
        <label class="lm20 rm">房间类型</label>
        <el-select v-model.trim="listQuery.roomType" style="width: 280px" class="filter-item">
          <el-option v-for="item in roomTypeList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </div>

      <div>
        <label class="lm20 rm">房间状态</label>
        <el-select v-model.trim="listQuery.line" style="width: 180px" class="filter-item">
          <el-option key="0" label="上架" value="0" />
          <el-option key="1" label="下架不可操作" value="1" />
          <el-option key="-1" label="已下架" value="-1" />
        </el-select>
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

    </div>

    <div class="filter-container clearfix">
      <div>
        <el-button class="filter-item" icon="el-icon-delete" type="primary" @click="handleBatchDelete">
          批量删除
        </el-button>
      </div>


      <div class="fr">
        <el-button class="filter-item" style="margin-left: 10px;" icon="el-icon-plus" type="primary"
          @click="handleCreate">
          新增
        </el-button>
      </div>

      <div class="fr">
        <el-button class="filter-item" style="margin-left: 10px;" icon="el-icon-plus" type="primary"
          @click="handleBulk">
          添加团购
        </el-button>
      </div>

    </div>

    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row
      @selection-change="handleSelectionChange">

      <el-table-column type="selection" width="40" align="center" />
      <el-table-column type="index" width="50" label="序号" align="center" />

      <el-table-column align="center" label="房间号" width="160">
        <template slot-scope="scope">
          {{ scope.row.roomNo }}
        </template>
      </el-table-column>

      <el-table-column label="可居住人数" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.canResideNum }}</span>
        </template>
      </el-table-column>

      <el-table-column label="房间类型" align="center">
        <template slot-scope="scope">
          <span v-for="item in roomTypeList" v-if="item.id == scope.row.roomType">{{ item.name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="图片" align="center" width="80">
        <template slot-scope="scope">
          <img :src="baseURL+scope.row.mainImage" alt="" width="50" height="50">
        </template>
      </el-table-column>

      <el-table-column label="是否特价房" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.isSpecialOffer">是</span>
          <span v-if="!scope.row.isSpecialOffer">否</span>
        </template>
      </el-table-column>

      <el-table-column label="产品现价" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.roomPriceNow }}</span>
        </template>
      </el-table-column>

      <el-table-column label="是否有窗" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.haswindows">有窗</span>
          <span v-if="!scope.row.haswindows">无窗</span>
        </template>
      </el-table-column>

      <el-table-column label="面积数" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.roomArea }}</span>
        </template>
      </el-table-column>

      <el-table-column label="房间状态" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.roomState == 0">上架可租用</span>
          <span v-else-if="scope.row.roomState == 1">下架不可操作</span>
          <span v-else-if="scope.row.roomState == -1">已下架</span>
          <span v-else>-</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="120" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-dropdown>
            <span style=" cursor: pointer;color: #409EFF;">
              <i class="el-icon-edit el-icon--left" />操作<i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-if="row.roomStatus == 0" @click.native="handleStatusUpdate(row,1)">上架
              </el-dropdown-item>
              <el-dropdown-item v-if="row.roomStatus == 1" @click.native="handleStatusUpdate(row,0)">下架
              </el-dropdown-item>
              <el-dropdown-item @click.native="handleUpdate(row)">修改</el-dropdown-item>
              <el-dropdown-item @click.native="handleDelete(row)">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize"
      @pagination="fetchData" />

    <el-dialog title="团购订单" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-width="88px" style="width: 400px; margin: 0 auto;">
        <el-form-item label="房间描述" prop="roomDesc">
          <el-input v-model.trim="temp.roomDesc" placeholder="请输入房间描述" />
        </el-form-item>
        <el-form-item label="团购价格" prop="groupPrice">
          <el-input v-model.trim="temp.groupPrice" placeholder="请输入团购价格" />
        </el-form-item>
        <el-form-item label="预约日期" prop="reserveTimeStart">
          <el-date-picker v-model.trim="date" type="daterange" format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="['00:00:00', '23:59:59']" :picker-options="pickerOptions" style="width: 100%;"
            range-separator="至" start-placeholder="预约日期" end-placeholder="预约日期" align="right" @change="addDate" />
        </el-form-item>

        <el-form-item label="预定日期" prop="groupStartDate">
          <el-date-picker v-model.trim="date1" type="daterange" format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="['00:00:00', '23:59:59']" :picker-options="pickerOptions" style="width: 100%;"
            range-separator="至" start-placeholder="预定日期" end-placeholder="预定日期" align="right" @change="addDate1" />
        </el-form-item>

        <el-form-item label="居住人数" prop="canResideNum">
          <el-input v-model.trim="temp.canResideNum" placeholder="请输入居住人数" />
        </el-form-item>

        <el-form-item label="备注">
          <el-input v-model.trim="temp.remark" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="createData()">
          确认
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {
    roomList,
    roomDelete,
    upDownroom
  } from '@/api/room'
  import {
    storeList
  } from '@/api/store'
  import {
    groupRoomInfoAdd
  } from '@/api/order'
  import {
    roomTypeList
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
        date: [],
        date1: [],
        multipleSelection: [],
        dictionariesAis: [],
        listQuery: {
          page: 1,
          pageSize: 10,
          salesFlag: '',
          priceFlag: '',
          line: '',
          storeId: ''
        },
        roomTypeList: [],
        storeList: [],
        dialogFormVisible: false,
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7; //如果没有后面的-8.64e7就是不可以选择今天的
          }
        },
      }
    },
    created() {
      this.categoryData()
      // 其他页面返回时，保存搜索状态
      var roomListQuery = JSON.parse(sessionStorage.getItem('roomListQuery'))
      if (roomListQuery) {
        this.listQuery = roomListQuery
        sessionStorage.setItem('roomListQuery', null) // 存入Session Storage缓存
      }
      this.fetchData()
    },

    methods: {
      fetchData() { // 查
        this.listLoading = true
        roomList(this.listQuery).then(res => {
          this.list = res.data.records
          this.total = res.data.total

          this.listLoading = false
        })
      },
      categoryData() {
        var setData = {}
        setData.page = 1
        setData.pageSize = 9999
        roomTypeList(setData).then(res => {
          this.roomTypeList = res.data.records
        })
        var setData = {}
        setData.page = 1
        setData.pageSize = 9999
        storeList(setData).then(res => {
          this.storeList = res.data.records
        })
      },
      handleCreate() { // 添加按钮
        sessionStorage.setItem('roomData', null) // 存入Session Storage缓存
        sessionStorage.setItem('roomListQuery', JSON.stringify(this.listQuery)) // 存入Session Storage缓存
        this.$router.push({
          path: this.redirect || '/room/roomUpdate'
        })
      },
      handleUpdate(row) { // 修改按钮
        sessionStorage.setItem('roomListQuery', JSON.stringify(this.listQuery)) // 存入Session Storage缓存
        // sessionStorage.setItem('roomData', JSON.stringify(row)) // 存入Session Storage缓存
        this.$router.push({
          path: '/room/roomUpdate',
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
        var str = this.multipleSelection.map(item => {
          return item.id
        })

        if (str == null || str.length <= 0) {
          this.$message.error('请选择您要删除的产品~')
          return
        }
        const setData = {}
        setData.ids = str.toString()
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
      handleBulk() {
        if (!this.listQuery.storeId) {
          this.$message.error('请选择门店~，确保团购订单全部属于同一个门店')
          return
        }
        var str = this.multipleSelection.map(item => {
          return item.id
        })

        if (str == null || str.length <= 0) {
          this.$message.error('请选择您添加的房间~')
          return
        }
        this.temp.roomId = str.toString()
        this.dialogFormVisible = true
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            groupRoomInfoAdd(this.temp).then(() => {
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
      addDate() {
        console.log(this.date)
        if (this.date) {
          this.temp.reserveTimeStart = this.date[0]
          this.temp.reserveTimeEnd = this.date[1]
        } else {
          this.temp.reserveTimeStart = ''
          this.temp.reserveTimeEnd = ''
        }
      },
      addDate1() {
        console.log(this.date)
        if (this.date) {
          this.temp.groupStartDate = this.date1[0]
          this.temp.groupEndDate = this.date1[1]
        } else {
          this.temp.groupStartDate = ''
          this.temp.groupEndDate = ''
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
