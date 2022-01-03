import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import { Checkbox, Row, Col, message,Image,Layout,Form,Input, Button,PageHeader} from 'antd';
import axios from "axios"
import Head from '../../layouts/header'
import footer from '../../layouts/footer'
import Navbar from '../../layouts/navbar';
import {Redirect} from "react-router-dom"
import './style.css'
const { Content , Footer} = Layout;

//将时间戳转换成正常时间格式
function timestampToTime(timestamp) {
  var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
  var D = date.getDate() + ' ';
  var h = date.getHours() + ':';
  var m = date.getMinutes() + ':';
  var s = date.getSeconds();
  return Y+M+D+h+m+s;
}

export default class createTask extends React.Component{
    state = {
      fileUrl : [],
      user : [],
      selectList: []
    }
    
    async componentDidMount(){
      await this.init();

    }
   
    init = async() =>{
      try{
        let user = await sessionStorage.getItem('loginUser')
        console.log(user)
        this.setState({user: user})
        const url = await axios.post('http://localhost:8080/api/v2/getPictureList/' + this.state.user)
        console.log(url)
        this.setState({fileUrl: url})
      }
      catch(error){
        message.error(error)
      }
    }

    onFinish = async values =>{
        let taskName = values.taskName;
        console.log(taskName);
        console.log(this.state.selectList)
        if(this.state.selectList.length == 0 ){
           message.error("请先选择图片")
        }
        else if(this.state.selectList.length >= 6){
           message.error("最多选择五张图片")
        }
        else{
          var time = timestampToTime(Date.now());
          let returnValue = await axios.post('http://localhost:8080/api/v3/createTask/'+ this.state.user + '/' + time + '/' + taskName,this.state.selectList)
          console.log(returnValue.data);
          if(returnValue.data == "已存在同名任务"){
            message.error("已存在同名任务")
          }
          else
          {
            message.success("任务创建成功")
            this.props.history.push('/myTask')
          } 
        }
        
    }


    onChange = (checkedValues) =>  {
        
        console.log('checked = ', checkedValues);
        this.setState({selectList: checkedValues})
    }
    
    // ListPicture = () => {
      
    //   return listPicture
    // }
    render(){

      if(sessionStorage.getItem('loginStatus') == 0){
        let data = this.state.fileUrl.data
        console.log(data)
        const listPicture = data ? data.map((item,index) =>{
            return (<Col span = {8} key = {index}>
              <Checkbox value = {item}>
                {item.slice(item.lastIndexOf("/")+1)}
                <Image width = '90%' src = {"https://nawei1010.oss-cn-hangzhou.aliyuncs.com/"+ item } />
              </Checkbox>
            </Col>)
        }) : (<Col></Col>)
        console.log(listPicture)
        return(
           <div>
           <Layout>
             {/*引入头部 */}
             <Head />  
             <Layout> 
             {/*引入下半部分，通过Col控制左右部分的占比 */}
             <Row>
               {/*引入导航栏 */}
               <Col span={4}> <Navbar current='createTask' /> </Col>
               {/*特别的，在有下拉的菜单中（写在实验管理下面的资源管理和权限管理的主页中）我们需要加一个isOpen的判断菜单是否展开，详见下方navbar.jsx文件，<Col span={4}> <Navbar current="aExperiment" isOpen="true"/> </Col>*/}
               <Col span={20}>
               <PageHeader
                      title="创建任务"
                      subTitle="选择最多五张图片创建任务"
                    />
                 <Layout style={{ padding: '0 24px 24px', margin: '23px 0' }}>
                   {/*引入右半部分 */}
                   <Content style={{ padding: 24, margin: 0, minHeight:580, background: '#fff' }}>
                      {/*右半部分封装成组件直接引入，默认是一块如效果图的空白区域 */}
                     {/* <ConHome />   */}
                    
                     <Checkbox.Group style={{ width: '100%' }} onChange={this.onChange}>
                   <Row>
                  {listPicture}
                  </Row>
                  <br></br>
                  <br></br>
                   </Checkbox.Group>
                  
                   <Form
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 8 }}
                    onFinish={this.onFinish}
                  >
                    <Form.Item
                      label="任务名"
                      name="taskName"
                      rules={[{ required: true, message: '请输入任务名' }]}
                    >
                        <Input />
                      </Form.Item>
                      <Form.Item wrapperCol={{ offset: 11, span: 16 }}>
                      <Button type="primary" htmlType="submit">
                        创建任务
                      </Button>
                      </Form.Item>
                      </Form>
                      
                   </Content>
                   <Footer className="footer">
                   图片标注网站&copy;2021 Created By Hongwei Zhang
                  </Footer>
                 </Layout>
               </Col>
             </Row>
           </Layout>
           </Layout>
         </div>
        )
      }
      else{
        return <Redirect to = '/login'/>
      }
    }
}


