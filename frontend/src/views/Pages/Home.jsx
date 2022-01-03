import React, { Component } from "react";
import { Row, Col } from 'antd';
import  Head  from "../../layouts/header";
import  Navbar  from "../../layouts/navbar";
import "../../layouts/style.css";
import { Layout,message, Form, Input, Button,PageHeader } from 'antd';
import { UserOutlined, LockOutlined, HomeOutlined } from "@ant-design/icons";
import {Redirect} from "react-router-dom"
import axios from "axios"
// import ConHome from "../../components/contentPart/cHome/cHome";

const { Content , Footer} = Layout;

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: "dark",
      current: "home",
      User: []
    };
  }

  state = {
    collapsed: false,
  };
  
  async componentDidMount(){
    await this.init();
}

init = async() => {
    try{
       let user = await sessionStorage.getItem('loginUser')
       const result = await axios.post('http://localhost:8080/api/v1/getUserinfo/'+ user)
       var data = result.data;
       console.log(data)
       this.setState({User: data})
       }
    catch(error){
        message.error(error)
    }
}
  

  handleSubmit = async (values) => {
    console.log(values)
    console.log(this.state.User)
    let username = this.state.User.userName;
    let password = values.password
    let email = values.email
    let lastpassword = values.lastpassword
    let postData = {
      userName: username,
      password: password,
      emailId: email
    };
    if(lastpassword != this.state.User.password){
      message.error("原密码输入错误")
    }
    else{
      console.log(postData)
      var result = await axios.post('http://localhost:8080/api/v1/updateUser',postData)
      console.log(result)
      if(result.data.status == 1){
        message.error("邮箱已存在")
      } 
      else{
        message.success("修改成功")
      }
    }
    // console.log(username)
    // console.log(password)
    // console.log(email)
}

  render() {
      if(sessionStorage.getItem('loginStatus') == 0){
        return(
          <div >
            <Layout style={{overflow: "auto"}}>
              {/*引入头部 */}
              <Head />  
              <Layout> 
              {/*引入下半部分，通过Col控制左右部分的占比 */}
              <Row>
                {/*引入导航栏 */}
                <Col span={4}> <Navbar current='home' /> </Col>
                {/*特别的，在有下拉的菜单中（写在实验管理下面的资源管理和权限管理的主页中）我们需要加一个isOpen的判断菜单是否展开，详见下方navbar.jsx文件，<Col span={4}> <Navbar current="aExperiment" isOpen="true"/> </Col>*/}
                <Col span={20}>
                <PageHeader
                      title="个人信息"
                      subTitle="可以查看和修改个人信息"
                    />
                  <Layout style={{ padding: '0 24px 24px', margin: '23px 0' }}>
                    {/*引入右半部分 */}
                    <Content style={{ padding: 24, margin: 0, minHeight:580, background: '#fff' }}>
                       {/*右半部分封装成组件直接引入，默认是一块如效果图的空白区域 */}
                      {/* <ConHome />   */}
                      
                      <Form onFinish = {this.handleSubmit}>
              <Form.Item name = "name" label = "用户名">
                 <Input prefix={<UserOutlined />} placeholder= {this.state.User.userName}  disabled/>
              </Form.Item>
              <Form.Item name = "password" label = "修改密码" rules = { [{ required: true, message: "请输入密码" },{min: 6,message: "长度最小6位"}]}>
                  <Input
                    prefix={<LockOutlined />}
                    type="password"
                     />
              </Form.Item>
              <Form.Item
        name="confirm"
        dependencies={['password']}
        hasFeedback
        label = "确认密码"
        rules={[
          {
            required: true,
            message: '请确认你的密码',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('两次输入的密码不同'));
            },
          }),
        ]}>
        <Input.Password />
      </Form.Item>
              
              <Form.Item name = "emailId" label ="邮箱" >
                  <Input prefix={<HomeOutlined /> } disabled  placeholder={this.state.User.emailId} />
              </Form.Item>
              <Form.Item name = "email" label = "修改邮箱" rules  ={[{type:'email',message:'邮箱格式错误'},{ required: true, message: "请输入邮箱" }]}>
                  <Input prefix={<HomeOutlined />}  />
              </Form.Item>
              <Form.Item>
              <Form.Item name = "lastpassword" label = "输入原密码确认" rules = { [{ required: true, message: "请输入原密码" },{min: 6,message: "长度最小6位"}]}>
                  <Input
                    prefix={<LockOutlined />}
                    type="password"
                     />
              </Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"      
                >
                  修改信息
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
        );
      }
      else{
        return <Redirect to = '/login' />
      }
  }
}
  
