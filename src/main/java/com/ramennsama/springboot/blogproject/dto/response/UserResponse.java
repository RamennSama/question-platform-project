package com.ramennsama.springboot.blogproject.dto.response;

import java.util.Date;
import java.util.List;

import com.ramennsama.springboot.blogproject.entity.Authority;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {

    private Long id;
    
    private String firstName;
    
    private String lastName;

    private String fullName;

    private String email;

    private List<Authority> authorities;
    
    private Date createAt;
    
    private String avatarUrl;
}

