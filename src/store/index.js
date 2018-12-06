import Vue from 'vue'
import vuex from 'vuex'
Vue.use(vuex);

export default new vuex.Store({
    state:{
        permission:{
            employer:{
                name:'',
                position: ''
            },
            permissions:{
                k1:{},
                k2:{},
                k4:{}
            }
        },
        bid:''
    },
    mutations:{
        initPermission(state,n){//这里的state对应着上面这个state
            state.permission = n?n:{};
            //你还可以在这里执行其他的操作改变state
        },
        setBid(state,n){
            if(n){
               state.bid = n
            }else{
               state.bid = ''
            }
                    
        }
        
    },
})