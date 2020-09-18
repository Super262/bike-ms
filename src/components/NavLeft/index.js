import React from 'react'
import { Menu } from 'antd';
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import { switchMenu } from './../../redux/action'
import MenuConfig from './../../config/menuConfig'
import axios from '../../axios'
import './index.less'
import Utils from '../../utils/utils';
const SubMenu = Menu.SubMenu;
class NavLeft extends React.Component {
    state = {
        currentKey: ''
    }

    componentWillMount(){
        let staff = Utils.getLoginState('staffNow');
        this.setState({
            staffInfo: staff
        });
        let a = -1;
        if(staff && staff.role){
            axios.ajaxPost({
                url: '/role/query',
                data: {
                    params: {
                        name: staff.role
                    }
                }
            }).then((res) => {
                let status = JSON.parse(res[0].status);
                if(status === 1){
                    let array = JSON.parse(res[0].menus);
                    for(let i = 0;i < array.length; i++){
                        if(array[i] === 'platform_all'){
                            a = i;
                        }
                    }
                    if(a !== -1){
                        array.splice(a);
                    }
                
                    this.setState({
                        menus: array
                    });
                    const menuTreeNode = this.renderMenu(MenuConfig);
                    let currentKey = window.location.hash.replace(/#|\?.*$/g, '');
                    this.setState({
                        menuTreeNode,
                        currentKey
                    })
                }
                
            }); 
        }
         
    }

    // 菜单渲染
    renderMenu =(data)=>{
        return data.map((item)=>{
            let menus= this.state.menus;
            if(menus.indexOf(item.key) !== -1){
                if(item.children){
                    return (
                        <SubMenu title={item.title} key={item.key}>
                            { this.renderMenu(item.children)}
                        </SubMenu>
                    )
                }
                return <Menu.Item title={item.title} key={item.key}>
                    <NavLink to={item.key}>{item.title}</NavLink>
                </Menu.Item>
            }
        })
    }

    handleClick = ({item, key})=>{
        const { dispatch } = this.props;
        dispatch(switchMenu(item.props.title));
        this.setState({
            currentKey: key
        });
    }

    

    render() {
        return (
            <div>
                <div className="logo">
                    <img src="/assets/logo-ant.svg" alt=""/>
                    <h1>Bike MS</h1>
                    <h1 className="quote">(课程设计)</h1>
                </div>
                <Menu
                onClick = {this.handleClick}
                selectedKeys = {[this.state.currentKey]}
                theme="dark"
                >
                    { this.state.menuTreeNode }
                </Menu>
            </div>
        );
    }
}
export default connect()(NavLeft);