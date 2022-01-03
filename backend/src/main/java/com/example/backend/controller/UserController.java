package com.example.backend.controller;


import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.returnResult;
import org.aspectj.bridge.MessageUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@CrossOrigin(origins = "*", maxAge = 3600)
@RestController //@Controller用来处理Http请求，RestController是Controller的衍生注解
@RequestMapping("/api/v1") //默认属性为value，因此这里没有写出，规定初步的请求映射
public class UserController {
    @Autowired
    private UserRepository userRepository;

    public Logger log = LoggerFactory.getLogger(UserController.class);
    @PostMapping("/register")
    public returnResult<User> createUser(@RequestBody User user ){
        User u = userRepository.findById(user.getUserName()).orElse(null);
        returnResult<User> result;
        if(u != null){
            result = new returnResult<User>(1,"用户名已存在", null);
            return  result;
        }
        User userList = userRepository.findByEmailId(user.getEmailId());
        if(userList != null){
            log.info(userList.getUserName());
            result = new returnResult<User>(1,"邮箱已存在",null);
            return result;
        }

        result = new returnResult<User>(0, "注册成功",user);
        userRepository.save(user);
        return result;
    }

    @PostMapping(value = "/login/{username}/{password}")
    public returnResult<User> login(@PathVariable String username, @PathVariable String password){
        log.info(username);
        log.info(password);
        User u = userRepository.findById(username).orElse(null);
        returnResult<User> result;
        if(u == null){
            result = new returnResult<User>(1, "该用户不存在",null);
            return result;
        }
        else if(u.getPassword().equals(password)){
            result = new returnResult<User>(0, "登陆成功", u);
            return result;
        }
        else{
            result = new returnResult<User>(1, "输入密码不正确", null);
            return result;
        }
    }

    @PostMapping("/getUserinfo/{user}")
    public User getUserInfo(@PathVariable String user){
        User u = userRepository.findById(user).orElse(null);
        return u;
    }

    @PostMapping("/updateUser")
    public returnResult<User> updateUser(@RequestBody User user){
        User userList = userRepository.findByEmailId(user.getEmailId());
        returnResult<User> result;
        if(userList != null){
            result = new returnResult<User>(1, "邮箱已存在", null);
            return result;
        }
        result = new returnResult<User>(0, "修改信息成功", user);
        userRepository.deleteById(user.getUserName());
        userRepository.save(user);
        return result;
    }
}
