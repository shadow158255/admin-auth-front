<template>
  <div class="app-container">
    <!--查询表单-->
    <div class="search-div">
      <el-form label-width="70px" size="small">
        <el-row>
          <el-col :span="8">
            <el-form-item label="岗位名称">
              <el-input
                style="width: 100%"
                v-model="searchObj.name"
                placeholder="岗位名称"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="岗位编码">
              <el-input
                style="width: 100%"
                v-model="searchObj.postCode"
                placeholder="岗位编码"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="状态">
              <el-input
                style="width: 100%"
                v-model="searchObj.status"
                placeholder="状态"
              ></el-input>
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

    <!-- 添加数据 -->
    <div class="tools-div">
      <el-button type="success" icon="el-icon-plus" size="mini" @click="addData"
        >添 加</el-button
      >
    </div>

    <!-- 表格 -->
    <el-table
      v-loading="listLoading"
      :data="postList"
      stripe
      border
      style="width: 100%; margin-top: 10px"
    >
      <el-table-column label="序号" width="70" align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="name" label="岗位名称" />
      <el-table-column prop="postCode" label="岗位编码" />
      <el-table-column label="状态" width="80">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status === 1"
            @change="switchStatus(scope.row)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="160" />
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="edit(scope.row.id)"
            title="修改"
          />
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="removeDataById(scope.row.id)"
            title="删除"
          />
        </template>
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
    <el-dialog title="添加/修改" :visible.sync="dialogVisible" width="40%">
      <el-form
        ref="dataForm"
        :model="sysPost"
        label-width="150px"
        size="small"
        style="padding-right: 40px"
        :rules="rules"
      >
        <el-form-item label="岗位名称" prop="name">
          <el-input v-model="sysPost.name" />
        </el-form-item>
        <el-form-item label="岗位编码" prop="postCode">
          <el-input v-model="sysPost.postCode" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          @click="dialogVisible = false"
          size="small"
          icon="el-icon-refresh-right"
          >取 消</el-button
        >
        <el-button
          type="primary"
          icon="el-icon-check"
          @click="saveOrUpdate()"
          size="small"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from "@/api/system/sysPost";
export default {
  data() {
    return {
      listLoading: false,
      postList: [],
      searchObj: {},
      status: 1,
      page: 1,
      limit: 5,
      total: 0,
      dialogVisible: false, //弹出框
      sysPost: {}, //封装添加表单的数据

      rules: {
        name: [{ required: true, message: "请输入岗位名称", trigger: "blur" }],
        postCode: [
          { required: true, message: "请输入岗位编码", trigger: "blur" },
        ],
      },
    };
  },

  created() {
    this.fetchData();
  },
  methods: {
    //改变岗位状态
    switchStatus(row) {
      row.status = row.status === 1 ? 0 : 1;
      api.changeStatus(row.id, row.status).then((res) => {
        //更改成功消息提示
        this.$message({
          type: "success",
          message: "更改状态成功",
        });
        //重新刷新页面
        this.fetchData();
      });
    },
    //删除数据
    removeDataById(id) {
      this.$confirm("您确定要删除这条数据吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        api.deletePost(id).then((res) => {
          //提示成功
          this.$message({
            type: "success",
            message: "删除完成",
          });
          //刷新列表
          this.fetchData();
        });
      });
    },
    //点击添加数据
    addData() {
      //弹出表单
      this.dialogVisible = true;
      //初始化表单对象
      this.sysPost = {};
    },
    //执行添加
    addPost() {
      api.addPost(this.sysPost).then((res) => {
        console.log("@@@@@", this.sysPost);
        //提示成功
        this.$message({
          type: "success",
          message: "添加成功！",
        });
        //添加成功后关闭表单
        (this.dialogVisible = false),
          //刷新页面
          this.fetchData();
      });
    },
    //点击修改
    edit(id) {
      //先弹出框
      this.dialogVisible = true;
      //显示当前数据
      api.selectById(id).then((res) => {
        this.sysPost = res.data;
      });
    },
    //执行修改
    update() {
      api.updatePost(this.sysPost).then((response) => {
        //提示成功
        this.$message({
          type: "success",
          message: "修改成功！",
        });
        //添加成功后关闭表单
        (this.dialogVisible = false),
          //刷新页面
          this.fetchData();
      });
    },
    //点击确定|先判断是添加还是修改
    saveOrUpdate() {
      if (!this.sysPost.id) {
        this.addPost();
      } else {
        this.update();
      }
    },
    //查询列表|条件查询
    fetchData(page = 1) {
      this.page = page;
      //调用api
      api
        .queryPostList(this.searchObj, this.page, this.limit)
        .then((response) => {
          this.listLoading = false;
          this.postList = response.data.records;
          this.total = response.data.total;
        });
    },
    //重置搜索框
    resetData() {
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
