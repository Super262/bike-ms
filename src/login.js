import React from "react";
import { Card, Form, Input, Button, message, Icon} from "antd";
import axios from './axios'
import Utils from './utils/utils'
import { Redirect } from 'react-router-dom'

const FormItem = Form.Item;

class Login extends React.Component{

    state = {
        isLogin: false
    }

    handleSubmit = ()=>{
        let userInfo = this.props.form.getFieldsValue();
        axios.ajaxPost({
            url: '/staff/login',
            data: {
                params: {
                    id: userInfo.userId,
                    password: userInfo.userPwd
                }
            }
        }).then((res) => {
            Utils.saveLoginState('staffNow', res);
            message.success('登录成功');
            this.setState({
                isLogin: true
            });
        })
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        if(this.state.isLogin){
            return <Redirect to='/home' />
        }
        return (
            <div style={{marginLeft: 100, marginRight:100, marginTop:400, justifyContent: 'center'}}>
                <Card title="登录Bike MS">
                    <Form style={{width:300}}>
                        <FormItem>
                            {
                                getFieldDecorator('userId', {
                                    initialValue:'',
                                    rules:[
                                        {
                                            required:true,
                                            message:'ID不能为空' // 规则不满足时的提示
                                        },
                                        {
                                            min:4,max:30,
                                            message:'长度不在范围内'
                                        },
                                        {
                                            pattern:new RegExp('^\\w+$','g'),
                                            message:'ID必须为字母或者数字'
                                        }
                                    ]
                                })
                                (
                                    <Input prefix={<Icon type="user"/>} placeholder="请输入ID" />
                                )
                            }
                        </FormItem>
                        <FormItem>
                            {
                                getFieldDecorator('userPwd', {
                                    initialValue: '',
                                    rules: []
                                })
                                (
                                    <Input prefix={<Icon type="lock" />} type="password" placeholder="请输入密码" />
                                )
                            }
                        </FormItem>
                        <FormItem>
                            <Button type="primary" onClick={this.handleSubmit}>登录</Button>
                        </FormItem>
                    </Form>
                </Card>
            </div>
        );
    }
}
export default Form.create()(Login);