<template>
  <div class="login">
    <h1>Hello</h1>
    <a-input placeholder="用户名" allowClear />
    <br />
    <br />
    <a-input-password placeholder="密码" allowClear />
    <a-button type="primary">登录</a-button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Login extends Vue {
  @Prop() private msg!: string;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.login {
  border: 1px;
  width: 100px;
  height: 100px;
}
</style>
