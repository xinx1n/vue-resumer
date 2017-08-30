<template>
  <div id="app" :class="{previewMode:previewMode}">
     <topbar class="topbar" :hasLogIn="hasLogIn" :username="usernameC" :showLoadLocalDataBtn="showLoadLocalDataBtn"  @preview="preview" @sign="sign" @logout="logout" @loadLocalData="loadLocalData" @clearLocalData="clearLocalData"></topbar>
     <signForm :signFormVisible="signFormVisible" :signUser="signUser" :signMode="signMode" @exitSign="exitSign" @submitForm="submitForm" class="signForm"></signForm>
    <main>
      <Editor :resume="resume" :resumeB="resumeB" :i8="i8" :inputType="inputType" class="editor"/>
      <Preview :resume="resume" :i8="i8" @saveorupdate="saveOrUpdateResume" class="preview"/>
    </main>
    <el-button id="exitPreview" type="success" @click="exitPreview">退出预览</el-button>
  </div>
</template>

<script>
import Topbar from './components/Topbar'
import Editor from './components/Editor'
import Preview from './components/Preview'
import SignForm from './components/SignForm'

import AV from './lib/leancloud'
import getErrorMessage from './lib/getErrorMessage'
let Resume = AV.Object.extend('Resume')
const GLocalResume = 'localResume'
// const GUpdateTime = 'updateAt'
export default {
  data(){
    return {
      showLoadLocalDataBtn: false,
      saveOrUpdateFl: true,
      block: false,
      previewMode: false,
      hasLogIn: false,
      signFormVisible: false,
      signMode: 0, // 1 注册 2 登录
      signUser: {
        name:'',
        password:''
      },
      user: {},
      resume: {
        profile: { name: '', city: '', birth: '' },
        workHistory: [ {company: '', content: ''}],
        education: [ {school: '', duration: '', degree: ''} ],
        projects: [ {name: '', content: '' } ],
        awards: [ {name: ''} ],
        contacts: { phone: '', email: '', wechat: '', qq: '' }
      },
      resumeB:{},
      resumeCOldStr:' ',
      i8: {
        profile: { name: '姓名', city: '城市', birth: '生日' },
        workHistory: {company: '公司', content: '工作内容'},
        education: {school: '学校', duration: '时间', degree: '学位'} ,
        projects: {name: '项目名称', content: '项目内容' } ,
        awards: {name: '奖励详情'} ,
        contacts: { phone: '电话', email: '邮箱', wechat: '微信', qq: 'Q Q' }
      },
      inputType:{
        profile: { name: 'text', city: 'text', birth: 'text' },
        workHistory: {company: 'text', content: 'textarea'},
        education: {school: 'text', duration: 'text', degree: 'text'} ,
        projects: {name: 'text' , content: 'textarea' } ,
        awards: {name: 'textarea'} ,
        contacts: { phone: 'text', email: 'text', wechat: 'text', qq: 'text' }
      }
    }
  },
  computed:{
    usernameC(){
      if(this.user){
        return this.user.username
      }
      return ' '
    }
  },
  methods:{
    exitPreview(){
      this.previewMode = false
    },
    preview(){
      this.previewMode = true
    },
    sign(mode){
      this.signMode = mode || 1
      this.signFormVisible = true
      this.block = false
    },
    exitSign(){
      this.signFormVisible = false
    },
    submitForm(){
      this.saveOrUpdateFl = true
      if(this.signMode === 1){
        this.signup()
      }else{
        this.signin()
      }
    },
    signin() {
      if(this.block) return
      this.block = true
      AV.User.logIn(this.signUser.name, this.signUser.password).then(function(user) {
        this.user = user.toJSON()
        this.signUser.name = this.signUser.password = ''
        this.signFormVisible = false
        this.initResume()
        this.showLocalDataBtnFn()
      }.bind(this)).catch(this.signMessage)
    },
    signup() {
      if(this.block) return
      if(!this.signUser.name||!this.signUser.password){
        this.$message({
          type:"warning",
          message:"请填写完整数据",
          showClose:true
        })
        return
      }
      this.block = true
      AV.User.signUp(this.signUser.name, this.signUser.password).then(function(user) {
        this.user = user.toJSON()
        this.signUser.name = this.signUser.password = ''
        this.signFormVisible = false
        this.initResume()
        this.showLocalDataBtnFn()
      }.bind(this)).catch(this.signMessage)
    },
    logout() {
      AV.User.logOut()
      this.saveOrUpdateFl = true
      this.initResume()
      this.user = { }
    },
    getResumeLocalKey() {
      let key = GLocalResume
      if(AV.User.current()){
        key = AV.User.current().id
      }
      return key
    },
    showLocalDataBtnFn: function () {
      let local = localStorage.getItem(GLocalResume)
      this.showLoadLocalDataBtn = !!local
    },
    loadLocalData() {
      if(AV.User.current()){
        let stor = localStorage.getItem(GLocalResume)
        if(stor){
          this.$confirm('载入本地数据将会覆盖云端数据，是否载入？', '提示', {
            confirmButtonText: '载入',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            localStorage.setItem(AV.User.current().id,stor)
            localStorage.removeItem(GLocalResume)
            this.saveOrUpdateFl = false
            this.initResumeFromLocal()
            this.$message({
              type: 'success',
              message: '已载入'
            })
            this.showLocalDataBtnFn()
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            })
          })
        }
      }
    },
    clearLocalData() {
      this.$confirm('将会删除本地数据，是否继续？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if(AV.User.current()){
          localStorage.removeItem(AV.User.current().id)
        }
        localStorage.removeItem(GLocalResume)
        this.initResumeFromLocal()
        this.$message({
          type: 'success',
          message: '已删除'
        })
        this.showLocalDataBtnFn()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    fixResume(resumeTmp){
      let tmp = {}
      for(let key in resumeTmp){
        let item = resumeTmp[key]
        if(item instanceof Array){
          if(item.length > 0){
            tmp[key] = item
          }else{
            tmp[key] = this.resumeB[key]
          }
        }else{
          tmp[key] = item
        }
      }
      return tmp
    },
    initResumeFromLocal() {
      let localResume = localStorage.getItem(this.getResumeLocalKey())
      if(localResume){
        let resumeTmp = JSON.parse(localResume).resume
        this.resume = this.fixResume(resumeTmp)
      }else{
        this.resume = JSON.parse(JSON.stringify(this.resumeB))
      }
    },
    saveAtLocal(resume,updateAt) {
      let l = { resume, updateAt }
      localStorage.setItem(this.getResumeLocalKey(),JSON.stringify(l))
    },
    initResume(){
      if(!AV.User.current()){
        // console.log('local nouser')
        this.initResumeFromLocal()
        return
      }
      let muser = AV.Object.createWithoutData('User', AV.User.current().id)
      const query = new AV.Query(Resume).equalTo('user', muser).descending('createdAt')
      query.find().then((data)=>{
        if(data.length>0&&this.compareTime(data[0].updatedAt)){
          // console.log('fetch')
          this.saveOrUpdateFl = true
          let resumeTmp = JSON.parse(data[0].attributes.content)
          this.resume = this.fixResume(resumeTmp)
          this.saveAtLocal(resumeTmp,data[0].updatedAt)
        }else{
          // console.log('local hasuser')
          this.saveOrUpdateFl = false
          this.initResumeFromLocal()
        }
      },(error)=>{
        // console.log('local forerror')
        this.saveOrUpdateFl = false
        this.initResumeFromLocal()
      })
    },
    saveOrUpdateResume (val) {
      // console.log('saveorupdate1')
      if(this.saveOrUpdateFl){
        this.saveOrUpdateFl = false
        return
      }
      // console.log('saveorupdate2')
      let value = JSON.stringify(val)
      if (!value||this.resumeCOldStr===value) { return }
      // console.log('saveorupdate2.5')
      this.resumeCOldStr = value
      if(!AV.User.current()){
        this.saveAtLocal(val,new Date().toString())
        return
      }
      // console.log('saveorupdate3')
      let muser = AV.Object.createWithoutData('User', AV.User.current().id)
      const query = new AV.Query(Resume).equalTo('user', muser).descending('createdAt')
      let newResume
      query.find().then((data)=>{
        if(data.length !== 0){
          newResume = AV.Object.createWithoutData('Resume', data[0].id)
          newResume.set('content', value)
        }else{
          let acl = new AV.ACL()
          acl.setPublicReadAccess(false)
          acl.setPublicWriteAccess(false)
          acl.setReadAccess(AV.User.current(), true)
          acl.setWriteAccess(AV.User.current(), true)
          newResume =  new Resume({
              content: value,
              user: AV.User.current()
          }).setACL(acl)
        }
        newResume.save().then((result)=>{
          this.saveAtLocal(val,result.updatedAt)
          this.successNotice()
        },(error)=>{
          this.failNotice()
        })
      })
    },
    successNotice(){
      this.$notify({
        title: '成功',
        message: '已完成同步',
        type: 'success',
        duration: 2000
      })
    },
    failNotice(){
      this.$notify({
        title: '失败',
        message: '同步失败，请稍后尝试',
        type: 'error',
        duration: 2000
      })
    },
    signMessage(error){
      let message = getErrorMessage(error)
      this.$message({
        type: 'warning',
        message,
        showClose:true
      })
      this.block = false
    },
    compareTime(str){
      if(!str){ return false }
      try {
        let localStore = JSON.parse(localStorage.getItem(this.getResumeLocalKey()))
        let localTime = localStore.updateAt
        let localResume = localStore.resume
        if(localTime&&localResume){
          return (new Date(str) - new Date(localTime)) > 0
        }
        return true
      } catch (error) {
        return true
      }
    }
  },
  created(){
    this.resumeB = JSON.parse(JSON.stringify(this.resume))
    let local = localStorage.getItem(this.getResumeLocalKey())
    if(local){
      let tmp = JSON.parse(local).resume||' '
      this.resumeCOldStr = JSON.stringify(tmp)
    }
    let user = AV.User.current()
    user&&(this.user = user.toJSON())
    this.initResume()
    this.showLocalDataBtnFn()
  },
  watch: {
    'user.objectId':{
      handler(id){
         this.hasLogIn = !!id
      }
    }
  },
  components: {
      Topbar, Editor, Preview, SignForm
  }

}
</script>
<style lang="scss">
html, body, #app{ height: 100%; overflow: hidden; }
#app{
  // font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  position: relative;
  display: flex;
  flex-direction: column;
  >.topbar{
    position: relative;
    z-index: 1;
    box-shadow: 0 0 3px hsla(0,0,0,0.5);
  }
  >main{
    display: flex;
    flex: 1;
    background-color: #ddd;
    position: relative;
    overflow: hidden;
    > .editor{
      width: 34%;
      margin: 16px 8px 16px 16px;
      background: white;
      box-shadow: 0 0 3px hsla(0,0,0,0.5);
      overflow: hidden;
    }
    > .preview{
      flex: 1;
      margin: 16px 16px 16px 8px;
      background: white;
      box-shadow: 0 0 3px hsla(0,0,0,0.5);
      overflow-x: hidden;
      overflow-y: auto;
      &::-webkit-scrollbar {
        display:none;
      }
    }
  }
  >#exitPreview{
    position: fixed;
    right: 20px;
    bottom: 20px;
    display: none;
  }
  &.previewMode{
    >.topbar{
      display: none;
    }
    >main{
      >.editor{
        display: none;
      }
      >.preview{
        margin: 0 auto;
        max-width: 66%;
      }
    }
    >#exitPreview{
      display: block;
    }
  }
}
</style>
