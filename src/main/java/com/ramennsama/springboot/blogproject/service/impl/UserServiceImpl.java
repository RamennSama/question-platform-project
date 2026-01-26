package com.ramennsama.springboot.blogproject.service.impl;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.ramennsama.springboot.blogproject.dto.request.PasswordUpdateRequest;
import com.ramennsama.springboot.blogproject.dto.response.UserResponse;
import com.ramennsama.springboot.blogproject.entity.Authority;
import com.ramennsama.springboot.blogproject.entity.User;
import com.ramennsama.springboot.blogproject.repository.UserRepository;
import com.ramennsama.springboot.blogproject.service.UserService;
import com.ramennsama.springboot.blogproject.utils.FindAuthenticatedUser;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final FindAuthenticatedUser findAuthenticatedUser;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserInfo() {
        User user = this.findAuthenticatedUser.getAuthenticatedUser();
        return new UserResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getFirstName() + " " + user.getLastName(),
                user.getEmail(),
                user.getAuthorities().stream().map(auth -> (Authority) auth).toList(),
                user.getCreateAt(),
                user.getAvatarUrl()
        );
    }
    
    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        return new UserResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getFirstName() + " " + user.getLastName(),
                user.getEmail(),
                user.getAuthorities().stream().map(auth -> (Authority) auth).toList(),
                user.getCreateAt(),
                user.getAvatarUrl()
        );
    }

    @Override
    public void deleteUser() {
        User user = this.findAuthenticatedUser.getAuthenticatedUser();
        if(isLastAdmin(user)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin cannot delete itself");
        }
        userRepository.delete(user);
    }

    @Override
    public void updatePassword(PasswordUpdateRequest rq) {
        User user = this.findAuthenticatedUser.getAuthenticatedUser();

        if (!isOldPasswordCorrect(user.getPassword(), rq.getOldPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Current password is incorrect");
        }

        if (!isNewPasswordConfirmed(rq.getNewPassword(),
                rq.getConfirmPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "New passwords do not match");
        }

        if (!isNewPasswordDifferent(rq.getNewPassword(),
                rq.getOldPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Old and new passwords must be different");
        }

        user.setPassword(passwordEncoder.encode(rq.getNewPassword()));
        userRepository.save(user);
    }

    @Override
    @Transactional
    public UserResponse updateAvatar(String avatarUrl) {
        User user = this.findAuthenticatedUser.getAuthenticatedUser();
        user.setAvatarUrl(avatarUrl);
        userRepository.save(user);
        return getUserInfo();
    }

    /**
     * ======================== INTERNAL HELPERS ========================
     */

    private boolean isOldPasswordCorrect(String newPassword, String oldPassword) {
        return passwordEncoder.matches(oldPassword, newPassword); // so sanh mk ma hoa
    }

    private boolean isNewPasswordConfirmed(String newPassword, String confirmPassword) {
        return confirmPassword.equals(newPassword);
    }

    private boolean isNewPasswordDifferent(String newPassword, String oldPassword) {
        return !newPassword.equals(oldPassword);
    }

    private boolean isLastAdmin(User user) {
        boolean isAdmin = user.getAuthorities().stream()
                .anyMatch(authority -> "ROLE_ADMIN".equals(authority.getAuthority()));

        if(isAdmin) {
            long cntAdmin = userRepository.countAdminUsers();
            return cntAdmin <= 1;
        }

        return false;
    }
}
