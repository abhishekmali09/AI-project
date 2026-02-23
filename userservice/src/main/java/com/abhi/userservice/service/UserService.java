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

        if (repository.existsByEmail(request.getEmail())) {
            User existingUser = repository.findByEmail(request.getEmail());
            UserResponse userResponse = new UserResponse();
            userResponse.setId(existingUser.getId());
            userResponse.setKeycloakId(existingUser.getKeycloakId());
            userResponse.setEmail(existingUser.getEmail());
            userResponse.setPassword(existingUser.getPassword());
            userResponse.setFirstName(existingUser.getFirstName());
            userResponse.setLastName(existingUser.getLastName());
            userResponse.setCreatedAt(existingUser.getCreatedAt());
            userResponse.setUpdatedAt(existingUser.getUpdatedAt());
            return userResponse;
        }

         User user = new User();
         user.setEmail(request.getEmail());
         user.setPassword(request.getPassword());
         user.setKeycloakId(request.getKeycloakId());
         user.setFirstName(request.getFirstName());
         user.setLastName(request.getLastName());

         User savedUser = repository.save(user);
         UserResponse userResponse = new UserResponse();
         userResponse.setId(savedUser.getId());
        userResponse.setKeycloakId(savedUser.getKeycloakId());
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

    public Boolean existByUserId(Long userId) {
        log.info("Calling User Validation API for userId: " + userId);
        return repository.existsById(userId);
    }

    public Boolean existByKeycloakId(String keycloakId) {
        log.info("Calling User Validation API for keycloakId: " + keycloakId);
        return repository.existsByKeycloakId(keycloakId);
    }
}
