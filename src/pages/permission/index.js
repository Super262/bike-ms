import React from 'react'
import { Card, Button, Form, Select, Modal, Input, Tree, Transfer } from 'antd'
import ETable from './../../components/ETable'
import Utils from './../../utils/utils'
import axios from './../../axios'
import menuConfig from './../../config/menuConfig'
const Option = Select.Option;
const FormItem = Form.Item;
const TreeNode = Tree.TreeNode;
export default class PermissionUser extends React.Component {

    state = { }
    componentWillMount(){
        axios.requestList(this,'/role/query',{});
    }
    // 打开创建角色弹框
    handleRole=()=>{
        this.setState({
            isRoleVisible:true
        })
    }
    // 角色提交
    handleRoleSubmit=()=>{
        let data = this.roleForm.props.form.getFieldsValue();
        data.operator = Utils.getLoginState('staffNow').id;
        console.log(data);
        axios.ajaxPost({
            url:'role/add',
            data:{
                params:data
            }
        }).then((res)=>{
            this.setState({
                isRoleVisible:false
            });
            this.roleForm.props.form.resetFields();
            axios.requestList(this, '/role/query', {});
            this.setState({
                selectedItem: null
            });
        })
    }

    // 权限设置
    handlePermission = ()=>{
        let item = this.state.selectedItem;
        if (!item) {
            Modal.info({
                title: '信息',
                content: '请选择一个角色'
            })
            return;
        }
        let menus=JSON.parse(item.menus);
        this.setState({
            isPermVisible:true,
            detailInfo:item,
            menuInfo: menus
        })
        console.log(menus);
    }

    handlePermEditSubmit = ()=>{
        let data = this.permForm.props.form.getFieldsValue();
        data.id = this.state.selectedItem.id;
        data.menus = JSON.stringify(this.state.menuInfo).toString();

        console.log(data);

        axios.ajaxPost({
            url:'/role/setPermission',
            data:{
                params:data
            }
        }).then((res)=>{
            if(res){
                this.setState({
                    isPermVisible:false
                })
                axios.requestList(this, '/role/query', {});
                this.setState({
                    selectedItem: null
                });
            }
        });
    }

    // 用户授权
    hanldeUserAuth = ()=>{
        let item = this.state.selectedItem;
        if (!item) {
            Modal.info({
                title: '信息',
                content: '请选择一个角色'
            })
            return;
        }
        this.setState({
            isUserVisible: true,
            detailInfo: item
        })
        this.getRoleUserList(item.name);
    }

    getRoleUserList = (name)=>{
        axios.ajaxPost({
            url:'/staff/getStaffRoleList',
            data:{
                params:{
                    roleName: name
                }
            }
        }).then((res)=>{
            if(res){
                this.getAuthUserList(res);
            }
        })
    }

    // 筛选目标用户
    getAuthUserList = (dataSource)=>{
        const mockData = [];
        const targetKeys = []
        const allKeys = []
        if (dataSource && dataSource.length>0){
            for(let i=0;i< dataSource.length;i++){
                const data = {
                    key: dataSource[i].staffId,
                    title: dataSource[i].staffName,
                    status: dataSource[i].status
                }
                if(data.status === 1){
                    targetKeys.push(data.key);
                }
                mockData.push(data);
                allKeys.push(data.key);
            }
            this.setState({
                mockData, targetKeys, allKeys
            })
        }
    }
    // 用户授权提交
    handleUserSubmit = ()=>{
        let data = {};
        let noRole= [];

        this.state.allKeys.forEach(element=> {
            if(this.state.targetKeys.indexOf(element) === -1){
                noRole.push(element);
            }
        });

        data.hasRoleIds = JSON.stringify(this.state.targetKeys);
        data.roleName = this.state.selectedItem.name;
        data.noRoleIds = JSON.stringify(noRole);

        console.log(data.hasRoleIds);
        console.log(data.roleName);
        console.log(data.noRoleIds);

        axios.ajaxPost({
            url:'/staff/setStaffRole',
            data:{
                params:{
                    ...data
                }
            }
        }).then((res)=>{
            this.setState({
                isUserVisible:false
                })
                axios.requestList(this, '/role/query', {});
        })
    }
    render() {
        const columns = [
            {
                title:'角色ID',
                dataIndex:'id'
            }, 
            {
                title: '角色名称',
                dataIndex: 'name'
            },
             {
                title: '创建时间',
                dataIndex: 'createTime',
                render: Utils.formateDate
            },
            {
                title: '创建人ID',
                dataIndex: 'operator'
            },
            {
                title: '使用状态',
                dataIndex: 'status',
                render(status){
                    return status === 1?'启用':'停用'
                }
            }, 
            {
                title: '授权时间',
                dataIndex: 'authorizeTime',
                render: Utils.formateDate
            },
            
        ]
        return (
            <div>
                <Card>
                    <Button type="primary" onClick={this.handleRole}>创建角色</Button>
                    <Button type="primary" style={{marginLeft:10,marginRight:10}} onClick={this.handlePermission}>设置权限</Button>
                    <Button type="primary" onClick={this.hanldeUserAuth}>员工授权</Button>
                </Card>

                <div className="content-wrap">
                    <ETable 
                        updateSelectedItem={Utils.updateSelectedItem.bind(this)}
                        selectedRowKeys={this.state.selectedRowKeys}
                        dataSource={this.state.list}
                        columns={columns}
                    />
                </div>

                <Modal
                    title="创建角色"
                    visible={this.state.isRoleVisible}
                    onOk={this.handleRoleSubmit}
                    onCancel={()=>{
                        this.roleForm.props.form.resetFields(); // 重置表单
                        this.setState({
                            isRoleVisible:false
                        })
                    }}
                >
                    <RoleForm wrappedComponentRef={(inst)=>this.roleForm=inst}></RoleForm>
                </Modal>

                <Modal
                    title="设置权限"
                    visible={this.state.isPermVisible}
                    width={600}
                    onOk={this.handlePermEditSubmit}
                    onCancel={()=>{
                        this.setState({
                            isPermVisible:false
                        })
                    }}
                >
                    <PermEditForm 
                        wrappedComponentRef={(inst) => this.permForm = inst}
                        detailInfo={this.state.detailInfo} 
                        menuInfo={this.state.menuInfo}
                        patchMenuInfo={(checkedKeys)=>{
                            this.setState({
                                menuInfo: checkedKeys
                            })
                        }}
                    />
                </Modal>
                
                <Modal
                    title="员工授权"
                    visible={this.state.isUserVisible}
                    width={800}
                    onOk={this.handleUserSubmit}
                    onCancel={() => {
                        this.setState({
                            isUserVisible: false
                        })
                    }}
                >
                    <RoleAuthForm
                        wrappedComponentRef={(inst) => this.userAuthForm = inst}
                        detailInfo={this.state.detailInfo}
                        targetKeys={this.state.targetKeys}
                        mockData={this.state.mockData}
                        patchUserInfo={(targetKeys)=>{
                            this.setState({
                                targetKeys
                            })
                        }}
                    />

                </Modal>

            </div>
        );
    }
}
class RoleForm extends React.Component {

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 }
        }
        return (
            <Form layout="horizontal">
                <FormItem label="角色名称" {...formItemLayout}>
                    {
                        getFieldDecorator('name')(
                            <Input type="text" placeholder="请输入角色名称" />
                        )   
                    }
                </FormItem>
                <FormItem label="状态" {...formItemLayout}>
                    {
                        getFieldDecorator('status')(
                            <Select>
                                <Option value={1}>启用</Option>
                                <Option value={0}>停用</Option>
                            </Select>
                        )  
                    }
                </FormItem>
            </Form>
        );
    }
}
RoleForm = Form.create({})(RoleForm);

class PermEditForm extends React.Component{

    onCheck = (checkedKeys)=>{
        this.props.patchMenuInfo(checkedKeys)
    }

    renderTreeNodes = (data)=>{
        return data.map((item)=>{
            if(item.children){
                return <TreeNode title={item.title} key={item.key}>
                    {this.renderTreeNodes(item.children)}
                </TreeNode>
            }else{
                return <TreeNode {...item}/>
            }
        })
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 }
        }
        const detail_info = this.props.detailInfo;
        const menuInfo = this.props.menuInfo;
        return (
            <Form layout="horizontal">
                <FormItem label="角色名称" {...formItemLayout}>
                    <Input disabled placeholder={detail_info.name}/>
                </FormItem>
                <FormItem label="状态" {...formItemLayout}>
                    {
                        getFieldDecorator('status',{
                            initialValue: 1
                        })(
                            <Select>
                                <Option value={1}>启用</Option>
                                <Option value={0}>停用</Option>
                            </Select>
                        )
                    }
                </FormItem>
                <Tree
                    checkable // 有复选框
                    defaultExpandAll
                    onCheck={(checkedKeys)=>{
                        this.onCheck(checkedKeys)
                    }}
                    checkedKeys={menuInfo}
                >
                    <TreeNode title="平台权限" key="platform_all">
                        {this.renderTreeNodes(menuConfig)}
                    </TreeNode>
                </Tree>
            </Form>
        );
    }
}
PermEditForm = Form.create({})(PermEditForm);

class RoleAuthForm extends React.Component {

    onCheck = (checkedKeys) => {
        this.props.patchMenuInfo(checkedKeys)
    }
    filterOption = (inputValue, option) => {
        return option.title.indexOf(inputValue) > -1;
    }
    handleChange = (targetKeys)=>{
        this.props.patchUserInfo(targetKeys);
    }
    
    render() {
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 }
        }
        const detail_info = this.props.detailInfo;
        return (
            <Form layout="horizontal">
                <FormItem label="角色名称" {...formItemLayout}>
                    <Input disabled placeholder={detail_info.name} />
                </FormItem>
                <FormItem label="选择员工" {...formItemLayout}>
                    <Transfer
                        listStyle={{width:200,height:400}}
                        dataSource={this.props.mockData}
                        titles={['待授权员工', '已授权员工']}
                        showSearch
                        searchPlaceholder='输入员工名'
                        filterOption={this.filterOption}
                        targetKeys={this.props.targetKeys}
                        onChange={this.handleChange}
                        render={item => item.title}
                    />
                </FormItem>
            </Form>
        );
    }
}
RoleAuthForm = Form.create({})(RoleAuthForm);