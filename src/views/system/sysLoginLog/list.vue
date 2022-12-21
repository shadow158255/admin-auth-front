<template>
  <div class="app-container">
    <!--查询表单-->
    <div class="search-div">
      <el-form label-width="70px" size="small">
        <el-row>
          <el-col :span="8">
            <el-form-item label="登录用户">
              <el-input
                style="width: 100%"
                v-model="searchObj.username"
                placeholder="登录用户"
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
      :data="loginLogList"
      stripe
      border
      style="width: 100%; margin-top: 10px"
    >
      <el-table-column label="序号" width="70" align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="username" label="登录账号" />
      <el-table-column prop="ipaddr" label="登录IP地址" />
      <el-table-column prop="status" label="状态" />
      <el-table-column prop="msg" label="提示信息" />
      <el-table-column prop="createTime" label="创建时间" width="160" />
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
  </div>
</template>

  <script>
import api from "@/api/system/sysLoginLog";
export default {
  data() {
    return {
      listLoading: false,
      loginLogList: [],
      createTimes: [],
      searchObj: {},
      status: 1,
      page: 1,
      limit: 5,
      total: 0,
    };
  },

  created() {
    this.fetchData();
  },
  methods: {
    //查询列表|条件查询
    fetchData(page = 1) {
      this.page = page;
      console.log("发送列表请求qian的obj：", this.searchObj);
      if (this.createTimes && this.createTimes.length == 2) {
        this.searchObj.createTimeBegin = this.createTimes[0];
        this.searchObj.createTimeEnd = this.createTimes[1];
      }
      console.log("发送列表请求时的obj：", this.searchObj);
      //调用api
      api
        .getLoginLogList(this.page, this.limit, this.searchObj)
        .then((response) => {
          this.listLoading = false;
          this.loginLogList = response.data.records;
          this.total = response.data.total;
        });
    },
    //重置搜索框
    resetData() {
      this.createTimes = [];
      this.searchObj = {};
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
