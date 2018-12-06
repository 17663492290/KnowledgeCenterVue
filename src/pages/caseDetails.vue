<template>
    <div class="content-body">
        <el-container>
            <el-main>
                <el-row class="line1">
                    <el-col :span="12" style="margin-right:30px;">
                        <h1 style="width:90%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">{{articleData.title}}</h1>
                    </el-col>
                    <el-col v-if="(articleData.state != 2 && articleData.state != 3) && $store.state.permission.permissions.hasOwnProperty('k2') && $store.state.permission.permissions.k2.hasOwnProperty('k2_b6')" :span="2" >
                        <el-button style="width: 90%;" type="success" @click="adoptAuditing">通过</el-button>
                    </el-col>
                    <el-col v-if="(articleData.state != 2 && articleData.state != 3) && $store.state.permission.permissions.hasOwnProperty('k2') && $store.state.permission.permissions.k2.hasOwnProperty('k2_b6')" :span="2" >
                        <el-button style="width: 90%;" type="danger" @click="adopt=true">不通过</el-button>
                    </el-col>
                </el-row>
                <el-row class="line2" >
                    <el-col :span="3" class="scrollBar">
                        <span class="tab1">{{articleData.primaryCategoryName}}</span>
                    </el-col>
                    <el-col :span="4">
                        <i class="icon icon_3"></i><span>{{articleData.createTime}}</span>
                    </el-col>
                    <el-col :span="2">
                        <i class="icon icon_5"></i><span class="user-name">{{articleData.userName}}</span>
                    </el-col>
                    <el-col :span="5">
                        <el-row>
                            <el-col :span="8">
                                <i class="icon icon_2"></i><span>{{articleData.visitNum}}</span>
                            </el-col>
                            <el-col :span="8"><!-- GiveUp(scope.row) -->
                                <div @click="GiveUp()">
                                    <i class="icon" style="cursor: pointer;" :class="articleData.like?'icon_up':'icon_4'"></i><span>{{articleData.likeNum}}</span>
                                </div>
                            </el-col>
                            <el-col :span="8">
                                <div @click="treadOn()" style="cursor: pointer;">
                                    <i class="icon" style="cursor: pointer;" :class="articleData.tread?'icon_down':'icon_1'"></i><span>{{articleData.treadNum}}</span>
                                </div>
                            </el-col>
                        </el-row>
                    </el-col>
                    <el-col :span="5" >
                        <el-button v-if="(articleData.ispublisher || articleData.state != 2 && articleData.state != 3) && $store.state.permission.permissions.hasOwnProperty('k2') && $store.state.permission.permissions.k2.hasOwnProperty('k2_b5')" class="btnGroup" type="primary" size="mini" plain @click="edit">编辑</el-button>
                        <el-button v-if="(articleData.state != 2 && articleData.state != 3) && $store.state.permission.permissions.hasOwnProperty('k2') && $store.state.permission.permissions.k2.hasOwnProperty('k2_b4')" class="btnGroup" type="primary" size="mini" :disabled="articleData.state==2?false:true" @click="hotArticle"  plain>{{articleData.hot==0?"加精":"去精"}}</el-button>
                        <el-button v-if="(articleData.state != 2 && articleData.state != 3) && $store.state.permission.permissions.hasOwnProperty('k2') && $store.state.permission.permissions.k2.hasOwnProperty('k2_b1')" class="btnGroup" type="primary" size="mini" @click="reassignment" plain >改派</el-button>
                    </el-col>
                    <el-col :span="5" >
                        <i v-if="articleData.state==1" class="result_icon toAudited"></i>
                        <i v-else-if="articleData.state==2" class="result_icon audited"></i>
                        <i v-else-if="articleData.state==3" class="result_icon noThrough"></i>
                    </el-col>
                </el-row> 
                <el-row class="line2 line3">
                    <el-col :span="15">
                        <span class="tab2" v-for="item in articleData.categoryNames" :key="item.index">{{item}}</span>
                    </el-col>
                </el-row> 
                <el-row class="line4">
                    <el-col :span="24" >
                        <div v-if="type == 1" class="line_body">
                            <div class="line_title">
                                <span>客户名称：</span>
                                <span>{{articleData.customerName}}</span>
                            </div>
                            <div class="case_background">
                                <p class="content-title"><span></span><span>案例背景：</span> </p>  
                                <div class="content-detail" v-html="articleData.caseBackground">
                               </div>
                            </div>
                            <div class="case_scheme">
                                <p class="content-title"><span></span>  <span>解决方案：</span> </p>  
                                <div class="content-detail" v-html="articleData.solution">
                                </div>
                            </div>
                        </div>
                        <div v-if="type == 0" class="line_body">
                            <div class="case_background">
                                <div class="content-detail" v-html="articleData.content">
                               </div>
                            </div>
                        </div>
                    </el-col>
                </el-row> 
            </el-main>
            <el-aside>
                <div class="aside_content">
                    <div>
                        <div class="title_box">
                            <label>浏览记录</label>
                            <el-input class="search" placeholder="请输入用户名" clearable 
                                v-model="filterText" 
                                suffix-icon="el-icon-search">
                            </el-input>
                        </div>
                        <div class="content_box">
                            <div class="title">
                                <span>浏览时间</span>
                                <span class="name">浏览人</span>
                            </div>
                            <div class="browse_none" v-if = "!visitList.length">{{browseNone}}</div>
                            <ul v-else class="content_lists scrollBar">
                                <li v-for="item in visitList" 
                                :key="item.index">
                                    <span>{{item.visitTime}}</span>
                                    <span class="name">{{item.visitName}}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                     <div>
                        <div class="title_box">
                            <label>操作记录 </label>
                        </div>
                        <div class="content_box2">
                            <div class="title">
                                <span>操作时间</span>
                                <span>类型</span>
                                <span class="name">浏览人</span>
                            </div>
                            <div class="browse_none" v-if = "!operationList.length">{{actionNone}}</div>
                            <ul v-else class="content_lists scrollBar">
                                <li v-for="item in operationList"
                                :key="item.index">
                                    <span>{{item.operateTime}}</span>
                                    <span>{{item.typeName}}</span>
                                    <span class="name">{{item.operateName}}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </el-aside>
        </el-container>
         <!-- :title="btnType == 2?'审核通过':'审核未通过'" -->
        <el-dialog
            title = '审核未通过'
            :visible.sync = "adopt"
            width="30%"
            :before-close="GGcancel"
            :close-on-click-modal="true"
            :modal-append-to-body="false">
            <div style="width:100%;max-height:60vh;">
                <el-row class="setPermission">
                    <el-col :span="8" style="width:100%;margin: 18px 0" >
                        <span style="float:left;"><span style="color:red">*</span> 未通过原因：</span>
                        <textarea v-model='textArea' type="text" style="width:70%;height:98px;float:left;padding:12px;border:1px solid #d2d2d2;resize:none;overflow-y: auto"/>
                    </el-col>
                </el-row> 
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="GGcancel">取 消</el-button>
                <el-button type="primary" @click="saveGGAttr">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title = '改派'
            :visible.sync="dialogVisible"
            width="680px"
            top="10vh"
            :before-close="cancelDialog"
            :close-on-click-modal="true"
            :modal-append-to-body="false">
            <div style="width:100%;height:400px; margin-top: 10px;">
                <el-row class="batch">
                    <el-col style="text-align:center height:100%" :span="10">
                        <div class="classTree" style="margin-top: 0;">
                            <div class="treeSearch">
                                <el-input placeholder="请输入内容" suffix-icon="el-icon-search" v-model="filterTxt"></el-input>
                            </div>
                            <div class="treeContent scrollBar">
                                <div class="block">
                                    <el-tree
                                        class="filter-tree"  
                                        :data="treeDataDialog"
                                        node-key="id"
                                        :props="defaultProps"
                                        :default-expanded-keys="idArr"
                                        :filter-node-method="filterNode"
                                        @node-click="handleNodeDialog"
                                        ref="tree2">
                                        <span :title="node.checked?'取消标签':'设为标签'" class="custom-tree-node" v-bind:class="{'custom-tree-sele':node.checked}" slot-scope="{ node, data }">
                                          <span :title="node.label" class="custom-content custom-content-special">{{ node.label }}</span>
                                          <span class="btn-content">
                                            <el-button icon="el-icon-success" type="text" style="margin-right: 8px;"></el-button>
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
                <el-button @click="cancelDialog">取 消</el-button>
                <el-button type="primary" @click="saveDialog">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

  export default {
    created (){
        this.id = this.$route.query.cId;
        this.type = this.$route.query.type;
        this.getData()
    },
    data () {
      return {
        browseNone: "请求中...",
        actionNone: "请求中...",
        adopt:false,
        articleData:[],
        visitList:[],
        operationList:[],  
        filterText: '', 
        filterTxt: '',
        id: '',  
        type: '',    
        dialogVisible:false,
        textArea:'',
        disabled:false,
        treeDataDialog: [],
        categoryIdDialog: [],
        userList:[],
        userListB: [],
        idArr: [],
        empId: ''
      }
    },
    watch: {
        filterText(val){
           this.visitData()
        },
        filterTxt(val){
           this.$refs.tree2.filter(val);
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
        }
    },
    methods: {
        //初始数据
        getData(){
            let loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            let ip =`/api/article/`+this.id
            this.$http.get(ip,{params:{bid: '2038'}}).then(res=>{
                loading.close();
                this.visitData()
                this.operationData()
                this.articleData = res.data.data
            },err=>{
                console.log(err)
            })
        },
        //取消按钮
        GGcancel(){
            this.adopt = false;
        },
        //审核不通过
        saveGGAttr () {
             if(this.textArea==""){
                this.$message({
                    type: 'error',
                    message: "原因不能为空！"
                });
            }else{
                var ip = `/api/article/checker/passArticle/${this.id}/3`;
                this.$http.get(ip,{
                    params:{
                        reason:this.textArea,
                        bid: '2043'
                    }
                })
                .then((res) => {
            
                    if(res.data.code == '0'){
                    this.$message({
                        type: 'success',
                        message: res.data.msg
                    });
                    this.adopt = false;
                    this.getData()
                    this.$router.push({
                        path: "/auditingList"
                    })
                    }else{  
                        this.$message({
                            type: 'error',
                            message: res.data.data.msg
                        });
                    }  
                
                }, (err) => {
                    console.log(err)
                })
            }
        },
        //通过审核确定按钮
        adoptAuditing(){
            this.$confirm('是否确认审核通过该文章?', '确认信息', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(() => {
                let loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                let ip = `/api/article/checker/passArticle/`+this.id+'/'+2;
                this.$http.get(ip,{params:{bid: '2043'}})
                .then((res) => {  
                    loading.close();  
                    if(res.data.code == 0){
                        this.$confirm('已审核通过,是否将文章设为精品?', '精品', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'success'
                        }).then(() => {
                            let loading = this.$loading({
                                lock: true,
                                text: 'Loading',
                                spinner: 'el-icon-loading',
                                background: 'rgba(0, 0, 0, 0.7)'
                            });
                            let ip = '/api/article/checker/addDigest/' + this.articleData.id + "/1";
                            this.$http.post(ip,{bid: '2037'}).then((res)=>{
                                loading.close();  
                                if(res.data.code==0){
                                    this.$message({
                                        type: 'success',
                                        message: '添加精品成功!'
                                    });
                                    this.$router.push({
                                        path: "/auditingList"
                                    })
                                }else{
                                    this.$message({
                                        type: 'error',
                                        message: res.data.msg
                                   }); 
                                }
                            },err=>{
                                console.log(err)
                            })
                        }).catch(() => {
                            // this.$message({
                            //     type: 'info',
                            //     message: '已取消'
                            // });          
                        });
                    }else{
                        this.$message({
                            type: 'error',
                            message: res.data.msg
                       }); 
                    }
                }, (err) => {
                    console.log(err)
                })
            }).catch(() => {
                // this.$message({
                //     type: 'info',
                //     message: '已取消'
                // });          
            });
        },
        //浏览记录
        visitData(){
            let ip =`/api/article/visit`+"/"+this.id
            this.$http.get(ip,{
                params:{
                    userName: this.filterText,
                    bid: '2039'
                }
             }).then(res=>{
                console.log(res);
                if(res.data.data.length  == 0){
                    this.browseNone = "没有浏览数据"
                }else{
                    this.visitList = res.data.data
                }
             },err=>{
                 console.log(err)
             })
        },
        //操作记录
        operationData(){
            let ip =`/api/article/operation/`+this.id
            this.$http.get(ip,{
                    params:{
                        bid: '2039'
                    }
                }).then(res => {
                if(res.data.data.length  == 0){
                    this.actionNone = "没有操作记录"
                }else{
                    this.operationList = res.data.data
                }
            },err=>{
                console.log(err)
            })
        },
        //加精和去精按钮
        hotArticle(){
            if(this.articleData.hot == 0){ 
                this.$confirm('确认将文章设为精品么?', '确认信息', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(() => {
                    let loading = this.$loading({
                        lock: true,
                        text: 'Loading',
                        spinner: 'el-icon-loading',
                        background: 'rgba(0, 0, 0, 0.7)'
                    });
                    let ip = '/api/article/checker/addDigest/' + this.articleData.id + "/1";
                    this.$http.post(ip,{bid: '2037'}).then((res)=>{
                        loading.close();  
                        if(res.data.code==0){
                            this.$message({
                                type: 'success',
                                message: '添加精品成功!'
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
                }).catch(() => {
                    //console.log("点击了取消")         
                });
            }else if(this.articleData.hot == 1){
                this.$confirm('确认取消精品么?', '确认信息', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(() => {
                    let ip = '/api/article/checker/addDigest/' + this.articleData.id + "/0";
                    this.$http.post(ip,{bid: '2037'}).then((res)=>{
                        if(res.data.code==0){
                            this.$message({
                                type: 'success',
                                message: '取消精品成功!'
                            });
                            this.getData()
                        }
                    },err=>{
                        console.log(err)
                    })
                }).catch(() => {
                   //console.log("点击了取消")         
                });
            }
        },
        //点赞
        GiveUp(){
            if(this.articleData.like == false && this.articleData.tread == false){
                let ip = '/api/article/praise/'+ this.id + "/1/1"
                this.$http.post(ip,{bid: '2030'}).then((res) => {
                    if(res.data.code == 0){
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
                    }
                }, (err) => {
                    console.log(err);
                })
            }else if( this.articleData.like == false && this.articleData.tread == true ){
                this.$message({
                    type: 'error',
                    message: "操作失败,您已将此文章标记为无用,请先取消踩"
                });
                return
            }else if(this.articleData.like == true && this.articleData.tread == false){
                let ip = '/api/article/praise/' + this.id + "/1/2"
                this.$http.post(ip,{bid: '2030'}).then((res) => {
                    if(res.data.code==0){
                        this.$message({
                            type: 'success',
                            message: "取消赞成功"
                        });
                        this.getData();
                    }else{
                        this.$message({
                            type: 'error',
                            message: res.data.msg
                        })
                        return
                    }
                }, (err) => {
                    console.log(err);
                })
            }
        },
        //踩
        treadOn(){
            if(this.articleData.like == false && this.articleData.tread == false){
                let ip = '/api/article/praise/' + this.id + "/2/1"
                this.$http.post(ip,{bid: '2030'}).then((res) => {
                    if(res.data.code == 0){
                        this.$message({
                            type: 'success',
                            message: "操作成功"
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
             }else if(this.articleData.like == true && this.articleData.tread == false){
                this.$message({
                    type: 'error',
                    message: '操作失败,您已将此文章标记为有用,请先取消赞'
                });
             }else if(this.articleData.like == false && this.articleData.tread == true){
                let ip = '/api/article/praise/' + this.id + '/2/2'
                this.$http.post(ip,{bid: '2030'}).then((res) => {
                    if(res.data.code==0){
                        this.$message({
                            type: 'success',
                            message: "操作成功"
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
            }
        },
        edit(){
            this.$router.push({path:'/release',query: {cId: this.id,user: '1'}});
        },
        handleNodeDialog (data, node, self) {
        //this.$store.commit('setBid','1340');
        // 树节点的点击事件
            if (node.isLeaf==true) {
                this.categoryIdDialog = [];
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
                    this.categoryIdDialog.push(data.id);
                } 
                // var ip = '/api/article/checker/changeAuditor?emp_Ids=' + this.categoryIdDialog2.join(",") + '&category_ids='
                if(this.categoryIdDialog.join(",")){
                    var ip = '/api/article/checker/getReassignmentEmps/' + this.categoryIdDialog.join(",");
                    this.$http.get(ip,{params:{'bid': '2034'}}).then((res) => {
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
        cancelDialog(){
            this.dialogVisible = false;
            this.categoryIdDialog = [];
            // this.primaryCategoryId = '',
            // this.getData();
        },
        saveDialog(){
            var ip = '/api/article/checker/changeAuditor?emp_Id=' + this.empId + '&articleIds=' + this.id;
            if(this.categoryIdDialog.join(",") == ''){
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
            this.$http.get(ip,{bid: '2034'}).then((res) => {
                if(res.data.code==0){
                    this.dialogVisible = false;
                    this.getData();
                    this.categoryIdDialog = [];
                    this.getTreeData();
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
        getTreeData(){
            //this.$store.commit('setBid','1340');
            this.loading = true;
            this.$http.get('/api/category/getCategories',{params:{'bid': '2032'}})
            .then((res) => {
                this.loading = false;
                this.treeDataDialog = res.data.data;
                this.treeDataDialog.forEach(m => {
                  this.idArr.push(m.id)
                })
            }, (err) => {
                console.log(err);
            })     
        },
        reassignment(){
            this.dialogVisible = true
            this.getTreeData()
        },
        userSelected(ele){
            this.empId = ele
        }
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
        padding: 40px;
    }
  
    body > .el-container {
        margin-bottom: 40px;
    }
    .line1{
        margin-bottom:20px;
        line-height:30px;
    }
    .line1 h1{
        font-size:22px;
        font-weight: 600;
    }
    .line2{
        line-height:30px;
        .tab1,.tab2{
            background-color: #ffd7d7;
            color:#ff3131;
            padding:0px 10px;
            border-radius: 5px;
            display:inline-block;
            text-align: center;
            margin-left: 5px;
        }
        .tab1{
            box-sizing: border-box;
            max-width: 90%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .tab2{
            background-color: #d3e4fb;
            color: #6c6e72;
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
            display: inline-block;
            height: 30px;
            vertical-align: top;
            background: url(../assets/images/icon5.png) no-repeat center;
            background-size:contain;
        }
        .result_icon{
            display: inline-block;
            width:120px;
            height:120px;
            position: absolute;
            right: 40px; 
            top: -50px;
        }
        .toAudited{
            background: url(../assets/images/toAudited.png) no-repeat center;
            background-size:contain;
        }
        .audited{
            background: url(../assets/images/audited.png) no-repeat center;
            background-size:contain;
        }
        .noThrough{
            background: url(../assets/images/noThrough.png) no-repeat center;
            background-size:contain;
        }
    }
    .line3{
        padding-bottom: 14px;
        border-bottom:2px solid #f0f0f0;
    }
    .line4{
        margin-top: 16px;
        height: calc(100vh - 346px);
        overflow-y: auto; 
    }
    .aside_content{
        width:90%;
        margin:20px 0;
        .title_box{
            background-color: #83a3d2;
            height:45px;
            text-align: left;
            padding-left: 6%;
            label{
                color:#fff;
                font-size:13px;
                display: inline-block;
                width:26%;
                padding:7px 0;
                line-height:30px;
            }  
            .search{
                background-color: #fff;
                width:66%;
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
        }
        .content_box2{
            border:1px solid #83a3d2;
            text-align: left;
            .title{
                background-color: #f2f2f2;
            }
            .title:first-child span:first-child{
                margin-right:67px
            }
            
        }
        .title,li{
            padding:0 15px;
            height:30px;
            line-height:30px;
            .name{
                float:right;
                width: 70px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
            span:first-child{
                margin-right:20px
            }
        }
        .content_lists{
            height: calc(50vh - 156px);
            overflow-y: auto;
        }
    }
    .line_body{
        font-size:13px;
        .line_title{
            background:#f2f2f2;
            height:50px;
            padding-left: 12px;
            span{
                display:inline-block;
                line-height: 50px;
                font-size:15px ;
                color:#000000
            }
            span:last-child{
                font-weight: 600
            }
        }
        .case_background,.case_scheme {
           margin-top:17px
        }
        .case_background p,.case_scheme p{
            height:34px;
      
            line-height: 24px;
            span{
                display: inline-block;
                height:34px;
                line-height: 34px;
                color:#1972ea;
                float:left
            } 
            span:first-child{
                width:6px;
                height:18px;
                background:#1972ea;
                margin:8px 13px 0 0;
                border-radius: 3px
            }
        }
      
    }
    .el-message-box .el-message-box__message{
        width:100px!important;
        background:pink
    }
    .el-message-box__input{
        width:100px
    }
    .icon_up{
        cursor: pointer;
        display:inline-block;
        width:15px;
        height:15px;
        background:url(../assets/images/icon_up.png) no-repeat center
        }
    .icon_down{
        cursor: pointer;
        display:inline-block;
        width:15px;
        height:15px;
        background:url(../assets/images/icon_down.png) no-repeat center
    }
    .content-title{
        margin-left: 5px;
    }
    .content-detail{
        padding-left: 20px;
        margin-top: 10px;
    }
    .browse_none{
        box-sizing: border-box;
        height: calc(50vh - 156px);
        text-align: center;
        padding: 30px 0;
        color: #aaa;
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
    .el-tree {
        background: #f8fdff;
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
        margin-top: 20px;
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
    .batchNone{
        text-align: center;padding-top: 30px;color: #999;
    }
    .user-name{
        display: inline-block;
        width: 52px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
</style>
