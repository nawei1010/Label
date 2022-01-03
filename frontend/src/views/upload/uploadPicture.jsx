import React from 'react';
import ReactDOM from 'react-dom';
import { Row, Col,Layout} from 'antd';
import 'antd/dist/antd.css';
import './style.css';
import { Form, Upload, message, Button,PageHeader } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from "axios"
import Head from '../../layouts/header'
import footer from '../../layouts/footer'
import Navbar from '../../layouts/navbar'
import {Redirect} from "react-router-dom"
const USER_BASE_URL = "http://localhost:8080/oss/policy"
const { Content , Footer} = Layout;

export default class uploadPicture extends React.Component {
  state = {
    OSSData: {},
    user: [],
    time: 0
  };

  async componentDidMount() {
    
    await this.init();
  }

  init = async () => {
    try {
      let user = await sessionStorage.getItem('loginUser')
      this.setState({user: user})
      console.log(this.state.user)
      const data = await axios.post(USER_BASE_URL + '/' + this.state.user)
      const OSSData = data.data
      this.setState({
        OSSData,
      });
    } catch (error) {
      message.error(error);
    }
  };

  // // Mock get OSS api
  // // https://help.aliyun.com/document_detail/31988.html
  // mockGetOSSData = () => ({
  //   dir: 'user-dir/',
  //   expire: '1577811661',
  //   host: '//www.mocky.io/v2/5cc8019d300000980a055e76',
  //   accessId: 'c2hhb2RhaG9uZw==',
  //   policy: 'eGl4aWhhaGFrdWt1ZGFkYQ==',
  //   signature: 'ZGFob25nc2hhbw==',
  // });

  onChange = async ({ fileList }) => {
    const { onChange } = this.props;
    console.log('Aliyun OSS:', fileList);
    for (var i in fileList)
    {
        if(fileList[i].status != "done")
        {
           continue;
        }
        console.log(fileList[i])
        let postData = {
           pictureUrl: fileList[i].url,
           owner: this.state.user
        }
        // const suffix = fileList[i].name.slice(file.name.lastIndexOf('.'));
        // console.log(suffix)
        // if(suffix == '.mp4' || suffix == ".rmvb" || suffix == ".avi" || suffix == '.flv') || suffix == '{
             
        // }
        
        console.log(postData)
        console.log(fileList[i].time)
        console.log( await axios.post("http://localhost:8080/api/v2/uploadPicture/"+ fileList[i].time, postData))
    }
    if (onChange) {
      onChange([...fileList]);
    }

  };

  onRemove = file => {
    const { value, onChange } = this.props;
    const files = []
    for(var v in value){
      if(v.url !== file.url ){
        files.push(v)
      }
    }

    if (onChange) {
      onChange(files);
    }
  };

  getExtraData = file => {
    const { OSSData } = this.state;

    return {
      key: file.url,
      OSSAccessKeyId: OSSData.accessid,
      policy: OSSData.policy,
      Signature: OSSData.signature,
    };
  };
  
  handleTime = (file) =>{
        return new Promise((resolve, reject) => {
          const videoUrl = URL.createObjectURL(file)
          const videoObj = document.createElement('video')
          videoObj.preload = 'metadata'
          videoObj.src = videoUrl
          videoObj.onloadedmetadata =  () => {
            URL.revokeObjectURL(videoUrl)
            let times = Math.round(videoObj.duration)
            console.log(times)
            this.setState({time: times})
            console.log(this.state.time)
            resolve()
          }    
        })
  }

  beforeUpload = async file => {
    
    const { OSSData } = this.state;
    const expire = OSSData.expire * 1000;
    console.log(file)
    if (expire < Date.now()) {
      await this.init();
    }
    const suffix = file.name.slice(file.name.lastIndexOf('.'));
    console.log(suffix)
    if(suffix == '.mp4' || suffix == ".rmvb" || suffix == ".avi" || suffix == '.flv' || suffix =='wmv' )
    {
         var test = await this.handleTime(file)  
         console.log(test)   
    }
    // const suffix = file.name.slice(file.name.lastIndexOf('.'));
    const filename = Date.now();
    file.url = OSSData.dir  +  filename + '-' + file.name;
    file.time = this.state.time;
    console.log(file.url)
    console.log(file.time)
    return file;
  };


  render() {
    const { value } = this.props;
    const props = {
      name: 'file',
      accept: 'image/*, video/*',
      fileList: value,
      action: this.state.OSSData.host,
      onChange: this.onChange,
      onRemove: this.onRemove,
      data: this.getExtraData,
      beforeUpload: this.beforeUpload,
      multiple: true
    };

    if(sessionStorage.getItem('loginStatus') == 0){
      return(
        <div>
          <Layout>
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
                      title="上传图片或视频"
                      subTitle="可以批量上传图片或视频，上传的视频会自动分帧截取图片"
                    />
                <Layout style={{ padding: '0 24px 24px', margin: '23px 0' }}>
                  {/*引入右半部分 */}
                  <Content style={{ padding: 24, margin: 0, minHeight:580, background: '#fff' }}>
                     {/*右半部分封装成组件直接引入，默认是一块如效果图的空白区域 */}
                    {/* <ConHome />   */}
                    
                  <Upload {...props}>
                  <Button icon={<UploadOutlined />}>上传图片或视频</Button>
                  </Upload>
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

