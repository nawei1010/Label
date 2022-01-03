import React, {Component, useEffect} from "react";
import {
    Layout,
    Input,
    Form,
    Button,
    Divider,
    message,
    notification
} from "antd";
import "@/style/login.scss";
import {LockOutlined, UserOutlined} from "@ant-design/icons";
import UserInfo from "../../axios";
//首先引入需要的图片路径
import Background from '../../assets/images/login.jpg';

//定义背景样式

var sectionStyle = {
  width: "100%",
  height: "100%",
// makesure here is String确保这里是一个字符串，以下是es6写法
  backgroundImage: `url(${Background})` 
};

class Login extends Component{
    constructor(props){
        super(props)
        this.state = {

        }
       this.onFinish = this.onFinish.bind(this)
    }

    getFieldDecorator = () =>{

    }

    onFinish = values => {
        let username = values.name;
        let password = values.password;
        console.log(username)
        console.log(password)
        UserInfo.UserLogin(username,password).then(result =>{
            let res = result.data
            console.log(res)
            if(res.status == 0)
            {
                message.success(res.message)
                sessionStorage.setItem('loginUser',res.data.userName)
                sessionStorage.setItem('loginStatus',res.status)
                this.props.history.push('/home')
                let info1 = sessionStorage.getItem('loginUser')
                let info2 = sessionStorage.getItem('loginStatus')
                console.log(info1)
                console.log(info2)
            }
            else{
                message.error(res.message)
            }
        })
        
    };

    useEffect = () => {
        notification.open({
            message: "欢迎使用图像标注平台",
            duration: null,
            description: "有账号的请登录，没有账号的请先注册"
        });
        if(localStorage.getItem("token")) {
            this.props.history.push("/index");
        }
        return () => {
            notification.destroy();
        };
        // eslint-disable-next-line
    };

    render(){
        return (
            <Layout className="login animated fadeIn" style = {sectionStyle}>
                <div className="model" >
                    <div className="login-form">
                        <h3>图像标注平台</h3>
                        <Divider/>
                        <Form onFinish={this.onFinish}>
                            <Form.Item  name = "name" rules = {[{required: true, message: "请输入用户名!"}]}>
                                <Input prefix={<UserOutlined/>} placeholder="用户名"/>
                            </Form.Item>
                            <Form.Item name = "password" rules = {[{required: true, message: "请输入密码"}]}>
                                    <Input
                                        prefix={<LockOutlined/>}
                                        type="password"
                                        placeholder="密码"
                                    />
                            </Form.Item>
                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    className="login-form-button"
                                >
                                    登录
                                </Button>
                                <Button
                                    type="dashed"
                                    className="login-form-button"
                                    onClick={event => {
                                        this.props.history.push("/register");
                                    }}
                                >
                                    注册
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </Layout>
        );
    }
    
};

export default Login;
