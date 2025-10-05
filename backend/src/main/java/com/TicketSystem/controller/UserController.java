package com.TicketSystem.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import com.TicketSystem.model.User;
import com.TicketSystem.model.UserRole;
import com.TicketSystem.service.UserService;

@RestController
public class UserController {

    @Autowired
    UserService userService;

    @GetMapping("/api/users/profile")
    public User getUserFromToken(@RequestHeader("Authorization") String jwt) {
        return userService.findUserByJwt(jwt)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @PutMapping("/api/users")
    public User updateUser(@RequestHeader("Authorization") String jwt, @RequestBody User user) throws Exception {
        Optional<User> reqUser = userService.findUserByJwt(jwt);
        User updatedUser = userService.updateUser(user, reqUser.get().getId());
        return updatedUser;
    }

    // Admin endpoints
    @GetMapping("/api/users")
    public ResponseEntity<List<User>> getAllUsers(@RequestHeader("Authorization") String jwt) {
        User currentUser = userService.findUserByJwt(jwt)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (currentUser.getRole() != UserRole.ADMIN) {
            throw new RuntimeException("Access denied. Admin role required.");
        }

        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    // ADD THIS ENDPOINT FOR CREATING USERS
    @PostMapping("/api/admin/users")
    public ResponseEntity<User> createUser(
            @RequestHeader("Authorization") String jwt,
            @RequestBody UserCreateRequest createRequest) {

        User currentUser = userService.findUserByJwt(jwt)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (currentUser.getRole() != UserRole.ADMIN) {
            throw new RuntimeException("Access denied. Admin role required.");
        }

        // Create new user
        User newUser = new User();
        newUser.setEmail(createRequest.getEmail());
        newUser.setFirstName(createRequest.getFirstName());
        newUser.setLastName(createRequest.getLastName());
        newUser.setPassword(createRequest.getPassword()); // Will be encoded in service
        newUser.setRole(createRequest.getRole() != null ? createRequest.getRole() : UserRole.USER);

        User createdUser = userService.registerUser(newUser);
        return ResponseEntity.ok(createdUser);
    }

    @PutMapping("/api/users/{userId}/role")
    public ResponseEntity<User> updateUserRole(
            @RequestHeader("Authorization") String jwt,
            @PathVariable Integer userId,
            @RequestBody RoleUpdateRequest roleUpdate) throws Exception {

        User currentUser = userService.findUserByJwt(jwt)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (currentUser.getRole() != UserRole.ADMIN) {
            throw new RuntimeException("Access denied. Admin role required.");
        }

        // Prevent admin from changing their own role
        if (currentUser.getId().equals(userId)) {
            throw new RuntimeException("Cannot change your own role");
        }

        User updatedUser = userService.updateUserRole(userId, roleUpdate.getRole());
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/api/admin/users/{userId}")
    public ResponseEntity<String> deleteUser(
            @RequestHeader("Authorization") String jwt,
            @PathVariable Integer userId) throws Exception {

        User currentUser = userService.findUserByJwt(jwt)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (currentUser.getRole() != UserRole.ADMIN) {
            throw new RuntimeException("Access denied. Admin role required.");
        }

        // Prevent admin from deleting themselves
        if (currentUser.getId().equals(userId)) {
            throw new RuntimeException("Cannot delete your own account");
        }

        userService.deleteUser(userId); // Use deleteUser instead of deactivateUser
        return ResponseEntity.ok("User deleted successfully");
    }

    // DTO for role update request
    public static class RoleUpdateRequest {

        private UserRole role;

        public UserRole getRole() {
            return role;
        }

        public void setRole(UserRole role) {
            this.role = role;
        }
    }

    // DTO for user creation request
    public static class UserCreateRequest {

        private String email;
        private String firstName;
        private String lastName;
        private String password;
        private UserRole role;

        // Getters and setters
        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getFirstName() {
            return firstName;
        }

        public void setFirstName(String firstName) {
            this.firstName = firstName;
        }

        public String getLastName() {
            return lastName;
        }

        public void setLastName(String lastName) {
            this.lastName = lastName;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        public UserRole getRole() {
            return role;
        }

        public void setRole(UserRole role) {
            this.role = role;
        }
    }
}
