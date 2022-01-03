import React, { Component } from 'react'
import { ReactPictureAnnotation,defaultShapeStyle } from "react-picture-annotation";
import {Button,Row, Col, message,Layout,Menu,PageHeader,Dropdown} from 'antd'
import Head from '../../layouts/header'
import Navbar from '../../layouts/navbar';
import "./style.css"
import axios from "axios"
import {Redirect} from "react-router-dom"
import { DownloadOutlined } from '@ant-design/icons';
const { Content , Footer} = Layout;

const BASE_URL = "https://nawei1010.oss-cn-hangzhou.aliyuncs.com/"
const pictureLabel = [];
const annotationresult = Array(5);
export default class Label extends Component{
    constructor(props){
        super(props)
        this.state = {
            image: [],
            url: [],
            amount: 0,
            current: 0,
            data:[],
            taskName: null
        }
    }

    componentDidMount = async() =>{
        var image =  await sessionStorage.getItem('selectPicture');
        var strs = new Array();
        var taskName = await sessionStorage.getItem('taskName');
        console.log(taskName)
        strs = image.split(",");
        this.setState({
            image : strs,
            taskName: taskName
        })
        console.log(strs)
        var str1 = "https://nawei1010.oss-cn-hangzhou.aliyuncs.com/"
        var s3 = str1 + strs[0]
        console.log(s3)
        console.log(typeof(s3))
        this.setState({
            url:  s3,
            amount: strs.length,
            current: 0
        })
        console.log(this.state)
        console.log(this.state.url)
    }


    onSelect = selectedId => console.log(selectedId);
    onChange = data => {
       console.log(data)
       console.log(annotationresult)
       annotationresult[this.state.current] = data;
       this.setState({data: data})
    }
    afterChange = (a) =>{
        
    }
    ClickLast = async()=>{
       if(this.state.current == 0){
         message.error("这已经是第一张图片")
       }
       else{
         
         var index = this.state.current - 1;
         var s = BASE_URL + this.state.image[index];
         await this.setState({url: s, current: index})
       }
    }
    ClickNext = async ()=>{
       if(this.state.current === this.state.amount-1){
          message.error("这已经是最后一张图片")
       }
       else{
         
         var index = this.state.current + 1;
         var s = BASE_URL + this.state.image[index];
         await this.setState({url:s, current: index})
       }
    }

    ClickSave = ()=>{
      var data = this.state.data;
      console.log(data)
      var Picture = [];
      for(let item in data){
        let newData = {}
        console.log(item)
        item = data[item]
        console.log(typeof(newData))
        newData.id = item.id;
        newData.comment = item.hasOwnProperty('comment')  ? item.comment:  "未注释";
        newData.height = item.mark.height;
        newData.type = item.mark.type;
        newData.width = item.mark.width
        newData.x = item.mark.x;
        newData.y = item.mark.y
        newData.name = this.state.image[this.state.current];
        console.log(typeof(newData));
        console.log(newData);
        Picture.push(newData);
      }
       console.log(Picture)
       if(Picture.length != 0){
         pictureLabel[this.state.current] = Picture;
         message.success("标注结果保存成功")
       }
       else{
          pictureLabel[this.state.current] = Picture
          message.error("请先标注")
       }
       console.log(pictureLabel)
    }


    ClickOutput = async (type) => {
        console.log(type);
        var arr = new Array()
        var count = 0;
        for(let item in pictureLabel){
            item = pictureLabel[item]
            if(item.length != 0)
            {
              count = count + 1;
            }
            for(let item2 in item){
              item2 = item[item2]
              let newData = item2;
              arr.push(newData)
            }
        }
        console.log(count)
        console.log(arr)
        console.log(arr.length)
        console.log(this.state.image.length)
        // alert(arr.length == 0); //true 为空， false 不为空
        // console.log(typeof(pictureLabel))
        // console.log(pictureLabel.length);
        if(this.state.image.length != count){
           message.error("请先完成所有图片的标注")
        }
        else{
          let params = {params: arr};
          let data = type === "XML" ? await axios.post('http://localhost:8080/api/v3/annotation/'+this.state.taskName, params)
                                    : await axios.post('http://localhost:8080/api/v3/annotation2/'+this.state.taskName, params)
          console.log(data)
          let pathname = data.data
          console.log(pathname)
          await axios({
            method: 'get',
            url: "http://localhost:8080/api/v3/getZip/" + pathname,
            responseType: 'blob',
          }).then(
            res => {
              console.log(res.data)
              const content = res.data;
              const blob = new Blob([content]);
              const fileName = pathname + '.zip';  //"myexport.json"
              const selfURL = window[window.webkitURL ? 'webkitURL' : 'URL'];
              let elink = document.createElement('a');
              if ('download' in elink) {
                elink.download = fileName;
                elink.style.display = 'none';
                elink.href = selfURL['createObjectURL'](blob);
                document.body.appendChild(elink);
                // 触发链接
                elink.click();
                console.log('click finish')
                selfURL.revokeObjectURL(elink.href);
                document.body.removeChild(elink)
            } else {
                navigator.msSaveBlob(blob, fileName);
            }
              // let blob = new Blob([res])
              // let downloadElement = document.createElement('a')
              // let href = window.URL.createObjectURL(blob)
              // downloadElement.href = href
              // downloadElement.download = this.state.taskName+  '标注结果.zip' //下载后文件名
              // document.body.appendChild(downloadElement)
              // downloadElement.click() //点击下载
              // document.body.removeChild(downloadElement) //下载完成后移除元素
              // window.URL.revokeObjectURL(href)//释放blob对象
            }
          )
        }
    }
    render(){
      if(sessionStorage.getItem('loginStatus') == 0){
        const menu = (
          <Menu>
            <Menu.Item>
            <Button type = "primary" span = {4} style = {{marginRight: 30, marginLeft: 30}} onClick = { () => {this.ClickOutput("XML")}} icon={<DownloadOutlined />}>
                  XML格式
            </Button>
            </Menu.Item>
            <Menu.Item>
            <Button type = "primary" span = {4} style = {{marginRight: 30, marginLeft: 30}} onClick = { () => {this.ClickOutput("JSON")}} icon={<DownloadOutlined />}>
                  JSON格式
            </Button>
            </Menu.Item>
          </Menu>
        )
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
                  title="图片标注"
                  subTitle="进行图片标注"
                />
                  <Layout style={{ padding: '0 24px 24px', margin: '23px 0' }}>
                    {/*引入右半部分 */}
                    
                    <div >
                        <Content style={{ padding: 24, margin: 0, minHeight:580, background: '#fff' }}>
                        
                        {/* <Carousel afterChange = {this.afterChange}>
                         
                         </Carousel>
                        {picture} */}
                        <div style = {{marginLeft: 300}}><ReactPictureAnnotation
                        image= {this.state.url}
                        annotationData = {annotationresult[this.state.current]}
                        onSelect={this.onSelect}
                        onChange={this.onChange}
                        width= {600}
                        height={600}
                        annotationStyle = {
                          {
                            ...defaultShapeStyle,
                            shapeStrokeStyle: "#FF9E80",
                            transformerBackground: "black",
                            lineWidth: 5,
                            fontBackground: "#9f82ff"
                          }
                        }
                        scrollSpeed = {0}
                    /> 
                    <Button type = "primary" style = {{marginRight: 30, marginLeft: 30}} onClick = {()=>{this.ClickLast()}}>
                      上一张
                    </Button>
                    <Button type = "primary" span = {4} style = {{marginRight: 30, marginLeft: 30}} onClick = { () => {this.ClickNext()}}>
                      下一张
                    </Button>
                    <Button type = "primary" span = {4} style = {{marginRight: 30, marginLeft: 30}} onClick = { () => {this.ClickSave()}}>
                      保存标注结果(单张图片)
                    </Button>
                    <Dropdown overlay = {menu} placement='topCenter'>
                       <Button>导出标注结果</Button>
                    </Dropdown>
                    </div>     
                {/* {pageSize.carousel} */}
                        </Content>
                        </div>
                        <div className='App' >
                  
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