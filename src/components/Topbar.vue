<template>
  <div id="topbar">
    <div class="logo">
      VueResumer
    </div>
    <div class="actions">
      <span v-if="hasLogIn" class="hello">你好 {{username}}</span>
      <el-button v-if="!hasLogIn" type="primary" @click="sign(1)">注册</el-button>
      <el-button v-if="!hasLogIn" @click="sign(2)">登录</el-button>
      <el-tooltip v-if="hasLogIn&&showLoadLocalDataBtn" effect="dark" content="载入本地数据" placement="bottom">
        <el-button @click="loadLocalData">载入</el-button>
      </el-tooltip>
      <el-tooltip v-if="showLoadLocalDataBtn" effect="dark" content="清除本地数据" placement="bottom">
        <el-button type="danger" :plain="true" @click="clearLocalData" icon="delete"></el-button>
      </el-tooltip>
      <el-button v-if="hasLogIn" @click="logout()">登出</el-button>
      <el-button type="success" v-on:click="preview">预览</el-button>
    </div>
  </div>
</template>

<style lang="scss">
#topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  font-size: 20px;
  >.actions {
    display: flex;
    align-items: center;
    >.hello {
      padding-right: 8px;
    }
    >.el-button {
      padding: 7px 14px;
      font-size: 15px;
    }
  }
}
</style>

<script>
export default {
  props: ['hasLogIn', 'username', 'showLoadLocalDataBtn'],
  methods: {
    preview() {
      this.$emit('preview')
    },
    sign(mode) {
      this.$emit('sign', mode)
    },
    logout() {
      this.$emit('logout')
    },
    loadLocalData() {
      this.$emit('loadLocalData')
    },
    clearLocalData() {
      this.$emit('clearLocalData')
    }


  }
}
</script>
