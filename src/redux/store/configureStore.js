// 引入createStore
import { createStore } from 'redux'
import reducer from './../reducer'
export default ()=>createStore(reducer);