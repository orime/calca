import React, {Component} from 'react';
import { Button, Form, InputNumber, Card, Row, Col, Switch  } from 'antd';

const FormItem = Form.Item;

function debounce(fn, delay) {
  let timerId;
  return function() {
    if(timerId) clearTimeout(timerId)
    timerId = setTimeout(() => {
      fn.apply(this)
    }, delay)
  }
}

@Form.create()
class App extends Component{

  constructor() {
    super()
    this.handleInput = debounce(this.handleInput, 500)
  }

  state = {
    resultList: [],
    fixed: 0,
    checked: false
  }

  // 重置
  // handleReset = () => {
  //   const { form } = this.props
  //   form
  // }

  // 原始待遍历数据
  calcItem = {
    dataIndex: 0,
  }
  groupData = Array.from({length: 5}, (item, index) => ({
    dataIndex: 'a' + index,
  }))

  // 表单提交
  handleSubmit = () => {
    const { form } = this.props
    const { fixed } = this.state
    form.validateFields((err, fieldsValue) => {
      // if (err) return;
      let resList = []
      console.log({fieldsValue})
      for(let i = 0; i<5; i++){
        // const { a[i], b[i], c[i] } = fieldsValue;
        const a = fieldsValue['a'+i] || undefined
        const b = fieldsValue['b'+i] || undefined
        const c = fieldsValue['c'+i] || undefined
        const res = (a + b)*293 / (273+c)
        resList.push(res.toFixed(fixed))
      }
      console.log({resList})
      this.setState({resultList: resList})
    });
  }

  // 实时响应用户输入
  handleInputChange = () => {
    this.handleInput()
  }

  handleInput = () => {
    this.handleSubmit()
  }

  render() {
    const { form } = this.props
    const { resultList, fixed, checked } = this.state
    return (
       <div style={{ margin: '50px auto' }}>
         <div style={{ fontSize: 50, textAlign: 'center' }}>温度压力计算</div>
         <Card style={{ margin: 50 }}>
         <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>

           {
             Array.from({length: 5}, (item, index) => (
                <Col xs={24} sm={24} md={8} lg={4}>
                  <Card title={`第${index+1}组`}>
                    <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 15 }} label="表压">
                      {form.getFieldDecorator('a'+index, {
                        rules: [
                          { required: true, message: '表压不能为空！' },
                        ],
                      })(<InputNumber onChange={ !checked ? null : this.handleInputChange} style={{width: '100%'}} placeholder="请输入表压" />)}
                    </FormItem>
                    <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 15 }} label="大气压">
                      {form.getFieldDecorator('b'+index, {
                        rules: [
                          { required: true, message: '大气压不能为空！' },
                        ],
                      })(<InputNumber onChange={ !checked ? null : this.handleInputChange} style={{width: '100%'}} placeholder="请输入大气压" />)}
                    </FormItem>
                    <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 15 }} label="温度">
                      {form.getFieldDecorator('c'+index, {
                        rules: [
                          { required: true, message: '温度不能为空！' },
                        ],
                      })(<InputNumber onChange={ !checked ? null : this.handleInputChange} style={{width: '100%'}} placeholder="请输入温度" />)}
                    </FormItem>
                    <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 15 }} label="计算结果">
                      {isNaN(resultList[index]) ? checked ? '输入不完整' : '输入完毕后点击计算' : resultList[index]}
                    </FormItem>
                  </Card>
                </Col>
             ))
           }

           <Col xs={24} sm={16} md={8} lg={4} style={{height: '100%'}}>
             <Card title={`操作`} style={{height: '100%'}}>
             <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 15 }} label="精度">
               保留 <InputNumber onChange={value => {
               this.setState({fixed: value}, this.handleSubmit)
             }} value={fixed} min={0} style={{width: 50}} max={22} /> 位小数
             </FormItem>
               <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 15 }} label="差值">
                 {isNaN(resultList[0] - resultList[4]) ? '输入未完成' : resultList[0] - resultList[4]}
               </FormItem>
               <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 15 }} label="实时计算">
                 <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked={false} onClick={checked => this.setState({checked}, this.handleSubmit())} />
               </FormItem>
               <div style={{float: 'right',}}>
                 <Button onClick={() => {
                   form.resetFields()
                   this.setState({resultList: []})
                 }} type='default' style={{marginRight: 8}}>重置</Button>
                 <Button onClick={this.handleSubmit} type='primary'>计算</Button>
               </div>
             </Card>
           </Col>
         </Row>
         </Card>
       </div>
    );
  }


}

export default App;
