# bike-ms
## 一、 系统开发平台

1. 开发工具：Intellij IDEA 2019，Visual Studio Code 1.38
2. 数据库：MariaDB 10.4（MySQL的一个分支，主要由开源社区在维护）
3. 操作系统：Ubuntu 18.04


## 二、 数据库规划

### 1. 任务概述

共享单车公司的员工在正常的运营中需要对用户信息、订单信息、员工信息、车辆信息和城市信息进行管理，利用共享单车管理系统及时了解各个环节中信息的变更，有利于高管理效率。一套功能强大而又便于使用的共享单车管理系统，适用于用户管理、订单管理和员工管理。该系统的主要功能有：城市信息、单车信息的查询，用户信息的查询，订单的查询、结束，员工的权限管理，异常处理。系统开发的总体任务是实现共享单车运营相关的各种信息的系统化、规范化和自动化。

### 2. 任务目标

#### 1) 正确、完整地展示城市信息、用户信息；

#### 2) 正确、完整、及时地展示订单信息，并提高内容的易读性；

#### 3) 正确、完整、及时地展示车辆信息，并提高内容的易读性；

#### 4) 正确、完整地展示员工信息；

#### 5) 提供权限设置，限制每个员工的操作范围；

#### 6) 可以修改员工信息；

#### 7) 具有丰富的查询功能；

#### 8) 保证员工权限管理的可靠性。


## 三、 需求分析

### 1. 用户需求说明

#### 1) 数据需求

管理系统的所有功能均由员工来使用。员工信息包括员工编号、员工姓名、密码、性别、联系电话、职务名、角色名。员工号是唯一的。员工号和密码用于登陆管理系统。角色名用于确定员工的权限。每一个员工的权限由他（或她）的角色赋予。一个员工在刚被创建时不具有任何角色，需要由更高级的或最高级的员工授权。角色信息包括角色的编号、角色名称、权限、创建时间、授权时间、状态和创建人编号。角色编号和角色名称都是唯一的。创建时间指角色被创建的时间。在某一角色刚被创建时，该角色没有任何权限。一个角色的权限需由最高级的员工或具有授权职能的员工授予。在某一角色被授权（或撤销权限）后，该角色拥有（或失去）特定的权限。授权时间是角色被授权的时间。状态为启用或停用。创建人编号依赖于员工编号。权限为包含该角色可用菜单的字符串数组，如“["/city","/order","/staff"]”表示可以使用“城市信息”、“订单信息”、“员工信息”这三个菜单。

用户是共享单车的使用者。用户数据包括用户编号、用户名、手机号、押金剩余量、所在城市。用户编号和用户名都是唯一的。城市信息用于指示单车、订单和用户的所在地。城市信息包括城市编号、名称、用车模式、营运模式、负责人、开通时间和开通人编号。城市编号和名称是唯一的。用车模式为停车点或禁停区。营运模式为加盟或自营。开通人编号为开通这个城市的员工的员工编号，依赖自员工信息。开通时间为这个城市被开通的时间。

单车信息包括车辆编号和所在城市。车辆编号是唯一的。车辆编号用于指示订 单信息和车辆记录信息所属的车辆。所在城市依赖城市信息的城市名称。

车辆记录信息指示某一辆车在某一时刻的位置变化。如果某一辆单车的位置一直不变，则与这辆车有关的车辆记录只有一条；如果某一辆车的位置发生了变化，那么与这辆车有关的车辆记录会有许多条。车辆记录包括的信息有记录编号、时间、车辆编号和位置。记录编号是唯一的。时间信息由 10 位时间戳表示。位置信息由包含经纬度的字符串表示，如“{"lon": 116.361221,"lat": 40.043776}”。车辆编号依赖自单车信息的车辆编号。

订单信息包括订单编号、所在城市、车辆编号、用户名、手机号、里程、时长、状态、开始时间、结束时间、标准金额、实付金额和轨迹。订单编号是唯一的。所在城市依赖城市信息的城市名称。车辆编号依赖车辆信息的车辆编号。用户名依赖用户信息的用户名。状态为结束或进行中。标准金额是某一订单的初始金额，实付金额是最终用户支付的金额。由于实际的共享单车应用可能有优惠，实付金额小于或等于标准金额。轨迹是包含位置信息的、表示JSON 数组的字符串，如“[{"lon": 116.361221,"lat": 40.043776}, {"lon": 116.363736,"lat": 40.038086}]”。


#### 2) 事务需求

##### a) 数据更新或删除
  ###### i. 结束订单
  ###### ii. 编辑员工信息
  ###### iii. 删除员工
  ###### iv. 设置角色权限
  ###### v. 员工授权
  
##### b) 数据添加
  ###### i. 创建员工
  ###### ii. 创建角色

##### c) 数据查询
  ###### i. 根据城市的全部属性（城市编号、城市名称、用车模式、营运模式、城市管理员、开通时间和开通人编号）中的任意属性查询满足条件的城市信息
  ###### ii. 根据用户的全部属性（用户编号、用户名、手机号、押金余额和所在城市）中的任意属性查询满足条件的用户信息
  ###### iii. 根据订单的部分属性（订单编号、所在城市、车辆编号、用户名、手机号、里程、行驶时长、状态、开始时间、结束时间、标准金额和实付金额）中的任意属性查询满足条件的订单信息
  ###### iv. 根据员工的部分属性（员工编号、姓名、性别、手机号、职位和角色）中的任意属性查询满足条件的订单信息）中的任意属性查询满足条件的员工信息
  ###### v. 根据车辆记录的部分属性（车辆编号、时间和位置）中的任意属性查询满足条件的车辆记录信息

### 2. 系统需求说明

#### 1) 初始数据库


##### a) 包含 1 个具有所有权限（最高权限）的root角色
##### b) 包含 1 个具有root角色的、最高级的员工（姓名：Admin）
##### c) 包含 6 条单车信息
##### d) 包含 8 条车辆记录
##### e) 包含 1 个城市信息
##### f) 包含 12 条订单信息
##### g) 包含 10 个用户


#### 2) 安全性
##### a) 数据库具有又令保护
##### b) 每个员工由于角色不同，具有不同的权限。因此，每个员工只能看到有限的数据、进行有限的操作

#### 3) 用户界面
##### 简洁、美观、人性化的设计风格

## 四、 数据库逻辑设计

### 1. E-R图

红色属性表示主码

![image](https://github.com/Super262/bike-ms/blob/master/screenshots/pic00001.png)


### 2. 数据字典

![image](https://github.com/Super262/bike-ms/blob/master/screenshots/pic00002.png)

![image](https://github.com/Super262/bike-ms/blob/master/screenshots/pic00003.png)

![image](https://github.com/Super262/bike-ms/blob/master/screenshots/pic00004.png)

### 3. 关系模式图

![image](https://github.com/Super262/bike-ms/blob/master/screenshots/pic00005.png)

## 五、 数据库物理设计

### 1. 索引

#### 1) bike表
```
a) 以id为索引
b) 以city为索引
```
  
#### 2) bikelog表
```
a) 以id为索引
b) 以bike_id为索引
c) 以position为索引
d) 以time为索引
```

#### 3) city表
```
a) 以id为索引
b) 以name为索引
c) 以 leader 为索引
d) 以op_mode为索引
e) 以op_time为索引
f) 以operator为索引
g) 以use_mode为索
```
  
#### 4) orderlog表
```
a) 以id为索引
b) 以actual_cost为索引
c) 以bike_id为索引
d) 以city为索引
e) 以duration为索引
f) 以finish_time为索引
g) 以mileage为索引
h) 以phone为索引
i) 以standard_cost为索引
j) 以start_time为索引
k) 以status为索引
l) 以username为索引
```
  
#### 5) role表
```
a) 以id为索引
b) 以name为索引
c) 以authorize_time为索引
d) 以create_time为索引
e) 以jurisdiction为索引
f) 以operator为索引
g) 以status为索引
```

#### 6) staff表
```
a) 以id为索引
b) 以name为索引
c) 以password为索引
d) 以phone为索引
e) 以post为索引
f) 以role为索引
g) 以sex为索引
```
  
#### 7) user表
```
a) 以id为索引
b) 以name为索引
c) 以city为索引
d) 以money为索引
e) 以phone为索引
```
  
### 2. 安全机制

#### 1) 数据安全
程序启动需要经过MariaDB登陆认证，登陆ID和密码正确才能启动程序。程序内部的任何会引起数据库改动的操作（增删改）均经过了严密的审查判定，以确保数据库的准确性和一致性。

#### 2) 系统安全
登陆需经过身份认证，即身份又令密码一致才可登录。不同的用户有不同的权限，用户只能使用分配给他的权限，无法越权操作。


## 六、 应用程序设计

### 1. 功能模块

![image](https://github.com/Super262/bike-ms/blob/master/screenshots/pic00006.png)

### 2. 界面设计

#### 1) 登录

![image](https://github.com/Super262/bike-ms/blob/master/screenshots/pic00007.png)

#### 2) 首页

![image](https://github.com/Super262/bike-ms/blob/master/screenshots/pic00008.png)

#### 3) 城市信息

![image](https://github.com/Super262/bike-ms/blob/master/screenshots/pic00009.png)

#### 4) 用户信息

![image](https://github.com/Super262/bike-ms/blob/master/screenshots/pic00010.png)

#### 5) 订单管理

![image](https://github.com/Super262/bike-ms/blob/master/screenshots/pic00011.png)

#### 6) 订单详情

![image](https://github.com/Super262/bike-ms/blob/master/screenshots/pic00012.png)

#### 7) 员工管理

![image](https://github.com/Super262/bike-ms/blob/master/screenshots/pic00013.png)

##### a) 创建员工

![image](https://github.com/Super262/bike-ms/blob/master/screenshots/pic00014.png)

##### b) 编辑员工

![image](https://github.com/Super262/bike-ms/blob/master/screenshots/pic00015.png)

##### c) 员工详情

![image](https://github.com/Super262/bike-ms/blob/master/screenshots/pic00016.png)

#### 8) 车辆地图

![image](https://github.com/Super262/bike-ms/blob/master/screenshots/pic00017.png)

##### 具体位置

![image](https://github.com/Super262/bike-ms/blob/master/screenshots/pic00018.png)

#### 9) 权限设置

![image](https://github.com/Super262/bike-ms/blob/master/screenshots/pic00019.png)

##### a) 创建角色

![image](https://github.com/Super262/bike-ms/blob/master/screenshots/pic00020.png)

##### b) 设置权限

![image](https://github.com/Super262/bike-ms/blob/master/screenshots/pic00021.png)

##### c) 员工授权

![image](https://github.com/Super262/bike-ms/blob/master/screenshots/pic00022.png)

### 3. 事务设计

#### 1) 利用任意属性进行模糊查询（Java）以查询城市信息为例

![image](https://github.com/Super262/bike-ms/blob/master/screenshots/pic00023.png)

#### 2) 在百度地图上绘制路线（JavaScript）

![image](https://github.com/Super262/bike-ms/blob/master/screenshots/pic00024.png)


## 七、 总结

这次课程设计使我感触颇深，首先是深刻感受到程序的实际应用性。这学期的课程设计的题目都是贴近实际生活的问题。我们就能够很清楚的明白自己写的程序要解决什么样的实际问题，应该解决什么样的实际问题，会觉得自己的程序更有实用价值。我设计的这个共享单车管理系统是一个非常简单的程序，而实际投入生产的系统的功能十分的强大。它能够在线了解信息，各种业务也可以在线完成，而且有很强大的报表功能。我的程序的可以实现共享单车管理中最基本也是最重要的业务，如订单查询、增删员工和权限管理。不足之处是没有统计、分析数据的功能。在开发的过程中我不断遇到新问题，我会自己努力，不断的改正错误、改进自己的程序。如果遇到自己无法解决的问题，我会与其他同学讨论，或上网查询、搜寻资料。在不断的改进过程中，我深刻认识到自己程序的漏洞和不健全性。因为我对一些JavaScript的语法和函数不是很了解，以致有很多错误需要我用很长时间修改才能调试正确。这次课程设计让我进一步加深了对知识的理解，而且锻炼了我的独立思考能力，以及分析问题、解决问题的能力。今后凡事我都不要着急，要冷静的分析思考，因为越是急越是无法解决。只有沉着冷静深入思考才能真正的解决问题。只要自己努力凡事都能解决。我也深刻感受到了知识的重要性。平时如果我不多积累知识，我在编写程序时会手忙脚乱、无所适从。相反，如果我平时自己扎实学习，知识掌握的都很牢固，写程序的时我会得心应手。即 使有些错误，如果仔细检查，也会在很短的时间内解决。
