import React, {Component} from 'react';
import { Button, Form, InputNumber, Card, Row, Col, Switch, Table, Radio   } from 'antd';
import './App.css'

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
    this.handleInput = debounce(this.handleInput, 300)
  }

  state = {
    resultList: [],
    fixed: 3,
    checked: false,
    layout: 'table'
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
    const { resultList, fixed, checked, layout } = this.state

    console.log(checked, 'checked')

    return (
       <div style={{ margin: '50px auto' }}>
         <div style={{ fontSize: 50, textAlign: 'center', position: 'relative' }}>17系列20℃箱内压力转换器</div>
         <Form layout='inline' style={{position: 'absolute', right: 36, top: 120}}>
           <FormItem label='切换布局'>
             <Radio.Group defaultValue="table" buttonStyle="solid" onChange={e => {
               console.log(e)
               this.setState({layout: e.target.value})
             }}>
               <Radio.Button value="table">表格布局</Radio.Button>
               <Radio.Button value="form">表单布局</Radio.Button>
             </Radio.Group>
           </FormItem>
         </Form>

         <Card style={{ margin: 50 }}>
           { layout === 'table' ? <>
             <Table
                style={{ marginBottom: 20 }}
                className='tableList'
                pagination={false}
                columns={[
                  {
                    title: '压力',
                    dataIndex: 'pressure',
                    className: 'centerAlign',
                  },
                  ...Array.from({length: 5}, (item, index) => ({
                    title: `第${index + 1}天`,
                    dataIndex: `alias`,
                    className: 'centerAlign',
                    render: (text, record) => {
                      if(text === 'd'){
                        return <span>{isNaN(resultList[index]) ? '输入完毕后点击计算': resultList[index]}</span>
                      }
                      return this.props.form.getFieldDecorator(text+index, {
                        rules: [
                          { required: true, message: '温度不能为空！' },
                        ],
                      })(<InputNumber onChange={ !checked ? null : this.handleInputChange} style={{width: '50%'}} placeholder="请输入" />)
                    }
                  }))
                ]}
                dataSource={[
                  {pressure: '表压(kPa)', alias: 'a'},
                  {pressure: '场地大气压(kPa)', alias: 'b'},
                  {pressure: '场地温度(℃)', alias: 'c'},
                  {pressure: '箱内气体压力(kPa)', alias: 'd'},
                ]}
             />
             <Row >
               <Form layout='inline' >
                 <FormItem label="泄漏量（kPa）" style={{ margin: '0 40px' }}>
                   <span>{isNaN(resultList[0] - resultList[4]) ? '输入未完成' : (resultList[0] - resultList[4]).toFixed(fixed)}</span>

                 </FormItem>
                 <div style={{float: 'right',}}>
                   <FormItem label="计算精度" span={7} style={{ margin: '0 10px' }}>
                     保留 <InputNumber onChange={value => {
                     this.setState({fixed: value}, this.handleSubmit)
                   }} value={fixed} min={0} style={{width: 50}} max={22} /> 位小数
                   </FormItem>
                   <FormItem label="实时计算" style={{ margin: '0 40px' }}>
                     <Switch checkedChildren="开" unCheckedChildren="关"  checked={checked} onClick={checked => this.setState({checked}, this.handleSubmit())} />
                   </FormItem>
                   <Button onClick={() => {
                     form.resetFields()
                     this.setState({resultList: []})
                   }} type='default' style={{marginRight: 8}}>重置</Button>
                   <Button onClick={this.handleSubmit} type='primary'>计算</Button>
                 </div>
               </Form>
             </Row>
           </> : <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
             {
               Array.from({length: 5}, (item, index) => (
                  <Col xs={24} sm={24} md={8} lg={8}>
                    <Card title={`第${index+1}组`}>
                      <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 15 }} label="表压（kPa）">
                        {form.getFieldDecorator('a'+index, {
                          rules: [
                            { required: true, message: '表压不能为空！' },
                          ],
                        })(<InputNumber onChange={ !checked ? null : this.handleInputChange} style={{width: '100%'}} placeholder="请输入表压" />)}
                      </FormItem>
                      <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 15 }} label="场地大气压（kPa）">
                        {form.getFieldDecorator('b'+index, {
                          rules: [
                            { required: true, message: '大气压不能为空！' },
                          ],
                        })(<InputNumber onChange={ !checked ? null : this.handleInputChange} style={{width: '100%'}} placeholder="请输入大气压" />)}
                      </FormItem>
                      <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 15 }} label="场地温度（℃）">
                        {form.getFieldDecorator('c'+index, {
                          rules: [
                            { required: true, message: '温度不能为空！' },
                          ],
                        })(<InputNumber onChange={ !checked ? null : this.handleInputChange} style={{width: '100%'}} placeholder="请输入温度" />)}
                      </FormItem>
                      <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 15 }} label="箱内气体压力（kPa）">
                        {isNaN(resultList[index]) ? checked ? '输入不完整' : '输入完毕后点击计算' : resultList[index]}
                      </FormItem>
                    </Card>
                  </Col>
               ))
             }

             <Col xs={24} sm={16} md={8} lg={8} style={{height: '100%'}}>
               <Card title={`操作`} style={{height: '100%'}}>
                 <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 15 }} label="计算精度">
                   保留 <InputNumber onChange={value => {
                   this.setState({fixed: value}, this.handleSubmit)
                 }} value={fixed} min={0} style={{width: 50}} max={22} /> 位小数
                 </FormItem>
                 <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 15 }} label="泄漏量（kPa）">
                   {isNaN(resultList[0] - resultList[4]) ? '输入未完成' : (resultList[0] - resultList[4]).toFixed(fixed)}
                 </FormItem>
                 <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 15 }} label="实时计算">
                   <Switch checkedChildren="开" unCheckedChildren="关" checked={checked} onClick={checked => this.setState({checked}, this.handleSubmit())} />
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
           </Row> }


         </Card>
       </div>
    );
  }


}

export default App;
