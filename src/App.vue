<template>
  <div id="app" :class="{previewMode:previewMode}">
     <topbar class="topbar" v-on:preview="preview"></topbar> 
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
export default {
  data(){
    return {
      previewMode: false,
      resume: {
        profile: { name: '', city: '', birth: '' },
        workHistory: [ {company: '', content: ''}],
        education: [ {school: '', duration: '', degree: ''} ],
        projects: [ {name: '', content: '' } ],
        awards: [ {name: ''} ],
        contacts: { qq: '', wechat: '', phone: '', email: '' }
      },
      resumeB:{},
      i8: {
        profile: { name: '姓名', city: '城市', birth: '生日' },
        workHistory: {company: '公司', content: '工作内容'},
        education: {school: '学校', duration: '时间', degree: '学位'} ,
        projects: {name: '项目名称', content: '项目内容' } ,
        awards: {name: '奖励详情'} ,
        contacts: { qq: 'QQ', wechat: '微信', phone: '电话', email: '邮箱' }
      },
      isArea:{
        profile: { name: 'text', city: 'text', birth: 'text' },
        workHistory: {company: 'text', content: 'textarea'},
        education: {school: 'text', duration: 'text', degree: 'text'} ,
        projects: {name: 'text' , content: 'textarea' } ,
        awards: {name: 'textarea'} ,
        contacts: { qq: 'text', wechat: 'text', phone: 'text', email: 'text' }
      }
    }
  },
  methods:{
    exitPreview(){
      this.previewMode = false
    },
    preview(){
      this.previewMode = true
    }
  },
  created(){
    this.resumeB = JSON.parse(JSON.stringify(this.resume))
  },
  components: {
      Topbar, Editor, Preview
  }

}
</script>
<style lang="scss">
html, body, #app{ height: 100%; overflow: hidden; }
#app{
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
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
