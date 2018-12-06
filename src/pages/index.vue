<template>
  <div class="sub-router">
    <div class="bHeader" style="height: 50px;line-height: 58px">
      <i></i><span>信息发布 / 信息发布列表（共{{totalValue}}条数据） </span>
      <div class="check-btns"> 
        <el-button v-if = "checkShow" type="text" @click="checkToggle(0)">收起<span class="el-icon-arrow-up el-icon--right"></span></el-button>
        <el-button v-else type="text" @click="checkToggle(1)">展开<span class="el-icon-arrow-down el-icon--right"></span></el-button>
      </div>
    </div>
    <div class="bBody">
      <div class="left scrollBar">
        <el-aside class="parentAside" style="width: auto;">
          <transition name="fade">
            <div v-if="openShow" class="treeBox">
              <div class="treeSearch">
                <el-input placeholder="请输入名称进行搜索" clearable 
                  v-model="filterText" 
                  suffix-icon="el-icon-search">
                </el-input>
              </div>
              <el-tree 
                class="filter-tree" 
                :data="treeData" 
                :props="defaultProps" 
                node-key="id"
                :default-expanded-keys="idArr"
                :filter-node-method="filterNode"
                ref="tree2"
                @node-click="handleNodeClick">
                  <span class="custom-tree-node" :title="node.checked?'取消标签':'设为标签'" v-bind:class="{'custom-tree-sele':node.checked}" slot-scope="{ node, data }">
                  <span :title="node.label" class="custom-content" >{{ node.label }}</span>
                  <span class="btn-content">
                    <el-button icon="el-icon-success" type="text"></el-button>
                  </span>
                </span>
              </el-tree>
            </div>
          </transition>
        </el-aside>
      </div>
      <div class="bBody-content right">
        <el-collapse-transition> 
          <div v-show = "checkShow">
            <div class="catagory-lt" style="margin-top: 15px;">
              <label class="bold">选择城市：</label>
              <div class="input-el" style="width: 22%;margin-right: 2%">
                <el-select 
                  v-model="searchData.provinceCode"
                    @change="choseProvince"
                    placeholder="请选择省份">
                  <el-option
                    v-for="item in province"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code">
                  </el-option>
                </el-select>
              </div>
              <div v-if="shiShow" class="input-el" style="width: 21.5%;margin-right: 2%">
                <el-select
                  v-model="searchData.cityCode"
                  @change="choseCity"
                  placeholder="请选择城市">
                  <el-option
                    v-for="item in city"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code">
                  </el-option>
                </el-select>
              </div>
              <div v-if="quShow" class="input-el" style="width: 21%;margin-right: 2%">
                <el-select
                  v-model="searchData.areaCode"
                  placeholder="请选择地区">
                  <el-option
                    v-for="item in area"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code">
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="catagory-lt" style="margin-top: 15px;">
              <label class='commodityStuta bold'>阅读状态:</label>
              <div class="commodityStuta_Box">
                <span  class="CStuta CSstate" v-for="(item,index) in readingStatus" 
                  :class="{isActive: (index == reading_indexPrev) || (index ==reading_ishover)}"  
                  @click="reading_setStatus(index,item.StatusId)" :key="item.id"
                  @mouseover="reading_ishover = index" @mouseout="reading_ishover = -1">
                    {{item.StatusName}}
                </span>
              </div>
            </div>
              <div class="catagory-lt ">
                <label for="commodityName" class="bold">发布时间：</label>
                <div class="input-el"  style="width:72%">
                  <div class="input-el" style="width:100%">
                    <el-date-picker
                      v-model="dateBetween"
                      type="daterange"
                      @change = "timeChangeing"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期">
                    </el-date-picker>
                  </div>
                </div>
              </div>
              <div class="catagory-lt">
                <label class='commodityStuta bold'>精品状态:</label>
                <div class="commodityStuta_Box">
                  <span  class="CStuta CSstate" v-for="(item,index) in ContentScreening" 
                  :class="{isActive: (index == content_indexPrev) || (index ==content_ishover)}"  
                  @click="content_setStatus(index,item.StatusId)" :key="item.id"
                  @mouseover="content_ishover = index" @mouseout="content_ishover = -1">
                    {{item.StatusName}}
                  </span>
                </div>
              </div>
              <div class="catagory-lt" >
                <label for="commodityName" class="bold">内容搜索：</label>
                <div class="input-el"  style="width:69.8%">
                  <el-input id="commodityName" placeholder="请输入搜索关键词"  suffix-icon="el-icon-search" v-model="search_keyWord" clearable></el-input>
                </div>
              </div>
              <div class="catagory-lt">
                <label class='commodityStuta bold'>发布类型:</label>
                <div class="commodityStuta_Box">
                  <span  class="CStuta" v-for="(item,index) in PublishingType"
                  :class="{isActive: (index == indexPrev) || (index ==ishover)}"
                  @click="setStatus(index,item.StatusId)" :key="item.id"
                  @mouseover="ishover = index" @mouseout="ishover = -1">
                    {{item.StatusName}}
                  </span>
                </div>
                <div class="check-btn"> 
                  <el-button v-show = "checkShow" @click="checkToggle(2)" type="text">清空</el-button>
                </div>
              </div> 
          </div>
        </el-collapse-transition>
        <div v-show="!search_keyWord">
          <el-table ref="multipleTable" 
            v-loading="loading" 
            :data="tableData" 
            tooltip-effect="dark" 
            :height = 'heightCtr'
            style="width: 100%;overflow-y:auto" 
            @select="SelectionChange"
            @select-all="SelectionChange">
            <el-table-column width="14"></el-table-column>
            <el-table-column label="标题" show-overflow-tooltip>
              <template slot-scope="scope">
              <!--   <router-link v-if="scope.row.type==0"  class="blue" :to="{path: `/auditingDetails`,query:{cId:scope.row.id}}"> -->
                  <!-- span v-if="scope.row.hot==1">{{scope.row.title}}<span class="jing"></span> </span>
                  <span v-else-if="scope.row.hot==0">{{scope.row.title}}</span> -->
        <!--         </router-link> -->
                <router-link class="blue" tag="a" target="_blank" :to="{path: `/caseDetails`,query:{cId:scope.row.id,type:scope.row.type}}">
                  <span :class="{jing:scope.row.hot == 1}">{{scope.row.title}}</span>
                </router-link>
              </template>
            </el-table-column>
            <el-table-column label="发布类型">
              <template slot-scope="scope">
                <span v-if="scope.row.type == 0">知识分享</span>
                <span v-else-if="scope.row.type == 1">案例分享</span>
              </template>
            </el-table-column>
            <el-table-column  label="状态">
              <template slot-scope="scope">
                <span v-if="scope.row.visit==false" style="color:#ff3030">未读</span>
                <span v-else-if="scope.row.visit==true">已读</span>
              </template>
            </el-table-column>
            <el-table-column prop="visitNum" label="浏览量"></el-table-column>
            <el-table-column prop="userName" label="发布人"></el-table-column>
            <el-table-column  label="发布时间" width = "230">
                <template slot-scope="scope">
                  <span>{{scope.row.publichTime}}</span>
                </template>
            </el-table-column>          
            <el-table-column label="有用" >
              <template slot-scope="scope">
                <span class="icon" type="text" size="small"  @click="GiveUp(scope.row)" ><span :class="scope.row.like?'icon_up':'iconImg'"></span>{{scope.row.likeNum}}</span>
              </template>
            </el-table-column>
            <el-table-column label="无用">
              <template slot-scope="scope">
                <span type="text" size="small"  @click="treadOn(scope.row)" ><span :class="scope.row.tread?'icon_down':'iconImg2'"></span>{{scope.row.treadNum}}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-show="search_keyWord" class="list_box scrollBar" v-bind:style="{height:heightCtr}">
          <ul>
            <li v-for="item in tableData" :key="item.index">
              <router-link tag="a" target="_blank" :to="{path: `/caseDetails`,query:{cId:item.id,type:item.type}}">
                <h1 v-html="item.title"><i class=""></i></h1>
                <div v-if = "item.type == 1" class="list_content">
                  <div v-html = "item.caseBackground"></div>
                  <div v-html = "item.solution"></div>
                </div>
                <div v-if = "item.type == 0" v-html = "item.content" class="list_content"></div>
              </router-link>
              <div class="list-icons">
                <el-row class="line3">
                  <el-col :span="3">
                    <i class="icon icon_3"></i><span>{{item.publichTime}}</span>
                  </el-col>
                  <el-col :span="2">
                    <i class="icon icon_5"></i><span>{{item.userName}}</span>
                  </el-col>
                  <el-col :span="1" >
                    <i class="icon icon_2"></i><span>{{item.visitNum}}</span>
                  </el-col>
                  <el-col :span="1" style="cursor:pointer;">
                    <div @click="GiveUp(item)">
                      <i class="icon" :class="item.like?'icon_up2':'icon_4'"></i><span>{{item.likeNum}}</span>
                    </div>
                  </el-col>
                  <el-col :span="1" >
                    <div @click="treadOn(item)">
                      <i class="icon" :class="item.tread?'icon_down2':'icon_1'"></i><span>{{item.treadNum}}</span>
                    </div>
                  </el-col>
                </el-row> 
              </div>
            </li>
          </ul>
          <div v-if="tableData == false" class = "no-data">暂无数据</div>
        </div>
        <div class="bottomBox clearfix">
          <div v-if="tableData && (tableData[0] != undifined)" class="bBody-pagination">
            <el-pagination
              @size-change="pageSizeChange"
              @current-change="pageCurrentChange"
              :current-page.sync="currentPage"
              :page-sizes="pageSizes"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalValue">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    created (){
      this.getData();
      this.getTreeData();
      this.getProvince();
      this.choseProvince('110000');
      this.choseCity('e','110000_110100');
    },
    data () {
      return {
        searchData: {
          provinceCode: '110000',
          cityCode: '',
          areaCode: '',
          state: '-1',
          startTime: '', 
          endTime: '', 
          key: '', 
          categoryIds: [],
        },
        checkShow: true,
        status:'-1',
        hot:'1',//精品状态
        type:'-1',
        likeUp:false,
        ab:3,
        search_keyWord:'',
        content_indexPrev:1,
        content_ishover: -1,
        reading_indexPrev:0,
        reading_ishover: -1,
        indexPrev:0,
        ishover: -1,
        commodityCategory: '',
        commodityName: '',
        GGAttrform:{
          attrCheckList:[]
        },
        tableData: [],
        PublishingType:[
          {
           StatusName:"全部",
           isActive: true,
           StatusId: -1
          },
          {
           StatusName:"知识分享",
           isActive: false,
           StatusId: 0
          },
          {
           StatusName:"案例分享",
           isActive: false,
           StatusId: 1
          }, 
        ],
        readingStatus:[
           {
             StatusName:"全部",
             isActive: true,
             StatusId: -1
            },
            {
             StatusName:"未读",
             isActive: false,
             StatusId: 0
            },
            {
             StatusName:"已读",
             isActive: false,
             StatusId: 1
            }, 
        ],
        ContentScreening:[
          {
            StatusName:"全部",
            isActive: false,
            StatusId: -1
          },
          {
            StatusName:"精品",
            isActive: true,
            StatusId: 1
          }, 
          {
            StatusName:"非精品",
            isActive: false,
            StatusId: 0
          }   
        ],
        options: [],
        city_value: [],
        comState:'',
        setStateIdList:[],
        linestateIdlist:[],

        pageSizes: [10, 15, 30, 40],
        pageSize: 10,
        currentPage: 1,
        totalValue: 0,
        loading: false,

        dialogShow:false,
        dialogVisible:false,
        priceDialogShow:false,
        dialogTableVisible:false,
        dialog:false,
        rowCategoryId:'',
    
        openShow:true,
        treeData: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        filterText: '',
        dateBetween: '',
        province: [],
        city: [],
        area: [],
        shiShow: true,
        quShow: true,
        categoryId:'',
        idArr: [],
        heightCtr: 'calc(100vh - 367px)'
      }
    },
    mounted(){
      if (document.querySelector('.el-table__body-wrapper')) {
        var that = this;
        document.querySelector('.el-table__body-wrapper').onscroll = function(){
          that.checkShow = false
        }
      }
      if (document.querySelector('.list_box')) {
        var that = this;
        document.querySelector('.list_box').onscroll = function(){
          that.checkShow = false
        }
      }
    },
    watch: {
      filterText(val) {
        this.$refs.tree2.filter(val);
      },
      search_keyWord(val){
        this.getData()
      },
      checkShow(val){
        if(val){
          this.heightCtr = 'calc(100vh - 367px)'
        }else{
          this.heightCtr = 'calc(100vh - 230px)'
        }
      }
    },
    methods: {
      // material(index,row){
      //   this.$router.push({path:'/commodityList/material',query: {cId: row.id}});
      // },
      //精品状态
      content_setStatus(index,status){
        this.content_indexPrev=index;
        this.hot=status;
        //console.log(this.hot)
        this.getData();
      },
      //内容搜索
      reading_setStatus(index,status){
         this.reading_indexPrev=index;
         this.status = status
         this.getData();
      },
      //发布类型
      setStatus(index,status){
         this.indexPrev=index;
         this.type=status;
         this.getData()
      },
      //初始化列表数据
      getData () {
        let ip = `/api/article/visit/list/${this.currentPage}/${this.pageSize}`;
        // this.$store.commit('setBid','1340');
        this.loading = true;
        this.$http.post(ip,{
          categoryIds: this.searchData.categoryIds.join(","),
          provinceCode: this.searchData.provinceCode,
          cityCode: this.searchData.cityCode,
          areaCode: this.searchData.areaCode,
          state:this.status,
          startTime:this.searchData.startTime,
          endTime:this.searchData.endTime,
          hot:this.hot,
          key:this.search_keyWord,
          type:this.type,
          bid: '2032'
        })
        .then((res) => {
          this.loading = false;
          this.tableData = res.data.data.data;
          this.totalValue = res.data.data.total;
        }, (err) => {
          this.loading = false;
          console.log(err);
        })
      },
      search () {
        this.getData();
      },
      //弹框确定按钮
      setComState (state){
        this.comState = state;  
        this.ab = 0 
      },
      //弹框取消按钮
      cancel (){
        this.lineFlag = false;
        this.dialogShow = false;
        // this.setStateIdList = [];
        this.comState = '';
      },
      //类目树数据请求
        // let loading = this.$loading({
        //   lock: true,
        //   text: 'Loading',
        //   spinner: 'el-icon-loading',
        //   background: 'rgba(0, 0, 0, 0.7)'
        // });
       
      //类目树数据请求
      getTreeData(){
        //this.$store.commit('setBid','1340');
        this.loading = true;
        this.$http.get('/api/category/getCategories',{headers: {'bid': '2032'}})
        .then((res) => {
          this.loading = false;
          this.treeData = res.data.data;
          this.treeData.forEach(m => {
            this.idArr.push(m.id)
          })
        }, (err) => {
          console.log(err);
        })     
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      handleNodeClick (data, node, self) {
        //this.$store.commit('setBid','1340');
        // 树节点的点击事件
        if (node.isLeaf==true) {
          this.searchData.categoryIds = [];
          if(node.checked == 1){
            node.checked = 0
          }else{
            if(this.$refs.tree2.getCheckedNodes() != false){
              for(var key in this.$refs.tree2.getCheckedNodes()){
                if(this.$refs.tree2.getNode(this.$refs.tree2.getCheckedNodes()[key].id).checked == 1){
                  this.$refs.tree2.getNode(this.$refs.tree2.getCheckedNodes()[key].id).checked = 0
                }
              }
            }
            node.checked = 1
            this.searchData.categoryIds.push(data.id);
          }
        }
        this.getData();
      },
      checkToggle(type){
        if(type != 2){
          this.checkShow = !this.checkShow
        }
        if (type == 2){
          this.searchData.provinceCode = "110000",
          this.searchData.cityCode = "",
          this.searchData.areaCode = "",
          this.indexPrev = 0,
          this.dateBetween = "",
          this.publishing_indexPrev = 0,
          this.searchData.startTime = "", 
          this.searchData.endTime = "",
          this.content_indexPrev = 1, 
          this.search_keyWord = "",
          this.searchData.key = "", 
          this.reading_indexPrev = 0,
          this.searchData.categoryIds = []
        }
        this.getData();
        this.getTreeData();
      },
      //多选框触发事件
      SelectionChange (selection,row){
        let arr = [];
        selection.forEach(function(item,index) { 
          arr.push(item.id)
        });
        this.setStateIdList = arr;
      },
      //省份筛选
      getProvince(){
        // this.$store.state.bid = '1320';
        var ip = '/api/common/region/province';
        // this.$http.get(ip,{headers: {'bid':  this.$store.state.bid}})
        this.$http.get(ip,{params:{
            code: 0,
            bid: '2032'
          }}).then((res) => {
           /* loading.close();*/
            this.province = res.data.data
          }, (err) => {
            console.log(err)
        })
      },
      //省份筛选
      choseProvince:function(code) {
        var ip = '/api/common/region/city';
        this.area = [];
        if(this.searchData.provinceCode == "-1"){
          this.searchData.cityCode = "";
          this.searchData.areaCode = "";
          this.shiShow = false;
          this.quShow = false
        }else{
          if(code){
            var code = code
          } else {
            var code = this.searchData.provinceCode
          }
          this.$http.get(ip,{params:{
            code: code,
            bid: '2032'
          }}).then((res) => {
             /* loading.close();*/
              res.data.data.length == 0?(this.shiShow=false,this.quShow=false):(this.city = res.data.data,this.shiShow=true,this.quShow=true)
              this.searchData.cityCode = ""
              this.searchData.areaCode = ""
            }, (err) => {
              console.log(err)
          })
        }
        this.getData();
      },
      //城市筛选
      choseCity:function(defa,s) {
        var ip = '/api/common/region/area';
        if(this.searchData.cityCode == "-1"){
          this.searchData.areaCode = "";
          this.quShow=false;
        }else{
          if(s){
            var s = s
          } else {
            var s = this.searchData.provinceCode + '_' + this.searchData.cityCode
          }
          this.$http.get(ip,{params:{
            code: s,
            bid: '2032'
          }}).then((res) => {
             /* loading.close();*/
              res.data.data.length == 0?this.quShow = false:(this.area = res.data.data,this.quShow = true);
              this.searchData.areaCode = ""
            }, (err) => {
              console.log(err)
          })
        }
        this.getData();
      },
      //地区筛选
      choseArea:function(e) {
        this.getData();
      },
      pageSizeChange(val) {
        this.pageSize =val;
        //console.log(`每页 ${val} 条`);
      },
      pageCurrentChange(val) {
        this.currentPage = val;
         this.getData()
      },
      //发布时间
      //时间筛选
      timeChangeing(){
        if(this.dateBetween){
          this.searchData.startTime = this.dateBetween[0];
          this.searchData.endTime = this.dateBetween[1]
        }else{
          this.searchData.startTime = "";
          this.searchData.endTime = ""
        }
        this.getData();
      }, 
      //点赞
      GiveUp(row){
        if(row.like == false&&row.tread == false){
          let ip = `/api/article/praise/`+row.id+"/1/1"
          this.$http.post(ip,{bid: '2030'}).then((res) => {
            if(res.data.code==0){
              this.$message({
                type: 'success',
                message: "点赞成功"
              });
              this.getData();
            }else{
              this.$message({
                type: 'error',
                message: res.data.msg
              });
              return
            }
          }, (err) => {
            console.log(err);
          })
        }else if(row.like == false && row.tread == true){
          this.$message({
            type: 'error',
            message: "操作失败,您已将此文章标记为无用,请先取消踩"
          });
        }else if(row.like == true && row.tread == false){
          let ip = '/api/article/praise/' + row.id + '/1/2'
          this.$http.post(ip,{bid: '2030'}).then((res) => {
            if(res.data.code==0){
              this.$message({
                type: 'success',
                message: "取消点赞成功"
              });
              this.getData();
            }else{
              this.$message({
                type: 'error',
                message: res.data.msg
              })
            }
          }, (err) => {
            console.log(err);
          })
        }
      },
      //踩
      treadOn(row){
        if(row.like == false && row.tread == false){
          let ip = '/api/article/praise/' + row.id + "/2/1"
          this.$http.post(ip,{bid: '2030'}).then((res) => {
            if(res.data.code == 0){
              this.$message({
                type: 'success',
                message: "设为无用成功"
              });
              this.getData();
            }else{
              this.$message({
                type: 'error',
                message: res.data.msg
              });
            }
          }, (err) => {
            console.log(err);
          })
        }else if(row.like == true && row.tread == false){
          this.$message({
            type: 'error',
            message: '操作失败,您已将此文章标记为有用,请先取消赞'
          });
        }else if(row.like == false && row.tread == true){
          let ip = '/api/article/praise/' + row.id + '/2/2'
          this.$http.post(ip,{bid: '2030'}).then((res) => {
            if(res.data.code == 0){
               this.$message({
                type: 'success',
                message: "取消无用成功"
              });
              this.getData();
            }else{
              this.$message({
                type: 'error',
                message: res.data.msg
              });
            }
          },(err) => {
            console.log(err);
          })
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  .el-date-editor--daterange.el-input__inner{
    width:0px;
    width:97%;
    line-height: 14px;
  }
  .CSstate:nth-child(3){
    padding-left: 44px
  }
  .no-data{
    text-align: center;
    height: 60px;
    line-height: 60px;
    border-top: 1px solid #ccc;
    font-size: 14px;
    color: #909399;
  }
  .bHeader{
    box-sizing: border-box;
    height: 50px;
    line-height: 58px;
  }
  .custom-tree-node {
    display: inline-block;
    width: 100%;
    line-height: 27px;
    padding-left: 10px;
    .btn-content {
      position: absolute;
      right: 0px;
    }
    .el-button {
      padding: 2px 0px;
    }
  }
  .jing{
    display: inline-block;
    padding-left: 22px;
    background: url(../assets/images/jing.png) no-repeat left top;
  }
  .list_box{
    border-top: 2px solid #ccc;
    float: left;
    width:100%;
    overflow-y: auto
  }
  .check-btn{
    float:right;
    .el-button{
      margin-left:5px;
      padding: 2px 4px;
    }
  }
  .check-btns{
    float: right;
    height: 50px;
  }
  .sub-router{
    position: fixed;
    top: 102px;
    left: 1.5%;
    width: 97%;
    right: 0;
    min-width: 1280px;
    overflow: hidden;
  }
  .left{
    width:18%;
    box-sizing: border-box;
    height:calc(100vh - 162px);
    background-color: #f8fdff;
    overflow: auto;
  }
  .right{
    position: absolute;
    left: 18%;
    width: 82%;
    top: 50px;
    height:calc(100vh - 162px);
    box-sizing: border-box;
  }
  .el-tree {
    background: #f8fdff;
  }
  .treeBox .treeSearch{
    margin-bottom:20px;
  }
  .custom-tree-node {
    display: inline-block;
    width: 100%;
    line-height: 27px;
    padding-left: 10px;
    .btn-content {
      position: absolute;
      right: 0px;
    }
    .el-button {
      padding: 2px 0px;
    }
  }
  .focus{
    color: #409EFF;
    border-color: #c6e2ff;
    background-color: #ecf5ff;
  }
  .bBody{background-color: #fff;}
  .bBody-nav{padding:7px 15px 7px;background-color:#fffeed;}
  .bBody-content{ border:1px solid #e5e5e5;}
  /*.bBody-content .category{
    float:left;
    background-color: #fff;
    border-bottom: 1px solid #e5e5e5; 
    padding: 15px 0 0 0;  
    position: relative;
    width: 100%;
   }*/
  /*.bBody-content .category:before{content:"";display: table;}*/
  .catagory-lt,.catagory-mid,.catagory-rt{margin-top: 25px;display: inline-block;}
  .catagory-lt { line-height: 30px; height:31px;}
  .catagory-lt{
    width: 46%;
    margin: 0 1% 8px 2%;
    .input-el{
      height:31px;
    }
    .commodityStuta_Box{
      height: 31px;
    }
  }
  .catagory-lt label{
    display: inline-block;
  }
  .catagory-lt div{
    display: inline-block;
  }
 .catagory-lt2{
    margin:25px 0px 0 0px;
    display: flex;
    float: left;
    width:120px;
    line-height: 30px;
  }
  .clearfix:after{
    visibility:hidden;
    display:block;
    font-size:0;
    content: " ";
    clear:both;
    height:0;
  }
  .clearfix{
    *zoom:1;
  }
  .bBody-pagination{
    position: fixed;
    bottom: 10px;
    right: 30px;
    background-color: #fff;
    padding:17px;
    text-align: center;
  }
  .CStuta{
    padding-left: 20px;
    cursor: pointer;
  }
  .parentAside{
    padding:22px;
  }
  .openBtn{
    float:left;
    width:8px;
    height:100%;
    display :flex;
    display:-webkit-flex;
    align-items:center;
    -webkit-align-items:center; 
    justify-content:center; 
    padding:1px;
    text-align:center;
    background-color:#eee;
    color:#aaa;
    border-radius: 3px;
    cursor: pointer;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    width:0px;
  }
  .list_box{
    li{
      border-bottom:1px solid #f0f0f0;
      padding:20px 0;
      margin: 0 30px;
    }
    h1{
      font-size:18px;
    }
    .list_content{
      font-size:12px;
      margin:16px 0;
      line-height:22px;
      overflow : hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }
    .list-icons{
      color: #aaa;
      font-size: 14px;
    }
    .line3{
      span{
        line-height:20px;
      }
       .icon{
          display: inline-block;
          width:15px;
          height:15px;
          vertical-align: middle;
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
      .icon_up{
        display: inline-block;
        width:15px;
        height:15px;
        background: url(../assets/images/icon_up.png) no-repeat center;
        background-size:contain;
      }
      .icon_5{
          background: url(../assets/images/icon5.png) no-repeat center;
          background-size:contain;
      }
    } 
  }
  .iconImg{
    cursor: pointer;
    display:inline-block;
    width:15px;
    height:15px;
    background:url(../assets/images/icon4.png) no-repeat
  }
  .icon_up2{
    cursor: pointer;
    display:inline-block;
    width:25px;
    height:25px;
    background:url(../assets/images/icon_up.png) no-repeat center
  }
  .icon_up{
    cursor: pointer;
    display: inline-block;
    width:15px;
     height:15px;
    background:url(../assets/images/icon_up.png) no-repeat center
  }

  .iconImg2{
    cursor: pointer;
    display:inline-block;
    width:15px;
    height:15px;
    background:url(../assets/images/icon1.png) no-repeat
  }
  .icon_down{
    cursor: pointer;
    display:inline-block;
    width:15px;
    height:15px;
    background:url(../assets/images/icon_down.png) no-repeat center
  }
  .icon_down2{
    cursor: pointer;
    display:inline-block;
    width:25px;
    height:25px;
    background:url(../assets/images/icon_down.png) no-repeat center
  }
  .bottomBox{
    float:  left;
    background-color: #fff;
    width: 100%;
  }
  .bBody-none{
    text-align: center;
    padding: 20px 0;
    font-size: 14px;
    color: #ccc;
  }
</style>
