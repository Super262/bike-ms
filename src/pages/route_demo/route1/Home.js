import React from 'react'
import {HashRouter , Route , Link, Switch} from 'react-router-dom'
import Main from './Main'
import About from './about'
import Topic from './topic'

// 混合路由和代码的方式

export default class Home extends React.Component{

    render(){
        return (
            <HashRouter>
                {/* Router下面必须要有根节点（如<div></div>），不然会报错；根节点也是最先被加载的组件 */}
                <div>
                    <ul>
                        {/* 三个链接，对应三个页面 */}
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/about">About</Link>
                        </li>
                        <li>
                            <Link to="/topics">Topics</Link>
                        </li>
                    </ul>
                    <hr/>
                    <Switch>
                        {/* 注意精确匹配（exact={true}）。如果外层使用了精准匹配，外层不符合，内层也不会被匹配到。 */}
                        <Route exact={true} path="/" component={Main}></Route>
                        <Route path="/about" component={About}></Route>
                        <Route path="/topics" component={Topic}></Route>
                    </Switch>
                </div>
            </HashRouter>
        );
    }
}