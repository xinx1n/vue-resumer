<template>
  <div id="app" :class="{previewMode:previewMode}">
     <topbar class="topbar" :hasLogIn="hasLogIn" :username="usernameC" @preview="preview" @sign="sign" @logout="logout"></topbar>
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
let Resume = AV.Object.extend('Resume')
const GLocalResume = 'localResume'
const GUpdateTime = 'updateAt'
export default {
  data(){
    return {
      initFetch: true,
      block:false,
      previewMode: false,
      hasLogIn: false,
      signFormVisible: false,
      signMode:0, // 1 注册 2 登录
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
        contacts: { phone: '电话', email: '邮箱', wechat: '微信', qq: 'QQ' }
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
      if(this.signMode === 1){
        this.signup()
      }else{
        this.signin()
      }
    },
    signin: function() {
      if(this.block) return
      this.block = true
      AV.User.logIn(this.signUser.name, this.signUser.password).then(function(user) {
        this.user = user.toJSON()
        this.signUser.name = this.signUser.password = ''
        this.signFormVisible = false
        this.initResume()
      }.bind(this)).catch(alert)
    },
    signup: function() {
      if(this.block) return
      this.block = true
      AV.User.signUp(this.signUser.name, this.signUser.password).then(function(user) {
        this.user = user.toJSON()
        this.signUser.name = this.signUser.password = ''
        this.signFormVisible = false
        this.initResume()
      }.bind(this)).catch(alert)
    },
    logout: function() {
      AV.User.logOut()
      this.initFetch = true
      this.user = { }
    },
    initResumeFromLocal(){
      let localResume = localStorage.getItem(GLocalResume)
      localResume && (this.resume = JSON.parse(localResume))
    },
    saveAtLocal(resume,updateAt){
      localStorage.setItem(GLocalResume,resume)
      localStorage.setItem(GUpdateTime,updateAt)
    },
    initResume(){
      if(!AV.User.current()){
        console.log('local nouser')
        this.initResumeFromLocal()
        return
      }
      let muser = AV.Object.createWithoutData('User', AV.User.current().id)
      const query = new AV.Query(Resume).equalTo('user', muser).descending('createdAt')
      query.find().then((data)=>{
        window.asdf = data
        if(data.length>0&&this.compareTime(data[0].updatedAt)){
          console.log('fetch')
          this.initFetch = true
          this.resume = JSON.parse(data[0].attributes.content)
          this.saveAtLocal(JSON.stringify(this.resume),data[0].updatedAt)
        }else{
          console.log('local hasuser')
          this.initResumeFromLocal()
        }
      },(error)=>{
        console.log('local hasuser')
        this.initResumeFromLocal()
      })
    },
    saveOrUpdateResume: function (val) {
      console.log('saveorupdate1')
      let value = JSON.stringify(val)
      if(this.initFetch){
        this.initFetch = false
        return
      }
      console.log('saveorupdate2')
      if (!value||this.resumeCOldStr===value) { return }
      console.log('saveorupdate2.5')
      this.resumeCOldStr = value
      if(!AV.User.current()){
        this.saveAtLocal(value,new Date().toString())
        return
      }
      console.log('saveorupdate3')
      let muser = AV.Object.createWithoutData('User', AV.User.current().id)
      const query = new AV.Query(Resume).equalTo('user', muser).descending('createdAt')
      let newResume
      query.find().then((data)=>{
        if(data.length !== 0){
          newResume = AV.Object.createWithoutData('Resume', data[0].id)
          newResume.set('content', value)
        }else{
          var acl = new AV.ACL()
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
          this.saveAtLocal(value,result.updatedAt)
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
    compareTime(str){
      if(!str){ return false }
      try {
        let localTime = localStorage.getItem(GUpdateTime)
        let localResume = localStorage.getItem(GLocalResume)
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
    this.resumeCOldStr = localStorage.getItem(GLocalResume)||' '
    let user = AV.User.current()
    user&&(this.user = user.toJSON())
    this.initResume()
  },
  watch: {
    'user.objectId':{
      handler(id){
        if(id){
          this.hasLogIn = true
        }else{
          this.hasLogIn = false
        }
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
