<template>
  <div class="sub-router">
    <div class="bHeader" style="height: 50px;line-height: 58px">
      <i></i><span>信息发布 / 信息发布列表（共 {{totalValue}} 条数据） </span> 
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
                  v-model="filterText1" 
                  suffix-icon="el-icon-search">
                </el-input>
              </div>
              <el-tree 
                class="filter-tree" 
                :data="treeData" 
                :props="defaultProps" 
                node-key="id"
                :default-expanded-keys="idArr1"
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
            <div class="input-el" style="width: 21.5%;margin-right: 2%">
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
          <div class="catagory-lt my-catagory-lt" style="margin-top: 15px;">
            <label class='commodityStuta bold'>发布类型：</label>
            <div class="commodityStuta_Box">
                <span class="CStuta" v-for="(item,index) in PublishingType"
                  :class="{isActive: (index == indexPrev) || (index ==ishover)}"
                  @click="setStatus(index)" :key="item.id"
                  @mouseover="ishover = index" @mouseout="ishover = -1">
                    {{item.StatusName}}
                  </span>
            </div>
          </div>
              <div class="catagory-lt my-catagory-lt">
                <label for="commodityName" class="bold"> 发 布 人 ：</label>
                <div class="input-el" style="width:69.5%">
                  <el-input id="commodityName" placeholder="请输入搜索关键词" suffix-icon="el-icon-search" v-model="publishName" clearable></el-input>
                </div>
              </div>
             <div class="catagory-lt my-catagory-lt">
              <label class='commodityStuta bold'>发布状态：</label>
              <div class="commodityStuta_Box">
                  <span  class="CStuta CSstate" v-for="(item,index) in PublishingStatus"
                    :class="{isActive: (index == publishing_indexPrev) || (index ==publishing_ishover)}"
                    @click="publishing_setStatus(index)" :key="item.id"
                    @mouseover="publishing_ishover = index" @mouseout="publishing_ishover = -1">
                      {{item.StatusName}}
                  </span>
              </div>
            </div>
            <div  class="catagory-lt ">
              <label for="commodityName" class="bold">发布时间：</label>
              <div class="input-el"  style="width:71%">
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
            <div class="catagory-lt my-catagory-lt">
              <label class='commodityStuta bold'>内容筛选：</label>
              <div class="commodityStuta_Box">
                  <span  class="CStuta CScontent" v-for="(item,index) in ContentScreening" 
                    :class="{isActive: (index == content_indexPrev) || (index ==content_ishover)}"  
                    @click="content_setStatus(index,item.StatusId)" :key="item.id"
                    @mouseover="content_ishover = index" @mouseout="content_ishover = -1">
                      {{item.StatusName}}
                    </span>
              </div>
            </div>
            <div class="catagory-lt my-catagory-lt">
              <label for="commodityName" class="bold">标题搜索：</label>
              <div class="input-el" style="width:69.2%">
                <el-input id="commodityName"  placeholder="请输入搜索关键词" suffix-icon="el-icon-search" v-model="contentKey" clearable></el-input>
              </div>
            </div>
            <div class="catagory-lt" style="text-align: right">
              <div class="check-btn"> 
                <el-button v-show = "checkShow" @click="checkToggle(2)" type="text">清空</el-button>
              </div>
            </div>
          </div>
        </el-collapse-transition>
          <!-- <div class="catagory-lt my-catagory-lt">
            <label class='commodityStuta bold'>知识类型:</label>
            <div class="commodityStuta_Box">
                <span  class="CStuta" v-for="(item,index) in readingType"
                  :class="{isActive: (index == reading_indexPrev) || (index ==reading_ishover)}"
                  @click="reading_setStatus(index)" :key="item.id"
                  @mouseover="reading_ishover = index" @mouseout="reading_ishover = -1">
                    {{item.StatusName}}
                  </span>
            </div>
          </div> -->
        <el-table ref="multipleTable" 
          v-loading="loading" 
          :data="tableData" 
          tooltip-effect="dark" 
          :height = 'heightCtr'
          style="width: 100%;overflow-y:auto" 
          @select="SelectionChange"
          @select-all="SelectionChange">
          <el-table-column prop="id" type="selection" width="36"></el-table-column>
          <el-table-column label="标题" width="120">
            <template slot-scope="scope">
            <!--   <router-link v-if="scope.row.type==0"  class="blue" :to="{path: `/auditingDetails`,query:{cId:scope.row.id}}"> -->
                <!-- span v-if="scope.row.hot==1">{{scope.row.title}}<span class="jing"></span> </span>
                <span v-else-if="scope.row.hot==0">{{scope.row.title}}</span> -->
      <!--         </router-link> -->
              <router-link tag="a" target="_blank" class="blue" :to="{path: `/caseDetails`,query:{cId:scope.row.id,type:scope.row.type}}">
                <span :class="{jing:scope.row.hot == 1}">{{scope.row.title}}</span>
              </router-link>
            </template>
          </el-table-column>
          <el-table-column prop="regionName" label="城市区域" width="110"></el-table-column>
          <el-table-column prop="typeName" label="发布类型" width="82"></el-table-column>
          <el-table-column label="状态" width="82">
           <template slot-scope="scope">
              <span v-if="scope.row.state == 0" class='orangeColor'>{{scope.row.stateName}}</span>
              <span v-else-if="scope.row.state ==1 || 2" class='greenColor'>{{scope.row.stateName}}</span>
              <span v-else-if="scope.row.state ==3" class='redColor'>{{scope.row.stateName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="发布时间/审核时间" width="168">
            <template slot-scope="scope">
              {{scope.row.publichTime}}</br>
              {{scope.row.checkTime}}
            </template>
          </el-table-column>
          <el-table-column prop="userName" label="发布人" width="68"></el-table-column>
          <el-table-column prop="checkName" label="审核人" width="68"></el-table-column>
          <el-table-column prop="visitNum" label="浏览量" width="66"></el-table-column>
          <el-table-column label="有用" width="82">
            <template slot-scope="scope">
              <span class="iconImg" ></span>{{scope.row.likeNum}}
            </template>
          </el-table-column>
          <el-table-column prop="treadNum" label="无用" width="82">
            <template slot-scope="scope">
              <span class="iconImg iconImg2" ></span>{{scope.row.treadNum}}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button v-if = "$store.state.permission.permissions.hasOwnProperty('k2') && $store.state.permission.permissions.k2.hasOwnProperty('k2_b3')" plain type="primary" size="mini" :disabled="scope.row.state==1?false:true" @click="priceSet(scope.row)" style="margin-left:10px;margin-bottom:6px;">审核</el-button>
              <el-button v-if = "$store.state.permission.permissions.hasOwnProperty('k2') && $store.state.permission.permissions.k2.hasOwnProperty('k2_b4')" plain type="primary" size="mini" @click="fineQuality(scope.row)" style="margin-bottom:6px;">{{scope.row.hot==0?"加精":"去精"}}</el-button>
              <el-button v-if = "scope.row.state != 2 && scope.row.state != 3 && $store.state.permission.permissions.hasOwnProperty('k2') && $store.state.permission.permissions.k2.hasOwnProperty('k2_b1')" plain type="primary" size="mini" style="margin-bottom:6px;" @click="dialogVisible2 = true;setStateIdList=[scope.row.id];banch1=0">改派</el-button>
              <el-button v-if = "scope.row.state != 2 && scope.row.state != 3 && $store.state.permission.permissions.hasOwnProperty('k2') && $store.state.permission.permissions.k2.hasOwnProperty('k2_b2')" plain type="primary" size="mini" @click="getArticle(scope.row.id)">更改类目</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="bottomBox clearfix">
          <div  v-if = "tableData != flase" class="btn_box">
            <el-button v-if = "$store.state.permission.permissions.hasOwnProperty('k2') && $store.state.permission.permissions.k2.hasOwnProperty('k2_b2')" type="primary" size="mini" @click="dialog1">批量更改类目</el-button>
            <el-button v-if = "$store.state.permission.permissions.hasOwnProperty('k2') && $store.state.permission.permissions.k2.hasOwnProperty('k2_b1')" type="primary" size="mini" @click="dialog2">批量改派</el-button>
          </div>
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
    </div>
   <!--  <el-dialog title="修改上下架状态" 
      :visible.sync="dialogShow"
      width="30%"
      top="35vh"
      :before-close="cancel"
      :modal-append-to-body="false">
        <el-button  @click="setComState('3')" :class="{focus: ab ==3 }" >下架</el-button>
        <el-button @click="setComState('1')" :class="{focus: ab ==1 }">前/后台上架</el-button>
        <el-button  @click="setComState('2')" :class="{focus: ab ==2 }">后台上架</el-button>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="setComStateAjax">确 定</el-button>
        </span>
    </el-dialog> -->
    <!--批量更改类目-->
    <el-dialog
      :title = "banch2 == 0?'更改类目':'批量更改类目'"
      :visible.sync="dialogVisible"
      width="560px"
      top="10vh"
      :before-close="cancelDialog1"
      :close-on-click-modal="true"
      :modal-append-to-body="false">
      <div style="width:100%;overflow:auto;padding-top:14px;margin-bottom: 20px;">
        <el-row>
          <el-col :span="6">
            <span><span style="color:red">*</span> 批量设置类型:</span>
          </el-col>
          <el-col :span="16">
            <div v-if = "banch2 == 1">
              <el-radio v-model="iscover" label="1">用新选择的类目覆盖已设置的类目</el-radio>
              <el-radio v-model="iscover" label="2" style="margin-left: 0">保留已设置的类目，并补充新设置的类目</el-radio>
            </div>
            <div class="classTree">
              <div class="treeSearch">
                <el-input placeholder="请输入内容" suffix-icon="el-icon-search" v-model="filterText2"></el-input>
              </div>
              <div class="treeContent scrollBar">
                <div class="block">
                  <el-tree
                    class="filter-tree"  
                    :data="treeDataDialog1"
                    node-key="id"
                    :props="defaultProps"
                    default-expand-all
                    :filter-node-method="filterNode"
                    @node-click="handleNodeDialog1"
                    ref="tree3">
                    <span :title="node.checked?'取消标签':'设为标签'" class="custom-tree-inleaf" v-bind:class="{'custom-tree-sele':node.checked,'custom-tree-leaf': node.isLeaf}" slot-scope="{ node, data }">
                      <span :title="node.label" class="custom-content custom-content-special" >{{ node.label }}</span>
                      <span class="btn-content">
                        <el-button v-bind:class="{'star-sele':node.checked==2}" @click.stop="() => starDialog(node,data)" icon="el-icon-star-on" :title="node.checked ==1?'设为主标签':'取消主标签'" type="text"></el-button>
                        <el-button icon="el-icon-success" type="text" style="margin-left: 6px;margin-right: 14px;"></el-button>
                      </span>
                    </span>
                  </el-tree>
                </div>
              </div>
            </div>
          </el-col>
        </el-row> 
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog1">取 消</el-button>
        <el-button type="primary" @click="saveDialog1">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title = "banch1 == '0'?'改派':'批量改派'"
      :visible.sync="dialogVisible2"
      width="680px"
      top="10vh"
      :before-close="cancelDialog2"
      :close-on-click-modal="true"
      :modal-append-to-body="false">
      <div style="width:100%;height:400px; margin-top: 10px;">
        <el-row class="batch">
          <el-col style="text-align:center height:100%" :span="10">
            <div class="classTree" style="margin-top: 0;">
              <div class="treeSearch">
                <el-input placeholder="请输入内容" suffix-icon="el-icon-search" v-model="filterText3"></el-input>
              </div>
              <div class="treeContent scrollBar">
                <div class="block">
                  <el-tree
                    class="filter-tree"  
                    :data="treeDataDialog2"
                    node-key="id"
                    :props="defaultProps"
                    :default-expanded-keys="idArr3" 
                    :filter-node-method="filterNode"
                    @node-click="handleNodeDialog2"
                    ref="tree4">
                    <span :title="node.checked?'取消标签':'设为标签'" class="custom-tree-node" v-bind:class="{'custom-tree-sele':node.checked}" slot-scope="{ node, data }">
                      <span :title="node.label" class="custom-content custom-content-special">{{ node.label }}</span>
                      <span class="btn-content">
                        <el-button icon="el-icon-success" type="text" style="margin-left: 6px;margin-right: 14px;"></el-button>
                      </span>
                    </span>
                  </el-tree>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="13" :push="1">
            <div style="height:100%;background:#fff;margin-top: 10px;">
              <el-input placeholder="请输入名称进行搜索" clearable 
                v-model="inputName" 
                :fetch-suggestions="queryName"
                suffix-icon="el-icon-search">
              </el-input>
            </div>
            <div class="batchNone" v-if = '!userList.join(",")'>请通过左侧类目树筛选人员</div>
            <el-col v-if = 'userList.join(",")' class="batchName scrollBar">
              <el-button v-for="(item,index) in userList" @click="userSelected(item.empId)" type="primary" plain>{{item.name}}</el-button>
            </el-col>
          </el-col>
        </el-row> 
      </div>      
      <span slot="footer" class="dialog-footer" >
        <el-button @click="cancelDialog2">取 消</el-button>
        <el-button type="primary" @click="saveDialog2">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>

  export default {
    created (){
      this.getTreeData(true);
      this.getData();
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
        inputName:'',//人员搜索
        tableData: [],//右边数据列表
        contentKey:'',
        disabled:false,
        publishing_indexPrev:2,
        publishing_ishover: -1,
        content_indexPrev: 0,
        content_ishover: -1,
        reading_indexPrev:0,
        reading_ishover: -1,
        ishover: -1,
        invTime: 2000,
        commodityCategory: '',
        publishName: '',
        hot: '-1',
        // GGAttrform:{
        //   attrCheckList:[]
        // },
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
             isActive: false,
             StatusId: -1
            },
            {
             StatusName:"未发布",
             isActive: false,
             StatusId: 0
            },
            {
             StatusName:"待审核",
             isActive: true,
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
            }, 
        ],
        treeDataDialog1: [],
        treeDataDialog2: [],
        iscover: '1',
        treeData: [],
        categoryIdDialog1: [],
        categoryIdDialog2: [],
        indexPrev:0,
        comState:'',
        setStateIdList: [],
        linestateIdlist: [],
        pageSizes: [10, 15, 30, 40],
        pageSize: 10,
        currentPage: 1,
        totalValue: 0,
        loading: false,
        dialogShow:false,
        dialogVisible:false,
        dialogVisible2:false,
        dialog:false,
        rowCategoryId:'',
        productId:'',
        openShow:true,
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        filterText1: '',
        filterText2: '',
        filterText3: '',
        categoryId:'',
        dateBetween: '',
        province: [],
        city: [],
        area: [],
        primaryCategoryId: '',
        shiShow: true,
        quShow: true,
        userList:[],
        userListB: [],
        empId: '',
        banch1: 0,
        banch2: 0,
        idArr1: [],
        idArr2: [],
        idArr3: [],
        checkShow: true,
        heightCtr: 'calc(100vh - 404px)'
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
      }
    },
    watch: {
      filterText1(val) {
        this.$refs.tree2.filter(val);
      },
      filterText2(val) {
        this.$refs.tree3.filter(val);
      },
      filterText3(val) {
        this.$refs.tree4.filter(val);
      },
      inputName(val){
        if(val){
          var len = this.userListB.length;
          var arr = [];
          for(var i=0;i<len;i++){
            if(this.userListB[i].name.indexOf(val)>=0){
              arr.push(this.userListB[i]);
            }
          }
          this.userList = arr;
        }else{
          this.userList = this.userListB;
        }
      },
      contentKey(val){
        this.getData()
      },
      publishName(val){
        this.getData()
      },
      checkShow(val){
        if(val){
          this.heightCtr = 'calc(100vh - 404px)'
        }else{
          this.heightCtr = 'calc(100vh - 235px)'
        }
      }
    },
    methods: {
      //审核按钮
      getProvince(){
        // this.$store.state.bid = '1320';
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
      priceSet (row) {
        let {href} = this.$router.resolve({
          path: "/caseDetails",
          query: {
            cId: row.id, 
            type: row.type
          }
        });
        window.open(href, '_blank');
      },
      // material(index,row){
      //   this.$router.push({path:'/commodityList/material',query: {cId: row.id}});
      // },
      pageSizeChange(val) {
        this.pageSize =val;
        //console.log(`每页 ${val} 条`);
      },
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
      contentInput(){
        console.log(this.commodityName)
      },
      content_setStatus(index,status){
        this.content_indexPrev=index;
        this.hot = status;
        this.getData();
      },
      reading_setStatus(index){
        this.reading_indexPrev=index;
        this.getData();
      },
      checkToggle(type){
        if(type != 2){
          this.checkShow = !this.checkShow
        }
        if(type == 2){
          this.searchData.provinceCode = "110000",
          this.searchData.cityCode = "",
          this.searchData.areaCode = "",
          this.indexPrev = 0,
          this.dateBetween = "",
          this.publishing_indexPrev = 2,
          this.content_indexPrev = 0,
          this.searchData.startTime = "", 
          this.searchData.endTime = "", 
          this.searchData.key = "", 
          this.publishName = '',
          this.contentKey = '',
          this.searchData.categoryIds = []
        }
        this.getData();
        this.getTreeData();
      },   
      // getGGAttr () {
      //   var ip = '/api/productDetail/findAttributeSpecAll/'+this.productId;
      //   this.$http.get(ip,{params:{
      //       bid: '2032'
      //     }})
      //   .then((res) => {
      //     this.GGAttrData = res.data.data.unselected;
      //   }, (err) => {
      //     console.log(err);
      //   })
      // },
      setquery(){
         this.commodityCategory =  this.$route.query.categoryName;
         //this.commodityName =  this.$route.query.categoryName
      },
      search () {
        this.getData();
      },
      //弹框确定按钮
      // setComState (state){
      //   this.comState = state;  
      //   this.ab = 0 
      // },
      //弹框取消按钮
      cancel (){
        this.dialogShow = false;
        // this.setStateIdList = [];
        this.comState = '';
      },
      //加精和去精按钮
      fineQuality (row){
        if(row.hot==0){ 
          let ip = `/api/article/checker/addDigest/`+row.id+"/1";
          this.$http.post(ip,{bid:"2037"})
          .then((res)=>{
            if(res.data.code==0){
              row.hot = 1
              this.$message({
                type: 'info',
                message: res.data.msg
              });   
              this.getData() 
            }else{
              this.$message({
                type: 'error',
                message: res.data.msg
              });   
            }
          },err=>{
            console.log(err)
          })
        }else if(row.hot==1){
          let ip = `/api/article/checker/addDigest/`+row.id+"/0";
          this.$http.post(ip,{bid:"2037"}).then((res)=>{
            if(res.data.code==0){
              row.hot= 0
              this.getData()
              this.$message({
                type: 'success',
                message: res.data.msg
              });
            }else{
              this.$message({
                type: 'error',
                message: res.data.msg
              });   
            }  
          },err=>{
            console.log(err)
          })
        }
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
            code:code,
            bid:"2032"
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
            code:s,
            bid:"2032"
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
        this.getData()
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
      //初始化列表数据
      getData () {
        let ip = `/api/article/checker/list/${this.currentPage}/${this.pageSize}`;
        //this.$store.commit('setBid','1340');
        this.loading = true;
        this.$http.post(ip,{
          provinceCode: this.searchData.provinceCode,
          cityCode: this.searchData.cityCode,
          areaCode: this.searchData.areaCode,
          type: this.indexPrev-1,
          state: this.publishing_indexPrev-1,
          startTime: this.searchData.startTime, 
          endTime: this.searchData.endTime, 
          key: this.contentKey, 
          categoryIds: this.searchData.categoryIds.join(","),
          hot:this.hot,
          categoryNames: "", 
          publishName: this.publishName,
          bid:"2033" 
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
      getArticle(id){
        let that = this;
        that.dialogVisible = true;
        that.setStateIdList.push(id);
        that.banch2 = 0;
        var par = {'bid': '2038'}
        that.$http.get("api/article/" + id,{params:par}).then((res) => {
          that.primaryCategoryId = res.data.data.primaryCategoryId;
          that.categoryIdDialog1 = res.data.data.categoryIdList;
          let i = 0;
          let j = 0;
          var timers2 = setInterval(function(){
            if(i > 5){
              i = 0;
              clearInterval(timers2);
            }
            if(that.$refs.tree3){
              if(that.$refs.tree3.getNode(that.categoryIdDialog1[0]) != undefined){
                clearInterval(timers2);
                for(var key in that.categoryIdDialog1){
                  that.$refs.tree3.getNode(that.categoryIdDialog1[key]).checked = 1
                }
              }
            }
            i++;
          }, 60);
          if(that.primaryCategoryId){
            if(j > 5){
              j = 0;
              clearInterval(timers);
            }
            var timers = setInterval(function(){
              if(that.$refs.tree3){
                if(that.$refs.tree3.getNode(that.primaryCategoryId) != undefined){
                  clearInterval(timers);
                  that.$refs.tree3.getNode(that.primaryCategoryId).checked = 2;
                }
              }
              j++;
            }, 60);
          }
        })  
      },
      //类目树数据请求
      getTreeData(dialog){
        //this.$store.commit('setBid','1340');
        this.loading = true;
        this.$http.get('/api/category/getCategories',{headers: {'bid': '2032'}})
        .then((res) => {
          this.loading = false;
          if(dialog){
            this.treeData = res.data.data;
            this.treeData.forEach(m => {
              this.idArr1.push(m.id)
            })
          }
          this.treeDataDialog1 = res.data.data;
          this.treeDataDialog2 = res.data.data;
          this.treeDataDialog2.forEach(m => {
            this.idArr3.push(m.id)
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
      dialog1(){
         if(this.setStateIdList.join(",") == ''){
          this.$message({
            type: 'error',
            message: '请先选择文章'
          })
          return
        }else {
          this.dialogVisible=true;
          this.iscover = '2';
          this.banch2 = 1
        }
      },
      dialog2(){
        if(this.setStateIdList.join(",") == ''){
          this.$message({
            type: 'error',
            message: '请先选择文章'
          })
          return
        }else {
          this.dialogVisible2=true;
          this.banch1 = 1
        }
      },
      handleNodeDialog1 (data, node, self) {
        // 树节点的点击事件
        if (node.isLeaf == true) {
          node.checked = node.checked==0?1:0;  
          this.categoryIdDialog1 = [];
          for(var key in this.$refs.tree3.getCheckedNodes()){
            if(this.$refs.tree3.getNode(this.$refs.tree3.getCheckedNodes()[key].id).checked == 1){
              this.categoryIdDialog1.push(this.$refs.tree3.getCheckedNodes()[key].id)
            }
          }
        }
      },
      handleNodeDialog2 (data, node, self) {
        // 树节点的点击事件
        if (node.isLeaf == true) {
          this.categoryIdDialog2 = [];
          this.empId = "";
          if(node.checked == 1){
            node.checked = 0
          }else{
            if(this.$refs.tree4.getCheckedNodes() != false){
              for(var key in this.$refs.tree4.getCheckedNodes()){
                if(this.$refs.tree4.getNode(this.$refs.tree4.getCheckedNodes()[key].id).checked == 1){
                  this.$refs.tree4.getNode(this.$refs.tree4.getCheckedNodes()[key].id).checked = 0
                }
              }
            }
            node.checked = 1
            this.categoryIdDialog2.push(data.id);
          }
          // var ip = '/api/article/checker/changeAuditor?emp_Ids=' + this.categoryIdDialog2.join(",") + '&category_ids=' + this.setStateIdList.join(",");
          if(this.categoryIdDialog2.join(",")){
            var ip = '/api/article/checker/getReassignmentEmps/' + this.categoryIdDialog2.join(",");
            this.$http.get(ip).then((res) => {
              if(res.data.code==0){
                this.userList = res.data.data
                this.userListB = res.data.data
              }else{
                this.$message({
                  type: 'error',
                  message: res.data.msg
                })
              }
            }, (err) => {
              console.log(err)
            })
          }else{
            this.userList = [];
          }
        }
      },
      starDialog(node,data){
        if(node.checked == 2){
          node.checked = 1;
          this.primaryCategoryId = "";
        }else{
          if(this.$refs.tree3.getCheckedNodes()){
            for(var key in this.$refs.tree3.getCheckedNodes()){
              this.$refs.tree3.getNode(this.$refs.tree3.getCheckedNodes()[key].id).checked = 1;
            }
          }
          node.checked = 2;
          this.categoryIdDialog1 = [];
          for(var key in this.$refs.tree3.getCheckedNodes()){
            if(this.$refs.tree3.getNode(this.$refs.tree3.getCheckedNodes()[key].id).checked == 1){
              this.categoryIdDialog1.push(this.$refs.tree3.getCheckedNodes()[key].id)
            }
          }
          // let arr11 = [];
          // for(var i = 0;i < this.categoryIdDialog1.length;i++){
          //   if(this.categoryIdDialog1[i] != node.data.id){
          //     arr11.push(this.categoryIdDialog1[i])
          //   }
          // }
          // this.categoryIdDialog1 = arr11;
          this.primaryCategoryId = node.data.id
        }
      },
      cancelDialog1(){
        this.dialogVisible = false;
        this.iscover = '1';
        this.categoryIdDialog1 = [];
        this.primaryCategoryId = '',
        this.getData();
        this.getTreeData(false);
        this.setStateIdList = []
      },
      cancelDialog2(){
        this.dialogVisible2 = false;
        this.categoryIdDialog2 = [];
        this.getTreeData(false);
        this.userList = [],
        this.getData();
        this.setStateIdList = []
      },
      saveDialog1() {
        console.log(this.setStateIdList);
        var ip = '/api/article/checker/reassignment?iscover=' + this.iscover + '&category_ids=' + this.categoryIdDialog1.join(",") + '&primary_category_id=' + this.primaryCategoryId + '&articleIds=' + this.setStateIdList.join(",");
        if(this.categoryIdDialog1.join(",") == '' && this.primaryCategoryId == ""){
          this.$message({
            type: 'error',
            message: '请先选择类目'
          })
          return
        }else if(this.iscover == 1 && this.primaryCategoryId == ""){
          this.$message({
            type: 'error',
            message: '主标签不能为空'
          })
          return
        }
        this.$http.get(ip).then((res) => {
          if(res.data.code==0){
            this.dialogVisible = false;
            this.getData();
            this.setStateIdList=[];
            this.categoryIdDialog1 = [];
            this.primaryCategoryId = '';
            this.getTreeData(false);
            this.$message({
              type: 'success',
              message: res.data.msg
            })
          }else{
            this.$message({
              type: 'error',
              message: res.data.msg
            })
          }
        }, (err) => {
          console.log(err)
        })
      },
      saveDialog2(){
        var ip = '/api/article/checker/changeAuditor?emp_Id=' + this.empId + '&articleIds=' + this.setStateIdList.join(",");
        if(this.categoryIdDialog2.join(",") == ''){
          this.$message({
            type: 'error',
            message: '请先选择类目'
          })
          return
        }else if(this.empId == ""){
          this.$message({
            type: 'error',
            message: '请先选择人员'
          })
          return
        }
        this.$http.get(ip).then((res) => {
          if(res.data.code==0){
            this.dialogVisible2 = false;
            this.getData();
            this.setStateIdList=[];
            this.categoryIdDialog2 = [];
            this.getTreeData(false);
            this.empId == "";
            this.$message({
              type: 'success',
              message: res.data.msg
            })
          }else{
            this.$message({
              type: 'error',
              message: res.data.msg
            })
          }
        }, (err) => {
          console.log(err)
        })
      },
      userSelected(ele){
        this.empId = ele
      }
    }
  }
</script>
<style lang="less" scoped>
  .el-date-editor--daterange.el-input__inner{
    width:0px;
    width:97.3%;
    line-height:14px
  }
  .bHeader{
    box-sizing: border-box;
    height: 50px;
    line-height: 58px;
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
  .public-new{
    float:right;
    margin-top: 10px;
    margin-right: 24px;
  }
  .custom-tree-node, .custom-tree-inleaf {
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
  /* .treeBox2{
    width:260px;
    padding:20px;
    margin:10px auto;
    background-color: #f8fdff;
    overflow: auto; 
  }*/
  .bBody-content .category .catagory-lt2{
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
  .bottomBox{
    position: fixed;
    bottom: 27px;
    background-color: #fff;
  }
  .bBody-content .btn_box{
    margin-top: 20px;
    float: left;
    background-color: #fff;
    padding:0 20px;
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
  .CScontent:nth-child(3){
    padding-left: 44px
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
  .iconImg{
    display:inline-block;
    width:14px;
    height:14px;
    background:url(../assets/images/icon4.png) no-repeat;
    margin-right: 6px;
  }
  .iconImg2{
    background:url(../assets/images/icon1.png) no-repeat
  }
  .orangeColor{
    color:#ff9000
  }
  .greenColor{
    color:#00c217
  }
  .redColor{
    color:#ff3030
  }
  .jing{
    display: inline-block;
    padding-left: 22px;
    background: url(../assets/images/jing.png) no-repeat left top;
  }
  .classTree{
    padding:22px;
    background-color: #f4f9ff;
    margin-top: 10px;
    padding-bottom:14px;
    border: 1px solid #cce2fc;
  }
  .classTree .treeSearch{
    background-color: #fff;
    margin-bottom:20px;
  }
  .treeContent{
    height: 300px;
    overflow-y: auto;
    overflow-x: auto;
  }
  .treeContent .el-tree{
    padding: 6px;
    padding-bottom:0;
  }
   /*美化滚动条*/
  .scrollBar::-webkit-scrollbar {width:5px;}
  .scrollBar::-webkit-scrollbar-track {-webkit-box-shadow: inset 0 0 6px rgba(209, 199, 199, 0.3); -webkit-border-radius: 10px;border-radius: 10px;}
  .scrollBar::-webkit-scrollbar-thumb {-webkit-border-radius: 10px;border-radius: 10px;background:rgba(212,212,212,0.7); -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5); }
  .scrollBar::-webkit-scrollbar-thumb:window-inactive {background: #d4d4d4; }
  .batchName{
    height: 330px;
    margin-top:20px;
    width: 100%;
    overflow-y: auto;
  }
  .batchName .el-button{
    max-width: 96%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-left: 2%;
    margin-right: 2%;
    margin-bottom: 10px;
  }
  .batchName .el-button:nth-child(4){
    margin-right: 0;
  }
  .batchNone{
    text-align: center;padding-top: 30px;color: #999;
  }
</style>
<style lang="less">
/*  .bBody-content .cell{ 
    word-break: break-all;
    text-overflow: ellipsis;
    display: -webkit-box; 
    -webkit-box-orient: vertical; 
    -webkit-line-clamp: 2; 
    overflow: hidden;  
  }*/
  .el-input--suffix .el-input__inner {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .el-dialog__footer{
    border-top: 1px solid #e5e5e5;
    padding-bottom: 10px;
  }
  .el-dialog__header{
    border-bottom: 1px solid #e5e5e5;
  }
</style>
