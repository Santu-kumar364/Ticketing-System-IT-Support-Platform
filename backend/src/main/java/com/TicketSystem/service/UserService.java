package com.TicketSystem.service;

import java.util.List;
import java.util.Optional;

import com.TicketSystem.exceptions.UserException;
import com.TicketSystem.model.User;
import com.TicketSystem.model.UserRole;

public interface UserService {
    public User registerUser(User user);
    public User findUserById(Integer userId) throws UserException;
    public User findUserByEmail(String Email);
    public User updateUser(User user, Integer userId) throws UserException;
    public Optional<User> findUserByJwt(String jwt);
    public List<User> getAllUsers();
    public User updateUserRole(Integer userId, UserRole newRole) throws UserException;
    public void deleteUser(Integer userId) throws UserException; // This now does soft delete
    public List<User> getUsersByRole(UserRole role);
    public List<User> searchUsers(String searchTerm);
}