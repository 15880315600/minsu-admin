<template>
  <div class="app-container">

    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column type="index" width="50" label="编号" align="center" />
      <el-table-column label="房间描述" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.roomDesc }}</span>
        </template>
      </el-table-column>

      <el-table-column label="团购价格" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.groupPrice }}</span>
        </template>
      </el-table-column>

      <el-table-column label="开始预约时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.reserveTimeStart }}</span>
        </template>
      </el-table-column>

      <el-table-column label="预约结束时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.reserveTimeEnd }}</span>
        </template>
      </el-table-column>

      <el-table-column label="开始预定日期" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.groupStartDate }}</span>
        </template>
      </el-table-column>

      <el-table-column label="预定结束日期" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.groupEndDate }}</span>
        </template>
      </el-table-column>

      <el-table-column label="房间数" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.roomNum }}</span>
        </template>
      </el-table-column>

      <el-table-column label="可居住人数" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.canResideNum }}</span>
        </template>
      </el-table-column>

      <el-table-column label="剩余可预约房间id" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.restRoomId }}</span>
        </template>
      </el-table-column>

      <el-table-column label="状态" align="center" width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.groupState == 1">上架</span>
          <span v-else-if="scope.row.groupState == 0">下架</span>
        </template>
      </el-table-column>

      <el-table-column label="备注" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>


      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize"
      @pagination="fetchData" />
  </div>
</template>

<script>
  import {
    groupRoomInfoList
  } from '@/api/order'

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
        listQuery: {
          page: 1,
          pageSize: 10
        },
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() { // 查
        this.listLoading = true
        groupRoomInfoList(this.listQuery).then(response => {
          this.list = response.data.records
          this.total = response.data.total
          this.listLoading = false
        })
      }
    }
  }
</script>

<style>
</style>
