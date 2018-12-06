<template>
  <div>
     
        <div >
          <div v-if="isShow" class="siderbar_mask siderbar_close"></div>
           <transition name="drop">
              <div v-if="isShow" class="siderbar_box">
                <div class="siderbar_title"><span >图文预览</span><span class="siderbar_close" style="float:right">X</span></div>
                <div class="siderbar_content">
                  <div class="siderbar_left">
                    <div class="group">

                    </div>
                    <div class="group">

                    </div>
                  </div>

                </div>
              </div>
           </transition>
        </div>
     
  </div>
</template>

<script>
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {

    }
  },
  methods: {
    closeMyself () {
      this.$emit('on-close')
    }
  }
}
</script>

<style scoped>
/* .drop-enter-active {
  transition: all .5s ease;
}
.drop-leave-active {
  transition: all .3s ease;
}
.drop-enter {
  width:0px;
}
.drop-leave-active {
  width:0px;
} */
.drop-enter-active, .drop-leave-active {
  transition:width 1s
}
.drop-enter, .drop-leave-to /* .fade-leave-active below version 2.1.8 */ {
  width:0px;
}
.siderbar_box{
		position:fixed;
		width:80%;
		right:0;
		top:0;
		bottom:0;
		-moz-box-shadow:-6px 0px 9px #999; -webkit-box-shadow:-6px 0px 9px #999; box-shadow:-6px 0px 9px #999;
		border-radius: 10px;
	}
	.siderbar_title{
		height:50px;
		line-height:50px;
		border-bottom:1px solid #888888;
		font-size:16px;
		padding:0 20px;
		font-weight: 700;
		color:#fff;
		background-color: rgba(102, 102, 102, 1);
	}
	.siderbar_title span{
		color:#fff;
	}
	.siderbar_content{
		float:left;
		width:100%;
		height:100%;
	}
	.siderbar_content .siderbar_left{
		float:left;
		width:100%;
		height:100%;
		border-right:1px solid #888888;
		overflow: auto;
		background-color: #fff;
	}
	.siderbar_mask{
		position:fixed;
		top:0;
		left:0;
		/* display: none; */
		width:100%;
		height:100%;
		background-color:rgba(0,0,0,0.3);
	}

</style>
