package com.ramennsama.springboot.blogproject.config.jwtservice.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ramennsama.springboot.blogproject.config.jwtservice.AuthService;
import com.ramennsama.springboot.blogproject.config.jwtservice.JwtService;
import com.ramennsama.springboot.blogproject.dto.request.LoginRequest;
import com.ramennsama.springboot.blogproject.dto.request.RegisterRequest;
import com.ramennsama.springboot.blogproject.dto.response.JwtResponse;
import com.ramennsama.springboot.blogproject.dto.response.UserResponse;
import com.ramennsama.springboot.blogproject.entity.Authority;
import com.ramennsama.springboot.blogproject.entity.User;
import com.ramennsama.springboot.blogproject.repository.UserRepository;
import com.ramennsama.springboot.blogproject.utils.FindAuthenticatedUser;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final FindAuthenticatedUser findAuthenticatedUser;
    private final JwtService jwtService;

    @Override
    public void register(RegisterRequest rq) throws Exception {
        if(isEmailTaken(rq.getEmail())) {
            throw new Exception("Email already Taken");
        }
        User user = buildNewUser(rq);
        userRepository.save(user);
    }

    @Override
    public JwtResponse login(LoginRequest rq) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(rq.getEmail(), rq.getPassword()));

        User user = userRepository.findByEmail(rq.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        String jwtToken = jwtService.generateToken(new HashMap<>(), user);

        return new JwtResponse(jwtToken);
    }

    @Override
    public UserResponse getInfo() {
        User user = this.findAuthenticatedUser.getAuthenticatedUser();
        UserResponse rep =  new UserResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getFirstName() + " " + user.getLastName(),
                user.getEmail(),
                user.getAuthorities()
                        .stream()
                        .map(auth -> (Authority) auth)
                        .toList(),
                user.getCreateAt(),
                user.getAvatarUrl());
        return rep;
    }

    /**
     * ======================== INTERNAL HELPERS ========================
     */

    private boolean isEmailTaken(String email) {
        return userRepository.findByEmail(email).isPresent();
    }

    private User buildNewUser(RegisterRequest rq) {
        User user = new User();
        user.setFirstName(rq.getFirstName());
        user.setLastName(rq.getLastName());
        user.setEmail(rq.getEmail());
        user.setEnabled(true);
        user.setPassword(passwordEncoder.encode(rq.getPassword()));
        user.setAuthorities(initialAuthority());
        
        // Set avatar URL if provided
        if (rq.getAvatarUrl() != null && !rq.getAvatarUrl().isEmpty()) {
            user.setAvatarUrl(rq.getAvatarUrl());
        }
        
        return user;
    }

    private List<Authority> initialAuthority() {
        boolean isFirstUser = userRepository.count() == 0;
        List<Authority> authorities = new ArrayList<>();
        authorities.add(new Authority("ROLE_USER"));
        if (isFirstUser) {
            authorities.add(new Authority("ROLE_ADMIN"));
        }
        return authorities;
    }
}
