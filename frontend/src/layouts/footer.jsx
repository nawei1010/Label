import React from "react";
import { Layout } from "antd";

const { Footer } = Layout;

export default class footer extends React.Component{
    constructor(){

    }
    render(){
       return(
        <Footer className="footer">
          图片标注网站&copy;2021 Created By Hongwei Zhang
        </Footer>
       )
    }
}