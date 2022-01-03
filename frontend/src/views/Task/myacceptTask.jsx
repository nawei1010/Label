import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import { Checkbox, Row, Col, message,Image,Layout, Button,Descriptions,PageHeader} from 'antd';
import axios from "axios"
import Head from '../../layouts/header'
import Navbar from '../../layouts/navbar';
import {Redirect} from "react-router-dom"
import './style.css'
const { Content , Footer} = Layout;

export default class myacceptTask extends React.Component{
    state = {
       user: [],
       data: []
    }

    async componentDidMount(){
        await this.init();
    }

    init = async() => {
        try{
           let user = await sessionStorage.getItem('loginUser')
           console.log(user)
           this.setState({user: user})
           const task = await axios.post('http://localhost:8080/api/v3/acceptTask2/'+ user)
           console.log(task)
           this.setState({data: task.data})
           console.log(this.state.data)
           let data = this.state.data
           for(let i in data){
             console.log(i)
             console.log(data[i])
           }
        }catch(error){
            message.error(error)
        }
    }
    
   handleClick = async (data, taskName) =>{
       console.log(data);
       console.log(typeof(data))
       await sessionStorage.setItem('taskName',taskName);
       await sessionStorage.setItem('selectPicture',[data]);
       this.props.history.push('/label')
   }

    render(){
        if(sessionStorage.getItem('loginStatus') == 0){
            var DescriptionList = [];
            const data = this.state.data
            var count = 1
            for(let i in data)
            {
                var taskName = i.slice(i.indexOf('/')+1)
                var owner = i.substring(0, i.indexOf('&'));
                var createTime = i.substring(i.indexOf('&')+1, i.indexOf('/'));
                const description = (
                  <Descriptions title = {"任务名: " + taskName + '    ' + "创建时间: " + createTime + "    任务发布者   " + owner} key =  {count}>
                  {/* <Row>
                    <Button type = "primary" onClick = {() => this.handleClick(taskName)}>
                       领取任务
                    </Button>
                  </Row> */}
                  <Row>
                    <Col span = {3}>
                    <Button type = "primary" onClick = {() => {this.handleClick(data[i],(owner + "_" + taskName))}}>
                       进行图片标注
                    </Button>
                    </Col>
                     {data[i].map((item,index) => {
                           return(  
                         <Col span = {4} key = {index}>
                            <span>图片名:{item.slice(item.indexOf("-")+1)}</span>
                            <Image width = '90%'  src = {"https://nawei1010.oss-cn-hangzhou.aliyuncs.com/"+ item }/>
                         </Col>
                           )
                     })}
                   
                  </Row>
                  </Descriptions>
                )
                DescriptionList.push(description)
                count = count + 1
            }
            return(
              <div>
                <Layout>
                  {/*引入头部 */}
                  <Head />  
                  <Layout> 
                  {/*引入下半部分，通过Col控制左右部分的占比 */}
                  <Row>
                    {/*引入导航栏 */}
                    <Col span={3}> <Navbar current='myTask' /> </Col>
                    {/*特别的，在有下拉的菜单中（写在实验管理下面的资源管理和权限管理的主页中）我们需要加一个isOpen的判断菜单是否展开，详见下方navbar.jsx文件，<Col span={4}> <Navbar current="aExperiment" isOpen="true"/> </Col>*/}
                     
                    <Col span={21} >
                    <PageHeader
                      title="我领取的任务"
                      subTitle="显示所有我领取的任务信息"
                    />
                      <Layout style={{ padding: '0 24px 24px', margin: '23px 0' }}>
                        {/*引入右半部分 */}
                        <div >
                        <Content style={{ padding: 24, margin: 0, minHeight:580, background: '#fff' }}>
                        {DescriptionList}
                        </Content>
                        </div>
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