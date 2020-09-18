import React from 'react';
import { Card } from 'antd'
import axios from '../../axios'
import Utils from '../../utils/utils'
import './detail.less'
export default class Order extends React.Component {

    state = {}

    componentWillMount(){
        let orderId = this.props.match.params.orderId;
        if(orderId){
            this.getDetailInfo(orderId);
        }
    }

    getDetailInfo = (orderId)=>{
        axios.ajaxPost({
            url:'/orderlog/query',
            data:{
                params:{
                    id: orderId,
                    mileageL: -1, 
                    mileageH: -1,
                    durationL: -1, 
                    durationH: -1,
                    startTimeL: -1, 
                    startTimeH: -1,
                    finishTimeL: -1, 
                    finishTimeH: -1,
                    standardCostL: -1, 
                    standardCostH: -1,
                    actualCostL: -1, 
                    actualCostH: -1
                }
            }
        }).then((res)=>{
            this.setState({
                orderInfo:res[0]
            });
            this.renderMap(res[0].trace);
            this.getCityInfo(this.state.orderInfo.city);
        })
    }

    getCityInfo = (city)=>{
        axios.ajaxPost({
            url:'/city/query',
            data:{
                params:{
                    city:city,
                    opTimeL: -1,
                    opTimeH: -1
                }
            }
        }).then((res)=>{
            this.setState({
                cityInfo:res[0]
            })
        })
    }

    renderMap = (trace)=>{
        this.map = new window.BMap.Map('orderDetailMap');
        // this.map.centerAndZoom('北京',11);
        // 添加地图控件
        this.addMapControl();
        // 调用路线图绘制方法
        this.drawBikeRoute(trace);

        // // 调用服务区绘制方法
        // this.drwaServiceArea(result.area);
    }

    // 添加地图控件
    addMapControl = ()=>{
        let map = this.map;
        map.addControl(new window.BMap.ScaleControl({ anchor: window.BMAP_ANCHOR_TOP_RIGHT}));
        map.addControl(new window.BMap.NavigationControl({ anchor: window.BMAP_ANCHOR_TOP_RIGHT }));
    }

    // 绘制用户的行驶路线
    drawBikeRoute = (positionList)=>{
        let startPoint = '';
        let endPoint = '';
        if (positionList.length>0){
            let first = positionList[0];
            let last = positionList[positionList.length-1];
            startPoint = new window.BMap.Point(first.lon,first.lat);
            let startIcon = new window.BMap.Icon('/assets/start_point.png',new window.BMap.Size(36,42),{
                imageSize:new window.BMap.Size(36,42),
                anchor: new window.BMap.Size(18, 42)
            })

            let startMarker = new window.BMap.Marker(startPoint, { icon: startIcon});
            this.map.addOverlay(startMarker);

            endPoint = new window.BMap.Point(last.lon, last.lat);
            let endIcon = new window.BMap.Icon('/assets/end_point.png', new window.BMap.Size(36, 42), {
                imageSize: new window.BMap.Size(36, 42),
                anchor: new window.BMap.Size(18, 42)
            })
            let endMarker = new window.BMap.Marker(endPoint, { icon: endIcon });
            this.map.addOverlay(endMarker);

            // 连接路线图
            let trackPoint = [];
            for(let i=0;i<positionList.length;i++){
                let point = positionList[i];
                trackPoint.push(new window.BMap.Point(point.lon, point.lat));
            }

            let polyline = new window.BMap.Polyline(trackPoint,{
                strokeColor:'#1869AD',
                strokeWeight:3,
                strokeOpacity:1
            })
            this.map.addOverlay(polyline);
            this.map.centerAndZoom(endPoint, 11);
        }
        
    }

    // // 绘制服务区
    // drwaServiceArea = (positionList)=>{
    //     // 连接路线图
    //     let trackPoint = [];
    //     for (let i = 0; i < positionList.length; i++) {
    //         let point = positionList[i];
    //         trackPoint.push(new window.BMap.Point(point.lon, point.lat));
    //     }
    //     // 绘制服务区
    //     let polygon = new window.BMap.Polygon(trackPoint, {
    //         strokeColor: '#CE0000',
    //         strokeWeight: 4,
    //         strokeOpacity: 1,
    //         fillColor: '#ff8605',
    //         fillOpacity:0.4
    //     })
    //     this.map.addOverlay(polygon);
    // }

    render(){
        const orderInfo = this.state.orderInfo || {};
        const cityInfo = this.state.cityInfo || {};
        return (
            <div>
                <Card>
                    <div id="orderDetailMap" className="order-map"></div>
                    <div className="detail-items">
                        <div className="item-title">基础信息</div>
                        <ul className="detail-form">
                            <li>
                                <div className="detail-form-left">状态</div>
                                <div className="detail-form-content">{orderInfo.status === '1' ?'进行中':'结束'}</div>
                            </li>
                            <li>
                                <div className="detail-form-left">订单编号</div>
                                <div className="detail-form-content">{orderInfo.id}</div>
                            </li>
                            <li>
                                <div className="detail-form-left">车辆编号</div>
                                <div className="detail-form-content">{orderInfo.bikeId}</div>
                            </li>
                            <li>
                                <div className="detail-form-left">用户姓名</div>
                                <div className="detail-form-content">{orderInfo.username}</div>
                            </li>
                            <li>
                                <div className="detail-form-left">手机号码</div>
                                <div className="detail-form-content">{orderInfo.phone}</div>
                            </li>
                            <li>
                                <div className="detail-form-left">标准金额</div>
                                <div className="detail-form-content">{orderInfo.standardCost}元</div>
                            </li>
                            <li>
                                <div className="detail-form-left">实付金额</div>
                                <div className="detail-form-content">{orderInfo.actualCost}元</div>
                            </li>
                        </ul>
                    </div>
                    <div className="detail-items">
                        <div className="item-title">轨迹信息</div>
                        <ul className="detail-form">
                            <li>
                                <div className="detail-form-left">行驶里程</div>
                                <div className="detail-form-content">{orderInfo.mileage}千米</div>
                            </li>
                            <li>
                                <div className="detail-form-left">行驶时长</div>
                                <div className="detail-form-content">{Utils.formateDuration(orderInfo.duration)}</div>
                            </li>
                            <li>
                                <div className="detail-form-left">开始时间</div>
                                <div className="detail-form-content">{Utils.formateDate(orderInfo.startTime)}</div>
                            </li>
                            <li>
                                <div className="detail-form-left">结束时间</div>
                                <div className="detail-form-content">{Utils.formateDate(orderInfo.finishTime)}</div>
                            </li>
                        </ul>
                    </div>
                    <div className="detail-items">
                        <div className="item-title">城市信息</div>
                        <ul className="detail-form">
                        <li>
                                <div className="detail-form-left">城市名称</div>
                                <div className="detail-form-content">{cityInfo.name}</div>
                            </li>
                            <li>
                                <div className="detail-form-left">用车模式</div>
                                <div className="detail-form-content">{cityInfo.useMode === '1' ?'停车点':'禁停区'}</div>
                            </li>
                            <li>
                                <div className="detail-form-left">营运模式</div>
                                <div className="detail-form-content">{cityInfo.opMode === '1' ?'自营':'加盟'}</div>
                            </li>
                            <li>
                                <div className="detail-form-left">城市管理员ID</div>
                                <div className="detail-form-content">{cityInfo.leader}</div>
                            </li>
                        </ul>
                    </div>
                </Card>
            </div>
        );
    }
}