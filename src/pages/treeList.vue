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
              :expand-on-click-node="false"
              :filter-node-method="filterNode"
              @node-click="getTreeData"
              ref="tree2">
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <span :title="node.label" class="custom-content" >{{ node.label }}</span>
                <!-- <span v-if="$store.state.permission.permissions.category_action.hasOwnProperty('category_bk_tree_action')" class="btn-content"> -->
                <span class="btn-content">
                    <el-button @click.stop="() => append(node,data)" icon="el-icon-plus" type="text"></el-button>
                    <el-button @click.stop="() => edit(node, data)" icon="el-icon-edit" type="text"></el-button>
                    <el-button @click.stop="() => remove(node, data)" icon="el-icon-delete" type="text"></el-button>
                    <el-button v-if="node.isLeaf==true&&node.previousSibling" @click.stop="() => move(node, data,'up')" style="margin-left: 0px;" icon="el-icon-sort-up" type="text"></el-button>
                    <el-button v-if="node.isLeaf==true&&!node.previousSibling" @click.stop="() => {return false}" style="margin-left: 0px;color:#ccc" icon="el-icon-sort-up" type="text"></el-button>
                    <el-button v-if="node.isLeaf==true&&node.nextSibling" @click.stop="() => move(node, data,'down')" style="margin-left: 0px;" icon="el-icon-sort-down" type="text"></el-button>
                    <el-button v-if="node.isLeaf==true&&!node.nextSibling" @click.stop="() => {return false}" style="margin-left: 0px;color:#ccc" icon="el-icon-sort-down" type="text"></el-button>
                </span>
              </span>
            </el-tree>
          </div>
        </div>
       <!--  <div v-if="$store.state.permission.permissions.category_action.hasOwnProperty('category_bk_tree_action')" @click="appendNew" class="addNode1">+增加一级类目</div> -->
        <div @click="appendNew" class="addNode1">+增加一级类目</div>
      </div>
    </div>
    <div class="right-content">
      <div class="classList list">
        <div class="right-content_tips">
          <p class="right-content_txt">请在左侧维护知识类目树，<br/>请特别注意修改动作，会同步更新已发布文章。</p>
        </div>
      </div>
    </div>
    <!--新增类目-->
    <el-dialog
      title="新增类目"
      :visible.sync="dialogVisible"
      width="30%"
      top="20vh"
      :before-close="cancel"
      :close-on-click-modal="true"
      :modal-append-to-body="false">
        <el-form ref="form" :model="form" :rules="rules"  label-width="95px">      
          <el-form-item  label="类目分类：" prop="" style="">
            <el-input disabled placeholder="请输入内容" v-model="form.categoryType"></el-input>
          </el-form-item>
            <el-form-item  label="类目级别：" prop="" style="">
            <el-input disabled placeholder="请输入内容" v-model="form.categoryLevel"></el-input>
          </el-form-item>
           <el-form-item v-if="parentShow == 1"  label="父类目：" prop="" style="">
            <el-input disabled placeholder="" v-model="form.parentName"></el-input>
          </el-form-item>
           <el-form-item  label="类目名称：" prop="categoryName" style="">
            <el-input placeholder="请输入类目名称" v-model="form.categoryName"></el-input>
          </el-form-item>
         <!--  <el-form-item  label="类目编号：" prop="categoryId"  style="">
            <el-input placeholder="请输入类目ID" v-model="form.categoryId"></el-input>
          </el-form-item> -->
        </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="categorySave">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="类目修改"
      :visible.sync="dialogEditVisible"
      width="30%"
      top="20vh"
      :before-close="editcCancel"
      :close-on-click-modal="true"
      :modal-append-to-body="false">
        <el-form ref="editForm" :model="editForm"  label-width="95px">      
           <el-form-item  label="类目名称：" style="margin: 25px 0">
            <el-input placeholder="请输入类目名称" v-model="editForm.categoryName"></el-input>
          </el-form-item>
        </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editcCancel">取 消</el-button>
        <el-button type="primary" @click="editAjax">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        filterText: '',
        categoryTreeList: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        form:{
          categoryType:'后台分类',
          categoryLevel:'一级类目',
          parentName:'',
          parentId:'',
          categoryName:'',
          categoryId:'',
          path:''
        },
        rules:{
          categoryName:[ { required: true, message: '请输入类目名称', trigger: 'blur' }],
        },
        dialogVisible:false,
        dialogshow:false,
        parentShow:1,
        categoryId:'',
        dialogEditVisible:false,
        editForm:{
          categoryNameOld: '',
          categoryName:'',
          label:'',
          parentId:''
        },
        editId:'',
        categoryId_tree:'',
        idArr: []
      }
    },
    watch: {
      filterText(val) {
        this.$refs.tree2.filter(val);
      }
    },
    methods: {
      descriptionChange(imageText){
          this.imageText = imageText;
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      getTreeData(data,node,val){
        this.categoryId_tree = data.id;
      },
      categorySave(){
         this.$refs['form'].validate((valid) => {
          if (valid) {
              this.$http.post('/api/category/addCategory.html',{
                categoryName: this.form.categoryName,
                parentId:this.form.parentId,
                bid:'2035'
           }).then((res) => {
             if(res.data.code == 200){
                this.dialogVisible = false;
                this.getClassTree();
                this.form.parentId = 0,
                this.form.label = '',
                this.form.categoryName = '',
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
                this.dialogVisible = false;
                this.form.parentId = '',
                this.form.label = '',
                this.form.categoryId = '',
                this.form.path = ''
                this.$message({
                    type: 'error',
                    message: '新增失败'
                  })
              })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      cancel(){
        this.dialogVisible = false;
        this.form.parentId = 0;
        this.form.label = '';
        this.form.categoryId = '';
        this.form.categoryLevel = '';
        this.form.path ='';
        this.form.parentName = '';
      },
      appendNew () {
        this.dialogVisible = true;
        this.parentShow = 0;
        this.form.categoryLevel = '一级类目';
        // this.form.parentName = node.data.label;
        // this.form.parentId = data.id;
        // this.form.path = data.bkPath;
      },
      append(node,data) {
        this.dialogVisible = true;
        this.parentShow = 1;
        this.form.categoryLevel = '子级类目';
        
        this.form.parentName = node.data.label;
        this.form.parentId = data.id;
      },
      edit(node, data) {
        this.dialogEditVisible = true;
        this.editId = data.id;
        this.editForm.label = data.label
        this.editForm.categoryName = node.data.label
        this.editForm.categoryNameOld = node.data.label
        this.editForm.parentId = data.pid;
        // this.$prompt('请输新名称', '修改', {
        //   confirmButtonText: '确定',
        //   cancelButtonText: '取消',
        //   inputValue: data.label,
        // }).then(({ value }) => {

        // }).catch(() => {
        //   this.$message({
        //     type: 'info',
        //     message: '取消输入'
        //   })
        // });
      },
      editAjax(){
        if(!this.editForm.categoryName){
          this.$message({
            type: 'error',
            message: '类目名称不能为空'
          })
        }else if(this.editForm.categoryNameOld == this.editForm.categoryName){
          this.$message({
            type: 'error',
            message: '类目名称不能与原名称相同'
          })
        }else{
          this.$http.post('/api/category/editCategory.html',{
            categoryName: this.editForm.categoryName,
            id:this.editId,
            parentId:this.editForm.parentId,
            bid:"2035"
          }).then((res) => {
          if(res.data.code == 200){
            this.editForm.label = '';
            this.editForm.categoryName="";
            this.dialogEditVisible = false;
            this.editForm.categoryNameOld = ""
            this.$message({
              type: 'success',
              message: '编辑成功'
            })
            this.getClassTree();
          }else{
            this.$message({
              type: 'error',
              message: res.data.msg
            })
          }
        }, (err) => {
          this.$message({
              type: 'error',
              message: '修改失败'
            })
          })
        }
      },
      editcCancel(){
        this.dialogEditVisible = false;
        this.editForm.categoryName = '';
        this.editForm.categoryId = '';
        this.editId = '';
        this.editForm.categoryNameOld = ''
      },
      remove(node, data) {
        // const parent = node.parent;
        // const children = parent.data.children || parent.data;
        // const index = children.findIndex(d => d.id === data.id);
        // children.splice(index, 1);
         this.$confirm('确认是否执行该删除操作?', '删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
             this.$http.post('/api/category/deleteCategory.html',{
              id: data.id,
              bid: "2035"
           }).then((res) => {
             if(res.data.code == 200){
                this.$message({
                    type: 'success',
                    message: res.data.msg
                  })
                this.getClassTree();
             } else{
                this.$message({
                    type: 'error',
                    message: res.data.msg
                  })
             }
              }, (err) => {
                this.$message({
                    type: 'error',
                    message: '删除失败'
                  })
              })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          })
        });
      },
      move(node, data, flag){
        if(flag=="up"){
          var suffixId = node.previousSibling==null?"":node.previousSibling.data.id;
        }else{
          var suffixId = node.nextSibling==null?"":node.nextSibling.data.id;
        }
        var ip = '/api/category/sortCategory.html?id1='+ data.id + '&id2=' + suffixId;
        this.$http.post(ip,{headers: {'ContentType':'application/x-www-form-urlencoded','bid':'2035'}})
          .then((res) => {
           /* loading.close();*/   
            // this.categoryTreeList = res.data.data
            if(res.data.msg=="排序成功！"){
              this.$message({
                type: 'success',
                message: '移动成功'
              })
              this.getClassTree()
            }
          }, (err) => {
            console.log(err)
          })
      },
      getClassTree(){
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        var ip = '/api/category/getCategories';
        this.$http.get(ip,{headers: {'bid':'2035'}})
          .then((res) => {
            loading.close();
            this.categoryTreeList = res.data.data
            this.categoryTreeList.forEach(m => {
              this.idArr.push(m.id)
            })
          }, (err) => {
            console.log(err)
          })
      },
      init(){
        this.getClassTree();
      }
    },
    created () {
      this.init();
    },
  }
</script>

<style lang="less" scoped>
  .custom-content{
    width: 50%;
  }
  .custom-tree-node {
    display: inline-block;
    width: 100%;
    line-height: 27px;
    &:hover .btn-content {
      display: inline-block;
      background-color: #f8fdff
    }
    .btn-content {
      padding-left: 6px;
      display: none;
      position: absolute;
      right: 0px;
      background-color: #f5f7fa;
    }
    .el-button {
      padding: 2px 0px;
    }

  }
  .el-tree {
    background: #f8fdff;
  }
  .sub-router{
    position: fixed;
    top:102px;
    width:100%;
    /*bottom:20px;*/
    float:left;
    min-width: 1280px;
    overflow: hidden;
  }

  .sub-router .left-tree{
    position: absolute;
    left: 0;
    width:19%;
    height:calc(100vh - 112px);
    background-color: #f8fdff;
    overflow: auto;
  }
  .sub-router .right-content{
    position: absolute;
    left: 19%;
    width: 78%;
    height:calc(100vh - 112px);
    background-color: #fff;
    position: relative;
  }
  /*树组件样式*/
  .classTree{
    padding:30px;
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
  .classTree .treeIcon_add{
    display: inline-block;
    width:13px;
    height:13px;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAALCAMAAACecocUAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoxMjE3NmQ0MC1mYTZiLTQxNmUtYWE5OC03OTY4NGJhMDg3YWQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NjIyNTE4QzIzMjUyMTFFODgzOThEOTc3NUU4Qzg3QTIiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NjIyNTE4QzEzMjUyMTFFODgzOThEOTc3NUU4Qzg3QTIiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpjZGVkNjljMC01MWRkLTRkNDAtYjhmNi1iN2Y2YjY3YzkzNWIiIHN0UmVmOmRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDpmZGNkNWY1YS00MzhlLTExN2EtYTA1Ni1lNWMwMmZkMTBmNDIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7pI2GrAAAAD1BMVEX////d3d1/f3+EhIQ/Pz/ftRQRAAAAJ0lEQVR42mJgRAAGRgYYwMJmRmIzwdnMTCxMzFjEUdVjMxMBAAIMABEEAEGNvBbXAAAAAElFTkSuQmCC) no-repeat center;
    position:absolute;
    left:-7px;
  }
  .classTree .treeIcon_red{
    display: inline-block;
    width:13px;
    height:13px;
    background: url(data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAABQAAD/4QOPaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjUtYzAxNCA3OS4xNTE0ODEsIDIwMTMvMDMvMTMtMTI6MDk6MTUgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6MTIxNzZkNDAtZmE2Yi00MTZlLWFhOTgtNzk2ODRiYTA4N2FkIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjYxRUQ5MUY0MzI1MjExRTg4Mzk4RDk3NzVFOEM4N0EyIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjYxRUQ5MUYzMzI1MjExRTg4Mzk4RDk3NzVFOEM4N0EyIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE3IChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6Y2RlZDY5YzAtNTFkZC00ZDQwLWI4ZjYtYjdmNmI2N2M5MzViIiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6ZmRjZDVmNWEtNDM4ZS0xMTdhLWEwNTYtZTVjMDJmZDEwZjQyIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+/+4ADkFkb2JlAGTAAAAAAf/bAIQAAgICAgICAgICAgMCAgIDBAMCAgMEBQQEBAQEBQYFBQUFBQUGBgcHCAcHBgkJCgoJCQwMDAwMDAwMDAwMDAwMDAEDAwMFBAUJBgYJDQsJCw0PDg4ODg8PDAwMDAwPDwwMDAwMDA8MDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwM/8AAEQgACwALAwERAAIRAQMRAf/EAGMAAAMBAAAAAAAAAAAAAAAAAAAEBQkBAQAAAAAAAAAAAAAAAAAAAAAQAAAEBAUBCQAAAAAAAAAAAAERAhIDBAUVACFRExQiMWKCkiRkRQYHEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwDbWNNKp0tSYcr+b1D7QmPIQI0apU+zphpWoCFC+dPSsQVZOEQQIZh1GYAFi2064M4Esy6bbNpBMt72kXY7Mtc8AU24W6QZdGcaEzbt7CYBNf1FoeeuAT9dzvkXXH2TncLyub4W97Af/9k=) no-repeat center;
    position:absolute;
    left:-7px;
  }
  .classTree .treeEdit{
    display: inline-block;
    width:16px;
    height:16px;
    background: url(data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAABQAAD/4QOPaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjUtYzAxNCA3OS4xNTE0ODEsIDIwMTMvMDMvMTMtMTI6MDk6MTUgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6MTIxNzZkNDAtZmE2Yi00MTZlLWFhOTgtNzk2ODRiYTA4N2FkIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkI1N0IwQUQzMkNFMzExRTg5NzY4QThERDUxNkM5NUJCIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkI1N0IwQUQyMkNFMzExRTg5NzY4QThERDUxNkM5NUJCIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE3IChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6Y2RlZDY5YzAtNTFkZC00ZDQwLWI4ZjYtYjdmNmI2N2M5MzViIiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6ZmRjZDVmNWEtNDM4ZS0xMTdhLWEwNTYtZTVjMDJmZDEwZjQyIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+/+4ADkFkb2JlAGTAAAAAAf/bAIQAAgICAgICAgICAgMCAgIDBAMCAgMEBQQEBAQEBQYFBQUFBQUGBgcHCAcHBgkJCgoJCQwMDAwMDAwMDAwMDAwMDAEDAwMFBAUJBgYJDQsJCw0PDg4ODg8PDAwMDAwPDwwMDAwMDA8MDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwM/8AAEQgADgAOAwERAAIRAQMRAf/EAFgAAQEBAAAAAAAAAAAAAAAAAAYFCAEBAAAAAAAAAAAAAAAAAAAAABAAAQUBAAIDAQAAAAAAAAAAAwECBAUGBwASESEVCBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A3Ni4fHeecRyve91SybvcHtpsmvsD20tsiwuf05hAI8smWyMJrUCpCFMrRCEx5CKjGOXwI0CT14Ibj+m9HpT12ulVys53zv1mujWVSkyIec91KrhyWwI8Rj3Mc2O+d6OJOKFxFj14AQc/11xR8exVTouPZfbY6Ddyx5PV3WkqoUKdP/SmLFLEjXEcRRn+Vcg0VqE+l9fAZa/Xdam9a47Y2PHgU1tTA0hM9niaSKYtwQ0WOE4hHDHcICgE5xlUzmo5G+rfl6ongf/Z) no-repeat center;
    position:absolute;
    right:80px;
  }
  .classTree .treeDel{
    display: inline-block;
    width:16px;
    height:16px;
    background: url(data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAABQAAD/4QOPaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjUtYzAxNCA3OS4xNTE0ODEsIDIwMTMvMDMvMTMtMTI6MDk6MTUgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6MTIxNzZkNDAtZmE2Yi00MTZlLWFhOTgtNzk2ODRiYTA4N2FkIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkI1N0IwQUQ3MkNFMzExRTg5NzY4QThERDUxNkM5NUJCIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkI1N0IwQUQ2MkNFMzExRTg5NzY4QThERDUxNkM5NUJCIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE3IChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6Y2RlZDY5YzAtNTFkZC00ZDQwLWI4ZjYtYjdmNmI2N2M5MzViIiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6ZmRjZDVmNWEtNDM4ZS0xMTdhLWEwNTYtZTVjMDJmZDEwZjQyIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+/+4ADkFkb2JlAGTAAAAAAf/bAIQAAgICAgICAgICAgMCAgIDBAMCAgMEBQQEBAQEBQYFBQUFBQUGBgcHCAcHBgkJCgoJCQwMDAwMDAwMDAwMDAwMDAEDAwMFBAUJBgYJDQsJCw0PDg4ODg8PDAwMDAwPDwwMDAwMDA8MDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwM/8AAEQgADwAOAwERAAIRAQMRAf/EAFgAAQEAAAAAAAAAAAAAAAAAAAIHAQEAAAAAAAAAAAAAAAAAAAAAEAABBQEBAAIDAQAAAAAAAAADAQIEBQYHERITISMUFREBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8Aq3ecNktF1bp0Xp6XfVIuH0FtAwsLQz48uPUxFo8DZmCAMmFIZ+yToTKr/PkjBjYi+e+gc5gMWtJ1jkr26AvG6/T4rNQeXPtBLVCk3XbdHj5dg0H8n1flKONKQH1/UjvmPz4v9QKb2WiOvYO1On0tpYQrLQyJVZZUVth1Y1svM8+AccsF7rKSXHNGJUDVw3A8cOXHIj0R7EeDytE8kjtd7JpLaABNVz24rsuW3w5b6ZbxO1azUErWCj6s0ADVsJ/+SN8mcEhDhOwYXnH9Dg//2Q==) no-repeat center;
    position:absolute;
    right:50px;
  }
  .classTree .treeAdd{
    display: inline-block;
    width:16px;
    height:16px;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAQCAMAAAARSr4IAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoxMjE3NmQ0MC1mYTZiLTQxNmUtYWE5OC03OTY4NGJhMDg3YWQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QjUzNjU2MTYyQ0UzMTFFODk3NjhBOERENTE2Qzk1QkIiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QjUzNjU2MTUyQ0UzMTFFODk3NjhBOERENTE2Qzk1QkIiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpjZGVkNjljMC01MWRkLTRkNDAtYjhmNi1iN2Y2YjY3YzkzNWIiIHN0UmVmOmRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDpmZGNkNWY1YS00MzhlLTExN2EtYTA1Ni1lNWMwMmZkMTBmNDIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5ANCLKAAAAKlBMVEV/f3+AgIDPz88/Pz+fn58AAADf399AQEAPDw+vr68wMDAQEBAvLy////+cccJ2AAAADnRSTlP/////////////////AEXA3MgAAABXSURBVHjabM7ZDoAgDETR6ciq9v9/17JUYuQ+kJyEIUCTjKpaSAW9I4ZGQHu4mxcRzItZzlgnSbY9Jv3ckCI5i9BpK5txf/lP8kP/GVjk7Ur9XY/6CDAAn68FTuPEGccAAAAASUVORK5CYII=) no-repeat center;
    position:absolute;
    right:20px;
  }
  .classTree .addNode1{
    border:1px dashed #3598e6;
    height:30px;
    line-height:30px;
    text-align: center;
    margin-top:20px;
    color: #3598e6;
    cursor: pointer;
  }
  .right-content_tips{
    position:absolute;
    top: 50%;
    left: 50%;
    width: 420px;
    height: 75px;
    background: url("../assets/images/trumpet.png") no-repeat left center;
    margin-left: -210px;
    margin-top: -38px;
  }
  .right-content_txt{
    float: right;
    width: 300px;
    font-size: 14px;
    color: #666;
    line-height: 24px;
    margin-top: 8px;
  }
</style>