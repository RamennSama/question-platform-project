package com.ramennsama.springboot.blogproject.dto.response;

import lombok.Data;

@Data
public class ExceptionResponses {

    private int status;

    private String message;

    private long timestamp;
}