import React from 'react';
import {Card, Button, Modal} from 'antd'
import BaseForm from '../../components/BaseForm'
import axios from './../../axios'
import Utils from '../../utils/utils';
import ETable from './../../components/ETable';

export default class BikeMap extends React.Component{

    state = {}
    params = {
        time: -1
    }
    map = '';

    formList = [
        {
            type:'INPUT-TXT',
            label:'车辆编号',
            field:'id',
            placeholder:'',
            initialValue:'',
            width:80,
        },
        {
            type: 'DATE',
            label: '时间',
            field: 'time',
        },
        {
            type:'INPUT-TXT',
            label:'城市',
            field:'city',
            placeholder:'',
            initialValue:'',
            width:80,
        }
    ]

    requestList = ()=>{
        axios.ajaxPost({
            url:'/bike/query',
            data:{
                params:this.params
            }
        }).then((res)=>{
            this.setState({
                list: res
            });
            this.renderMap(res);
        })
    }

    componentWillMount(){
        this.requestList();
    }

    // 查询表单
    handelFilterSubmit = (filterParams)=>{
        if(filterParams.time === "" || filterParams.time === undefined || filterParams.time === null){
            filterParams.time=-1;
        }
        else{
            filterParams.time=Utils.momentToInt(filterParams.time._d);
        }
        this.params = filterParams;
        this.requestList();
    }

    // 查询位置
    handleShowLoc = ()=>{
        let item = this.state.selectedItem;
        if (!item) {
            Modal.info({
                title: '信息',
                content: '请选择一条记录进行查询'
            })
            return;
        }
        Utils.getLocation(item.position);
    }

    // 添加地图控件
    addMapControl = ()=>{
        let map = this.map;
        map.addControl(new window.BMap.ScaleControl({ anchor: window.BMAP_ANCHOR_TOP_RIGHT}));
        map.addControl(new window.BMap.NavigationControl({ anchor: window.BMAP_ANCHOR_TOP_RIGHT }));
    }

    // 渲染地图数据
    renderMap = (res)=>{
        this.map = new window.BMap.Map('container');

        let bikeList = res;
        let bikeIcon = new window.BMap.Icon('/assets/bike.jpg',new window.BMap.Size(36,42),{
            imageSize: new window.BMap.Size(36, 42),
            anchor: new window.BMap.Size(18, 42)
        });

        bikeList.forEach((item)=>{
            let point = new window.BMap.Point(item.position.lon, item.position.lat);
            let bikeMarker = new window.BMap.Marker(point, { icon: bikeIcon});
            var bikeLabel = new window.BMap.Label(item.bikeId, {position: point,  offset: new window.BMap.Size(-30, 0)});
            bikeLabel.setStyle({
                color : "red",
                fontSize : "12px",
                height : "20px",
                lineHeight : "20px",
                fontFamily:"微软雅黑"
            });
            this.map.addOverlay(bikeMarker);
            this.map.addOverlay(bikeLabel);
            this.map.centerAndZoom(point,11);

        });
        this.addMapControl();
    }



    render(){

        const columns = [
            {
                title: '车辆编号',
                dataIndex: 'bikeId'
            }, 
            {
                title:'城市',
                dataIndex:'city'
            },
            {
                title: '时间',
                dataIndex: 'time',
                render: Utils.formateDate
            }          
        ]
        

        return (
            <div>
                <Card>
                    <BaseForm formList={this.formList} filterSubmit={this.handelFilterSubmit}/>
                </Card>
                <Card style={{marginTop:10}}>
                    <div id="container" style={{height:500}}></div>
                </Card>
                <Card style={{marginTop:10}}>
                    <Button type="primary" onClick={this.handleShowLoc}>具体位置</Button>
                </Card>
                <div className="content-wrap">
                    <ETable
                        updateSelectedItem={Utils.updateSelectedItem.bind(this)}
                        columns={columns}
                        dataSource={this.state.list}
                        selectedRowKeys={this.state.selectedRowKeys}
                        selectedIds={this.state.selectedIds}
                        selectedItem={this.state.selectedItem}
                    />
                </div>
            </div>
        );
    }
}
