const menuList = [
    {
        title: '首页',
        key: '/home'
    },
    {
        title: '城市信息',
        key: '/city'
    },
    {
        title: '用户信息',
        key: '/user'
    },
    {
        title: '订单管理',
        key: '/order',
        btnList: [
            {
                title: '订单详情',
                key: 'detail'
            },
            {
                title: '结束订单',
                key: 'finish'
            }
        ]
    },
    {
        title: '员工管理',
        key: '/staff'
    },
    {
        title: '车辆地图',
        key: '/bikeMap'
    },
    {
        title: '权限设置',
        key: '/permission'
    },
];
export default menuList;