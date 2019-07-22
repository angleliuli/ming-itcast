<template>
  <div class="users">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索框 -->
    <div style="margin: 10px 0">
      <el-input
        placeholder="请输入内容"
        v-model="userObj.query"
        @keyup.enter.native="init"
        class="input-with-select"
        style="width:300px;margin-right:10px"
      >
        <el-button slot="append" icon="el-icon-search" @click="init"></el-button>
      </el-input>
      <el-button type="success" plain @click="adddialogFormVisible = true">添加用户</el-button>
    </div>

    <!-- 数据展示表格 -->
    <el-table :data="userList" style="width: 100%" border>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="状态" width="80">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949" @change='changeStatu(scope.row.id,scope.row.mg_state)'></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="260">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
            <el-button type="primary" icon="el-icon-edit" @click="editSubmit(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="分配角色" placement="top-start">
            <el-button type="primary" icon="el-icon-share"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
            <el-button type="primary" icon="el-icon-delete" @click="delUser(scope.row.id)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="this.userObj.pagenum"
      :page-sizes="[1, 2, 3, 4]"
      :page-size="this.userObj.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="adddialogFormVisible">
      <el-form :model="addform" :label-width="'80px'" :rules="rules" ref="addformRef">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addform.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addform.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addform.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addform.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="adddialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑用户对话框 -->
    <el-dialog title="编辑用户" :visible.sync="editdialogFormVisible">
      <el-form :model="editform" :label-width="'80px'" :rules="rules" ref="editformRef">
        <el-form-item label="用户名">
          <el-input v-model="editform.username" autocomplete="off" disabled style="width:80px"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editform.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editform.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="editdialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getUserList, addUserList, delUserList, editUserList, updateUserState } from '@/api/user_index.js'
export default {
  data () {
    return {
      // 添加用户对话框控制显示隐藏
      adddialogFormVisible: false,
      // 编辑用户对话框控制显示隐藏
      editdialogFormVisible: false,
      status: true,
      // 用户数据总条数
      total: 0,
      // 添加用户表单数据
      addform: {
        username: '',
        email: '',
        mobile: ''
      },
      // add 表单验证
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {
            pattern: /\w+[@]\w+[.]\w/,
            message: '请输入正确的邮箱',
            trigger: 'blur'
          }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          {
            pattern: /^1\d{10}$/,
            message: '请输入正确的手机号',
            trigger: 'blur'
          }
        ]
      },
      // 编辑用户表单数据
      editform: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      },
      // 获取数据需要传入的对象
      userObj: {
        query: '',
        pagenum: 1,
        pagesize: 4
      },
      // 接收到的数据
      userList: []
    }
  },
  methods: {
    // 获取用户数据
    init () {
      getUserList(this.userObj)
        .then(res => {
          if (res.data.meta.status === 200) {
            this.userList = res.data.data.users
            this.total = res.data.data.total
          }
        })
        .catch(err => {
          this.$message.error(err)
        })
    },
    // 改变每页显示的数量触发的事件
    handleSizeChange (val) {
      this.userObj.pagesize = val
      this.init()
    },
    // 改变页码触发的事件
    handleCurrentChange (val) {
      this.userObj.pagenum = val
      this.init()
    },
    // 添加用户
    addUser () {
      // 对表单数据进行二次验证
      this.$refs.addformRef.validate(valid => {
        addUserList(this.addform)
          .then(res => {
            if (res.data.meta.status === 201) {
              this.$message({
                type: 'success',
                message: '添加成功!'
              })
              this.adddialogFormVisible = false
              // 重置添加用户表单数据
              this.$refs.addformRef.resetFields()
              this.init()
            }
          })
          .catch(err => {
            this.$message.error(err)
          })
      })
    },
    // 删除用户
    delUser (id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delUserList(id)
            .then(res => {
              if (res.data.meta.status === 200) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                if (Math.ceil((this.total - 1) / this.userObj.pagesize) < this.userObj.pagenum) {
                  this.userObj.pagenum--
                }
                this.init()
              }
            })
            .catch(err => {
              this.$message.error(err)
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 状态改变事件
    async changeStatu (id, type) {
      let res = await updateUserState(id, type)
      console.log(res)
      if (res.data.meta.status === 200) {
        this.$message({
          type: 'success',
          message: res.data.meta.msg
        })
      }
    },
    // 编辑用户对话框获取默认数据
    editSubmit (row) {
      this.editdialogFormVisible = true
      this.editform.id = row.id
      this.editform.username = row.username
      this.editform.email = row.email
      this.editform.mobile = row.mobile
    },
    // 编辑用户
    async editUser () {
      let res = await editUserList(this.editform)
      if (res.data.meta.status === 200) {
        this.$message({
          type: 'success',
          message: '编辑成功'
        })
        this.editdialogFormVisible = false
        this.init()
      }
    }
  },
  mounted () {
    // 初始化表格数据
    this.init()
  }
}
</script>

<style lang="less" scoped>
</style>
