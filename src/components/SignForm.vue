<template>
  <div id="signForm">
    <el-dialog :title="titleC" :visible.sync="signFormVisible" :before-close="myBeforClose">
      <el-form :model="signUser" @submit="submitForm">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="signUser.name" auto-complete="off" autofocus @keyup.enter.native="submitForm"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="signUser.password" auto-complete="off" type="password" @keyup.enter.native="submitForm"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="exitSign">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: ['signFormVisible', 'signUser', 'signMode'],
  data() {
    return {
      formLabelWidth: '56px'
    }
  },
  computed: {
    titleC() {
      if (this.signMode === 1) {
        return '注册'
      } else {
        return '登录'
      }
    }
  },
  methods: {
    exitSign() {
      this.$emit('exitSign')
    },
    myBeforClose() {
      this.$emit('exitSign')
    },
    submitForm() {
      this.$emit('submitForm')
    }
  }
}
</script>

<style lang="scss">
#signForm {
  .el-dialog__header {
    text-align: center;
    padding: 20px 20px 8px;
  }
  .el-dialog--small {
    width: 32%;
  }
  .el-dialog__body {
    padding: 16px 20px;
  }
  .el-dialog__footer {
    padding: 0 20px 15px;
  }
}
</style>

