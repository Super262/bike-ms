import React from 'react'
import { HashRouter as Router, Route, Switch} from 'react-router-dom'
import Main from './Main'
import Info from './info'
import About from './../route1/about'
import Topic from './../route1/topic'
import Home from './Home'
import NoMatch from './NoMatch'
export default class IRouter extends React.Component{

    render(){
        return (
            <Router>
                <Home>
                    <Switch>
                        <Route path="/main" render={() =>
                            <Main>
                                {/* 注意这里的写法（:value） */}
                                <Route path="/main/:value" component={Info}></Route>
                            </Main>
                        }></Route>
                        <Route path="/about" component={About}></Route>
                        <Route exact={true} path="/about/abc" component={About}></Route>
                        <Route path="/topics" component={Topic}></Route>
                        {/* 在Switch中，若前面的几项都未被匹配到, 且最后一项没有匹配参数，则会执行最后的一项 */}
                        <Route component={NoMatch}></Route>
                    </Switch>
                </Home>
            </Router>
        );
    }
}