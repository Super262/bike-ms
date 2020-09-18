import React from 'react';
import { Card, Button, Modal,Form, Input, Radio} from 'antd'
import axios from '../../axios'
import Utils from '../../utils/utils'
import BaseForm from '../../components/BaseForm'
import ETable from '../../components/ETable'
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
export default class Staff extends React.Component{

    params = {
        sex: -1
    }

    state = {
        isVisible:false
    }

    formList = [
        {
            type: 'INPUT-TXT',
            label: 'ID',
            field: 'id',
            placeholder: '请输入员工ID',
            width: 130,
        }, 
        {
            type: 'INPUT-TXT',
            label: '姓名',
            field: 'name',
            placeholder: '请输入员工姓名',
            width: 130,
        }, 
        {
            type: 'SELECT',
            label: '性别',
            field:'sex',
            placeholder: '',
            initialValue: -1,
            width: 65,
            list: [{ id: -1, name: '全部' }, { id: 1, name: '男' }, { id: 2, name: '女' }]
        }, 
        {
            type: 'INPUT-TXT',
            label: '手机号',
            field: 'phone',
            placeholder: '请输入员工的手机号',
            width: 150,
        },
        {
            type: 'INPUT-TXT',
            label: '职务',
            field: 'post',
            placeholder: '请输入员工的职务',
            width: 140,
        },
        {
            type: 'INPUT-TXT',
            label: '角色',
            field: 'role',
            placeholder: '请输入员工的角色',
            width: 140,
        },
    ]

    componentWillMount(){
        this.requestList();
    }

    handleFilter = (params)=>{
        if(params.sex === "" || params.sex === undefined || params.sex === null){
            params.sex=-1;
        }
        this.params = params;
        this.requestList();
    }

    requestList = ()=>{
        axios.requestList(this,'/staff/query',this.params);
        this.setState({
            selectedItem: null
        })
    }

    // 功能区操作
    hanleOperate = (type)=>{
        let item =  this.state.selectedItem;
        if(type === 'create'){
            this.setState({
                type,
                isVisible:true,
                title:'创建员工'
            })
        }
        else if(type === 'edit'){
            if (!item){
                Modal.info({
                    title: "提示",
                    content: '请选择一个员工'
                })
                return;
            }
            this.setState({
                type,
                isVisible: true,
                title: '编辑员工',
                userInfo:item
            })
        }
        else if(type === 'detail'){
            if (!item){
                Modal.info({
                    title: "提示",
                    content: '请选择一个员工'
                })
                return;
            }
            this.setState({
                type,
                isVisible: true,
                title: '员工详情',
                userInfo: item
            })
        }
        else{
            if (!item) {
                Modal.info({
                    title: "提示",
                    content: '请选择一个用户'
                })
                return;
            }
            let _this = this;
            Modal.confirm({
                title:'确认删除',
                content:'是否要删除当前选中的员工',
                onOk(){
                    axios.ajaxPost({
                        url:'/staff/delete',
                        data:{
                            params:{
                                id:item.id
                            }
                        }
                    }).then((res)=>{
                        _this.setState({
                            isVisible:false
                        })
                        _this.requestList();
                    })
                }
            })
        }
    }

    // 创建员工提交
    handleSubmit = ()=>{
        let type = this.state.type;
        let data = this.userForm.props.form.getFieldsValue();
        axios.ajaxPost({
            url:type === 'create'?'/staff/add':'/staff/update',
            data:{
                params: data
            }
        }).then((res)=>{
            this.userForm.props.form.resetFields();
            this.setState({
                isVisible:false
            })
            this.requestList();
        })
    }

    render(){
        const columns = [
            {
                title:'id',
                dataIndex:'id'
            },
            {
                title: '姓名',
                dataIndex: 'name'
            }, 
            {
                title: '性别',
                dataIndex: 'sex',
                render(sex){
                    return sex === 1?'男':'女'
                }
            }, 
            {
                title: '手机号',
                dataIndex: 'phone'
            }, 
            {
                title: '职位',
                dataIndex: 'post'
            }, 
            {
                title: '角色',
                dataIndex: 'role'
            },
        ]
        let footer = {};
        if(this.state.type === 'detail'){
            footer = {
                footer: null
            }
        }
        return (
            <div>
                <Card>
                    <BaseForm formList={this.formList} filterSubmit={this.handleFilter}/>
                </Card>
                <Card style={{ marginTop: 10 }} className="operate-wrap">
                    <Button type="primary" icon="plus" onClick={()=>this.hanleOperate('create')}>创建员工</Button>
                    <Button type="primary" icon="edit" onClick={() => this.hanleOperate('edit')}>编辑员工</Button>
                    <Button type="primary" onClick={() => this.hanleOperate('detail')}>员工详情</Button>
                    <Button type="primary" icon="delete" onClick={() => this.hanleOperate('delete')}>删除员工</Button>
                </Card>
                <div className="content-wrap">
                    <ETable
                        updateSelectedItem={Utils.updateSelectedItem.bind(this)}
                        columns={columns}
                        dataSource={this.state.list}
                        selectedRowKeys={this.state.selectedRowKeys}
                        selectedItem={this.state.selectedItem}
                    />
                </div>
                <Modal
                    title={this.state.title}
                    visible={this.state.isVisible}
                    onOk={this.handleSubmit}
                    onCancel={()=>{
                        this.userForm.props.form.resetFields();
                        this.setState({
                            isVisible:false
                        })
                    }}
                    width={600}
                    { ...footer }
                >
                    <UserForm type={this.state.type} userInfo={this.state.userInfo} wrappedComponentRef={(inst)=>{this.userForm = inst;}}/>
                </Modal>
            </div>
        );
    }
}
class UserForm extends React.Component{

    render(){
        let type = this.props.type;
        let userInfo = this.props.userInfo || {};
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol:{span:5},
            wrapperCol:{span:19}
        }
        return (
            <Form layout="horizontal">
                <FormItem label="姓名" {...formItemLayout}>
                    {
                        type === 'detail'?userInfo.name:
                        getFieldDecorator('name',{
                            initialValue:userInfo.name
                        })(
                            <Input  type="text" placeholder="请输入姓名"/> 
                        )
                    }
                </FormItem>
                <FormItem label="密码" {...formItemLayout}>
                    {
                        type === 'detail'?userInfo.password:
                        getFieldDecorator('password',{
                            initialValue:userInfo.password
                        })(
                            <Input  type="text" placeholder="请输入密码"/> 
                        )
                    }
                </FormItem>
                <FormItem label="性别" {...formItemLayout}>
                    {
                        type === 'detail' ? userInfo.sex === 1?'男':'女' :
                        getFieldDecorator('sex',{
                            initialValue: userInfo.sex
                        })(
                            <RadioGroup>
                                <Radio value={1}>男</Radio>
                                <Radio value={2}>女</Radio>
                            </RadioGroup>
                        )
                    }
                </FormItem>
                <FormItem label="手机号" {...formItemLayout}>
                    {
                        type === 'detail'?userInfo.phone:
                        getFieldDecorator('phone',{
                            initialValue:userInfo.phone
                        })(
                            <Input  type="text" placeholder="请输入手机号"/> 
                        )
                    }
                </FormItem>
                <FormItem label="职务" {...formItemLayout}>
                    {
                        type === 'detail'?userInfo.post:
                        getFieldDecorator('post',{
                            initialValue:userInfo.post
                        })(
                            <Input  type="text" placeholder="请输入职务"/> 
                        )
                    }
                </FormItem>
            </Form> 
        );
    }
}
UserForm = Form.create({})(UserForm);