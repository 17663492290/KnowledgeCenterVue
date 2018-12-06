import Vue from 'vue'

import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import animate from 'animate.css'
import './styles/reset.less';
import Layout from './components/layout';
import VueRouter from 'vue-router';

// import axios from 'axios'
import services from './services'
import IndexPage from './pages/index'
import TreeList from './pages/treeList'
import Release from './pages/release'
import ReleaseList from './pages/releaseList'
import AuditingList from './pages/auditingList'
import AuditAuthorityList from './pages/auditAuthorityList'
import CaseDetails from './pages/caseDetails'
Vue.use(ElementUI);
Vue.use(VueRouter);
Vue.use(services); // api 接口服务
Vue.use(animate); // api 接口服务
// Vue.use(VueQuillEditor, /* { default global options } */)
Vue.config.productionTip = false;
// Vue.use(VueKindEditor);
// Vue.prototype.$http = axios;
let router = new VueRouter({
  mode: 'history',
  srcollBehavior(to,from,savedPosition){
    if(to.hash){
      return {
        selector:to.hash
      }
    }
  },
	routes: [
    {
      path: '/',
      redirect: '/index',
      meta: {
        title: '知识中心'
      }
    },
    { 
      name: 'treeList',
      path: '/treeList',
      component: TreeList,
      meta: {
        title: '知识树类目'
      }
    },
		{
      name: 'index',
      path: '/index',
			component: IndexPage,
      meta: {
        title: '知识中心'
      }
    },
    {
      name: "release",
      path: '/release',
      component: Release,
      meta: {
        title: '知识发布'
      }
    },
    { 
      name: 'releaseList',
      path: '/releaseList',
      component: ReleaseList,
      meta: {
        title: '知识列表'
      }
    },
    { 
      name: 'auditingList',
      path: '/auditingList',
			component: AuditingList,
      meta: {
        title: '知识审核'
      }
    },
    {
      name: 'auditAuthorityList',
      path: '/auditAuthorityList',
			component: AuditAuthorityList,
      meta: {
        title: '审核权限'
      }
    },
    {
      name: 'caseDetails',
      path: '/caseDetails',
      component: CaseDetails,
      meta: {
        title: '文章详情'
      }
    },
  ],
})

router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<Layout/>',
  components: { Layout }
})
