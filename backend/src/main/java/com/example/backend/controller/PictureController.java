package com.example.backend.controller;


import com.aliyun.oss.OSS;
import com.aliyun.oss.OSSClient;
import com.aliyun.oss.OSSClientBuilder;
import com.aliyun.oss.model.GetObjectRequest;
import com.aliyun.oss.model.OSSObject;
import com.example.backend.AliyunOssUtil;
import com.example.backend.model.Picture;
import com.example.backend.repository.PictureRepository;
import com.example.backend.returnResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Pattern;

@CrossOrigin(origins = "http://localhost:3000")
@RestController //@Controller用来处理Http请求，RestController是Controller的衍生注解
@RequestMapping("/api/v2") //默认属性为value，因此这里没有写出，规定初步的请求映射
public class PictureController {

    @Autowired
    private PictureRepository pictureRepository;

    public Logger log = LoggerFactory.getLogger(PictureController.class);

    @PostMapping("/uploadPicture/{time}")
    public returnResult<Picture> uploadPicture(@RequestBody Picture picture, @PathVariable int time){
        Picture p = pictureRepository.findById(picture.getPictureUrl()).orElse(null);
        returnResult<Picture> result;
        if(p != null){
            result = new returnResult<Picture>(1,"图片已存在",null);
            return result;
        }
        log.info("2" + picture.getPictureUrl());
        String reg = "(mp4|flv|avi|rm|rmvb|wmv)";
        Pattern isMovie = Pattern.compile(reg);
        boolean boo = isMovie.matcher(picture.getPictureUrl()).find(); //匹配是否是视频文件
        if(boo){
            for(int i = 1; i < 6; i++){
                String cut_time = String.valueOf((time/6 * i * 1000));
                log.info(cut_time);
                URL url = AliyunOssUtil.snapshot("nawei1010",picture.getPictureUrl(),cut_time);
                log.info("1" + url.toString());
                try{
                    int index = picture.getPictureUrl().lastIndexOf('.');
                    String name = picture.getPictureUrl().substring(0,index) + "截图" + i + ".jpg";
                    log.info(name);
                    log.info(url.toString());
                    AliyunOssUtil.UploadNetworkStream(url.toString(),"nawei1010", name);
                    Picture snapshot = new Picture(name, picture.getOwner());
                    pictureRepository.save(snapshot);
                } catch (IOException exception) {
                    exception.printStackTrace();
                }
            }
        }
        result = new returnResult<Picture>(0,"保存成功",picture);
        pictureRepository.save(picture);
        return result;
    }

    @PostMapping("/getPictureList/{user}")
    public ArrayList<String> getPictureList(@PathVariable String user){
        // List<Picture> pictureList = pictureRepository.findAll();
        List<Picture> pictureList = pictureRepository.findByOwner(user);
        ArrayList<String> urlList = new ArrayList<>();
        String reg = "(mp4|flv|avi|rm|rmvb|wmv)";
        Pattern isMovie = Pattern.compile(reg);
        log.info(user);
        for(Picture item: pictureList){  //视频则无需获得
            log.info(item.getOwner());
            log.info(item.getPictureUrl());
            if(!isMovie.matcher(item.getPictureUrl()).find() ){
                urlList.add(item.getPictureUrl());
                log.info("1");
            }
        }
        return urlList;
    }

    @PostMapping("/getPicture")
    public byte[] getPicture(@RequestBody String pictureUrl) throws IOException {
        String accessId = "LTAI5tJxqeB1UcpGzgoJrsqq"; // 请填写您的AccessKeyId。
        String accessKey = "t8qSDeQqls5UxnCsvWjugIIKpl5MJz"; // 请填写您的AccessKeySecret。
        String endpoint = "oss-cn-hangzhou.aliyuncs.com"; // 请填写您的 endpoint。
        String bucket = "nawei1010"; // 请填写您的 bucketname 。
        log.info(pictureUrl);
        OSS ossClient = new OSSClientBuilder().build(endpoint, accessId, accessKey);
        GetObjectRequest getObjectRequest = new GetObjectRequest(bucket, pictureUrl);
        OSSObject ossObject = ossClient.getObject(getObjectRequest);
        InputStream content = ossObject.getObjectContent();
        byte[] buf = new byte[1024 * 1024 * 10];
        try{
            for(int n = 0; n != -1; ){
                n = content.read(buf,0,buf.length);
            }
        }catch (IOException e){
            return null;
        }

        content.close();
//        if(content != null){
//            try{
//                //设置一个足够大的buffer用于存储图片的比特数据
//                int length = 1920 * 1260 * 3;
//                byte[] buf = new byte[length];
//                int size = 0;
//                int temp;
//                while((temp = content.read()) != -1){
//                    buf[size] = (byte) temp;
//                    size++;
//                }
//                content.close();
//                return Arrays.copyOf(buf,size);
//            }catch (IOException e){
//                return null;
//            }
//        }
        ossClient.shutdown();
        return buf;
    }
}
