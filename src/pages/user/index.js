import React from 'react';
import { Card } from 'antd'
import axios from '../../axios'
import Utils from '../../utils/utils'
import BaseForm from '../../components/BaseForm'
import ETable from '../../components/ETable'
export default class User extends React.Component{

    params = {
        moneyH: -1,
        moneyL: -1
    }

    formList = [
        {
            type: 'INPUT-TXT',
            label: 'ID',
            field: 'id',
            width: 130,
        },
        {
            type: 'INPUT-TXT',
            label: '用户名',
            field: 'name',
            width: 130,
        },
        {
            type: 'INPUT-TXT',
            label: '手机号',
            field: 'phone',
            width: 150,
        },
        {
            type: 'NUM-RANGE',
            label: '押金',
            field1: 'moneyL',
            field2: 'moneyH',
            width: 140,
        },
        {
            type: 'INPUT-TXT',
            label: '所在城市',
            field: 'city',
            width: 140,
        },
    ]

    componentWillMount(){
        this.requestList();
    }

    handleFilter = (params)=>{
        if(params.moneyL === "" || params.moneyL === undefined || params.moneyL === null){
            params.moneyL = -1;
        }
        if(params.moneyH === "" || params.moneyH === undefined || params.moneyH === null){
            params.moneyH = -1;
        }
        this.params = params;
        this.requestList();
    }

    requestList = ()=>{
        axios.requestList(this,'/user/query',this.params);
        this.setState({
            selectedItem: null
        })
    }

    render(){
        const columns = [
            {
                title:'id',
                dataIndex:'id'
            },
            {
                title: ' 用户名',
                dataIndex: 'name'
            },
            {
                title: '手机号',
                dataIndex: 'phone'
            },
            {
                title: '押金（单位：元）',
                dataIndex: 'money'
            },
            {
                title: '所在城市',
                dataIndex: 'city'
            },
        ]

        return (
            <div>
                <Card>
                    <BaseForm formList={this.formList} filterSubmit={this.handleFilter}/>
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
            </div>
        );
    }
}
