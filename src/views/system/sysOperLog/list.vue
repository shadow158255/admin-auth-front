<template>
  <div class="app-container">
    <!--查询表单-->
    <div class="search-div">
      <el-form label-width="70px" size="small">
        <el-row>
          <el-col :span="8">
            <el-form-item label="操作模块">
              <el-input
                style="width: 100%"
                v-model="searchObj.title"
                placeholder="操作模块"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="操作人">
              <el-input
                style="width: 100%"
                v-model="searchObj.operName"
                placeholder="操作人"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="操作时间">
              <el-date-picker
                v-model="createTimes"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                style="margin-right: 10px; width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="display: flex">
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="fetchData()"
            >搜索</el-button
          >
          <el-button icon="el-icon-refresh" size="mini" @click="resetData"
            >重置</el-button
          >
        </el-row>
      </el-form>
    </div>

    <!-- 表格 -->
    <el-table
      v-loading="listLoading"
      :data="operLogList"
      stripe
      border
      style="width: 100%; margin-top: 10px"
    >
      <el-table-column label="序号" width="70" align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="title" label="系统模块" />
      <el-table-column prop="operatorType" label="操作类型" />
      <el-table-column prop="requestMethod" label="请求方式" />
      <el-table-column prop="operName" label="操作人员" />
      <el-table-column prop="operIp" label="操作IP" />
      <el-table-column prop="operUrl" label="请求方法" />

      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small"
            >查看详情</el-button
          >
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="160" />
    </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <el-pagination
      :total="total"
      :current-page="page"
      :page-size="limit"
      style="padding: 30px 0; text-align: center"
      layout="total,sizes, prev, pager, next, jumper"
      :page-sizes="[5, 10, 20, 40]"
      @size-change="handleSizeChange"
      @current-change="fetchData"
    />

     <!-- 弹框 -->
     <el-dialog title="查看详情" :visible.sync="dialogVisible" width="40%" >
      <el-form
        ref="dataForm"
        :model="sysOper"
        label-width="150px"
        size="small"
        style="padding-right: 40px"
      >
      <el-row>
        <el-col :span="16">
          <el-form-item label="岗位名称:" prop="title">
          <d>{{sysOper.title}}</d>
        </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="16">
          <el-form-item label="操作类型:" prop="operatorType">
          <d>{{sysOper.operatorType}}</d>
        </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="16">
          <el-form-item label="岗位名称:" prop="title">
          <d>{{sysOper.title}}</d>
        </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="16">
          <el-form-item label="请求方式:" prop="requestMethod">
          <d>{{sysOper.requestMethod}}</d>
        </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="16">
          <el-form-item label="操作人员:" prop="operName">
          <d>{{sysOper.operName}}</d>
        </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="16">
          <el-form-item label="返回结果:" prop="jsonResult">
          <d>{{sysOper.jsonResult}}</d>
        </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="16">
          <el-form-item label="操作方法:" prop="method">
          <d>{{sysOper.method}}</d>
        </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="16">
          <el-form-item label="操作IP:" prop="operIp">
          <d>{{sysOper.operIp}}</d>
        </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="16">
          <el-form-item label="请求方法:" prop="operUrl">
          <d>{{sysOper.operUrl}}</d>
        </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="16">
          <el-form-item label="创建时间:" prop="createTime">
          <d>{{sysOper.createTime}}</d>
        </el-form-item>
        </el-col>
      </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          @click="dialogVisible = false"
          size="small"
          icon="el-icon-refresh-right"
          >取 消</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from "@/api/system/sysOperLog";
export default {
  data() {
    return {
      dialogVisible: false,
      listLoading: false,
      operLogList: [],
      searchObj: {},
      createTimes: [],
      status: 1,
      page: 1,
      limit: 5,
      total: 0,
      sysOper: {}, //封装添加表单的数据
    };
  },

  created() {
    this.fetchData();
  },
  methods: {
    //点击详情展示
    handleClick(row) {
      console.log(row);
      console.log(this);
      console.log(this.$nextTick);
      this.dialogStatus = "查看详情";
      this.dialogVisible = true;
      this.sysOper = row;
      console.log(this.sysOper);
    },
    //改变status显示
    statusStitch(row) {
      console.log("row###", row);
      if (row.status === 1) {
        return "正确";
      } else {
        return "失败";
      }
    },
    //查询列表|条件查询
    fetchData(page = 1) {
      this.page = page;
      if (this.createTimes && this.createTimes.length == 2) {
        this.searchObj.createTimeBegin = this.createTimes[0];
        this.searchObj.createTimeEnd = this.createTimes[1];
      }
      //调用api
      api
        .getOperList(this.page, this.limit, this.searchObj)
        .then((response) => {
          this.listLoading = false;
          this.operLogList = response.data.records;
          this.total = response.data.total;
        });
    },
    //重置搜索框
    resetData() {
      (this.createTimes = []), (this.searchObj = {});
      this.fetchData();
    },
    //改变页面数据多少
    handleSizeChange(limitChange) {
      this.limit = limitChange;
      this.fetchData();
    },
  },
};
</script>

  <style>
</style>
