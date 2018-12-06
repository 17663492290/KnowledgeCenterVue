<template>
    <div>
        <div ref="editor" style="text-align:left"></div>
        <!-- <button v-on:click="getContent">查看内容</button> -->
    </div>
</template>

<script>
    import E from 'wangeditor'
    export default {
      name: 'editor',
      props: {
        initData: {
          type: String,
          default: "<p>请输入要设置的内容</p>"
        },
      },
      data () {
        return {
          editorContent: '',
          editor:''
        }
      },
      watch: {
        initData: {  // 这监听对象值的改变 和上面的不一样。
            handler(curVal,oldVal){
                // alert(11+curVal);
                 this.editor.txt.html(curVal)
            },
            deep: true, 
        },
    },
      methods: {
        getContent: function () {
            alert(this.editorContent);
        }
      },
      mounted() {
        this.editor = new E(this.$refs.editor)
        this.editor.customConfig.uploadFileName = 'file'
        this.editor.customConfig.withCredentials = true;
        this.editor.customConfig.uploadImgServer = '/api/sku/image/upload';
        this.editor.customConfig.uploadImgHeaders = {
            'bid': '1520'
        };
        this.editor.customConfig.onchange = (html) => {
            this.editorContent = html;
            this.$emit('onUpdata',this.editorContent);
        }
        this.editor.create()
        // if(!this.initData){
        //   this.initData = "<p>请输入要设置的内容</p>"
        // }
        // alert(12+this.initData)
        this.editor.txt.html(this.initData);
      }
    }
</script>
<style scoped>

</style>
