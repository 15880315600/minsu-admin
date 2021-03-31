<template>
  <div class="app-container">
    <div class="filter-container clearfix">
      <!--      <div>
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
      </div> -->
      <div class="fr">
        <el-button class="filter-item" icon="el-icon-plus" type="primary" @click="handleCreate">
          新增
        </el-button>
      </div>
    </div>

    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column type="index" width="50" label="编号" align="center" />
      <el-table-column align="center" label="订单号">
        <template slot-scope="scope">
          {{ scope.row.orderNo }}
        </template>
      </el-table-column>

      <el-table-column label="房间信息" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.orderBody }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="房间图片" width="80">
        <template slot-scope="scope">
          <el-image style="width: 50px; height: 50px" :src="baseURL + scope.row.orderImage" />
        </template>
      </el-table-column>

      <el-table-column label="预定人" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.reserveName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="预定人手机号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.reservePhone }}</span>
        </template>
      </el-table-column>


      <el-table-column label="预定时间" align="center" width="110">
        <template slot-scope="scope">
          <span>{{ scope.row.orderReserveTimeStart | dateTime }} - {{ scope.row.orderReserveTimeEnd | dateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="预计到店时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.estimateArriveTime }}</span>
        </template>
      </el-table-column>

      <el-table-column label="备注" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.orderRemark }}</span>
        </template>
      </el-table-column>

      <el-table-column label="订单金额" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.orderPrice }}</span>
        </template>
      </el-table-column>

      <el-table-column label="实付金额" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.orderPricePay }}</span>
        </template>
      </el-table-column>

      <el-table-column label="订单状态" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.orderState == 0">未入住</span>
          <span v-if="scope.row.orderState == 1">已入住</span>
        </template>
      </el-table-column>

      <el-table-column label="支付时间" align="center" width="110">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.orderPayTime }}</span>
        </template>
      </el-table-column>

      <el-table-column label="创建时间" align="center" width="110">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.orderCreateTime }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button size="mini" @click="handleUpdateRoom(row)">
            修改房间
          </el-button>
          <el-button size="small" type="danger" @click="handleWriteOff(row)">
            核销
          </el-button>
        </template>
      </el-table-column>

    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize"
      @pagination="fetchData" />

    <el-dialog title="更换房间" width="30%" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-width="88px" style="width:88%; margin:0 18px;">
        <el-form-item label="房间" prop="roomId">
          <el-select v-model.trim="temp.roomId" class="filter-item" style="width: 100%;" placeholder="请选择房间">
            <el-option v-for="item in roomList" :key="item.id" :label="item.roomNo" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {
    orderTableList,
    roomReserveRecord,
    roomReserveRecordWriteOff
  } from '@/api/order'
  import {
    roomList
  } from '@/api/room'
  import Pagination from '@/components/Pagination'

  export default {
    components: {
      Pagination
    },
    data() {
      return {
        list: null,
        listLoading: false,
        total: 0,
        listQuery: {
          page: 1,
          pageSize: 10
        },
        temp: {},
        roomList: [],
        dialogFormVisible: false,
        rules: {
          roomId: [{
            required: true,
            message: '请选择房间',
            trigger: 'blur'
          }]
        },
      }
    },
    created() {
      this.fetchData()
      this.getData()
    },
    filters: {
      //处理函数
      dateTime(value) {
        return value.split(' ')[0]
      }
    },
    methods: {
      fetchData() { // 查
        this.listLoading = true
        orderTableList(this.listQuery).then(res => {
          this.list = res.data.records
          this.total = res.data.total
          this.listLoading = false
        })
      },
      getData() {
        let listQuery = {
          page: 1,
          pageSize: 9999
        }
        roomList(listQuery).then(res => {
          this.roomList = res.data.records
        })
      },
      handleCreate() {
        this.$router.push({
          path:'/order/orderAdd'
        })
      },
      handleUpdateRoom(row) {
        this.temp = row
        this.dialogFormVisible = true
      },
      updateData() { // 完成修改按钮
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            roomReserveRecord(this.temp).then(() => {
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
      handleWriteOff(row) {
        roomReserveRecordWriteOff(row).then(() => {
          this.fetchData()
          this.$notify({
            title: '成功',
            message: '核销成功',
            type: 'success',
            duration: 2000
          })
        })
      },
      // handleFilter() {
      //   this.listQuery.page = 1
      //   this.fetchData()
      // },
      // handleReset() {
      //   this.listQuery = {
      //     page: 1,
      //     pageSize: 10
      //   }
      //   this.fetchData()
      // }
    }
  }
</script>
