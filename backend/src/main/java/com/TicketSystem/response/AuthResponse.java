package com.TicketSystem.response;

import com.TicketSystem.model.User;
import com.TicketSystem.model.UserRole;

public class AuthResponse {
    private String token;
    private String message;
    private User user;

    public AuthResponse() {}

    public AuthResponse(String token, String message) {
        this.token = token;
        this.message = message;
    }

    public AuthResponse(String token, String message, User user) {
        this.token = token;
        this.message = message;
        this.user = user;
    }

    // Getters and setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    // Helper method to get role from user
    public UserRole getRole() {
        return user != null ? user.getRole() : null;
    }
}