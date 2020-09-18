import React from 'react';
import { Card, Button, Form,Modal, message} from 'antd'
import axios from '../../axios'
import Utils from '../../utils/utils'
import BaseForm from '../../components/BaseForm'
import ETable from './../../components/ETable'
const FormItem = Form.Item;
export default class Order extends React.Component{
    state  = {
        orderInfo:{},
        orderConfirmVisble:false
    }
    params = {
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
    formList = [
        {
            type:'INPUT-TXT',
            label:'订单编号',
            field:'id',
            placeholder:'',
            initialValue:'',
            width:120,
        },
        {
            type:'INPUT-TXT',
            label:'城市',
            field:'city',
            placeholder:'',
            initialValue:'',
            width:80,
        },
        {
            type:'INPUT-TXT',
            label:'车辆编号',
            field:'bikeId',
            placeholder:'',
            initialValue:'',
            width:120,
        },
        {
            type:'INPUT-TXT',
            label:'用户名',
            field:'username',
            placeholder:'',
            initialValue:'',
            width:120,
        },
        {
            type:'INPUT-TXT',
            label:'手机号',
            field:'phone',
            placeholder:'',
            initialValue:'',
            width:120,
        },
        {
            type:'NUM-RANGE',
            label:'里程（千米）',
            field1:'mileageL',
            field2:'mileageH',
            placeholder:'',
            initialValue:'',
            width:80,
        },
        {
            type:'TIME-RANGE',
            label:'行驶时长',
            field1:'durationL',
            field2:'durationH',
        },
        {
            type: 'SELECT',
            label: '订单状态',
            field:'status',
            placeholder: '',
            initialValue: '',
            width: 90,
            list: [{ id: '', name: '全部' }, { id: '1', name: '进行中' }, { id: '2', name: '结束' }]
        },
        {
            type: 'DATE-RANGE',
            label: '开始时间',
            field1: 'startTimeL',
            field2: 'startTimeH'
        },
        {
            type: 'DATE-RANGE',
            label: '结束时间',
            field1: 'finishTimeL',
            field2: 'finishTimeH'
        },
        {
            type:'NUM-RANGE',
            label:'标准金额（元）',
            field1:'standardCostL',
            field2:'standardCostH',
            placeholder:'',
            initialValue:'',
            width:80,
        },
        {
            type:'NUM-RANGE',
            label:'实付金额（元）',
            field1:'actualCostL',
            field2:'actualCostH',
            placeholder:'',
            initialValue:'',
            width:80,
        },
    ]
    componentWillMount(){
        this.requestList()
    }

    momentToDurSec = (params)=>{
        let h=params.getHours();
        let m=params.getMinutes();
        let s=params.getSeconds();
        return (h*3600+m*60+s);
    }


    handleFilter = (params)=>{

        if(params.mileageL === "" || params.mileageL === undefined || params.mileageL === null){
            params.mileageL=-1;
        }
        if(params.mileageH === "" || params.mileageH === undefined || params.mileageH === null){
            params.mileageH=-1;
        }

        if(params.durationL === "" || params.durationL === undefined || params.durationL === null){
            params.durationL=-1;
        }
        else{
            params.durationL=this.momentToDurSec(params.durationL._d);
        }
        
        if(params.durationH === "" || params.durationH === undefined || params.durationH === null){
            params.durationH=-1;
        }
        else{
            params.durationH=this.momentToDurSec(params.durationH._d);
        }

        if(params.startTimeL === "" || params.startTimeL === undefined || params.startTimeL === null){
            params.startTimeL=-1;
        }
        else{
            params.startTimeL= Utils.momentToInt(params.startTimeL._d);
        }

        if(params.startTimeH === "" || params.startTimeH === undefined || params.startTimeH === null){
            params.startTimeH=-1;
        }
        else{
            params.startTimeH= Utils.momentToInt(params.startTimeH._d);
        }

        if(params.finishTimeL === "" || params.finishTimeL === undefined || params.finishTimeL === null){
            params.finishTimeL=-1;
        }
        else{
            params.finishTimeL= Utils.momentToInt(params.finishTimeL._d);
        }

        if(params.finishTimeH === "" || params.finishTimeH === undefined || params.finishTimeH === null){
            params.finishTimeH=-1;
        }
        else{
            params.finishTimeH= Utils.momentToInt(params.finishTimeH._d);
        }

        if(params.standardCostL === "" || params.standardCostL === undefined || params.standardCostL === null){
            params.standardCostL=-1;
        }

        if(params.standardCostH === "" || params.standardCostH === undefined || params.standardCostH === null){
            params.standardCostH=-1;
        }

        if(params.actualCostL === "" || params.actualCostL === undefined || params.actualCostL === null){
            params.actualCostL=-1;
        }

        if(params.actualCostH === "" || params.actualCostH === undefined || params.actualCostH === null){
            params.actualCostH=-1;
        }

        console.log(params);
        this.params=params;
        this.requestList();
    }
    requestList = ()=>{
         axios.requestList(this,'/orderlog/query',this.params);
    }
    // 订单结束确认
    handleConfirm = ()=>{
        let item = this.state.selectedItem;
        if (!item) {
            Modal.info({
                title: '信息',
                content: '请选择一条订单进行结束'
            })
            return;
        }
        axios.ajaxPost({
            url:'/orderlog/query',
            data:{
                params:{
                    id: item.id,
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
            console.log(res);
            this.setState({
                orderInfo:res[0],
                orderConfirmVisble: true
            });
        })
    }

    // 结束订单
    handleFinishOrder = ()=>{
        let item = this.state.selectedItem;
        axios.ajaxPost({
            url: '/orderlog/finish',
            data: {
                params: {
                    id: item.id
                }
            }
        }).then((res) => {
            message.success('订单结束成功');
            this.setState({
                orderConfirmVisble: false
            });
            this.requestList();
        });
    }

    openOrderDetail = ()=>{
        let item = this.state.selectedItem;
        if (!item) {
            Modal.info({
                title: '信息',
                content: '请先选择一条订单'
            })
            return;
        }
        window.open(`/#/common/order/detail/${item.id}`,'_blank')
    }
    render(){
        const columns = [
            {
                title:'订单编号',
                dataIndex:'id'
            },
            {
                title:'城市',
                dataIndex:'city'
            },
            {
                title: '车辆编号',
                dataIndex: 'bikeId'
            },
            {
                title: '用户名',
                dataIndex: 'username'
            },
            {
                title: '手机号',
                dataIndex: 'phone'
            },
            {
                title: '里程（千米）',
                dataIndex: 'mileage',
            },
            {
                title: '行驶时长',
                dataIndex: 'duration',
                render: Utils.formateDuration
            },
            {
                title: '状态',
                dataIndex: 'status',
                render(s) {
                    return s === '1' ? '进行中' : '结束';
                }
            },
            {
                title: '开始时间',
                dataIndex: 'startTime',
                render: Utils.formateDate
            },
            {
                title: '结束时间',
                dataIndex: 'finishTime',
                render: Utils.formateDate
            },
            {
                title: '标准金额（元）',
                dataIndex: 'standardCost'
            },
            {
                title: '实付金额（元）',
                dataIndex: 'actualCost'
            }
        ]
        const formItemLayout = {
            labelCol:{span:5},
            wrapperCol:{span:19}
        }
        return (
            <div>
                <Card>
                    <BaseForm formList={this.formList} filterSubmit={this.handleFilter}/>
                </Card>
                <Card style={{marginTop:10}}>
                    <Button type="primary" onClick={this.openOrderDetail}>订单详情</Button>
                    <Button type="primary" style={{marginLeft:10}} onClick={this.handleConfirm}>结束订单</Button>
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
                <Modal
                    title="结束订单"
                    visible={this.state.orderConfirmVisble}
                    onCancel={()=>{
                        this.setState({
                            orderConfirmVisble:false
                        })
                    }}
                    onOk={this.handleFinishOrder}
                    width={600}
                >
                    <Form layout="horizontal">
                        <FormItem label="车辆编号" {...formItemLayout}>
                            {this.state.orderInfo.bikeId}
                        </FormItem>
                        <FormItem label="行驶时长" {...formItemLayout}>
                            {Utils.formateDuration(this.state.orderInfo.duration)}
                        </FormItem>
                        <FormItem label="行程开始时间" {...formItemLayout}>
                            {Utils.formateDate(this.state.orderInfo.startTime)}
                        </FormItem>
                        <FormItem label="所在城市" {...formItemLayout}>
                            {this.state.orderInfo.city}
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        );
    }
}