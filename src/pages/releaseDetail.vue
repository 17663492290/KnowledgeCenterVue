
<template>
  <div class="content-body">
    <el-container>
        <el-main>
            <el-row class="line1">
                <el-col :span="13" >
                  <h1 >近期总结的政策变化通知及销售签单注意事项</h1>
                </el-col>
            </el-row>
            <el-row class="line2">
                <el-col :span="2" >
                    <span class="tab1">公司变更</span>
                </el-col>
                <el-col :span="2" >
                    <span class="tab2">注册地址</span>
                </el-col>
                <el-col :span="2" style="text-align:center" >
                    <i class="icon icon_3"></i><span>2017-1-12</span>
                </el-col>
                <el-col :span="2" style="text-align:center" >
                    <i class="icon icon_5"></i><span>唐博涵</span>
                </el-col>
                <el-col :span="1" >
                    <i class="icon icon_2"></i><span>203</span>
                </el-col>
                <el-col :span="1" >
                    <i class="icon icon_4"></i><span>34</span>
                </el-col>
                <el-col :span="1" >
                    <i class="icon icon_1"></i><span>3</span>
                </el-col>
                <el-col :span="2" >
                  <el-button type="primary" size="mini"  plain >编辑</el-button>
                </el-col>
                <el-col :span="5" style="position:relative" >
                    <i class="result_icon toAudited"></i>
                </el-col>
            </el-row> 
            <el-row>
                <el-col :span="24" >
                    <div class="line_body">
                        风刀霜剑空间等到风景宽松的艰苦飞机离开的时间飞快垃圾堵塞了看见反对苏联空军阿多撒离开解放离开的时间离开分距离迪斯科解放立刻几多撒离开解放立刻就打算飞洒发生的 第三方的的 第三方的手多少  大幅杀跌多少电费大幅度分啊啊地方撒
                    </div>
                </el-col>
            </el-row> 
        </el-main>
        <el-aside>
           <div class="aside_content">
                <div>
                    <div class="title_box">
                        <label>浏览记录 </label>
                        <el-input class="search" style="" placeholder="请输入用户名" clearable 
                            v-model="filterText" 
                            suffix-icon="el-icon-search">
                        </el-input>
                    </div>
                    <div class="content_box">
                        <ul>
                            <li class="title">
                                <span>浏览时间</span>
                                <span class="name">浏览人</span>
                            </li>
                            <li>
                                <span>2018-10-23 10:22</span>
                                <span class="name">范冰冰</span>
                            </li>
                            <li>
                                <span>2018-10-23 10:22</span>
                                <span class="name">刘晓庆</span>
                            </li>
                            <li>
                                <span>2018-10-23 10:22</span>
                                <span class="name">范冰冰</span>
                            </li>
                        </ul>
                    </div>
                </div>
                 <div>
                    <div class="title_box">
                        <label>操作记录 </label>
                    </div>
                    <div class="content_box2">
                        <ul>
                            <li class="title">
                                <span>浏览时间</span>
                                <span class="name">浏览人</span>
                            </li>
                            <li>
                                <span>2018-10-23 10:22</span>
                                <span class="name">范冰冰</span>
                            </li>
                            <li>
                                <span>2018-10-23 10:22</span>
                                <span class="name">刘晓庆</span>
                            </li>
                            <li>
                                <span>2018-10-23 10:22</span>
                                <span class="name">范冰冰</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </el-aside>
    </el-container>
  </div>
</template>

<script>

  export default {
    activated (){

    },
    data () {
      return {
      
      }
    },
    computed: {
       
    },
    watch: {
    
    },
    methods: {

    }
  }
</script>

<style lang="less" scoped>
  .crm-box .content-body {
    
    background: #fff;
}
  .el-aside {
 
    color: #333;
    text-align: center;
    
  }
  
  .el-main {
    
    color: #333;
    // text-align: center;
    
  }
  
  body > .el-container {
    margin-bottom: 40px;
  }
  .line1{
    margin-top:20px;
    margin-bottom:20px;
    line-height:30px;
  }
  .line1 h1{
      font-size:22px;
      font-weight: 600;
    //text-align: center;
  }
  .line2{
    margin-top:20px;
    line-height:30px;
    padding-bottom:15px;
    border-bottom:1px solid #f0f0f0;
    .tab1{
        background-color: #ffd7d7;
        color:#ff3131;
        padding:0px 0px;
        border-radius: 5px;
        display:inline-block;
        width:90%;
        text-align: center;
    }
    .tab2{
        background-color: #d3e4fb;
        color:#67686a;
        padding:0px 0px;
        border-radius: 5px;
        display:inline-block;
        width:90%;
        text-align: center;
    }
    .icon{
        display: inline-block;
        width:15px;
        height:15px;
        vertical-align: middle;
        margin-left:5px;
        margin-right:3px;
    }
    .icon_1{
        background: url(../assets/images/icon1.png) no-repeat center;
        background-size:contain;
    }
    .icon_2{
        background: url(../assets/images/icon2.png) no-repeat center;
        background-size:contain;
    }
    .icon_3{
        background: url(../assets/images/icon3.png) no-repeat center;
        background-size:contain;
    }
    .icon_4{
        background: url(../assets/images/icon4.png) no-repeat center;
        background-size:contain;
    }

    .icon_5{
        background: url(../assets/images/icon5.png) no-repeat center;
        background-size:contain;
    }
    .result_icon{
        display: inline-block;
        width:140px;
        height:140px;
        vertical-align: middle;
        margin-left:5px;
        margin-right:3px;
        position: absolute;
        left:110px;
        top:-73px    
    }
    .toAudited{
        background: url(../assets/images/toAudited.png) no-repeat center;
        background-size:contain;
    }

  }
  .aside_content{
      width:90%;
      margin:40px 0;
      .title_box{
          background-color: #83a3d2;
          height:45px;
          text-align:left;
          padding-left: 12px;
          label{
              color:#fff;
              font-size:13px;
              display: inline-block;
              width:22%;
              padding:7px 0;
              line-height:30px;
          }
          .search{
              background-color: #fff;
              width:70%;
              margin-top:7px;
              border-radius: 3px;
          }
      }
      .content_box{
          border:1px solid #83a3d2;
          text-align: left;
          .title{
              background-color: #f2f2f2;
          }
          li{
              padding:0 15px;
              height:30px;
              line-height:30px;
              .name{
                 float:right;
              }
          }
      }
      .content_box2{
          border:1px solid #83a3d2;
          text-align: left;
          .title{
              background-color: #f2f2f2;
          }
          li{
              padding:0 15px;
              height:30px;
              line-height:30px;
              .name{
                 float:right;
              }
          }
      }
  }
  .line_body{
        padding:30px;
        font-size:13px;
      }
</style>
