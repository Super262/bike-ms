import React from 'react';
import { Card, Table} from 'antd';
import axios from './../../axios/index';
import Utils from './../../utils/utils';
import BaseForm from '../../components/BaseForm'
export default class City extends React.Component{

    state = {
        list:[],
        isShowOpenCity:false
    }

    params = {
        opTimeL: -1,
        opTimeH: -1
    }

    formList = [
        {
            type:'INPUT-TXT',
            label:'城市ID',
            field:'id',
            placeholder:'',
            initialValue:'',
            width:120,
        },
        {
            type:'INPUT-TXT',
            label:'城市名称',
            field:'name',
            placeholder:'',
            initialValue:'',
            width:80,
        },
        {
            type:'SELECT',
            label:'用车模式',
            field:'useMode',
            placeholder:'',
            initialValue:'',
            width:120,
            list: [{ id: '', name: '全部' }, { id: '1', name: '停车点' }, { id: '2', name: '禁停区' }]
        },
        {
            type:'SELECT',
            label:'营运模式',
            field:'opMode',
            placeholder:'',
            initialValue:'',
            width:100,
            list: [{ id: '', name: '全部' }, { id: '1', name: '自营' }, { id: '2', name: '加盟' }]
        },
        {
            type:'INPUT-TXT',
            label:'城市管理员ID',
            field:'leader',
            placeholder:'',
            initialValue:'',
            width:140,
        },
        {
            type: 'DATE-RANGE',
            label: '开通时间',
            field1: 'opTimeL',
            field2: 'opTimeH'
        },
        {
            type:'INPUT-TXT',
            label:'开通人ID',
            field:'operator',
            placeholder:'',
            initialValue:'',
            width:140,
        },
    ]

    handleFilter = (params)=>{

        if(params.opTimeL === "" || params.opTimeL === undefined || params.opTimeL === null){
            params.opTimeL=-1;
        }
        else{
            params.opTimeL = Utils.momentToInt(params.opTimeL._d);
        }

        if(params.opTimeH === "" || params.opTimeH === undefined || params.opTimeH === null){
            params.opTimeH=-1;
        }
        else{
            params.opTimeH = Utils.momentToInt(params.opTimeH._d);
        }

        console.log(params);
        this.params=params;
        this.requestList();
    }

    componentWillMount(){
        this.requestList();
    }


    // 查询城市
    requestList = ()=>{
        axios.requestList(this,'/city/query',this.params);
    }


    // 开通城市
    // handleOpenCity = ()=>{
    //     this.setState({
    //         isShowOpenCity:true
    //     });
    // }

    // 城市开通提交
    // handleSubmit = ()=>{
    //     let cityInfo = this.cityForm.props.form.getFieldsValue();
    //     let time = parseInt(parseInt(Date.parse(new Date()))/1000);
    //     cityInfo.push({opTime: time, operator: '201700301004'});
    //     console.log(cityInfo);
    //     // axios.ajaxPost({
    //     //     url:'/city/open',
    //     //     data:{
    //     //         params:cityInfo
    //     //     }
    //     // }).then((res)=>{
    //     //     message.success('开通成功');
    //     //     this.setState({
    //     //         isShowOpenCity:false
    //     //     })
    //     //     this.requestList();
    //     // })
    // }
    render(){
        const columns = [
            {
                title:'城市ID',
                dataIndex:'id'
            }, 

            {
                title: '城市名称',
                dataIndex: 'name'
            }, 

            {
                title: '用车模式',
                dataIndex: 'useMode',
                render(useMode){
                    return useMode === '1' ?'停车点':'禁停区';
                }
            }, 

            {
                title: '营运模式',
                dataIndex: 'opMode',
                render(opMode) {
                    return opMode === '1' ? '自营' : '加盟';
                }
            }, 

            {
                title: '城市管理员ID',
                dataIndex: 'leader',
            }, 

            {
                title: '开通时间',
                dataIndex: 'opTime',
                render: Utils.formateDate
            }, 

            {
                title: '开通人ID',
                dataIndex: 'operator'
            }
        ]

        return (
            <div>
                <Card>
                <BaseForm formList={this.formList} filterSubmit={this.handleFilter}/>
                </Card>
                <Card></Card>
                {/* <Card style={{marginTop:10}}>
                    <Button type="primary" onClick={this.handleOpenCity}>开通城市</Button>
                </Card> */}
                <div className="content-wrap">
                    <Table
                        bordered
                        columns={columns}
                        dataSource={this.state.list}
                        // pagination={this.state.pagination}
                    />
                </div>
                {/* <Modal 
                    title="开通城市"
                    visible={this.state.isShowOpenCity}
                    onCancel={()=>{
                        this.setState({
                            isShowOpenCity:false
                        })
                    }}
                    onOk={this.handleSubmit}
                >
                    <OpenCityForm/>
                </Modal> */}
            </div>
        );
    }
}


// class OpenCityForm extends React.Component{
//     render(){
//         const formItemLayout = {
//             labelCol:{
//                 span:5
//             },
//             wrapperCol:{
//                 span:19
//             }
//         }
//         const { getFieldDecorator }  =this.props.form;
//         return (
//             <Form layout="horizontal">
//                 <FormItem label="城市名称" {...formItemLayout}>
//                     {
//                         getFieldDecorator('name',{
//                             initialValue:''
//                         })(
//                             <Input type='text' style={{ width: 100 }}> </Input>
//                         )
//                     }
//                 </FormItem>
//                 <FormItem label="管理员ID" {...formItemLayout}>
//                     {
//                         getFieldDecorator('leader',{
//                             initialValue:''
//                         })(
//                             <Input type='text' style={{ width: 100 }}> </Input>
//                         )
//                     }
//                 </FormItem>
//                 <FormItem label="营运模式" {...formItemLayout}>
//                     {
//                         getFieldDecorator('opMode', {
//                             initialValue: '1'
//                         })(
//                             <Select style={{ width: 100 }}>
//                                 <Option value="1">自营</Option>
//                                 <Option value="2">加盟</Option>
//                             </Select>
//                         )
//                     }
//                 </FormItem>
//                 <FormItem label="用车模式" {...formItemLayout}>
//                     {
//                         getFieldDecorator('useMode', {
//                             initialValue: '1'
//                         })(
//                             <Select style={{ width: 100 }}>
//                                 <Option value="1">停车点</Option>
//                                 <Option value="2">禁停区</Option>
//                             </Select>
//                         )
//                     }
//                 </FormItem>
//             </Form>
//         );
//     }
// }
// OpenCityForm = Form.create({})(OpenCityForm);