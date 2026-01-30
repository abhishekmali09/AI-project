package com.abhi.userservice.service;
import com.abhi.userservice.dto.RegisterRequest;
import com.abhi.userservice.dto.UserResponse;
import com.abhi.userservice.modle.User;
import com.abhi.userservice.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.Nullable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class UserService {

    @Autowired
    private UserRepository repository;

    public UserResponse register( RegisterRequest request) {

        if (repository.existsByEmail(request.getEmail()))
            throw new RuntimeException("Email already exists");
         User user = new User();
         user.setEmail(request.getEmail());
         user.setPassword(request.getPassword());
         user.setFirstName(request.getFirstName());
         user.setLastName(request.getLastName());

         User savedUser = repository.save(user);
         UserResponse userResponse = new UserResponse();
         userResponse.setId(savedUser.getId());
         userResponse.setEmail(savedUser.getEmail());
         userResponse.setPassword(savedUser.getPassword());
         userResponse.setFirstName(savedUser.getFirstName());
         userResponse.setLastName(savedUser.getLastName());
         userResponse.setCreatedAt(savedUser.getCreatedAt());
         userResponse.setUpdatedAt(savedUser.getUpdatedAt());
         return userResponse;

    }

    public @Nullable UserResponse getUserProfile(long userId) {

        User user = repository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserResponse userResponse = new UserResponse();
        userResponse.setId(user.getId());
        userResponse.setEmail(user.getEmail());
        userResponse.setPassword(user.getPassword());
        userResponse.setFirstName(user.getFirstName());
        userResponse.setLastName(user.getLastName());
        userResponse.setCreatedAt(user.getCreatedAt());
        userResponse.setUpdatedAt(user.getUpdatedAt());
        return userResponse;
    }

    public Boolean existByUserId(long userId) {
        log.info("Calling User Validation APL for userId: " + userId);
        return repository.existsById(userId);
    }
}
