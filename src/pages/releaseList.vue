<template>
  <div class="sub-router">
    <div class="bHeader">
      <i></i><span>信息发布 / 信息发布列表（共{{totalValue}}条数据） </span> 
      <div class="check-btns"> 
        <el-button v-if = "checkShow" type="text" @click="checkToggle(0)">收起<span class="el-icon-arrow-up el-icon--right"></span></el-button>
        <el-button v-else type="text" @click="checkToggle(1)">展开<span class="el-icon-arrow-down el-icon--right"></span></el-button>
      </div>
      <el-button v-if="$store.state.permission.permissions.hasOwnProperty('k1') && $store.state.permission.permissions.k1.hasOwnProperty('k1_b2')" class="public-new" type="primary" @click="publicNew">发布新文章</el-button>
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
            <div class="catagory-lt my-catagory-lt" style="margin-top: 15px;">
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
            <div v-if="shiShow" class="input-el" style="width: 22%;margin-right: 2%">
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
            <div v-if="quShow" class="input-el" style="width: 21.4%;margin-right: 2%">
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
          
          <div class="catagory-lt my-catagory-lt" style="margin-top: 15px;">
            <label class='commodityStuta bold'>发布类型:</label>
            <div class="commodityStuta_Box">
              <span  class="CStuta" v-for="(item,index) in PublishingType"
                :class="{isActive: (index == indexPrev) || (index ==ishover)}"
                @click="setStatus(index)" :key="item.id"
                @mouseover="ishover = index" @mouseout="ishover = -1">
                  {{item.StatusName}}
              </span>
            </div>
          </div>
            <div class="catagory-lt ">
              <label class="bold">发布时间：</label>
              <div class="input-el" style="width:70.5%">
                <el-date-picker
                  v-model="dateBetween"
                  width="100%"
                  type="daterange"
                  @change = "timeChangeing"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </div>
            </div>
            <div class="catagory-lt my-catagory-lt">
              <label class='commodityStuta bold'>发布状态:</label>
              <div class="commodityStuta_Box">
                <span  class="CStuta CSstate" v-for="(item,index) in PublishingStatus"
                  :class="{isActive: (index == publishing_indexPrev) || (index ==publishing_ishover)}"
                  @click="publishing_setStatus(index)" :key="item.id"
                  @mouseover="publishing_ishover = index" @mouseout="publishing_ishover = -1">
                    {{item.StatusName}}
                </span>
              </div>
            </div>
            <div class="catagory-lt my-catagory-lt">
              <label for="commodityName" class="bold">内容搜索：</label>
              <div class="input-el" style="width:70.7%">
                <el-input id="commodityName" placeholder="请输入搜索关键词" suffix-icon="el-icon-search" v-model="keys" clearable></el-input>
              </div>
            </div>
            <div class="catagory-lt" style="text-align: right">
              <div class="check-btn"> 
                <el-button v-show = "checkShow" @click="checkToggle(2)" type="text">清空</el-button>
              </div>
            </div>
           </div>
        </el-collapse-transition>
        <el-table ref="multipleTable" 
          v-loading="loading" 
          :data="tableData" 
          tooltip-effect="dark" 
          :height = 'heightCtr'
          style="width: 100%;overflow-y:auto" 
          >
          <el-table-column width="20" height="0"></el-table-column>
          <el-table-column label="标题" width="130">
              <template slot-scope="scope">
                {{scope.row.title}}
              </template>
          </el-table-column>
          <el-table-column prop="regionName" label="城市区域" width="130"></el-table-column>
          <el-table-column prop="typeName" label="发布类型" width="82"></el-table-column>
          <el-table-column prop="stateName" label="状态" width="82"></el-table-column>
          <el-table-column label="发布时间/审核时间" width="168">
            <template slot-scope="scope">
              {{scope.row.publichTime}}</br>
              {{scope.row.checkTime}}
            </template>
          </el-table-column>
          <el-table-column prop="userName" label="发布人" width="82"></el-table-column>
          <el-table-column prop="checkName" label="审核人" width="82"></el-table-column>
          <el-table-column prop="visitNum" label="浏览量" width="66"></el-table-column>
          <el-table-column prop="likeNum" label="有用" width="66"></el-table-column>
          <el-table-column prop="treadNum" label="无用" width="66"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button v-if="$store.state.permission.permissions.hasOwnProperty('k1') && $store.state.permission.permissions.k1.hasOwnProperty('k1_b1')" plain type="primary" :disabled = "scope.row.state == 1?false:true" size="mini" @click="backPublic(scope.$index, scope.row,0)" style="margin-left:10px;margin-bottom: 6px">撤回</el-button>
              <el-button v-if="$store.state.permission.permissions.hasOwnProperty('k1') && $store.state.permission.permissions.k1.hasOwnProperty('k1_b2')" plain type="primary" size="mini" :disabled = "scope.row.state == 0?false:true" v-html="scope.row.state == 0?'发布':'已发布'" @click="backPublic(scope.$index, scope.row,1)" style="margin-bottom: 6px"></el-button>
              <el-button plain type="primary" size="mini" @click="edit(scope.$index, scope.row)" :disabled = "scope.row.state == 1?true:false" style="margin-bottom: 6px">编辑</el-button>
              <!-- <el-button v-if="$store.state.permission.permissions.k2.hasOwnProperty('k1_b3')" plain type="primary" size="mini" @click="edit(scope.$index, scope.row)" style="margin-bottom: 6px">编辑</el-button> -->
            </template>
          </el-table-column>
        </el-table>
        <div class="bBody-pagination">
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
  <!--   <el-dialog :visible.sync="public_confirm" :modal-append-to-body="false" width="30%" top="40vh">
      <div class = "dialog-sele" v-if="public_state==0">确认发布么?</div>
      <div class = "dialog-sele" v-else>确定撤回么?</div>
      <span slot="footer">
        <el-button @click="public_confirm = false">取 消</el-button>
        <el-button type="primary" @click="backPublicConfirm">确 定</el-button>
      </span>
    </el-dialog> -->
    <el-dialog
      title = '确认信息'
      :visible.sync="public_confirm"
      width="30%"
      :close-on-click-modal="true"
      :modal-append-to-body="false">
      <div style="width:100%;max-height:60vh;">
        <div class = "dialog-sele" v-if="public_state==0">确认发布么?</div>
        <div class = "dialog-sele" v-else>确定撤回么?</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="public_confirm = false">取 消</el-button>
        <el-button type="primary" @click="backPublicConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    created (){
      this.getTreeData();
      this.getData();
      this.getProvince();
      this.choseProvince('110000');
      this.choseCity('e','110000_110100');
    },
    data () {
      return {
        checkShow: true,
        pubulicId: "",
        public_confirm: false,
        public_state: 0,
        publishing_indexPrev:0,
        publishing_ishover: -1,
        content_indexPrev:0,
        content_ishover: -1,
        reading_indexPrev:0,
        reading_ishover: -1,
        ishover: -1,
        GGAttrform:{
          attrCheckList:[]
        },
        GGAttrData:[],
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
        readingType:[
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
        PublishingStatus:[
          {
             StatusName:"全部",
             isActive: true,
             StatusId: -1
            },
            {
             StatusName:"未发布",
             isActive: false,
             StatusId: 0
            },
            {
             StatusName:"待审核",
             isActive: false,
             StatusId: 1
            }, 
            {
             StatusName:"审核通过",
             isActive: false,
             StatusId: 2
            },
            {
             StatusName:"审核不通过",
             isActive: false,
             StatusId: 3
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
        searchData: {
          provinceCode: '110000',
          cityCode: '',
          areaCode: '',
          state: '-1',
          startTime: '', 
          endTime: '', 
          categoryIds: [],
        },
        indexPrev:0,
        options: [],
        city_value: [],
        comState:'',
        setStateIdList:[],
        linestateIdlist:[],
        productName:'',

        pageSizes:[10, 15, 30, 40],
        pageSize: 10,
        currentPage: 1,
        totalValue: 0,
        loading: false,
        priceDialogShow:false,
        dialogTableVisible:false,
        dialog:false,
        rowCategoryId:'',
        productId:'',
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
        idArr: [],
        keys: '',
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
    },
    computed: {
      GGFlag: function () {
        var attrCheckStr=','+this.GGAttrform.attrCheckList.join(",")+","; 
        if(this.GGAttrform.attrCheckList.length==0){
          return "0"
        }else if(attrCheckStr.indexOf(","+1+",")!=-1){
          return "2"
        }else{
          return "1"
        }
      },
    },
    watch: {
      filterText(val) {
        this.$refs.tree2.filter(val);
      },
      keys(val){
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
      //获取省份信息
      getProvince(){
        var ip = '/api/common/region/province';
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
      //发布新文章
      publicNew(){
        this.$router.push({path:'/release'});
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
          this.keys = "", 
          this.searchData.categoryIds = []
        }
        this.getData();
        this.getTreeData();
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
              res.data.data.length==0?(this.shiShow=false,this.quShow=false):(this.city = res.data.data,this.shiShow=true,this.quShow=true)
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
      //单页面加载个数
      pageSizeChange(val) {
        this.pageSize = val;
        //console.log(`每页 ${val} 条`);
      },
      //当前页面
      pageCurrentChange(val) {
        this.currentPage = val;
        //console.log(`当前页: ${val}`);
        this.getData()
      },
      //状态筛选
      setStatus(index){
        this.indexPrev = index;
        this.getData();
      },
      publishing_setStatus(index){
        this.publishing_indexPrev=index;
        this.getData();
      },
      //时间筛选
      timeChangeing(){
        console.log(this.dateBetween)
        if(this.dateBetween){
          this.searchData.startTime = this.dateBetween[0],
          this.searchData.endTime = this.dateBetween[1]
        } 
        this.getData();
      },
      //初始化列表数据
      getData () {
        let ip = `/api/article/author/list/${this.currentPage}/${this.pageSize}`;
        //this.$store.commit('setBid','1340');
        // let ip ='/api/getClassList';
        this.loading = true;
        this.$http.post(ip,{
          provinceCode: this.searchData.provinceCode,
          cityCode: this.searchData.cityCode,
          areaCode: this.searchData.areaCode,
          type: this.indexPrev-1,
          state: this.publishing_indexPrev-1,
          startTime: this.searchData.startTime, 
          endTime: this.searchData.endTime, 
          key: this.keys, 
          categoryIds: this.searchData.categoryIds.join(","),
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
      //行修改上下架状态
      // dropBack (index, rowObj){
      //   let obj = {};
      //   obj.productId = rowObj.id;
      //   obj.state = rowObj.state.key;
      //   this.ab = obj.state; 
      //   this.$set( this.linestateIdlist,0, obj);
      // },
      backPublic(index,row,type){
        this.pubulicId = row.id;
        this.public_confirm = true;
        this.public_state = type == 0?1:0;
      },
      edit(index,row){
        this.$router.push({path:'/release',query: {cId: row.id,user:'0'}});
      },
      backPublicConfirm(){
        var par = {};
        var ip = "";
        if(this.public_state == 1){
          ip = `/api/article/author/recall/${this.pubulicId}`;
          par = {bid:'2031'}
        }else{
          ip = `/api/article/author/publish/${this.pubulicId}`;
          par = {bid:'2032'}
        }
        this.public_confirm = false;
        this.$http.get(ip,{params:par}).then((res) => {
          if(res.data.code == 0){
            this.getData();
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            this.getData();
          }else{
            this.$message({
              type: 'error',
              message: res.data.msg
            })  
          }
        },(err) => {
          this.$message({
            type: 'error',
            message: '服务器器异常'
          })
          console.log(err);
        })
      },
      //多选框触发事件
      // SelectionChange (selection,row){
      //     let arr = [];
      //     selection.forEach(function(item,index) { 
      //       let obj = {};
      //       obj.productId = item.id;
      //       obj.state = item.state.key;
      //       arr.push(obj)
      //     });
      //     this.setStateIdList = arr;
      // },
      // hotAjax(index,row){
      //   var hot = row.isHot=="1"?"0":"1";
      //   var ip = '/api/productList/setProductIsHot';
      //   //var ip = `/api/productDetailData/`
      //   this.$store.commit('setBid','1340');
      //   this.$http.get(ip,{params:{
      //     productId:row.id,
      //     isHot:hot
      //   }})
      //   .then((res) => {
      //       this.getData();
      //       if(res.data.code==200){
      //         this.getData();
      //       }
      //   }, (err) => {
      //       console.log(err);
      //   })
      // },
      //类目树数据请求
      getTreeData(){
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
      }
    }
  }
</script>
<style lang="less" scoped>
  .bHeader{
    box-sizing: border-box;
    height: 50px;
    line-height: 58px;
  }
  .dialog-sele{
    margin: 18px 0; 
  }
  .el-date-editor--daterange.el-input__inner{
    width:0px;
    width:100%;
    line-height: 14px
  }
  .public-new{
    float:right;
    margin-right: 20px;
    margin-top: 10px;
  }
  .dialog-sele{
    margin: 18px 0; 
  }
  .custom-tree-node {
    display: inline-block;
    width: 100%;
    line-height: 22px;
    padding-left: 10px;
    .btn-content {
      position: absolute;
      right: 0px;
    }
    .el-button {
      padding: 2px 0px;
    }
  }
  .check-btn{
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
    box-sizing: border-box;
  }
  .el-tree {
    background: #f8fdff;
  }
  .treeBox .treeSearch{
    margin-bottom:20px;
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
  }
  .bBody-content .category:before{content:"";display: table;}*/
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
  .bBody-content .btn_box{
    background-color: #fff;
    padding:0 20px;
  }
  .bBody-content .category .catagory-lt2{
    margin:25px 0px 0 0px;
    display: flex;
    float: left;
    width:120px;
    line-height: 30px;
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
  .CSstate:nth-child(3){
    padding-left: 32px
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
  .fade-enter-active, .fade-leave-active {
    transition:width 0.5s
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    width:0px;
  }
</style>
<style lang="less">
  .el-input--suffix .el-input__inner{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .el-table__body-wrapper{
    overflow-y: auto;
  }
    /*美化滚动条*/
  .el-table__body-wrapper::-webkit-scrollbar {width:5px;}
  .el-table__body-wrapper::-webkit-scrollbar-track {-webkit-box-shadow: inset 0 0 6px rgba(209, 199, 199, 0.3); -webkit-border-radius: 10px;border-radius: 10px;}
  .el-table__body-wrapper::-webkit-scrollbar-thumb {-webkit-border-radius: 10px;border-radius: 10px;background:rgba(212,212,212,0.7); -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5); }
  .el-table__body-wrapper::-webkit-scrollbar-thumb:window-inactive {background: #d4d4d4; }
  .custom-tree-node{
    box-sizing: border-box;
    height: 27px;
  }
  .custom-content{
    display: inline-block;
    width: 60%;
    height: 14px;
    line-height: 14px;
    margin-top: 6px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>

