<template>
  <div id="editor">
    <nav>
      <ul>
        <li v-for="(nav,index) in navs" :key="index" :class="{active:currentTab===nav.name}" @click="currentTab = nav.name">
          <svg class="icon">
            <use v-bind:xlink:href="`#icon-${nav.icon}`"></use>
          </svg>
        </li>
      </ul>
    </nav>
     <ul class="tabpanes">
        <li v-for="(nav,index) in navs" :key="index" v-show="currentTab===nav.name">
          <div>
              <h2>{{nav.title}}</h2>
              <el-form v-if="resume[nav.name] instanceof Array">
                  <div class="container" v-for="(item,index) in resume[nav.name]" :key="index">
                    <el-form-item v-for="(value,key) in item" :key="key" :label="i8[nav.name][key]">
                        <el-input v-model="item[key]"></el-input>
                    </el-form-item>
                  </div>
              </el-form>
              <el-form v-else>
                   <el-form-item v-for="(value,key) in resume[nav.name]" :key="key" :label="i8[nav.name][key]">
                      <el-input v-model="resume[nav.name][key]"></el-input>
                  </el-form-item>
              </el-form>
          </div>
        </li>
    </ul> 
  </div>
</template>

<script>
export default {
  props: ['resume','i8'],
  data(){
    return{
      currentTab:'profile',
      navs:[
        {name:'profile',icon:'id',title:'个人信息'},
        {name:'workHistory',icon:'work',title:'工作经历'},
        {name:'education',icon:'book',title:'学习经历'},
        {name:'projects',icon:'heart',title:'项目经历'},
        {name:'awards',icon:'jiangbei',title:'获奖情况'},
        {name:'contacts',icon:'phone',title:'联系方式'}
      ]
    }
  }
}

</script>

<style lang="scss">
#editor {
  display: flex;
  >nav {
    background: #000;
    width: 80px;
    > ul > li {
      padding: 16px 0;
      text-align: center;
      > .icon{
        width: 24px;
        height: 24px;
        fill: #fff;
      }
      &.active{
        background-color: #fff;
        >.icon{
          fill: #000;
        }
      }
    }
  }
  >.tabpanes{
    flex: 1;
    >li{
      padding: 16px;
      overflow: auto;
    }
  }
}
</style>
