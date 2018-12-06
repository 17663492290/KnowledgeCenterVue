<template>
  <div class="sub-router">
    <div class="left-tree">
      <div class="classTree">
        <div class="treeSearch">
          <el-input placeholder="输入关键字进行过滤" 
            suffix-icon="el-icon-search" v-model="filterText">
          </el-input>
        </div>
        <div class="treeContent">
          <div class="block">
            <el-tree
              class="filter-tree"  
              :data="categoryTreeList"
              node-key="id"
              :props="defaultProps"
              :default-expanded-keys="idArr"
              :filter-node-method="filterNode"
              @node-click="selectList"
              ref="tree2">
              <span :title="node.checked  ?'取消标签':'设为标签'" class="custom-tree-inleaf" v-bind:class="{'custom-tree-sele':node.checked,'custom-tree-leaf': node.isLeaf}" slot-scope="{ node, data }">
                <span :title="node.label" class="custom-content custom-content-special" >{{ node.label }}</span>
                <span class="btn-content">
                  <el-button v-bind:class="{'star-sele':node.checked==2}" @click.stop="() => star(node,data)" icon="el-icon-star-on" :title="node.checked ==1?'设为主标签':'取消主标签'" type="text"></el-button>
                  <el-button icon="el-icon-success" type="text" style="margin-left:6px;"></el-button>
                </span>
              </span>
            </el-tree>
          </div> 
        </div>
      </div>
    </div>
    <div class="right-content">
      <div>
        <el-form ref="formRadio" :model="formRadio" :rules="rulesRadio" label-width="120px">
          <el-form-item label="发布类型：" prop="types">
            <el-radio-group v-model="formRadio.types" @change="resetVal">
              <el-radio label="0">知识分享</el-radio>
              <el-radio label="1">案例分享</el-radio>
            </el-radio-group> 
          </el-form-item>
        </el-form>
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
          <el-form-item label="选择城市：" required>
            <el-col :span="4">
              <el-form-item prop="sheng" style="margin-bottom: 0">
                <el-select
                  v-model="form.sheng"
                  @change="choseProvince()"
                  placeholder="请选择省份">
                  <el-option
                    v-for="item in province"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col v-if="shiShow" :span="4" class="col-interval">
              <el-form-item prop="shi" style="margin-bottom: 0">
                <el-select
                  v-model="form.shi"
                  @change="choseCity()"
                  placeholder="请选择城市">
                  <el-option
                    v-for="item in city"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col v-if="quShow" :span="4" class="col-interval">
              <el-form-item prop="qu" style="margin-bottom: 0">
                <el-select
                  v-model="form.qu"
                  placeholder="请选择地区">
                  <el-option
                    v-for="item in area"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="标题：" prop="tit">
            <el-input v-model="form.tit" style="width:400px"></el-input>
          </el-form-item>
          <el-form-item v-if="formRadio.types == '1'" label="客户名称：" prop="customer">
            <el-input v-model="form.customer" style="width:400px"></el-input>
          </el-form-item>
          <el-form-item v-if="formRadio.types == '1'" label="所需服务：" prop="server">
            <el-input v-model="form.server" style="width:400px"></el-input>
          </el-form-item>
          <el-form-item class="editor-box"> 
            <editor ref="skuImage" v-if="formRadio.types == '0'" :initData="change" @onUpdata="descriptionChange" v-model="content"></editor>
            <editor ref="skuImage" v-if="formRadio.types == '1'" :initData="changeBa" @onUpdata="descriptionChangeBa" v-model="caseBackground"></editor>
            <editor ref="skuImage" v-if="formRadio.types == '1'" :initData="changeSo" @onUpdata="descriptionChangeSo" v-model="solution"></editor>
          </el-form-item>  
          <el-form-item class="btn-box">
            <el-button class="el-button" type="primary" @click="onSubmit(1)">发布</el-button>
            <el-button class="el-button" type="info" plain @click="onSubmit(0)">存草稿</el-button>
            <el-button v-if = "cancled" class="el-button" type="info" plain @click="cancelSubmit">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
  import Editor from '../components/Editor'
  export default {
    components: {
      Editor
    },
    data () {
      return {
        change: '<p>请输入分享内容</p>',
        changeBa: '<p>案例背景</p>',
        changeSo: '<p>解决方案</p>',
        filterText: '',
        categoryTreeList: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        formRadio:{
          types: "0" 
        },
        form:{
          tit: '',
          sheng: '110000',
          shi: '',
          qu: '',
          customer: '',
          server: ''
        },
        rulesRadio:{
          types: [
            { required: true,message: '请选择发布类型', trigger: 'change' }
          ],
        },
        rules:{ 
          sheng: [
            { required: true,message: '省份不能为空', trigger: 'change' }
          ],
          shi: [
            { required: true,message: '城市不能为空', trigger: 'change' }
          ],
          qu: [
            { required: true,message: '地区不能为空', trigger: 'change' }
          ],
          tit: [
            { required: true, message: '请输入标题', trigger: 'blur' },
          ],
          tit: [
            { max: 30, message: '标题长度不能超过30个字符', trigger: 'blur' },
          ],
          customer: [
            { required: true, message: '请输入客户名称', trigger: 'blur' }
          ]
        },
        province:[],
        city:[],
        area:[],
        tableData:[],
        dialogVisible:false,
        dialogshow:false,
        parentShow:1,
        categoryId:'',
        dialogEditVisible:false,
        categoryIdList: [],
        primaryCategoryId: '',
        content: '',
        caseBackground: '',
        solution: '',
        shiShow: true,
        quShow: true,
        idArr: [],
        id: '',
        ispublisher: true,
        cancled: ''
      }
    },
    watch: {
      filterText(val) {
        this.$refs.tree2.filter(val);
      }
    },
    methods: {
      descriptionChange(content){
        this.content = content;
      },
      descriptionChangeBa(caseBackground){
        this.caseBackground = caseBackground;
      },
      descriptionChangeSo(solution){
        this.solution = solution;
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      // getTreeData(data,node,val){
      //   this.categoryId_tree = data.id; 
      //   this.getClassList(data.id)
      // },
      resetVal(){
        this.$refs["form"].resetFields();
      },
      selectList(data,node,val){
        if (node.isLeaf==true) {
          node.checked = node.checked==0?1:0;  
          this.categoryIdList = [];
          for(var key in this.$refs.tree2.getCheckedNodes()){
            if(this.$refs.tree2.getNode(this.$refs.tree2.getCheckedNodes()[key].id).checked == 1){
              this.categoryIdList.push(this.$refs.tree2.getCheckedNodes()[key].id);
            }
          }
        }
      },
      selectListDef(def){
        let that = this;
        let i = 0;
        var timers2 = setInterval(function(){
          if(i > 5){
            i = 0;
            clearInterval(timers2);
          }
          if(that.$refs.tree2){
            if(that.$refs.tree2.getNode(def[0]) != undefined){
              clearInterval(timers2);
              that.categoryIdList = def;
              for(var key in def){
                that.$refs.tree2.getNode(def[key]).checked = 1
              }
            }
          }
          i++;
        }, 60);
        // if(def){
          
        //   for(var key in def){
        //     if(this.$refs.tree2.getNode(def[key])){
        //       this.$refs.tree2.getNode(def[key]).checked == 1
        //     }
        //   }
        // }
      },
      star(node,data){
        if(node.checked == 2){
          node.checked = 1;
          this.primaryCategoryId = "";
        }else{
          if(this.$refs.tree2.getCheckedNodes()){
            for(var key in this.$refs.tree2.getCheckedNodes()){
              this.$refs.tree2.getNode(this.$refs.tree2.getCheckedNodes()[key].id).checked = 1;
            }
          }
          node.checked=2;
          let arr11 = [];
          for(var i = 0;i < this.categoryIdList.length;i++){
            if(this.categoryIdList[i] != node.data.id){
              arr11.push(this.categoryIdList[i])
            }
          }
          this.categoryIdList = arr11;
          this.primaryCategoryId = node.data.id
        }
      },
      starDef(def){
        var that = this;
        if(def){
          let i = 0;
          var timers = setInterval(function(){
            if(i > 5){
              i = 0;
              clearInterval(timers);
            }
            if(that.$refs.tree2){
              if(that.$refs.tree2.getNode(def) != undefined){
                clearInterval(timers);
                that.primaryCategoryId = def;
                that.$refs.tree2.getNode(def).checked = 2;
              }
            }
            i++;
          }, 60);
          // that.primaryCategoryId = def;
          // if(that.$refs.tree2.getNode(def)){
          //   that.$refs.tree2.getNode(def).checked = 2;
          // }
        }
      },
      getClassTree(){
        let loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        // this.$store.state.bid = '2030';
        var ip = '/api/category/getCategories';
        this.$http.get(ip,{headers: {'bid':  this.$store.state.bid}})
          .then((res) => {
            loading.close();
            this.categoryTreeList = res.data.data
            this.categoryTreeList.forEach(m => {
              this.idArr.push(m.id)
            })
          }, (err) => {
            console.log(err)
            loading.close();
          })
      },
      getProvince(def){
        // this.$store.state.bid = '1320';
        var ip = '/api/common/region/province';
        // this.$http.get(ip,{headers: {'bid':  this.$store.state.bid}})
        this.$http.get(ip,{params:{
            code:0,
          }}).then((res) => {
           /* loading.close();*/
            this.province = res.data.data;
            if(def){
              this.form.sheng = def;
            }
          }, (err) => {
            console.log(err)
          })
      },
      choseProvince:function(defShi,defQu) {
        var ip = '/api/common/region/city';
        this.area = [];
        if(this.sheng == "-1"){
          this.shi = "";
          this.qu = "";
          this.shiShow = false;
          this.quShow = false;
        }else{
          this.$http.get(ip,{params:{
            code:this.form.sheng,
          }}).then((res) => {
             /* loading.close();*/
              res.data.data.length == 0?(this.shiShow=false,this.quShow=false):(this.city = res.data.data,this.shiShow=true,this.quShow=true);
              this.form.shi = "";
              this.form.qu = "";
              if(defShi){
                this.form.shi = defShi;
                this.choseCity();
                if(defQu){
                  this.choseCity(defQu)
                }
              }
            }, (err) => {
              console.log(err)
          })
        }
      },
      choseCity:function(defQu) {
        var ip = '/api/common/region/area';
        if(this.form.shi == "-1"){
          this.qu = "";
          this.quShow = false
        }else{
          this.$http.get(ip,{params:{
          code:this.form.sheng + '_' + this.form.shi
          }}).then((res) => {
             /* loading.close();*/
              res.data.data.length == 0?this.quShow=false:(this.area = res.data.data,this.quShow=true);
              this.form.qu = "";
              if(defQu){
                this.form.qu = defQu;
              }
            }, (err) => {
              console.log(err)
          })
        }
      },
      onSubmit:function(status){
        let that = this;
        that.$refs['form'].validate((valid) => {
          if (valid) { 
            if(that.primaryCategoryId){
              var data = {
                provinceCode: that.form.sheng,
                cityCode: that.form.shi,
                areaCode: that.form.qu,
                type: that.formRadio.types,
                title: that.form.tit,
                categoryIdList: that.categoryIdList,
                primaryCategoryId: that.primaryCategoryId,
                state: status,
                bid: '2030'
              }
              var ip = "";
              if(that.formRadio.types == 0){
                if(that.content=="请输入分享内容"|| that.content == '<p></b></p>'){
                  that.$message({
                    type: 'error',
                    message: '分享内容不能为空'
                  })
                  return false
                }else{
                  Object.assign(data,{
                    content: that.content
                  })
                }
              }else{
                Object.assign(data,{
                  customerName: that.form.customer,
                  needService: that.form.server
                })
                if(that.caseBackground=="案例背景"|| that.caseBackground == '<p></b></p>'){
                  that.$message({
                    type: 'error',
                    message: '案例背景不能为空'
                  })
                  return false
                }else{
                  Object.assign(data,{
                    caseBackground: that.caseBackground
                  })
                }
                if(that.solution=="解决方案"|| that.solution == '<p></b></p>'){
                  that.$message({
                    type: 'error',
                    message: '解决方案不能为空'
                  })
                  return false
                }else{
                  Object.assign(data,{
                    solution: that.solution
                  })
                }
              }
              if(this.id){
                Object.assign(data,{
                  id: this.id
                })
              }
              if(that.id){
                ip = '/api/article/author/edit'
              }else{
                ip = '/api/article/author/save'
              }
              if(status == 1){
                that.$confirm('确认立即发布'+'《' + that.form.tit + '》吗?', '发布确认', {
                  confirmButtonText: '立即发布',
                  cancelButtonText: '稍后在说',
                  type: 'warning'
                }).then(() => {
                  let loading = that.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                  });
                  that.$http.post(ip,data).then((res) => {
                    if(res.data.code == 0){
                      if(res.data.data){
                        this.id = res.data.data
                      }
                      if(that.ispublisher && that.id){
                        let ip = `/api/article/author/publish/${that.id}`;
                        let par = {bid:'2032'}
                        that.$http.get(ip,{params:par}).then((res) => {
                          if(res.data.code == 0){
                            loading.close();
                            that.$message({
                              type: 'success',
                              message: '发布成功!'
                            })
                            that.$router.push('/releaseList');
                          }else{
                            loading.close();
                            that.$message({
                              type: 'error',
                              message: res.data.msg
                            })  
                          }
                        },(err) => {
                          loading.close();
                          that.$message({
                            type: 'error',
                            message: '服务器器异常'
                          })
                          console.log(err);
                        })
                      }else if(!this.ispublisher && this.id){
                        let ip = `/api/article/author/publish/${that.id}`;
                        let par = {bid:'2032'}
                        that.$http.get(ip,{params:par}).then((res) => {
                          if(res.data.code == 0){
                            loading.close();
                            that.$message({
                              type: 'success',
                              message: '发布成功!'
                            })
                            that.$router.push('/auditingList');
                          }else{
                            loading.close();
                            that.$message({
                              type: 'error',
                              message: res.data.msg
                            })  
                          }
                        },(err) => {
                          loading.close();
                          that.$message({
                            type: 'error',
                            message: '服务器器异常'
                          })
                          console.log(err);
                        })
                      }else{
                        loading.close();
                        that.$message({
                          type: 'success',
                          message: '发布成功'
                        })
                        setTimeout(function(){
                          that.$router.push('/releaseList');
                        },1200)
                      }
                    }else{
                      that.$message({
                        type: 'error',
                        message: res.data.msg
                      })
                      loading.close();
                    }
                  }, (err) => {
                    loading.close();
                    console.log(err)
                  }) 
                })
              }else if(status == 0){
                let loading = that.$loading({
                  lock: true,
                  text: 'Loading',
                  spinner: 'el-icon-loading',
                  background: 'rgba(0, 0, 0, 0.7)'
                });
                that.$http.post(ip,data).then((res) => {
                  if(res.data.code == 0){
                    if(res.data.data){
                      this.id = res.data.data
                    }
                    loading.close();
                    if(status == 0){
                      that.$message({
                        type: 'success',
                        message: '保存草稿成功'
                      })
                    }
                  }else{
                    loading.close();
                    that.$message({
                      type: 'error',
                      message: res.data.msg
                    })
                  }
                }, (err) => {
                  loading.close();
                  console.log(err)
                }) 
              }
            }else{
              that.$message({
                type: 'error',
                message: '主标签不能为空'
              })
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      cancelSubmit() {
        if(this.id){
          this.$router.go(-1)
        }
      },
      init(){
        this.getClassTree();
        this.getProvince();
      }
    },
    created () {
      this.init()
      if(this.$route.query.cId){
        this.id = this.$route.query.cId;
        this.cancled = this.$route.query.cId;
        var par = {};
        if(this.$route.query.user == 0){
          par = {'bid': '2042'}
        }else{
          par = {'bid': '2038'}
        }
        this.$http.get("api/article/"+this.$route.query.cId,{params:par}).then((res) => {
          console.log(res.data.data);
          this.form.sheng = res.data.data.provinceCode;
          this.choseProvince(res.data.data.cityCode,res.data.data.areaCode);
          this.form.tit = res.data.data.title;
          this.formRadio.types = res.data.data.type+"";
          this.form.customer = res.data.data.customerName;
          this.form.server = res.data.data.needService;
          this.selectListDef(res.data.data.categoryIdList);
          this.starDef(res.data.data.primaryCategoryId);
          this.change = res.data.data.content;
          this.content = res.data.data.content;
          this.changeBa = res.data.data.caseBackground;
          this.caseBackground = res.data.data.caseBackground;
          this.changeSo = res.data.data.solution;
          this.solution = res.data.data.solution;
          this.ispublisher = res.data.data.ispublisher;
        })
      }else{
        this.form.sheng = "110000"
        this.choseProvince();
      }
    }
  }
</script>

<style lang="less" scoped>
  .custom-tree-inleaf {
    display: inline-block;
    width: 100%;
    line-height: 22px;
    .btn-content {
      position: absolute;
      right: 0px;
    }
    .el-button {
      padding: 2px 0px;
    }
  }
  .el-tree {
    background: #f8fdff;
  }
  .sub-router{
    /* position: absolute;
     top:194px;*/
    width:100%;
    /*bottom:20px;*/
    float:left;
    min-width: 1280px;
    overflow: hidden;
  }
  .sub-router .left-tree{
    width:19%;
    min-height:calc(100vh - 112px);
    background-color: #f8fdff;
    float:left;
    overflow: auto;
    margin-bottom: -99999px; 
    padding-bottom: 99999px;
  }
  .sub-router .right-content{
    width:80%;
    /*min-height:calc(100vh - 178px);*/
    background-color: #fff;
    float:left;
    position: relative;
    padding-top: 20px;
    margin-bottom: -99999px; 
    padding-bottom: 99999px;
  }
  /*树组件样式*/
  .classTree{
    padding:22px;
  }
  .classTree .treeSearch{
   /* border:1px solid #ccc;
    border-radius: 4px;
    padding:0 20px;*/
    margin-bottom:20px;
  }
  .bBody-pagination{
    background-color: #fff;
    padding:30px;
    text-align: center;
  }
  .right-content .el-button{
    padding: 10px 30px;
    font-size: 14px;
  }
  .el-input__icon {
    line-height: 33px;
  }
  .el-form-item {
    margin-bottom: 12px;
  }
  .classTree .treeNode{
    /*margin-bottom:10px;*/
    padding:5px 0px;
    position:relative;
    cursor: pointer;
    /*border-left:1px dashed #8daaca;*/
    padding-left:20px;
  }
  .classTree .treeNode:hover{
    background-color: #dff3fc;
  }
  .classTree .treeNode2_box{
    /* border-left:1px dashed #8daaca;*/
    padding-left:30px;
  }
  .editor-box {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    width:95%; 
    margin-top: 22px;
  }
  .btn-box{
    margin-left: 2.5%;
    margin-bottom: 20px;
  }
  .col-interval{
    margin-left: 30px;
  }
</style>
<style lang="less">
  .el-select-dropdown__list{
    padding-bottom:22px;
  }
  .el-icon-success{
    margin-right: 10px
  }
  .custom-tree-sele{
    background-color: #1972ea;
  }
  .el-icon-star-on,.el-icon-success{
    display: none;
    color: #aaa;
    font-size: 16px;
    margin-top: 2px;
  }
  .custom-tree-leaf{
    &:hover{
      .el-icon-success{
        display:inline-block;
      }
    }
  } 
  .custom-tree-sele .el-icon-star-on:hover{
    color:#ffc600;
  }
  .custom-tree-sele .el-icon-success,.custom-tree-sele .el-icon-star-on{
    display: inline-block;
    color: #fff;
  }
  .el-tree-node__content{
    margin-bottom: 4px;
  }
  .custom-content-special{
    padding-left: 10px;
  }
  .custom-tree-node .btn-content:hover,.custom-tree-inleaf .btn-content:hover{
    background-color: transparent;
  }
  .custom-tree-sele .custom-content{
    color: #fff;
  }
  .star-sele .el-icon-star-on{
    color:#ffc600;
  }
</style>

 