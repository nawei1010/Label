package com.example.backend.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.serializer.SerializerFeature;
import com.example.backend.model.AcceptTask;
import com.example.backend.model.Annotation;
import com.example.backend.model.CreateTask;
import com.example.backend.model.Task_info;
import com.example.backend.repository.AcceptTaskRespository;
import com.example.backend.repository.TaskInfoRepostiory;
import com.example.backend.repository.TaskRepository;


import net.lingala.zip4j.core.ZipFile;
import net.lingala.zip4j.exception.ZipException;
import net.lingala.zip4j.model.ZipParameters;
import net.lingala.zip4j.util.Zip4jConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.jdom.Document;

import org.jdom.Element;

import org.jdom.JDOMException;

import org.jdom.output.Format;

import org.jdom.output.XMLOutputter;

import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.URLEncoder;
import java.util.*;


@CrossOrigin(origins = "http://localhost:3000")
@RestController //@Controller用来处理Http请求，RestController是Controller的衍生注解
@RequestMapping("/api/v3") //默认属性为value，因此这里没有写出，规定初步的请求映射
public class TaskController {
    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private TaskInfoRepostiory taskInfoRepostiory;

    @Autowired
    private AcceptTaskRespository acceptTaskRespository;

    public Logger log = LoggerFactory.getLogger(TaskController.class);

    @PostMapping("/createTask/{user}/{time}/{taskName}")
    public String createTask(@PathVariable String user, @PathVariable String time, @PathVariable String taskName, @RequestBody ArrayList<String> pictureList){
        List<CreateTask> taskList = taskRepository.findByTaskOwner(user);
        for(CreateTask t: taskList){
            if(t.getTaskName().equals(taskName))
            {
                return "已存在同名任务";
            }
        }
        CreateTask task = new CreateTask(time, taskName, user);
        taskRepository.save(task); //保存任务
        for(String image : pictureList){
            Task_info taskinfo = new Task_info(image, taskName, user);
            taskInfoRepostiory.save(taskinfo);
        }
        return taskName;
    }

    @PostMapping("/getTask/{user}") //获取用户已经创建的任务信息
    public Map<String,ArrayList<String>> getTask(@PathVariable String user){
        List<CreateTask> task = taskRepository.findByTaskOwner(user);
        if(task == null){
            return null;
        }
        Map<String, ArrayList<String>> respMap = new LinkedHashMap<>();
        for(CreateTask item : task){
            String taskName = item.getTaskName();
            ArrayList<String> imageList = new ArrayList<>();
            List<Task_info>  taskInfo = taskInfoRepostiory.findByTaskNameAndImageOwner(taskName,user);
            String returnName = item.getTaskOwner() + '&' + item.getCreateTime() + '/' + taskName;
            for(Task_info image : taskInfo){ //查询task中所选择的图片
                imageList.add(image.getImageUrl());
            }
            respMap.put(returnName, imageList);
        }
        return respMap;
    }

    @PostMapping("/acceptTask1/{user}") //获取仍未领取的所有任务信息
    public Map<String,ArrayList<String>> getNoacceptTask(@PathVariable String user){
        List<CreateTask> task = taskRepository.findAll();
        if(task == null){
            return null;
        }
        Map<String, ArrayList<String>> respMap = new LinkedHashMap<>();
        for(CreateTask item : task){
            String taskName = item.getTaskName();
            String Owner = item.getTaskOwner();

            AcceptTask acceptTask = acceptTaskRespository.findByAcceptUserAndTaskNameAndAcceptOwner(user, taskName, Owner);
            //说明该任务已被领取过,可能出现同名任务，因此需要区分一下是否是同样的主人
            if(acceptTask != null){
                 continue;
            }
            ArrayList<String> imageList = new ArrayList<>();
            List<Task_info>  taskInfo = taskInfoRepostiory.findByTaskNameAndImageOwner(taskName, Owner);
            String returnName = item.getTaskOwner() + '&' + item.getCreateTime() + '/' + taskName;
            for(Task_info image : taskInfo){ //查询task中所选择的图片
                imageList.add(image.getImageUrl());
            }
            respMap.put(returnName, imageList);
        }
        return respMap;
    }

    @PostMapping("/getAcceptTask/{user}") //获取用户的任务被领取的情况
    public Map<String,ArrayList<String>> getAcceptTask(@PathVariable String user){
        List<CreateTask> task = taskRepository.findByTaskOwner(user);
        if(task == null){
            return null;
        }
        Map<String, ArrayList<String>>  respMap = new LinkedHashMap<>();
        for(CreateTask item : task){
            String taskName = item.getTaskName();
            String owner = item.getTaskOwner();
            ArrayList<String> AcceptUser = new ArrayList<>();
            List<AcceptTask>  accpetUser = acceptTaskRespository.findByTaskName(taskName);
            for(AcceptTask accept : accpetUser){
                AcceptUser.add(accept.getAcceptUser());
            }
            respMap.put(owner + "&" + taskName, AcceptUser);
        }
        return respMap;
    }

    @PostMapping("/acceptTask2/{user}") //获取领取的任务信息
    public Map<String,ArrayList<String>> myacceptTask(@PathVariable String user){
        List<AcceptTask> task = acceptTaskRespository.findByAcceptUser(user);
        if(task == null){
            return null;
        }
        Map<String, ArrayList<String>> respMap = new LinkedHashMap<>();
        for(AcceptTask item : task){
            String taskName = item.getTaskName();
            String owner = item.getAcceptOwner();
            System.out.println(taskName +"&" + owner);
            CreateTask item2 = taskRepository.findByTaskNameAndTaskOwner(taskName,owner);

            ArrayList<String> imageList = new ArrayList<>();
            List<Task_info>  taskInfo = taskInfoRepostiory.findByTaskNameAndImageOwner(taskName, owner);
            String returnName = "";
            if(item2 == null){
                System.out.println("空");
            }
            else{
                returnName = item2.getTaskOwner() + '&' + item2.getCreateTime() + '/' + taskName;
            }
            for(Task_info image : taskInfo){ //查询task中所选择的图片
                imageList.add(image.getImageUrl());
            }
            respMap.put(returnName, imageList);
        }
        return respMap;
    }

    @PostMapping("/acceptTask3/{user}/{taskName}/{Owner}")
    public String acceptTask(@PathVariable String user, @PathVariable String taskName, @PathVariable String Owner){
        AcceptTask acceptTask = new AcceptTask(taskName,user,Owner);
        acceptTaskRespository.save(acceptTask);
        return "领取成功";
    }

    @GetMapping("/getZip/{pathname}")
    public void add(HttpServletResponse response, @PathVariable String pathname) throws FileNotFoundException, UnsupportedEncodingException {
        String fileName = pathname + ".zip";
        File file = new File("./annotationResult/"+fileName);
        InputStream inStream = new FileInputStream(file);
        response.setContentType("application/zip");
        response.setCharacterEncoding("UTF-8");
        response.setHeader("Content-Disposition","attachment;filename="+ URLEncoder.encode(fileName,"utf-8"));

        //循环取出流中的数据
        byte[] b = new byte[1024];
        int len;
        try{
            while((len = inStream.read(b)) > 0){
                response.getOutputStream().write(b,0,len);
            }
            inStream.close();
        }catch (IOException e){
            e.printStackTrace();
        }
        System.out.println("end");
    }

    @PostMapping("/annotation/{taskName}")
    public String pictureAnnotation2(@RequestBody String params, @PathVariable String taskName) throws ZipException, IOException {
        System.out.println(params);
        System.out.println(taskName);
        JSONObject jsonObject= JSONObject.parseObject(params);
        List<Annotation> list = JSONObject.parseArray(jsonObject.getJSONArray("params").toJSONString(),Annotation.class);
        Map<String,ArrayList<Annotation>> picturemap = new HashMap<>();
        for(Annotation item : list){
            System.out.println(item.getName());
            System.out.println(item.getX());
            if(!picturemap.containsKey(item.getName())){ //说明还没有该数据项
                ArrayList<Annotation> annotationInfo = new ArrayList<>();
                annotationInfo.add(item);
                picturemap.put(item.getName(),annotationInfo);
            }
            else{
                picturemap.get(item.getName()).add(item);
            }
        }
        //创建结点
        Iterator<Map.Entry<String,ArrayList<Annotation>>> entries = picturemap.entrySet().iterator();
        Date date = new Date();
        long stamp = date.getTime()/1000;
        String pathname = "./annotationResult/" + taskName + "_" + stamp;
        String returnname = taskName + "_" + stamp;
        while(entries.hasNext()){
            Map.Entry<String,ArrayList<Annotation>> entry = entries.next();
            String url = entry.getKey();
            ArrayList<Annotation> annotations = entry.getValue();
            int count = annotations.size();
            String name =  url.substring(url.lastIndexOf('/')+1);
            Element root = new Element("图片标注结果");
            Document Doc = new Document(root);
            Element pictureName = new Element("name");
            pictureName.setText(name);
            Element pictureUrl = new Element("url");
            pictureUrl.setText("https://nawei1010.oss-cn-hangzhou.aliyuncs.com/"+url);
            root.addContent(pictureName);
            root.addContent(pictureUrl);
            for(int i = 0; i < count; i++){
                Element elements = new Element("Annotation");
                Annotation a = annotations.get(i);
                elements.addContent(new Element("id").setText(a.getId()));
                elements.addContent(new Element("comment").setText(a.getComment()));
                elements.addContent(new Element("x").setText(String.valueOf(a.getX())));
                elements.addContent(new Element("y").setText(String.valueOf(a.getY())));
                elements.addContent(new Element("height").setText(String.valueOf(a.getHeight())));
                elements.addContent(new Element("width").setText(String.valueOf(a.getWidth())));
                elements.addContent(new Element("type").setText(a.getType()));
                root.addContent(elements);
            }
            //指定路径如果没有则创建并添加
            File file1 = new File(pathname);
            if(file1.mkdirs()){
                System.out.println("文件夹创建成功");
            }
            Format format = Format.getPrettyFormat();
            XMLOutputter XMLOut = new XMLOutputter(format);
            XMLOut.output(Doc,new FileOutputStream(pathname + "/" + name + ".xml"));
        }
        //创建压缩文件
        zipFile(pathname, returnname);
        return returnname;
    }

    @PostMapping("/annotation2/{taskName}")
    public String pictureAnnotation (@RequestBody String params, @PathVariable String taskName) throws IOException, ZipException {
          System.out.println(params);
          System.out.println(taskName);
          JSONObject jsonObject= JSONObject.parseObject(params);
          List<Annotation> list = JSONObject.parseArray(jsonObject.getJSONArray("params").toJSONString(),Annotation.class);
          Map<String,ArrayList<Annotation>> picturemap = new HashMap<>();
          for(Annotation item : list){
              System.out.println(item.getName());
              System.out.println(item.getX());
              if(!picturemap.containsKey(item.getName())){ //说明还没有该数据项
                  ArrayList<Annotation> annotationInfo = new ArrayList<>();
                  annotationInfo.add(item);
                  picturemap.put(item.getName(),annotationInfo);
              }
              else{
                  picturemap.get(item.getName()).add(item);
              }
          }
        //创建结点
        Iterator<Map.Entry<String,ArrayList<Annotation>>> entries = picturemap.entrySet().iterator();
        Date date = new Date();
        long stamp = date.getTime()/1000;
        String pathname = "./annotationResult/" + taskName + "_" + stamp;
        String returnname = taskName + "_" + stamp;
        while(entries.hasNext()){
            Map.Entry<String,ArrayList<Annotation>> entry = entries.next();
            String url = entry.getKey();
            ArrayList<Annotation> annotations = entry.getValue();
            int count = annotations.size();
            String name =  url.substring(url.lastIndexOf('/')+1);
            JSONArray jsonArray = new JSONArray();
            JSONObject result = new JSONObject();
            result.put("图片名",name);
            result.put("图片下载路径","https://nawei1010.oss-cn-hangzhou.aliyuncs.com/"+url);
            for(int i = 0; i < count ; i++){
                Annotation a = annotations.get(i);
                JSONObject label = new JSONObject();
                label.put("id",a.getId());
                label.put("comment",a.getComment());
                label.put("x",a.getX());
                label.put("y",a.getY());
                label.put("height",a.getHeight());
                label.put("width",a.getWidth());
                label.put("type",a.getType());
                jsonArray.add(i,label);
            }
            result.put("标注结果",jsonArray);
            String content = JSON.toJSONString(result, SerializerFeature.PrettyFormat,SerializerFeature.WriteDateUseDateFormat);
            //指定路径如果没有则创建并添加
            File file1 = new File(pathname);
            if(file1.mkdirs()){
                System.out.println("文件夹创建成功");
            }
            File file = new File(pathname + "/" + name + ".json");
            file.createNewFile();
            Writer write = new OutputStreamWriter(new FileOutputStream(file),"UTF-8");
            write.write(content);
            write.flush();
            write.close();
        }
        //创建压缩文件
        zipFile(pathname, returnname);
        return returnname;
    }

    public static void zipFile(String pathname, String taskName) throws  ZipException {
        ZipFile zipFile = new ZipFile("./annotationResult/"+taskName+".zip");
        ZipParameters parameters = new ZipParameters();

        //压缩方式
        parameters.setCompressionMethod(Zip4jConstants.COMP_STORE);
        //压缩级别
        parameters.setCompressionLevel(Zip4jConstants.DEFLATE_LEVEL_FASTEST);
        //要打包的文件夹
        File currentFile = new File(pathname);
        File[] fs = currentFile.listFiles();
        //遍历所有文件和文件夹
        for(File f: fs){
            if(f.isDirectory()){
                zipFile.addFolder(f.getPath(),parameters);
            }else {
                zipFile.addFile(f,parameters);
            }
        }
    }


}
