import React, { Component } from "react";
import { Layout, Input, Form, Button, Divider, message } from "antd";
import "@/style/login.scss";
import { UserOutlined, LockOutlined, HomeOutlined } from "@ant-design/icons";
import UserInfo from '../../axios' 
//首先引入需要的图片路径
import Background from '../../assets/images/login.jpg';

//定义背景样式

var sectionStyle = {
  width: "100%",
  height: "100%",
// makesure here is String确保这里是一个字符串，以下是es6写法
  backgroundImage: `url(${Background})` 
};

class Register extends Component{
  constructor(props){
    super(props)
    this.state = {
      loading: false
    }
    this.handleSubmit = this.handleSubmit.bind(this)
  }
 
  handleSubmit = (values) => {
      console.log(values)
      let username = values.name
      let password = values.password
      let email = values.email
      let postData = {
        userName: username,
        password: password,
        emailId: email
      };
      UserInfo.UserRegister(postData).then(result => {
        let res = result.data
        console.log(res)
        if(res.status == 0){
          message.success(res.message)
          this.props.history.push('/login')
        }
        else{
          message.error(res.message)
        }
      })
      // console.log(username)
      // console.log(password)
      // console.log(email)
}

  render() {
    return (
      <Layout className="login animated fadeIn" style = {sectionStyle}>
        <div className="model">
          <div className="login-form">
            <h3>图像标注平台</h3>
            <Divider />
            <Form onFinish = {this.handleSubmit}>
              <Form.Item name = "name" rules = {[{ required: true, message: "请输入用户名!" },{min:6, message: "长度最小6位"}]}>
                 <Input prefix={<UserOutlined />} placeholder="用户名" />
              </Form.Item>
              <Form.Item name = "password" rules = { [{ required: true, message: "请输入密码" },{min: 6,message: "长度最小6位"}]}>
                  <Input
                    prefix={<LockOutlined />}
                    type="password"
                    placeholder="密码" />
              </Form.Item>
              <Form.Item
        name="confirm"
        dependencies={['password']}
        hasFeedback
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
        <Input.Password placeholder = "确认密码"/>
      </Form.Item>
              <Form.Item name = "email" rules  ={[{type:'email',message:'邮箱格式错误'},{ required: true, message: "请输入邮箱" }]}>
                  <Input prefix={<HomeOutlined />} placeholder="邮箱" />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"      
                >
                  注册
                </Button>
                <Button
                  type="dashed"
                  className="login-form-button"
                  onClick={event => {
                    this.props.history.push("/login");
                  }}
                >
                  登陆
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </Layout>
    );
    }
  }


export default Register
