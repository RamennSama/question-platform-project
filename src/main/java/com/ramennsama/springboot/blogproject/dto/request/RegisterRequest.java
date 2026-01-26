package com.ramennsama.springboot.blogproject.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterRequest {

    @NotBlank(message = "firstName is required")
    private String firstName;

    @NotBlank(message = "lastName is required")
    private String lastName;

    @Email(message = "email must be valid")
    @NotBlank(message = "email is required")
    @Size(max = 100)
    private String email;

    @NotBlank(message = "password is required")
    @Size(min = 6, max = 100)
    private String password;

    private String avatarUrl;

}
