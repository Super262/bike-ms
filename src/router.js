import React from 'react'
import { HashRouter,Route,Switch,Redirect} from 'react-router-dom'
import App from './App'
import Login from './login'
import Admin from './admin'
import Home from './pages/home'
import NoMatch from './pages/nomatch'
import City from './pages/city/index'
import User from './pages/user/index'
import Order from './pages/order/index'
import Staff from './pages/staff'
import BikeMap from './pages/map/bikeMap'
import Common from './common'
import OrderDetail from './pages/order/detail'
import Permission from './pages/permission'
export default class IRouter extends React.Component{

    render(){
        return (
            <HashRouter>
                <App>
                    <Switch>
                        <Route path="/login" component={Login}/>
                        <Route path="/common" render={() =>
                            <Common>
                                <Route path="/common/order/detail/:orderId" component={OrderDetail}/>
                            </Common>  
                        }
                        />
                        <Route path="/" render={()=>
                            <Admin>
                                <Switch>
                                    <Route path="/home" component={Home} />

                                    <Route path="/city" component={City} />

                                    <Route path="/user" component={User} />

                                    <Route path="/order" component={Order} />

                                    <Route path="/staff" component={Staff} />

                                    <Route path="/bikeMap" component={BikeMap} />

                                    <Route path="/permission" component={Permission} />

                                    <Redirect to="/login" />

                                    <Route component={NoMatch} />

                                </Switch>
                            </Admin>         
                        } />
                    </Switch>
                </App>
            </HashRouter>
        );
    }
}