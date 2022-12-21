<template>
  <div class="app-container">
    <!-- 列表标签 -->
    <el-table
      :data="sysDeptList"
      style="width: 100%; margin-bottom: 20px; margin-top: 10px"
      row-key="id"
      border
      :default-expand-all="false"
      :tree-props="{ children: 'children' }"
    >
      <el-table-column prop="name" label="名称" width="160" />
      <el-table-column prop="leader" label="部门负责人" width="160" />

      <el-table-column prop="phone" label="部门电话" width="160" />
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
      <el-table-column label="操作" width="180" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button
            type="success"
            v-if="scope.row.type !== 2"
            icon="el-icon-plus"
            size="mini"
            @click="add(scope.row)"
            title="添加下级节点"
          />
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="edit(scope.row)"
            title="修改"
          />
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="removeDataById(scope.row.id)"
            title="删除"
            :disabled="scope.row.children.length > 0"
          />
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加部门的表单 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="40%">
      <el-form
        :rules="rules"
        ref="ruleForm"
        :model="sysDept"
        label-width="150px"
        size="small"
        style="padding-right: 40px"
      >
        <el-form-item label="上级部门" v-if="sysDept.id === ''">
          <el-input v-model="sysDept.parentName" :disabled="true" />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="sysDept.name" />
        </el-form-item>
        <el-form-item label="部门负责人" prop="leader">
          <el-input v-model="sysDept.leader" />
        </el-form-item>
        <el-form-item label="部门电话" prop="phone">
          <el-input v-model="sysDept.phone" />
        </el-form-item>
        <el-form-item label="状态" prop="type">
          <el-radio-group v-model="sysDept.status">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="0">停用</el-radio>
          </el-radio-group>
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
import api from "@/api/system/sysDept";
const defaultForm = {
  id: "",
  parentId: "",
  name: "",
  leader: "",
  phone: "",
  sortValue: 1,
  status: 1,
  parentName: "",
};
export default {
  data() {
    return {
      sysDeptList: [],
      sysDept: defaultForm,
      dialogVisible: false,

      dialogTitle: "",
      status: 1,
      saveBtnDisabled: false,
      ruleForm: {
        name: "",
        path: "",
        icon: "",
      },
      rules: {
        name: [
          { required: true, message: "请输入菜单名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        path: [
          { required: true, message: "请输入路由地址", trigger: "blur" },
          {
            min: 3,
            max: 40,
            message: "长度在 3 到 40 个字符",
            trigger: "blur",
          },
        ],
        icon: { required: true, message: "请选择一个图标", trigger: "change" },
      },
    };
  },
  created() {
    this.selectList();
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
        this.selectList();
      });
    },

    //删除部门根据id
    removeDataById(id) {
      //先判断当前id下是否还有子级，不用判断了，已经根据chileren属性来判断删除按钮是否可点击了
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // promise
          // 点击确定，远程调用ajax
          return api.deleteDeptByid(id);
        })
        .then((response) => {
          this.selectList();
          this.$message({
            type: "success",
            message: response.message,
          });
        })
        .catch(() => {}); // 添加错误捕获
    },
    //查询部门列表
    selectList() {
      console.log("加载列表。。。");
      api.deptTreeList().then((res) => {
        this.sysDeptList = res.data;
      });
    },
    //点击添加按钮
    add(row) {
      console.log("添加的参数row：", row);
      //直接给下级添加，因为跟目录只有一个公司，下面是各自部门
      //控制按钮是否可以点击
      this.typeDisabled = false;
      this.dialogTitle = "添加下级节点";
      //打开表单
      this.dialogVisible = true;

      //给表单赋初始值
      console.log("defaultForm是：", defaultForm);
      this.sysDept = Object.assign({}, defaultForm);
      console.log("通过Object.assign赋值defaultForm输出sysDept", this.sysDept);
      //当前添加的部门parentId是当前行数据的id
      this.sysDept.parentId = row.id;
      //父部门名就是当前行数据的名
      this.sysDept.parentName = row.name;
      console.log("当前的sysDept：", this.sysDept);
    },
    //点击修改按钮
    edit(row) {
      debugger;
      this.dialogTitle = "修改菜单";
      this.dialogVisible = true;
      //拷贝Object.assign({}, row)
      this.sysDept = Object.assign({}, row);
      this.typeDisabled = true;
    },
    //执行添加方法
    handleAdd() {
      console.log("进入添加方法，当前sysDept值：", this.sysDept);
      api.addDept(this.sysDept).then((res) => {
        //提示成功
        this.$message({
          type: "success",
          message: "添加成功",
        });
        //关闭表单
        this.dialogVisible = false;
        //刷新页面
        this.selectList();
      });
    },
    //执行修改方法
    handleUpdate() {
      console.log("进入修改方法，当前sysDept值：", this.sysDept);
      api.updateDept(this.sysDept).then((res) => {
        //提示成功
        this.$message({
          type: "success",
          message: "修改成功",
        });
        //关闭表单
        this.dialogVisible = false;
        //刷新页面
        this.selectList();
      });
    },

    //点击确定按钮
    saveOrUpdate() {
      //先判断是添加还是修改
      if (!this.sysDept.id) {
        //没有id执行添加
        this.handleAdd();
      } else {
        //有id执行修改
        this.handleUpdate();
      }
    },
  },
};
</script>

<style>
</style>
