import React from 'react';
import { Select, Modal } from 'antd'
const Option = Select.Option;
export default {

    formateDate(time){
        if(!time)return '';
        let date = new Date(time*1000);
        return date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
    },

    formateDateNormal(time){
        if(!time)return '';
        let date = new Date(time);
        return date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
    },

    formateDuration(dur){
        let h = parseInt(dur/3600, 10);
        let m = parseInt(dur/60%60, 10);
        let s = parseInt(dur%60, 10);     
        return h+'小时'+m+'分钟'+s+'秒';
    },

    pagination(data,callback){
        return {
            onChange:(current)=>{
                callback(current)
            },
            current:data.result.page,
            pageSize:data.result.page_size,
            total: data.result.total_count,
            showTotal:()=>{
                return `共${data.result.total_count}条`
            },
            showQuickJumper:true
        }
    },

    getOptionList(data){
        if(!data){
            return [];
        }
        let options = [] //[<Option value="0" key="all_key">全部</Option>];
        data.map((item)=>{
            options.push(<Option value={item.id} key={item.id}>{item.name}</Option>)
        })
        return options;
    },

    updateSelectedItem(selectedRowKeys, selectedItem, selectedIds){
        if (selectedIds){
            this.setState({
                selectedRowKeys,
                selectedItem,
                selectedIds
            })
        }else{
            this.setState({
                selectedRowKeys,
                selectedItem
            })
        }
    },

    getLocation(pos){
        let myGeo = new window.BMap.Geocoder();
        console.log(pos); 
        myGeo.getLocation(new window.BMap.Point(pos.lon, pos.lat), function(result){
            if (result){
                Modal.info({
                    title: '具体位置',
                    content: result.address
                })
            }      
        });
    },

    momentToInt(params){
        return parseInt(parseInt(params.valueOf(), 10)/1000, 10); 
    },

    saveLoginState(key, obj){
        localStorage.setItem(key, JSON.stringify(obj));
    },

    getLoginState(key){
        return JSON.parse(localStorage.getItem(key));
    }

}