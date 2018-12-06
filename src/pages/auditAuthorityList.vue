<template>
  <div class="sub-router">
    <div class="bHeader" style="height: 50px;line-height: 58px">
      <i></i><span>审核权限 </span>
    </div>
    <div class="bHeader2">
      <span>共 {{totalValue}} 条数据 </span>
    </div>
    <div class="bBody">
      <div class="left">
        <el-aside class="parentAside scrollBar" style="width: auto; overflow-y: auto">
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
                :expand-on-click-node="false"
                :default-expanded-keys="idArr"
                :filter-node-method="filterNode"
                ref="tree8"
                @node-click="handleNodeClick">
                  <span class="custom-tree-node" :title="node.checked?'取消标签':'设为标签'" v-bind:class="{'custom-tree-sele':node.checked}" slot-scope="{ node, data }">
                  <span :title="node.label" class="custom-content" >{{ node.label }}</span>
                </span>
              </el-tree>
            </div>
          </transition>
        </el-aside>
      </div>
      <div class="right">
        <div class="bBody-content">
          <div class="category">
            <div class="catagory-lt my-catagory-lt">
              <div class="input-el">
                <el-input suffix-icon="el-icon-search" placeholder="请输入搜索关键词" v-model="commodityName" clearable></el-input>
              </div>
            </div>
            <div class="catagory-lt my-catagory-lt" style="width:10%">
              <div class="input-el">
                 <el-checkbox v-model="checked" @change="checkBox">显示禁用用户</el-checkbox>
              </div>
            </div>
            <div class="catagory-lt my-catagory-lt">
              <div class="input-el">
                  <el-button v-if = "$store.state.permission.permissions.hasOwnProperty('k4') && $store.state.permission.permissions.k4.hasOwnProperty('k4_b1')" type="primary" @click="priceSetBatch">批量设置审核权限</el-button>
              </div>
            </div>
          </div>
          <el-table ref="multipleTable" 
            v-loading="loading" 
            :data="tableData" 
            tooltip-effect="dark" 
            style="width: 100%" 
            @select="SelectionChange"
            @select-all="SelectionChange" class = "scrollbar">
            <el-table-column prop="id" type="selection" width="55"></el-table-column>
            <el-table-column label="姓名">
              <template slot-scope="scope" style="color: #00f">
                {{scope.row.name}}
              </template> 
            </el-table-column>
            <el-table-column prop="cityName" label="所辖城市" ></el-table-column>
            <el-table-column prop="deptName" label="所属部门" ></el-table-column>
            <el-table-column  label="角色" show-overflow-tooltip >
              <template slot-scope="scope">
                <span style="margin-right:5px" v-for="item in scope.row.roleNames" :key="item.index">{{item}}</span>
              </template> 
            </el-table-column>
            <el-table-column prop="state" label="状态" width = "100">
              <template slot-scope="scope">
                <span v-if="scope.row.state==3" style="color:#ff3030">禁用</span>
                <span v-else>启用</span>
              </template>
            </el-table-column>
            <el-table-column label="审核权限">
              <template slot-scope="scope">
                <!-- <div class="authority" v-for="item in scope.row.categoryNames" :key="item.index">{{item}}</div> -->
                <div class="authority" v-for="(item,index) in scope.row.categoryNames">{{item}}</div>
              </template>
            </el-table-column>
            <el-table-column label="操作"  >
              <template slot-scope="scope">
                <el-button v-if = "$store.state.permission.permissions.hasOwnProperty('k4') && $store.state.permission.permissions.k4.hasOwnProperty('k4_b1')" plain type="primary" size="mini" @click="priceSet(scope.$index, scope.row)">审核权限</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="bottomBox clearfix">
            <div v-if="tableData[0] != undifined" class="bBody-pagination">
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
    <!-- 批量设置审核权限 -->
    <el-dialog 
      title="批量设置审核权限"
      :visible.sync="dialogVisible1"
      width="70%"
      :before-close="GGcancel1"
      :close-on-click-modal="true"
      :modal-append-to-body="false">
      <div style="width:100%;max-height:60vh;">
        <el-row class="setPermission" style="height:0">
          <el-col :span="8" :push="2" >
            <span><span style="color:red">*</span> 批量设置类型</span>
          </el-col>
          <el-col :span="16">
            <el-radio v-model="radio" label="1">用新选择的类目覆盖已设置的类目</el-radio>
            <el-radio v-model="radio" label="2">保留已设置的类目，并补充新设置的类目</el-radio>
          </el-col>
        </el-row> 
        <tree-transfer :title="title" :from_data='fromData' :defaultProps="{label:'label',children:'children'}" defaultTransfer :to_data='toData' @addBtn='add' @removeBtn='remove' mode='transfer' height='calc(60vh - 43px)' filter open-all>
        </tree-transfer>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="GGcancel1">取 消</el-button>
        <el-button type="primary" @click="saveGGAttr1">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 审核权限 -->
    <el-dialog
      title="审核权限"
      :visible.sync="dialogVisible2"
      width="70%"
      :before-close="GGcancel2"
      :close-on-click-modal="true"
      :modal-append-to-body="false">
      <div style="width:100%;max-height:60vh;">
        <tree-transfer :title="title" :from_data='fromData' :defaultProps="{label:'label',children:'children'}" :defaultCheckedKeys="defaultChecked" defaultTransfer :to_data='toData' @addBtn='add' @removeBtn='remove' mode='transfer' height='calc(60vh - 50px)' filter open-all>
        </tree-transfer>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="GGcancel2">取 消</el-button>
        <el-button type="primary" @click="saveGGAttr2">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script> 
import treeTransfer from "../components/auditAuthorityBox"; 
  export default {
    created (){
      this.getData();
      this.getTreeData()
    },
    data () {
      return {
        mode:"transfer",
        checked:false,
        fromData:[],
        toData:[],//树形穿梭框2
        defaultChecked:[],
        radio:'2',
        ab:3,
        ishover: -1,
        invTime: 2000,
        el: '#one',
        commodityName: '',
        tableData: [],
        current: "",
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
            isActive: true,
            StatusId: -1
          },
          {
            StatusName:"精品",
            isActive: false,
            StatusId: 0
          },
          {
            StatusName:"非精品",
            isActive: false,
            StatusId: 1
          }, 
        ],
        indexPrev:0,
        options: [],
        city_value: [],
        comState:'',
        setStateIdList:'',//人员id
        permissionId:'',//弹框类目id
        linestateIdlist:[],
        productName:'',
        pageSizes:[10, 15, 30, 40],
        pageSize: 10,
        currentPage: 1,
        totalValue: 0,
        loading: false,
        dialogShow:false,
        dialogVisible1:false,
        dialogVisible2:false,
        priceDialogShow:false,
        dialogTableVisible:false,
        dialog:false,
        rowCategoryId:'',
        productId:'',
        lineFlag:false,
        GGrow:{},
        hotSort:false,
        idArr: [],
        openShow:true,
        treeData: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        filterText: '',
        categoryId:''
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
      }
    },
    watch: {
      filterText(val) {
        console.log(this.$refs.tree8.filter)
        this.$refs.tree8.filter(val);
      },
      commodityName(val){
        this.currentPage = 1;
        this.getData()
      }
    },
    methods: {
      // 添加按钮
      add(fromData, toData, obj) {
        // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
        let arr = [];
        this.preOrder(toData,arr);
      },
      preOrder(ele,arr){   
        var that = this;
        ele.forEach(function(item,index){
          if(item.children == null){
            arr.push(item.id) 
          }else{                             
            that.preOrder(item.children,arr);                                                      
          }
        }) 
        if(arr){
          this.permissionId = arr.join(',')
        } 
      },
      // 移除按钮
      remove(fromData, toData, obj) {
        // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
        // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
        let arr = []
        this.preOrder(toData,arr);
      },
      //批量审核权限按钮
      priceSetBatch(){
        if(this.setStateIdList==""){
          this.$message({
            type: 'error',
            message: '请先勾选变预变更人员'
          });
          return
        }else if(this.setStateIdList != ""){
          this.dialogVisible1 = true;
          this.fromDataBox()
        }
      },
      //审核权限按钮   测试    注释是正式
      priceSet(index, row){
        var arr = [];
        let ip ='/api/permission/getEmpVerifys/' + row.empId;
        this.current = row.empId;
        this.$http.get(ip,{params:{'bid':'2041'}}).then((res)=>{
          this.dialogVisible2 = true;
          if(res.data.data){
            for(var key in res.data.data){
              arr.push(key)
            }
          }
          this.fromDataBox(arr);
        },(err)=>{
          console.log(err)
        })
      },
      pageSizeChange(val) {
        this.pageSize =val;
      },
      pageCurrentChange(val) {
        this.currentPage = val;
        this.getData()
      },
      setStatus(index){
         this.indexPrev=index;
         this.getData();
      },
      GGcancel1(){
        this.dialogVisible1 = false;
        this.defaultChecked = [];
        this.toData = []
        this.permissionId = "";
      },
      GGcancel2(){
        this.dialogVisible2 = false;
        this.defaultChecked = [];
        this.toData = [];
        this.permissionId = "";
        this.current = "";
      },
      //批量审核传参
      saveGGAttr1 () {
        var ip = `/api/permission/doVerify?empIds=${this.setStateIdList}&permission_ids=${this.permissionId}&iscover=${this.radio}`
        this.$http.post(ip,{bid: '2041'}).then((res) => {
          if(res.data.code==0){
            this.dialogVisible1 = false;
            this.$message({
              type: 'success',
              message: res.data.msg
            });
            this.permissionId = "";
            this.setStateIdList='';
            this.radio = "2";
            this.toData = [];
            this.getData()
          }else{
            this.$message({
              type: 'error',
              message: res.data.msg
            });
          }
        }, (err) => {
          console.log(err)
        })
      },
      //单个审核传参
      saveGGAttr2 () {
        var ip = '/api/permission/doVerify?empIds='+ this.current + '&permission_ids=' + this.permissionId + '&iscover=1';
       //this.$store.commit('setBid','1540');
        this.$http.post(ip,{bid: '2041'})
        .then((res) =>{
          if(res.data.code==0){
            this.dialogVisible2 = false;
            this.defaultChecked = [];
            this.toData = [],
            this.$message({
              type: 'success',
              message: res.data.msg
            });
            this.permissionId = "";
            this.current = "";
            this.getData()
          }else{
            this.$message({
              type: 'error',
              message: res.data.msg
            });
          }  
        }, (err) => {
          //  this.dialogVisible = false;
          console.log(err)
        })
      },
      //初始化列表数据
      getData () {
        let ip = `/api/permission/employer/${this.currentPage}/${this.pageSize}`;
        //this.$store.commit('setBid','1340');
        this.setStateIdList = '';
        this.loading = true;
        this.$http.get(ip,
          {params:{
            condition:this.commodityName,
            forbidden:this.checked,
            orgId:this.categoryId,
            bid: '2041'
          }}).then((res) => {
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
      //多选框触发事件
      SelectionChange (selection,row){
        let arr = [];
        selection.forEach(function(item,index) { 
          arr.push(item.empId)
        });
        this.setStateIdList = arr.join(',');
      },
      //类目树数据请求
      getTreeData(){
        //this.$store.commit('setBid','1340');
        this.$http.get('/api/permission/organize',{params:{bid:'2041'}})
        .then((res) => {
          if(res.data.code==0){
            this.treeData = res.data.data;
            this.treeData.forEach(m=>{
              this.idArr.push(m.id)
            })
          }
        }, (err) => {
            console.log(err);
        })
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
      handleNodeClick (data, node, self) {
        this.categoryId = data.id;
        this.getData();
      },
      //是否显示禁用
      checkBox(){
        // this.checked
        this.getData();
      },
      //审核权限树结构
      fromDataBox(arr){
        var ip = '/api/category/getCategories';
        this.$http.get(ip,{params:{bid:'2041'}})
        .then((res) => {
          this.fromData = res.data.data;
          if(arr != false){
            this.toData = [];
            this.defaultChecked = arr
          }else{
            this.defaultChecked = []
            this.toData = []
          }
        }, (err) => {
          console.log(err)
        })
      }

    },
    computed: {
      title() {
        if (this.mode == "transfer") {
          return ["源列表", "目标列表"];
        } 
      }
    },
    components: {treeTransfer}
  }
</script>

<style lang="less" scoped>
  .bHeader2 {
    line-height: 43px;
    color: #666;
    background-color: #fff;
    padding:0 1%;
    border:1px solid #e5e5e5;
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
    height:calc(100vh - 207px);
    background-color: #f8fdff;
    overflow: auto;
  }
  .right{
    position: absolute;
    left: 18%;
    width: 82%;
    top: 95px;
    height:calc(100vh - 207px);
    box-sizing: border-box;
    overflow-y: hidden;
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
    padding-left: 10px
  }
  .blue{
    color: blue;
  }
  .focus{
    color: #409EFF;
    border-color: #c6e2ff;
    background-color: #ecf5ff;
  }
  .bBody{background-color: #fff;}
  .bBody-nav{padding:7px 15px 7px;background-color:#fffeed;}
  .bBody-content{ 
      border-left:1px solid #e5e5e5;
      border-right:1px solid #e5e5e5;
      border-bottom:1px solid #e5e5e5;
      }
  .bBody-content .category{
    height: 45px;
    background-color: #fff;
    border-bottom: 1px solid #e5e5e5; 
    padding-bottom:15px;
  }
  .bBody-content .category:before{content:"";display: table;}
  .bBody-content .category .catagory-lt,.catagory-mid,.catagory-rt{margin-top: 25px; float: left;}
  .bBody-content .category .catagory-lt { line-height: 30px;}
  .bBody-content .category .catagory-lt{
     width: 26%;
    margin:15px 10px 0 25px;
    display: flex;
    .input-el{
      height:31px;
      width:100%
    }
    .commodityStuta_Box{
      height: 31px;
    }
  }
  .bBody-content .category .catagory-lt2{
    margin:25px 0px 0 0px;
    display: flex;
    float: left;
    width:120px;
    line-height: 30px;
  }
  .bBody-pagination{
    float: right;
    background-color: #fff;
    padding: 20px;
    text-align: center;
  }
  .CStuta{
    padding-left: 20px;
      cursor: pointer;
  }
  .bg-header{
    background-color: #ccc;
  }
  /*.parentAside{
    background-color:#f8fdff;
    .el-tree{
      background-color:#f8fdff;
    }
    .el-input{
      margin: 15px 5%;
      width: 90%;
    }
  }*/
  .parentAside{
    height: 100%;
    padding:22px;
    overflow-y: hidden;
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
  /*批量设置审核权限*/ 
  .setPermission{
    margin:14px 0;
  }
  .setPermission .el-col-8{
    width: 12.33333%;
  }
  .setPermission .el-col-16 {
    width: 86.66667%;
    div{
      width:50%;
      float:left
    }
  }
  .setPermission .el-col-push-2{
    left:0
  }
  .bottomBox{
    float:  left;
    background-color: #fff;
    width: 100%;
  }
  .authority{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .scrollbar{
    max-height:calc(100vh - 332px);
    overflow-y: auto;
  }
</style>
<style lang="less">
  .el-table::before{
    width: 0;
  }
  .el-table__row .cell{
    max-height: 90px;
    overflow-y: auto;
  }
  .transfer-left .el-tree,.transfer-right .el-tree{
    height: calc(60vh - 158px);
    overflow-y: auto
  }
  /*美化滚动条*/
  .el-tree::-webkit-scrollbar {width:5px;}
  .el-tree::-webkit-scrollbar-track {-webkit-box-shadow: inset 0 0 6px rgba(209, 199, 199, 0.3); -webkit-border-radius: 10px;border-radius: 10px;}
  .el-tree::-webkit-scrollbar-thumb {-webkit-border-radius: 10px;border-radius: 10px;background:rgba(212,212,212,0.7); -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5); }
  .el-tree::-webkit-scrollbar-thumb:window-inactive {background: #d4d4d4; }

  .scrollbar::-webkit-scrollbar {width:5px;}
  .scrollbar::-webkit-scrollbar-track {-webkit-box-shadow: inset 0 0 6px rgba(209, 199, 199, 0.3); -webkit-border-radius: 10px;border-radius: 10px;}
  .scrollbar::-webkit-scrollbar-thumb {-webkit-border-radius: 10px;border-radius: 10px;background:rgba(212,212,212,0.7); -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5); }
  .scrollbar::-webkit-scrollbar-thumb:window-inactive {background: #d4d4d4; }
  /*美化滚动条*/
  .el-table__row .cell::-webkit-scrollbar {width:5px;}
  .el-table__row .cell::-webkit-scrollbar-track {-webkit-box-shadow: inset 0 0 6px rgba(209, 199, 199, 0.3); -webkit-border-radius: 10px;border-radius: 10px;}
  .el-table__row .cell::-webkit-scrollbar-thumb {-webkit-border-radius: 10px;border-radius: 10px;background:rgba(212,212,212,0.7); -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5); }
  .el-table__row .cell::-webkit-scrollbar-thumb:window-inactive {background: #d4d4d4; }
  .transfer{
    top: 8px;
  }
  .el-dialog__footer{
    border-top: none;
    position: relative;
    top: 5px;
  }
</style>
