<template>
  <div id="topbar">
    <div class="logo">
      VueResumer
    </div>
    <div class="actions">
      <span v-if="hasLogIn" class="hello">你好 {{username}}</span>
      <el-button v-if="!hasLogIn" type="primary" @click="sign(1)">注册</el-button>
      <el-button v-if="!hasLogIn" @click="sign(2)">登录</el-button>
      <el-button v-if="hasLogIn"  @click="logout()">登出</el-button>
      <el-button type="success" v-on:click="preview">预览</el-button> 
    </div>
  </div>
</template>

<style lang="scss">
  #topbar{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 16px;
    font-size: 20px;
    >.actions{
      display: flex;
      align-items: center;
      >.hello{
        padding-right: 8px;
      }
    }
  }
</style>

<script>
  export default {
    props:['hasLogIn','username'],
    methods:{
      preview(){
        this.$emit('preview')
      },
      sign(mode){
        this.$emit('sign',mode)
      },
      logout(){
        this.$emit('logout')
      }
    }
  }
</script>