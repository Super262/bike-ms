import React from 'react'
import { Input, Select, Form, Button, Checkbox, DatePicker, InputNumber, TimePicker} from 'antd'
import Utils from '../../utils/utils';
const FormItem = Form.Item;

class FilterForm extends React.Component{

    handleFilterSubmit = ()=>{
        let fieldsValue = this.props.form.getFieldsValue();
        this.props.filterSubmit(fieldsValue);
    }

    reset = ()=>{
        this.props.form.resetFields();
    }

    initFormList = ()=>{
        const { getFieldDecorator } = this.props.form;
        const formList = this.props.formList;
        const formItemList = [];
        if (formList && formList.length>0){
            formList.forEach((item,i)=>{
                let label = item.label;
                let field = item.field;
                let field1 = item.field1;
                let field2 = item.field2;
                let initialValue = item.initialValue || '';
                let placeholder = item.placeholder;
                let width = item.width;

                if (item.type === 'DATE-RANGE'){

                    const begin_date = <FormItem label={label} key={field1}>
                        {
                            getFieldDecorator([field1])(
                                <DatePicker showTime={true} placeholder={placeholder} format="YYYY-MM-DD HH:mm:ss"/>
                            )
                        }
                    </FormItem>;
                    formItemList.push(begin_date);

                    const end_date = <FormItem label="~" colon={false} key={field2}>
                        {
                            getFieldDecorator([field2])(
                                <DatePicker showTime={true} placeholder={placeholder} format="YYYY-MM-DD HH:mm:ss" />
                            )
                        }
                    </FormItem>;
                    formItemList.push(end_date);

                }
                else if(item.type === 'INPUT-TXT'){
                    const INPUT = <FormItem label={label} key={field}>
                        {
                            getFieldDecorator([field],{
                                initialValue: initialValue
                            })(
                                <Input type="text" style={{ width: width }} placeholder={placeholder} />
                            )
                        }
                    </FormItem>;
                    formItemList.push(INPUT)
                } 
                else if(item.type === 'INPUT-NUM'){
                    const INPUT_NUM = <FormItem label={label} key={field}>
                        {
                            getFieldDecorator([field],{
                                initialValue: initialValue
                            })(
                                <InputNumber style={{ width: width }} placeholder={placeholder} min='0' />
                            )
                        }
                    </FormItem>;
                    formItemList.push(INPUT_NUM)
                }
                else if(item.type === 'NUM-RANGE'){
                    const NUM_L = <FormItem label={label} key={field1}>
                        {
                            getFieldDecorator([field1],{
                                initialValue: initialValue
                            })(
                                <InputNumber style={{ width: width }} placeholder={placeholder} min='0'/>
                            )
                        }
                    </FormItem>;
                    formItemList.push(NUM_L)

                    const NUM_H = <FormItem label='~' colon={false} key={field2}>
                        {
                            getFieldDecorator([field2],{
                                initialValue: initialValue
                            })(
                                <InputNumber style={{ width: width }} placeholder={placeholder} min='0' />
                            )
                        }
                    </FormItem>;
                    formItemList.push(NUM_H)
                }
                else if(item.type === 'TIME-RANGE'){
                    const TIME_L = <FormItem label={label} key={field1}>
                        {
                            getFieldDecorator([field1])(
                                <TimePicker/>
                            )
                        }
                    </FormItem>;
                    formItemList.push(TIME_L)

                    const TIME_H = <FormItem label='~' colon={false} key={field2}>
                        {
                            getFieldDecorator([field2])(
                                <TimePicker/>
                            )
                        }
                    </FormItem>;
                    formItemList.push(TIME_H)
                }
                else if (item.type === 'SELECT') {
                    const SELECT = <FormItem label={label} key={field}>
                        {
                            getFieldDecorator([field], {
                                initialValue: initialValue
                            })(
                                <Select
                                    style={{ width: width }}
                                    placeholder={placeholder}
                                >
                                    {Utils.getOptionList(item.list)}
                                </Select>
                            )
                        }
                    </FormItem>;
                    formItemList.push(SELECT)
                } 
                else if (item.type === 'CHECKBOX') {
                    const CHECKBOX = <FormItem label={label} key={field}>
                        {
                            getFieldDecorator([field], {
                                valuePropName: 'checked',
                                initialValue: initialValue //true | false
                            })(
                                <Checkbox>
                                    {label}
                                </Checkbox>
                            )
                        }
                    </FormItem>;
                    formItemList.push(CHECKBOX)
                } 
                else if (item.type === 'DATE') {
                    const Date = <FormItem label={label} key={field}>
                        {
                            getFieldDecorator([field])(
                                <DatePicker showTime={true} placeholder={placeholder} format="YYYY-MM-DD HH:mm:ss" />
                            )
                        }
                    </FormItem>;
                    formItemList.push(Date)
                }
            })
        }
        return formItemList;
    }
    render(){
        return (
            <Form layout="inline">
                { this.initFormList() }
                <FormItem>
                    <Button type="primary" style={{ margin: '0 20px' }} onClick={this.handleFilterSubmit}>查询</Button>
                    <Button onClick={this.reset}>重置</Button>
                </FormItem>
            </Form>
        );
    }
}
export default Form.create({})(FilterForm);