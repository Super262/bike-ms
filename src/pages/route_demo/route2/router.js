import React from 'react'
import {HashRouter as Router,Route} from 'react-router-dom' // HashRouter有别名
import Main from './Main'
import About from './../route1/about'
import Topic from './../route1/topic'
import Home from './Home'
export default class IRouter extends React.Component{

    // 分离式Router，即Router与页面是分开的

    render(){
        return (
            <Router>
                <Home>
                    {/* 注意不要在外层添加精准匹配 */}
                    <Route path="/main" 
                    render={()=>
                    // 嵌套路由
                        <Main>
                            <Route path="/main/a" component={About}></Route>
                        </Main>   
                    }>

                    </Route>
                    <Route path="/about" component={About}></Route>
                    <Route path="/topics" component={Topic}></Route>
                </Home>
            </Router>
        );
    }
}