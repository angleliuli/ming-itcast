<template>
  <div class="login">
    <div class="container">
      <!-- 头像 -->
      <img src="@/assets/avatar.jpg" alt class="avatar" />

      <el-form :model="loginForm" :rules="rules" ref="loginForm" class="demo-ruleForm">
        <!-- 用户名输入框 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="用户名" prefix-icon="myicon myicon-user"></el-input>
        </el-form-item>

        <!-- 密码输入框 -->
        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="loginForm.password"
            placeholder="密码"
            prefix-icon="myicon myicon-key"
            @keyup.native.13="login"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" class="login-btn" @click="login">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// 引入api文件
import { login } from '@/api/user_index.js'

export default {
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    login () {
      // 调用表单的 validata 方法再次实现数据的验证
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          // 调用接口方法，传入表单数据
          login(this.loginForm)
          // 请求成功
            .then(res => {
              console.log(res)
              if (res.data.meta.status === 200) {
                // 验证通过，跳转到首页
                this.$router.push({ name: 'home' })
              } else {
                this.$message({
                  message: res.data.meta.msg,
                  type: 'error'
                })
              }
            })
            // 请求失败
            .catch(err => {
              console.log(err)
              this.$message.error('登录失败')
            })
        } else {
          // 表单验证失败
          this.$message.error('请输入用户名或密码')
          // 阻止发送请求
          return false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: #2f4050;
  .container {
    position: absolute;
    left: 0;
    right: 0;
    width: 400px;
    padding: 0px 40px 15px 40px;
    margin: 200px auto;
    background: white;
    .avatar {
      position: relative;
      left: 50%;
      width: 120px;
      height: 120px;
      margin-left: -60px;
      margin-top: -60px;
      margin-bottom: 30px;
      box-sizing: border-box;
      border-radius: 50%;
      border: 10px solid #fff;
      box-shadow: 0 1px 5px #ccc;
      overflow: hidden;
    }
    .login-btn {
      width: 100%;
    }
  }
}
</style>
