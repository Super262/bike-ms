import React from 'react'
import { Link } from 'react-router-dom'
export default class Home extends React.Component {

    render() { // this.props.children呈现被匹配到的组件
        return (
            <div>
                <ul>
                    <li>
                        <Link to="/main">Home1</Link>
                    </li>
                    <li>
                        <Link to="/about">About1</Link>
                    </li>
                    <li>
                        <Link to="/topics">Topics1</Link>
                    </li>
                </ul>
                <hr />
                {this.props.children}
            </div>
        );
    }
}