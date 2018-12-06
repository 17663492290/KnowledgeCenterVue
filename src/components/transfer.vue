<template>
  <div class="content" >
    <div class="leftBox">
      <el-tree
        class="transfer-tree"
        :data="data"
        :props="prop"
        default-expand-all
        @node-click="handleNodeClick"
        ref="tree2">
      </el-tree>
    </div>
    <div class="btnBox">
      <p>
        <el-button :disabled="temArrL.length>0?false:true" type="primary" @click="add" >添加<i class="el-icon-d-arrow-right"></i></el-button>
      </p>
     <p>
        <el-button :disabled="temArrR.length>0?false:true" type="primary"  @click="remove"><i class="el-icon-d-arrow-left"></i>移除</el-button>
     </p>
    </div>
    <div class="rightBox">
      <div class="checkList" v-for="(item, index) in checkArr" :class="{on:index===tab}" @click="onCheck(item.categoryId,item.categoryName,index)">{{item.categoryName}}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default: []
    },
    id: {
      type: String,
      default: ""
    },
    prop: {
      type: Object,
      default: {}
    },
    checkArr: {
      type: Array,
      default: []
    }
  },
  data () {
    return {
        tab:'',
        temArrL:[],
        temArrR:[],
    }
  },
  computed: {

  },
  methods: {
    handleNodeClick(data,node) {
      if(!data.childCateList){
         console.log(12);
          let obj = {};
          obj.categoryName = data.categoryName;
          obj.categoryId = data.id;
           this.$set(this.temArrL, 0, obj);
          //  this.temArrL[0]= obj;
      }else{
         console.log(13);
          this.temArrL=[];
      }
      //console.log(data);
      
    },
    onCheck(id,name,index) {
      this.tab = index;
      let obj={}
      obj.categoryName = name;
      obj.categoryId = id;
      this.$set(this.temArrR, 0, obj);
     
    },
    add(){
       console.log(14)
        let flag = true;
        if(this.checkArr.length>0){
          console.log(15)
           for(var  i=0;i<this.checkArr.length;i++){
            if(this.checkArr[i].categoryId == this.temArrL[0].categoryId){
              flag = false;
              return ; 
            } 
          }
        }
        if(flag){
           
          this.checkArr.push(this.temArrL[0]);
          this.temArrL = [];
        }
         this.$emit('onUpdata',this.checkArr);   
    },
    remove(){
      for(var  i=0;i<this.checkArr.length;i++){
            if(this.checkArr[i].categoryId == this.temArrR[0].categoryId){
              this.checkArr.splice( i, 1);
            } 
        }
         this.$emit('onUpdata',this.checkArr);
    }
  },
  mounted () {
   
  }
}
</script>

<style scoped>

.content {
  position: relative;
  width: 100%;
  height: 188px;
  overflow: auto;
  /* border:1px solid #ddd;
  border-radius: 4px; */
}
.leftBox,.rightBox{
  margin:5px;
  float:left;
  border:1px solid #dcdfe6;
  height:175px;
  width:28%;
  border-radius: 5px;
  overflow: auto;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
}
.btnBox{
  float:left;
  /* border:1px solid #dcdfe6; */
  height:100px;
  width:30%;
  text-align: center;
  padding-top:50px;
}
.on{
  background-color: #aeb0b3;
}
.checkList{
  /* height:30px; */
  line-height:30px;
  cursor: pointer;
  padding:0px 5px;
}

</style>
