<template>
  <div id="topbar">
    <div class="logo">
      VueResumer
    </div>
    <div class="actions">
      <el-button type="primary">注册</el-button>
      <el-button>登录</el-button>
       <el-button type="success" v-on:click="preview">预览</el-button> 
    </div>
  </div>
</template>

<style>
  #topbar{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 16px;
    font-size: 20px;
  }
</style>

<script>
  export default {
    methods:{
      preview(){
        this.$emit('preview')
      }
    }
  }
</script>