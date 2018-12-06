<template>
  <!-- 过渡动画 -->
  <transition name="fade">
  　　 <div class="img-view" @click.stop="bigImg">
  　　　　 <!-- 遮罩层 -->
  　　　　 <div class="img-layer">
          
            <div class="range"  @click.stop="()=>{return false}">
               <input type="range" style="width:100%"  name="points" min="100" max="1200" value="400"  @mousemove.stop="bigAndSmall" />
            </div>
            <!-- <el-button size="mini" class="btn1" round @click.stop="round" icon="el-icon-circle-plus"></el-button> -->
            <el-button size="mini" icon="el-icon-refresh" @click.stop="round" class="btn" round>旋转</el-button>
    　　　　 <div class="img" :style="{transform:'rotate('+ deg +'deg)'}">
    　　　　　　 <img class="aa" :style="{height:height+'px'}" :src="imgSrc">
    　　　　 </div>
         </div>
  　　</div>
　　</transition>
</template>
<script>
　　export default {
      data () {
        return {
            deg:0,
            value:50,
            height:400
          }
        },
　　　　props: ['imgSrc'],//接受图片地址
　　　　methods: {
　　　　　　bigImg() {
　　　　　　// 发送事件
　　　　　　　　this.$emit('clickit');
　　　　　　},
　          round() {
　　　　　　// 发送事件
                if(this.deg==360){
                    this.deg==0
                }
　　　　　　　　this.deg += 90;
　　　　　　},
            bigAndSmall(e){   
                console.log(e.target.value);
                this.height = e.target.value;
            }

　　　　}
　　}
</script>
<style scoped>
    .aa{transition: all 0.5s;}
    .fade-enter-active,.fade-leave-active {transition: all .2s linear;transform: translate3D(0, 0, 0);}
    .fade-enter,.fade-leave-active {transform: translate3D(100%, 0, 0);}
    .img-view {}
    .img-view .img-layer {  width: 100%;
  	    height: 100%;  	
  	    border: 1px solid #000;	
  	    display: flex;
  	    justify-content: center;
  	    align-items: flex-start; position: fixed;z-index: 999;top: 0;left: 0;background: rgba(0, 0, 0, 0.7); width: 100%;height: 100%;overflow: auto;}
    .img-view .img img {display: block;margin:50px 0;}
    .img-view .img {}
    .btn{display: block;position: fixed;right:22%; bottom:10px;z-index: 10001;opacity: 0.5}
    .btn1{display: block;position: fixed;right:28%; bottom:10px;z-index: 10001;opacity: 0.5}
    .range{width:40%;display: block;position: fixed; left:30%; bottom:10px;z-index: 10001;margin: auto;opacity: 0.5}
    .btn:hover{opacity: 1}
    .btn1:hover{opacity: 1}
    .range:hover{ opacity: 1}
</style>