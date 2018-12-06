<template>
    <ul class="nav">
      <!-- <router-link v-for="item in $store.state.permission.navLists" :to="{ path: item.path }" @click.native="setTitle(item.name)" tag="li" active-class="active"> -->
      <router-link v-for="(item,index) in $store.state.permission.navLists" :to="{ path: item.path }" tag="li" active-class="active">
        <!--<a v-if="item.url===true" :href="item.path">{{ item.name }}</a>-->
       <!--  <a v-if="index == 0 && $store.state.permission.permissions.k2.hasOwnProperty('k2_b2')">{{ item.name }}</a>
        <a v-else-if = "index == 1 && $store.state.permission.permissions.hasOwnProperty('k1')">{{ item.name }}</a> 
        <a v-else-if = "index == 2 && $store.state.permission.permissions.hasOwnProperty('k2')">{{ item.name }}</a>
        <a v-else-if = "index == 3 && $store.state.permission.permissions.hasOwnProperty('k3')">{{ item.name }}</a>-->
        <a>{{ item.name }}</a>
      </router-link>
    </ul>
</template> 

<script>
export default {
  props: {
    'isShow': 'boolean'
  },
  data () {
    return {
      navLists: [
      //  {
      //   name: '知识树类目',
      //   path: '/treeList',
      //   active: true
      // },
      // {
      //   name: '知识列表',
      //   path: '/releaseList',
      //   active: false
      // },
      // {
      //   name: '知识审核',
      //   path: '/auditingList',
      //   active: false
      // },
      // {
      //   name: '知识中心',
      //   path: '/index',
      //   active: false
      // },
      // {
      //   name: '审核权限',
      //   path: '/auditAuthorityList',
      //   active: false
      // },
    ],
    }
  },
  // watch:{
  //   $route(to,from){
      
  //   }
  // }
  // methods: {
  //   setTitle(name){
  //     document.title = name
  //   }
  // }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .nav {
    background: #232736;
    color: #a3b7d2;
    height: 40px;
    line-height: 40px;
    /*width: 100%;*/
    padding: 0 20px;
  }
  .nav li{
    text-align: center;
    height: 40px;
    line-height: 40px;
    float: left;
    cursor: pointer;
  }
  .nav li:hover a {
    color: #05b7ff;
  }
  .nav li a {
    display: block;
    min-width: 30px;
    padding: 0 15px;
    font-size: 14px;
    color: #a3b7d2;
  }
  .nav li.active {
    background: #000;
  }
  .nav li.active a {
    color: #05b7ff;
  }
</style>
