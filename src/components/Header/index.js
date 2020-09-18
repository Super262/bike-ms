import React from 'react'
import { Row,Col } from "antd"
import './index.less'
import Util from '../../utils/utils'
import axios from '../../axios'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

class Header extends React.Component{
    state={
        isLogin:true
    }
    componentWillMount(){
        let staff = Util.getLoginState('staffNow');
        if(staff != null){
            console.log(staff);
            this.setState({
                userName: staff.name
            });
        }
        else{
            this.setState({
                userName: " "
            });
        }
        
        setInterval(()=>{
            let sysTime = Util.formateDateNormal(new Date().getTime());
            this.setState({
                sysTime
            })
        },1000)
        this.getWeatherAPIData();
    }

    getWeatherAPIData(){
        let city = '济南';
        axios.jsonp({
            url:'http://api.map.baidu.com/telematics/v3/weather?location='+encodeURIComponent(city)+'&output=json&ak=3p49MVra6urFRGOT9s8UBWr2'
        }).then((res)=>{
            if(res.status === 'success'){
                let data = res.results[0].weather_data[0];
                this.setState({
                    dayPictureUrl:data.dayPictureUrl,
                    weather:data.weather
                })
            }
        })
    }

    handleLogout =()=>{
        window.close();
        localStorage.clear();
        
    }

    render(){
        const menuType = this.props.menuType;
        if(!this.state.isLogin){
            return <Redirect to='/login' />
        }
        return (
            <div className="header">
                <Row className="header-top">
                    {
                        menuType?
                            <Col span="6" className="logo">
                                <img src="/assets/logo-ant.svg" alt=""/>
                                <span>Bike MS管理系统（课程设计）</span>
                            </Col>:''
                    }
                    <Col span={menuType?18:24}>
                        <span>欢迎，{this.state.userName}</span>
                        <a href="#" onClick = {this.handleLogout}>退出</a>
                    </Col>
                </Row>
                {
                    menuType?'':
                        <Row className="breadcrumb">
                            <Col span="4" className="breadcrumb-title">
                                {this.props.menuName}
                            </Col>
                            <Col span="20" className="weather">
                                <span className="date">{this.state.sysTime}</span>
                                <span className="weather-img">
                                    <img src={this.state.dayPictureUrl} alt="" />
                                </span>
                                <span className="weather-detail">
                                    {this.state.weather}
                                </span>
                            </Col>
                        </Row>
                }
            </div>
        );
    }
    
}

const mapStateToProps = state => {
    return{
        menuName: state.menuName
    }
}
export default connect(mapStateToProps)(Header);