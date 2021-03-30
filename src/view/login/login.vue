<style lang="less">
@import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in"
            title="欢迎登录"
            :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
          <!-- <p class="login-tip">输入任意用户名和密码即可</p> -->
          <!-- <p class="tips">
            <span>账号 : admin</span><span>密码 : 123456</span>
          </p> -->
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import LoginForm from "_c/login-form";
import { mapActions } from "vuex";
// function
import { refreshRoute } from "@/router"; // 路由初始化，清空动态路由

export default {
  components: {
    LoginForm
  },
  created () {
    localStorage.setItem("dynamicRouter-gateway", []);
    localStorage.setItem("redirectRouter-gateway", []);
    refreshRoute();
  },
  methods: {
    ...mapActions(["handleLogin", "getRouters"]),
    handleSubmit ({ userName, password }) {
      this.handleLogin({ userName, password }).then(res => {
        res.data.success === "200" &&
          this.getRouters().then(resRoutes => {
            this.$router.push({ path: "/" });
          });
      });
    }
  }
};
</script>

<style>
</style>
