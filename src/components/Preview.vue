<template>
  <div id="preview">
    <h1>{{resumeC.profile.name||'姓名'}}</h1>
    <p>{{resumeC.profile.city||'城市'}} | {{resumeC.profile.birth||'生日'}}</p>
    <section v-if="resumeC.workHistory.length>0">
      <h2>工作经历</h2>
      <ul>
        <li v-for="(work,index) in resumeC.workHistory" :key="index">
          {{work.company}}
          {{work.content}}
        </li>
      </ul>
    </section>
    <section v-if="resumeC.education.length>0">
      <h2>教育经历</h2>
      <ul>
        <li v-for="(edu,index) in resumeC.education" :key="index">
          {{edu.school}}
          {{edu.duration}}
          {{edu.degree}}
        </li>
      </ul>
    </section>
    <section v-if="resumeC.projects.length>0">
      <h2>项目经历</h2>
      <ul>
        <li v-for="(project,index) in resumeC.projects" :key="index">
          {{project.name}}
          {{project.content}}
        </li>
      </ul>
    </section>
    <section v-if="resumeC.awards.length>0">
      <h2>获奖情况</h2>
      <ul>
        <li v-for="(award,index) in resumeC.awards" :key="index">
          {{award.name}}
        </li>
      </ul>
    </section>
    <section v-if="!isEmpty(resumeC.contacts)">
      {{resumeC.contacts.qq}}
      {{resumeC.contacts.wechat}}
      {{resumeC.contacts.phone}}
      {{resumeC.contacts.email}}
    </section>
  </div>
</template>

<script>
export default {
  props:['resume','i8'],
  methods:{
    filter(array){ // 找出非空对象
      return array.filter(item=> !this.isEmpty(item))
    },
    isEmpty(object){ // 只要有一个 value 不是 falsy，就返回 flase
      let empty = true
      for(let key in object){
        if(object[key]){
          empty = false
          break
        }
      }
      return empty
    }
  },
  computed:{
    resumeC:function(){
      let tmp = {}
      let resumeTmp = JSON.parse(JSON.stringify(this.resume))
      for(let key in resumeTmp){
        let item = resumeTmp[key]
        if(item instanceof Array){
          tmp[key] = this.filter(item)
        }else{
          tmp[key] = item
        }
      }
      return tmp
    }
  }
}
</script>

<style lang="scss">
  #preview{
    padding: 24px 32px;
    color: #333;
  }
</style>
