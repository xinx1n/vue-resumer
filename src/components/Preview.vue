<template>
  <div id="preview">
    <h1>{{resumeC.profile.name||'姓名'}}</h1>
    <p>{{resumeC.profile.birth||'生日'}} | {{resumeC.profile.city||'城市'}}</p>
    <section v-if="resumeC.workHistory.length>0">
      <h2>工作经历</h2>
      <ul>
        <li v-for="(work,index) in resumeC.workHistory" :key="index">
          <p>{{work.company}}：</p>
          <p class="content">{{work.content}}</p>
        </li>
      </ul>
    </section>
    <section v-if="resumeC.education.length>0">
      <h2>教育经历</h2>
      <ul>
        <li v-for="(edu,index) in resumeC.education" :key="index">
          {{edu.duration}} {{edu.school}} {{edu.degree&&edu.degree+'学位'}}
        </li>
      </ul>
    </section>
    <section v-if="resumeC.projects.length>0">
      <h2>项目经历</h2>
      <ul>
        <li v-for="(project,index) in resumeC.projects" :key="index">
          <p>{{project.name}}：</p>
          <p class="content">{{project.content}}</p>
        </li>
      </ul>
    </section>
    <section v-if="resumeC.awards.length>0">
      <h2>获奖情况</h2>
      <ul>
        <li v-for="(award,index) in resumeC.awards" :key="index">
          <p class="content">{{award.name}}</p>
        </li>
      </ul>
    </section>
    <section v-if="!isEmpty(resumeC.contacts)" class="contacts">
      <p v-if="resumeC.contacts.phone">
        <span>{{i8.contacts.phone}}：</span>{{resumeC.contacts.phone}}</p>
      <p v-if="resumeC.contacts.email">
        <span>{{i8.contacts.email}}：</span>{{resumeC.contacts.email}}</p>
      <p v-if="resumeC.contacts.wechat">
        <span>{{i8.contacts.wechat}}：</span>{{resumeC.contacts.wechat}}</p>
      <p v-if="resumeC.contacts.qq">
        <span>{{i8.contacts.qq}}：</span>{{resumeC.contacts.qq}}</p>
    </section>
  </div>
</template>

<script>
let timeoutTimer
export default {
  props: ['resume', 'i8'],
  methods: {
    filter(array) { // 找出非空对象
      return array.filter(item => !this.isEmpty(item))
    },
    isEmpty(object) { // 只要有一个 value 不是 falsy，就返回 false
      let empty = true
      for (let key in object) {
        if (object[key]) {
          empty = false
          break
        }
      }
      return empty
    },
    saveOrUpdate(tmp) {
      timeoutTimer && clearTimeout(timeoutTimer)
      timeoutTimer = setTimeout(() => {
        this.$emit('saveorupdate', tmp)
      }, 2500)
    }
  },
  computed: {
    resumeC: function() {
      let tmp = {}
      let resumeTmp = JSON.parse(JSON.stringify(this.resume))
      for (let key in resumeTmp) {
        let item = resumeTmp[key]
        if (item instanceof Array) {
          tmp[key] = this.filter(item)
        } else {
          tmp[key] = item
        }
      }
      this.saveOrUpdate(tmp)
      return tmp
    }
  }
}
</script>

<style lang="scss">
.previewMode #preview {
  padding: 24px 48px;
}

#preview {
  position: relative;
  padding: 24px 32px;
  color: #333;
  font-size: 20px;
  h1 {
    margin: 8px 0;
  }
  >section {
    padding-top: 8px;
    &.contacts {
      position: absolute;
      top: 24px;
      right: 48px;
      >p {
        font-size: 15px;
        margin-bottom: 4px;
        >span {
          display: inline-block;
          min-width: 60px;
          text-align: right;
        }
      }
    }
    >h2 {
      margin-bottom: 8px;
      font-size: 26px;
    }
    >ul {
      font-size: 18px;
      >li {
        margin-bottom: 8px;
        line-height: 1.4;
      }
    }
    p {
      margin-bottom: 8px;
      &.content {
        font-size: 16px;
        color: #555;
      }
    }
  }
}
</style>
