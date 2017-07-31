<template>
  <div id="app" :class="{previewMode:previewMode}">
     <topbar class="topbar" :hasLogIn="hasLogIn" :username="usernameC" @preview="preview" @sign="sign" @logout="logout"></topbar>
     <signForm :signFormVisible="signFormVisible" :signUser="signUser" :signMode="signMode" @exitSign="exitSign" @submitForm="submitForm" class="signForm"></signForm>
    <main>
      <Editor :resume="resume" :resumeB="resumeB" :i8="i8" :isArea="isArea" class="editor"/>
      <Preview :resume="resume" :i8="i8" class="preview"/>
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
export default {
  data(){
    return {
      previewMode: false,
      hasLogIn: false,
      signFormVisible: false,
      signMode:0, // 1 注册 2 登录
      signUser: {
        name:'',
        password:''
      },
      user: null,
      resume: {
        profile: { name: '', city: '', birth: '' },
        workHistory: [ {company: '', content: ''}],
        education: [ {school: '', duration: '', degree: ''} ],
        projects: [ {name: '', content: '' } ],
        awards: [ {name: ''} ],
        contacts: { phone: '', email: '', wechat: '', qq: '' }
      },
      resumeB:{},
      i8: {
        profile: { name: '姓名', city: '城市', birth: '生日' },
        workHistory: {company: '公司', content: '工作内容'},
        education: {school: '学校', duration: '时间', degree: '学位'} ,
        projects: {name: '项目名称', content: '项目内容' } ,
        awards: {name: '奖励详情'} ,
        contacts: { phone: '电话', email: '邮箱', wechat: '微信', qq: 'QQ' }
      },
      isArea:{
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
      console.log('login')
      AV.User.logIn(this.signUser.name, this.signUser.password).then(function(user) {
        this.user = user.toJSON()
        this.signUser.name = this.signUser.password = ''
        this.signFormVisible = false
      }.bind(this)).catch(alert)
    },
    signup: function() {
      console.log('signup')
      AV.User.signUp(this.signUser.name, this.signUser.password).then(function(user) {
        this.user = user.toJSON()
        this.signUser.name = this.signUser.password = ''
        this.signFormVisible = false
      }.bind(this)).catch(alert)
    },
    logout: function() {
      AV.User.logOut()
      this.user = null
    },
  },
  created(){
    this.resumeB = JSON.parse(JSON.stringify(this.resume))
    let localResume = localStorage.getItem('localResume')
    localResume && (this.resume = JSON.parse(localResume))
    var user = AV.User.current()
    if(user){
      this.user = user.toJSON()
    }
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
