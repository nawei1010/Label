import React  from "react";
import 'antd/dist/antd.min.css';//显示样式，不加显示不出来
import "./style.css";
import { Layout, Menu, Dropdown,message,PageHeader} from 'antd';
import { Link } from "react-router-dom";
import { DownOutlined } from '@ant-design/icons';
const { Header } = Layout;      //使用前定义，不加大括号会没有样式


export default class Head extends React.Component {
    constructor(props) {
        super(props);
        console.log(this.props.current);
        
        this.state = {
            user: "admin",
        }
    }

    onClick = ({key}) =>{
        if(key == 2){
           sessionStorage.clear();
           console.log(sessionStorage.getItem('loginStatus'))
           message.success("退出登陆成功")
        //    this.setState({isModalVisible: true})
        }
    }
    
    // handleCancel = () =>{
    //     this.setState({isModalVisible: false})
    // }

    menu = (
        <Menu onClick = {this.onClick}>
            <Menu.Item key = "1">
            <Link to="/home" >修改个人信息</Link>
            </Menu.Item>
            <Menu.Item key = "2">
                <a href = '/login'>退出登陆</a>
            </Menu.Item>
        </Menu>
    )

    componentDidMount(){
        let user = sessionStorage.getItem('loginUser')
        this.setState({user: user})
    }
    render() {
        
        return(
            <Layout>
                <Header className="header">
                    <div className="navbar">
                        <Link to="/home" className="title">图片标注平台</Link>
                        <Dropdown className = "hello" overlay={this.menu}>
                        <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                        欢迎进入图像标注网站，用户{this.state.user}<DownOutlined /></a>
                       </Dropdown>                                 
                    </div>
                    {/* <Modal title="确认退出" visible={this.state.isModalVisible} onOk={handleOk} onCancel={this.handleCancel}>
                    <p>退出后将删除登陆信息</p>
                    </Modal> */}
                </Header>
            </Layout>
        )
    }
}
