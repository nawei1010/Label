import React  from "react";
import "./style.css";
import 'antd/dist/antd.min.css';
import { Layout, Menu} from 'antd';
import { Link } from "react-router-dom";
import { HomeOutlined,TeamOutlined, LaptopOutlined, AppstoreOutlined, ToolOutlined} from '@ant-design/icons';
// import { FALSE } from "node-sass";
const { SubMenu } = Menu;
const Sider = Layout;//使用定义

export default class Navbar extends React.Component {
    constructor(props) {
        super(props);
        // console.log(this.props.current);
        this.state = {
            theme: "dark",
            isOpen:false
        };
    }
    render() {

        return(
                <Sider  className="site-layout-background" id="siderNav">
                    <Menu
                        mode="inline" //导航栏列出来显示
                        theme="dark"    
                        id="navBarMenu"                   
                    >
                    <Menu.Item key="home" icon={<HomeOutlined />}>
                        <Link to="/home">个人信息</Link>
                    </Menu.Item>
                    <Menu.Item key="uploadPicture" icon={<TeamOutlined />}>
                        <Link to="/uploadPicture">图片上传</Link>
                    </Menu.Item>    
                    
                    <SubMenu key="sub1" icon={<AppstoreOutlined />} title="任务管理">
                        <Menu.Item key="createTask" >
                            <Link to="/createTask">创建任务</Link>
                        </Menu.Item>
                        <Menu.Item key="myTask">
                            <Link to="/myTask">我创建的任务</Link>
                        </Menu.Item>
                        <Menu.Item key="acceptTask">
                            <Link to="/acceptTask">领取任务</Link>
                        </Menu.Item>
                        <Menu.Item key="myacceptTask">
                            <Link to="/myacceptTask">我领取的任务</Link>
                        </Menu.Item>
                    </SubMenu>
                    <Menu.Item key="label" icon={<ToolOutlined />} disabled>
                        <Link to="/label">图像标注</Link>
                    </Menu.Item>
                </Menu>
            </Sider>
        );
    }
}
