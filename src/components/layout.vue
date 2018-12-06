<template>
  <div class="crm-box">
    <div class="detailnav">
      <div class="topbox">
        <div class="top">
          <div class="logo"></div>
          <div class="logo_text">知识管理</div>
          <div class="right-box">
            <ul>
              <!-- <li class="older"><a>旧版入口</a></li> -->
              <!--<li class="addbox">
                <a class="add"></a>
                <div class="moreadd">
                   <a href="" class="madd">拨打任务</a>
                  <a href="" class="madd">线索</a>
                  <a href="" class="madd">商机</a>
                  <a href="" class="madd">联系人</a>
                </div>
              </li> -->
              <li class="messagebox" @click="messageHover()" :title="lengths>0?'':'暂无消息通知'">
                <a class="message"></a>
                <div v-if = "lengths!=0" class="message-num">{{lengths}}</div>
              </li>
              <!-- <li><a class="news"></a><i class="num">2</i></li> -->
              <li class="moreczbox">
                <a class="user"></a>
                <div class="morecz">
                  <div class="username">
                    <p class="user">{{$store.state.permission.employer.name}}</p>
                    <p class="name">{{$store.state.permission.employer.position}}</p>
                  </div>
                 <!--  <div class="btn">
                    <a href="pw-set.html" class="madd">修改密码</a>
                    <a href="" class="madd">退出登陆</a>
                  </div> -->
                </div>
              </li>
              <li class="wikibox">
           	 	<a class="wiki" href="javascript:void(0);" onclick="JavaScript:window.open('http://wiki.lvzheng.com');"></a>
            </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="navbox">
        <app-nav></app-nav>
      </div>
      <transition enter-active-class="slideInRight" leave-active-class="slideOutRight">
        <div v-show="messageShow" class = "message-wraper scrollBar animated">
          <div class="clear-box"><a class="clear" @click="clear">清空</a><a class="close-all" @click="closeAll">关闭</a></div>
          <ul class="message-list"> 
            <li v-for="item in messages" class="message-item">
              <a href="javascript:void(0)" class="message-close" @click="deleted(item.id)">X</a>
              <h2 class="message-tit" @click="jump(item.id,item.articleId,item.articleType)">{{item.title}}</h2>
              <div class="message-content">{{item.messageContent}}</div>
              <div class="message-time">{{item.createTime}}</div>
            </li>
            <!-- <li class="message-item">
              <a href="javascript:void(0)" class="message-close" @click="deleted">X</a>
              <h2 class="message-tit">《朝阳区孵化器暂停使用》</h2>
              <div class="message-content">李若彤人为你发布的《这个0》很有用，为你点了赞!</div>
            </li> -->
          </ul>
        </div>
      </transition>
    </div>
    <div class="bodybox">
      <keep-alive include='releaseList,treeList,index,auditingList,auditAuthorityList,caseDetails,auditingList'>
        <router-view></router-view>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import appNav from './appNav';
var timer = "";
export default {
  data () {
    return {
      messageShow: false,
      lengths: 0,
      messages:[]
    }
  },
  methods: {
    isOnLogin () {
      document.cookie="ssoid="+"lg3z%2F%2FZn0QRhb6UW1v5mD1xiK5fZvywAfLMSUOJQOBxslueGE6n4bJ6QJkY7Ujc%2B78W5NSqBmzCF%0AOpZFs7OTY2Ly9rg5SqmdkUZ88B6zxfynNClTV1mTpxQlgSfMr0fyZ0RQPstq8xzm1dDTrCghp9Y6%0ATx4rwVyQmLkBbV0LCnCBrQlZDC3YtABaigdyxSSfFt0AytSTVXE%3D";
      //document.cookie="ssoid="+"WIjtZ8W87NtK7ezrjWOmvCPkXMIS3cstv3q4mslg%2B%2FfcFq5VAZho3zvJteypm2AbdiYoqsTjfpt7%0AR0vNOi7kaB9XI9zZ5ei51hiDvPx98dz7WfJluarQj24qrgNeuae1MioEJxg1UYXC8J2%2FYxilLt%2BZ%0AESTO3f5ToVLhNytElAtUEpEV8aJ41tMZrMmSvHlJ5s9s4VlT2Au%2FU2B6vhMNgw%3D%3D";  
      this.$http.get('/api/common/permission').then((res) => {
        if(res.data.code == 0){
          var temporary = res.data.data;
          if(temporary.navLists[temporary.navLists.length-1].name == "知识树类目"){
            temporary.navLists.unshift(temporary.navLists[temporary.navLists.length-1]);
            temporary.navLists.pop(temporary.navLists[temporary.navLists.length-1]);
          }
          this.$store.commit('initPermission',temporary);
        }else{
          window.location.href='http://test.union.lvzheng.com/emp/checklog';
        }
      }, (error) => {
        //window.location.href='http://test.union.lvzheng.com/emp/checklog';
        console.log(error)
      })
    },
    clear(){
      let ip = '/api/message/setMessageStatusAll';
      this.$http.get(ip).then((res) => {
        if(res.data.code == 0){
          this.getMessage()
          this.messageShow = false
        }
      })
    },
    deleted(id){
      let ip = '/api/message/setMessageStatus/'+id;
      this.$http.get(ip).then((res) => {
        if(res.data.code == 0){
          this.getMessage()
        }
      })
    },
    jump(id,arct,types){
      let ip = '/api/message/setMessageStatus/'+id;
      this.$http.get(ip).then((res) => {
        if(res.data.code == 0){
          this.$router.push({path: "/caseDetails",query:{cId:arct,type:types}})
          this.messageShow = false
        }else{
          console.log(res.data.msg)
        }
      })
    },
    getMessage(){
      this.$http.get('/api/message/getMessage').then((res) => {
        if(res.data.code == 0){
          this.messages = res.data.data;
          this.lengths = res.data.data.length;
        }else{
          clearTimeout(timer);
        }
      })
    },
    messageHover(){
      if(this.lengths>0){
        this.messageShow = !this.messageShow
      }
      if(!this.messageShow){
        clearTimeout(timer);
        this.messageCurrent(5000)
      }else{
        this.messageCurrent(1000)
      }
    },
    closeAll(){
      this.messageShow = false
      clearTimeout(timer)
      this.messageCurrent(5000)
    },
    messageCurrent(gap){
      this.getMessage();
      var that = this;
      timer = setTimeout(function() {
        that.messageCurrent(gap)
      }, gap);
    }
  },
  created () {
    this.isOnLogin();
    this.getMessage();
    this.messageCurrent(5000)
  },
  // mounted() {
  //     this.isOnLogin();
  // },
  components: {
    appNav,
  }

}
</script>

<style>
.message-time{
  margin-top: 5px;
  color: #999;
  text-align: right;
}
.close-all{
  margin-left: 12px;
}
.messagebox{
  cursor: pointer;
  position: relative;
}
.message-num{
  position: absolute;
  width: 20px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  top: 10px;
  right: 10px;
  background-color: #f4404e;
  color: #fff;
  border-radius: 20px
}
.message-wraper{
  position: fixed;
  right: 0;
  top: 20vh;
  max-height: 62vh;
  width: 300px;
  z-index: 10;
  border: 1px solid #d2d2d2;
  background-color: #fff;
  border-radius: 5px 0 0 5px;
  box-shadow: -1px -1px 16px #d2d2d2;
  padding: 0 12px 10px;
  overflow-y: auto;
}
.clear-box{
  height: 40px;
  text-align: right;  
  line-height: 40px;
}
.message-item{
  padding: 14px;
  background-color: #f3f8fe;
  position: relative;
  margin-bottom: 12px;
  border-radius: 4px;
}
.clear{
  color: #1972ea;
}
.message-tit{
  font-size: 14px;
  color: #1972ea;
  cursor: pointer;
}
.message-close{
  position: absolute;
  font-size: 14px;
  top: 10px;
  right: 10px;
  color: #abaeb2;
}
.message-content{
  color: #666666;
  font-size: 12px;
  line-height: 22px;
  margin-top: 8px;
}

/*css样式重置*/
html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
article, aside, canvas, details, embed,
figure, figcaption, footer, header, hgroup,
menu, nav, output, ruby, section, summary,
time, mark, audio, video {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
}
.detail_box table, .detail_box tbody, .detail_box tfoot, .detail_box thead, .detail_box tr, .detail_box th, .detail_box td{
  border: 1px solid #ddd;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure,
footer, header, hgroup, menu, nav, section {
  display: block;
}


*{padding:0;margin:0; font-family:"Myriad Pro", "Microsoft Yahei",  "arial",  "Hiragino Sans GB","sans-serif";-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%; }
body{padding:0;margin:0;font-size:12px;font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;color: #333;background:#f0f3f4; overflow-x: hidden;}
img{border:none;}
a{text-decoration:none;cursor:pointer;color:#666;}
a:hover,a:hover {text-decoration:none;color:#55acee;}
input{color: #777;outline: none;}
ul{padding:0;margin:0;list-style:none;}
li,p{padding:0;margin:0;}
.clear{clear:both;}

.left-tree::-webkit-input-placeholder { /* WebKit browsers */color: #ccc;}
.left-tree:-moz-placeholder { /* Mozilla Firefox 4 to 18 */color: #ccc;}
.left-tree::-moz-placeholder { /* Mozilla Firefox 19+ */color: #ccc;}
.left-tree:-ms-input-placeholder { /* Internet Explorer 10+ */color: #ccc;}
/*美化滚动条*/
.left-tree::-webkit-scrollbar {width:5px;}
.left-tree::-webkit-scrollbar-track {-webkit-box-shadow: inset 0 0 6px rgba(209, 199, 199, 0.3); -webkit-border-radius: 10px;border-radius: 10px;}
.left-tree::-webkit-scrollbar-thumb {-webkit-border-radius: 10px;border-radius: 10px;background:rgba(212,212,212,0.7); -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5); }
.left-tree::-webkit-scrollbar-thumb:window-inactive {background: #d4d4d4; }

.bodybox::-webkit-input-placeholder { /* WebKit browsers */color: #ccc;}
.bodybox:-moz-placeholder { /* Mozilla Firefox 4 to 18 */color: #ccc;}
.bodybox::-moz-placeholder { /* Mozilla Firefox 19+ */color: #ccc;}
.bodybox:-ms-input-placeholder { /* Internet Explorer 10+ */color: #ccc;}
/*美化滚动条*/
.bodybox::-webkit-scrollbar {width:5px;}
.bodybox::-webkit-scrollbar-track {-webkit-box-shadow: inset 0 0 6px rgba(209, 199, 199, 0.3); -webkit-border-radius: 10px;border-radius: 10px;}
.bodybox::-webkit-scrollbar-thumb {-webkit-border-radius: 10px;border-radius: 10px;background:rgba(212,212,212,0.7); -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5); }
.bodybox::-webkit-scrollbar-thumb:window-inactive {background: #d4d4d4; }

.treeBox::-webkit-input-placeholder { /* WebKit browsers */color: #ccc;}
.treeBox:-moz-placeholder { /* Mozilla Firefox 4 to 18 */color: #ccc;}
.treeBox::-moz-placeholder { /* Mozilla Firefox 19+ */color: #ccc;}
.treeBox:-ms-input-placeholder { /* Internet Explorer 10+ */color: #ccc;}
/*美化滚动条*/
.treeBox::-webkit-scrollbar {width:5px;}
.treeBox::-webkit-scrollbar-track {-webkit-box-shadow: inset 0 0 6px rgba(209, 199, 199, 0.3); -webkit-border-radius: 10px;border-radius: 10px;}
.treeBox::-webkit-scrollbar-thumb {-webkit-border-radius: 10px;border-radius: 10px;background:rgba(212,212,212,0.7); -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5); }
.treeBox::-webkit-scrollbar-thumb:window-inactive {background: #d4d4d4; }

/*header部分*/
.crm-box{ position:fixed;  top:0;  height:100%;  left:0;  width:100%; min-width:1280px;}
.detailnav{ top: 0px; width: 100%; min-width: 1280px}
.crm-box .topbox{height: 60px;width: 100%;background: #393e51}
.crm-box .topbox .top{/*width: 1200px;margin: 0 auto*/ padding: 0 20px; }
.crm-box .topbox .top .logo{width: 60px;height: 60px; padding-left: 75px; font-size: 20px; line-height: 60px; color: #fff; float: left;background: url(../assets/logo.png) no-repeat center;}
.crm-box .topbox .top .logo_text{width: 90px;height: 60px; padding-left: 35px; font-size: 20px; line-height: 60px; color: #fff; float: left; }
.crm-box .topbox .top .right-box{min-width: 180px;height: 60px;float: right;}
.crm-box .topbox .top .right-box li {float: left;width: 60px;height: 60px;position: relative;}
.crm-box .topbox .top .right-box li i.num{display: inline-block; position: absolute;top: 13px;left: 33px; font-style: normal;font-size: 12px;color: #fff; width: 17px;height: 17px; text-align: center; line-height: 14px; border-radius: 50%; background: #f4404e}
.crm-box .topbox .top .right-box li a{display: inline-block; border-right: 1px solid #4d5263; height: 20px;width: 20px; margin: 20px 0; padding: 0 20px; }
.crm-box .topbox .top .right-box li a.add{background: url(../assets/images/add_ico.png) no-repeat center;}
.crm-box .topbox .top .right-box li a.message{background: url(../assets/images/news_ico.png) no-repeat center;}
.crm-box .topbox .top .right-box li a.news{background: url(../assets/images/news_ico.png) no-repeat center;}
.crm-box .topbox .top .right-box li a.user{background: url(../assets/images/user_ico.png) no-repeat center;}
.crm-box .topbox .top .right-box li a.wiki{background: url(../assets/images/wiki_ico.png) no-repeat center;}
.crm-box .topbox .top .right-box li:last-child a{border-right: 0px}

.crm-box .topbox .top .right-box li.addbox:hover{background: #282b39 url(../assets/images/add_ico.png) no-repeat center;}
.crm-box .topbox .top .right-box li.addbox:hover .moreadd{display: block;}
.crm-box .topbox .top .right-box li.addbox:hover a.add{border-right: none;}

/*.crm-box .topbox .top .right-box li.message:hover{background: #282b39 url(../assets/images/add_ico.png) no-repeat center;}*/
/*.crm-box .topbox .top .right-box li.addbox:hover .moreadd{display: block;}
.crm-box .topbox .top .right-box li.addbox:hover a.add{border-right: none;}*/

.crm-box .topbox .top .right-box li .moreadd{width: 90px;min-height: 1px;padding: 5px 0;background: #282b39;display: none; border-radius: 3px; position: absolute; z-index: 9999}
.crm-box .topbox .top .right-box li .moreadd a.madd{display: block; border: 0px; padding: 0 15px; height: 30px; line-height: 30px; width: 60px;  font-size: 12px;color: #8daaca;margin: 0px}
.crm-box .topbox .top .right-box li .moreadd a.madd:hover{color: #0097e6}

.crm-box .topbox .top .right-box li.moreczbox:hover{background: #282b39 url(../assets/images/user_ico.png) no-repeat center;}
.crm-box .topbox .top .right-box li.oon{background: #282b39 url(../assets/images/user_ico.png) no-repeat center;}
.crm-box .topbox .top .right-box li.moreczbox:hover .morecz{display: block;}
.crm-box .topbox .top .right-box li.moreczbox:hover a.add{border-right: none;}

.crm-box .topbox .top .right-box li .morecz{width: 180px;min-height: 1px;padding: 15px;background: #282b39;display: none; border-radius: 5px; position: absolute; right: 0px; z-index: 999999}
.crm-box .topbox .top .right-box li .morecz .username{padding-left: 45px;min-height: 40px;background: url(../assets/images/username.png) no-repeat center left;}
.crm-box .topbox .top .right-box li .morecz .username p.user{font-size: 12px;color: #fff;line-height: 20px;}
.crm-box .topbox .top .right-box li .morecz .username p.name{font-size: 12px;color: #fff;line-height: 20px;}
.crm-box .topbox .top .right-box li .morecz .btn{padding-left: 35px;}
.crm-box .topbox .top .right-box li .morecz a.madd{border: 0px; padding: 0 5px; height: 30px; line-height: 30px; width: 50px;  font-size: 12px;color: #018BD2;margin: 0px}
.crm-box .topbox .top .right-box li .morecz a.madd:hover{color: #0097e6}


.crm-box .topbox .top .right-box li.older {width: 100px}
.crm-box .topbox .top .right-box li.older a{width: 60px;text-align: center;color:#fff;text-decoration: underline;}
.crm-box .topbox .top .right-box li.older a:hover{color: #0097E6}




/*主体部分css*/
.crm-box .bodybox{position:fixed;  top:100px;  bottom:10px;  left:0;  width: 97%; padding: 0px 1.5%; min-width:1280px; background: #f0f3f4; overflow: auto;margin: 0px auto 0;border-top:1px solid #e5e5e5;}



body.overhidden{overflow: hidden;}
.cf{clear: both}
.blue{color:#0097E6}
.ellipsis{overflow: hidden;text-overflow:ellipsis;white-space: nowrap;}




/*按钮公共样式*/
/*按钮样式重置*/
input,button{ margin:0; padding:0; list-style-type:none;background:none;border-style: none;outline:none;}
/*btn1*/
.btn1 {
  border:1px solid #00aef0;
  border-radius: 4px;
  padding:2px 5px;
  color:#00aef0;
  cursor: pointer;
}
 /*美化滚动条*/
  .scrollBar::-webkit-scrollbar {width:5px;}
  .scrollBar::-webkit-scrollbar-track {-webkit-box-shadow: inset 0 0 6px rgba(209, 199, 199, 0.3); -webkit-border-radius: 10px;border-radius: 10px;}
  .scrollBar::-webkit-scrollbar-thumb {-webkit-border-radius: 10px;border-radius: 10px;background:rgba(212,212,212,0.7); -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5); }
  .scrollBar::-webkit-scrollbar-thumb:window-inactive {background: #d4d4d4; }
</style>
