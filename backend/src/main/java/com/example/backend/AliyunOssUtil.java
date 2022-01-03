package com.example.backend;

import com.aliyun.oss.HttpMethod;
import com.aliyun.oss.OSS;
import com.aliyun.oss.OSSClientBuilder;
import com.aliyun.oss.model.GeneratePresignedUrlRequest;
import com.example.backend.controller.UserController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.io.InputStream;

import java.net.URL;
import java.util.Date;

public class AliyunOssUtil {
    /*
     * 1.Endpoint（访问域名）
     * 2.AccessKey（访问密钥）
     * 3.密钥密码
     * 将以上3个声明为成员变量，避免代码冗余
     * */
    // Endpoint以杭州为例，其它Region请按实际情况填写。
    private static String endpoint = "oss-cn-hangzhou.aliyuncs.com";//1
    // 阿里云主账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM账号进行API访问或日常运维，请登录RAM控制台创建RAM账号。
    private static String accessKeyId = "LTAI5tJxqeB1UcpGzgoJrsqq";//2
    private static String accessKeySecret = "t8qSDeQqls5UxnCsvWjugIIKpl5MJz";//3
    public Logger log = LoggerFactory.getLogger(UserController.class);
    /*
     * 截取视频帧数
     * 参数：
     * 1.Bucket名字
     * 2.要截取的视频的位置,目录+文件名
     * 返回值：截取完的图片路径
     * */
    public static URL snapshot(String bucketName, String objectName, String time){
        // 创建OSSClient实例。
        OSS ossClient = new OSSClientBuilder().build(endpoint, accessKeyId, accessKeySecret);
        // 设置视频截帧操作。
        //截取格式
        // String style = "video/snapshot,t_50000,f_jpg,m_fast,w_800,h_600";
        String style1 = "video/snapshot,t_";
        String style2 = ",f_jpg,m_fast,w_800,h_600";
        String style = style1 + time + style2;
        // 指定过期时间为10分钟。
        Date expiration = new Date(new Date().getTime() + 1000 * 60 * 10 );
        GeneratePresignedUrlRequest req = new GeneratePresignedUrlRequest(bucketName, objectName, HttpMethod.GET);
        req.setExpiration(expiration);
        req.setProcess(style);
        URL signedUrl = ossClient.generatePresignedUrl(req);
        System.out.println(signedUrl);
        // 关闭OSSClient。
        ossClient.shutdown();
        return signedUrl;
    }


    /*
     * 上传网络流
     * 参数：
     * 1.截取完图片后的URL.toString
     * 2.Bucket名字
     * 3.要上传到的目录+文件名
     * */
    public static void UploadNetworkStream(String url, String bucketName,String objectName) throws IOException {
        // 创建OSSClient实例。
        OSS ossClient = new OSSClientBuilder().build(endpoint, accessKeyId, accessKeySecret);
        // 上传网络流。
        InputStream inputStream = new URL(url).openStream();
        ossClient.putObject(bucketName, objectName, inputStream);
        // 关闭OSSClient。
        ossClient.shutdown();
    }
}
