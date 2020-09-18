// Reducer 数据处理
import {type} from '../action'
const initialState = {
    menuName: '首页'
}

export default (state = initialState, action)=>{ // redux默认要求的参数
    switch(action.type){
        case type.SWITCH_MENU:
            return {
                ...state,
                menuName: action.menuName
            }
            
        default:
            return{
                ...state
            };
    }
}