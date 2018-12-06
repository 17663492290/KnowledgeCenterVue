import Vue from 'vue'
import axios from 'axios'
import store from '../store'
import { Message } from 'element-ui'

// Vue.use(ElementUI);
const Service = {
  install (Vue) {
    this.vm = new Vue()
    this.init()
    Object.defineProperty(Vue.prototype, '$http', { value: this.axios })
  },
  vm: null,
  axios: null,
  init () {
    this.axios = axios.create({
      //timeout: 30000,
      headers: {
        // post: {
        //   'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        // }
      }
    })
    // this.axios.interceptors.request.use((config) => {
    //   // 在发送请求之前做某事
    //   let data = config.data || {}
    //     config.data = {
    //     //   bid: store.state.bid,
    //       body: data
    //     }
    //    console.log(config)
    //   return config
    // }, (error) => {
    //   // 请求错误时做些事
    //   return Promise.reject(error)
    // })
    // 返回状态判断
    // this.axios.interceptors.response.use((res) => {
    //     console.log(8888,data.data.code)
    //   let { data } = res
    //   if (data.data.code === 200) {
    //     return Promise.resolve(data)
    //   } else if (data.data.code === 250) {
    //     console.log(data.data.code)
    //      window.location.href='http://test.union.lvzheng.com/emp/checklog';
    //   } else {
    //     return Promise.reject(new Error(data.statusText))
    //   }
    // }, (error) => {
    //   let txt = error.message.indexOf('timeout') === -1 ? '网络发生错误!' : '网络请求超时!'
    //   return Promise.reject(new Error(txt))
    // })
    // http request 拦截器
    this.axios.interceptors.request.use(
        config => {
            if (config.params) {
                if (config.params.bid) {
                    config.headers.bid = config.params.bid;
                    delete config.params.bid
                }
            }
            if (config.data) {
                if (config.data.bid) {
                    config.headers.bid = config.data.bid
                    delete config.data.bid
                }
            }

            // if (config.data.bid) {   判断是否存在bid，如果存在的话，则每个http header都加上token
            //     config.headers.bid = config.data.bid;
            // }
            return config;
        },
        err => {
            return Promise.reject(err);
        });
    this.axios.interceptors.response.use(
        response => {
            // store.state.bid = ''
            if (response.data.code == 0 || response.data.code == 200) {
                
            } else if (response.data.code == 110) {
                window.location.href='http://test.union.lvzheng.com/emp/checklog';
            } else {
                Message({
                    message:response.data.msg,
                    type: 'warning'
                }) 
            } 
            return response
        },
        error => {
            store.state.bid =''
            alert('服务器端异常，请稍后重试')
           // return Promise.reject(error.response.data)   // 返回接口返回的错误信息
        });
  },
}
export default Service


