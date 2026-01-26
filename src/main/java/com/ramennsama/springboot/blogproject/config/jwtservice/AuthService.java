package com.ramennsama.springboot.blogproject.config.jwtservice;

import com.ramennsama.springboot.blogproject.dto.request.LoginRequest;
import com.ramennsama.springboot.blogproject.dto.request.RegisterRequest;
import com.ramennsama.springboot.blogproject.dto.response.JwtResponse;
import com.ramennsama.springboot.blogproject.dto.response.UserResponse;

public interface AuthService {
    void register(RegisterRequest rq) throws Exception;
    JwtResponse login(LoginRequest rq);
    UserResponse getInfo();
}
