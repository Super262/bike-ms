import JsonP from 'jsonp'
import axios from 'axios'
import { Modal } from 'antd'
export default class Axios {

    static requestList(_this,url,options){
        this.ajaxPost({
            url: url,
            data:{
                params:options
            }
        }).then((res)=>{
            let list = res.map((item, index) => {
                item.key = index;
                return item;
            });
            _this.setState({
                list:list,
            })
        })
    }

    static jsonp(options) {
        // 用于天气UI
        return new Promise((resolve, reject) => {
            JsonP(options.url, {
                param: 'callback'
            }, function (err, response) {
                if (response.status === 'success') {
                    resolve(response);
                } else {
                    reject(response.messsage);
                }
            })
        })
    }

    static ajaxPost(options){
        let loading;
        if(options.data && options.data.isShowLoading !== false){
            loading = document.getElementById('ajaxLoading');
            loading.style.display = 'block'; 
        }
        let baseApi= 'http://localhost:8080';
        return new Promise((resolve, reject)=>{
            axios({
                url: options.url,
                method: 'post',
                baseURL: baseApi,
                timeout: 5000,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                params: (options.data && options.data.params) || ''
            }).then((response)=>{

                if (options.data && options.data.isShowLoading !== false) {
                    loading = document.getElementById('ajaxLoading');
                    loading.style.display = 'none';
                }

                if(response.status === 200){ // 请求成功
                    let result = response.data.data; // result包括返回值中的data
                    if(response.data.msg === "OK"){ // 正确，参考后台的IMoocResult
                        resolve(result); // 向Promise里的then书写数据
                    }
                    else{ // 错误
                        Modal.info({
                            title: '提示',
                            content: response.data.msg
                        })
                    }
                }
                else{
                    reject(response.data);
                }
            })
        });
    }
}