package com.TicketSystem.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.TicketSystem.config.JwtProvider;
import com.TicketSystem.exceptions.UserException;
import com.TicketSystem.model.Ticket;
import com.TicketSystem.model.User;
import com.TicketSystem.model.UserRole;
import com.TicketSystem.repository.TicketRepository;
import com.TicketSystem.repository.UserRepository;

@Service
public class UserServiceImplemention implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public User registerUser(User user) {
        // Check if email already exists
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        User newUser = new User();
        newUser.setEmail(user.getEmail());
        newUser.setFirstName(user.getFirstName());
        newUser.setLastName(user.getLastName());
        newUser.setPassword(passwordEncoder.encode(user.getPassword()));
        newUser.setRole(user.getRole() != null ? user.getRole() : UserRole.USER);
        newUser.setActive(true);

        User savedUser = userRepository.save(newUser);
        return savedUser;
    }

    @Override
    public User findUserById(Integer userId) throws UserException {
        Optional<User> user = userRepository.findById(userId); // FIXED: Remove Long.valueOf()

        if (user.isPresent()) {
            return user.get();
        }
        throw new UserException("User not exist with userId " + userId);
    }

    @Override
    public User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }

    @Override
    public User updateUser(User user, Integer userId) throws UserException {
        Optional<User> userOptional = userRepository.findById(userId); // FIXED: Remove Long.valueOf()

        if (userOptional.isEmpty()) {
            throw new UserException("User not exist with id " + userId);
        }

        User oldUser = userOptional.get();

        if (user.getFirstName() != null) {
            oldUser.setFirstName(user.getFirstName());
        }
        if (user.getPassword() != null) {
            oldUser.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        if (user.getEmail() != null) {
            // Check if email is being changed and if it's already taken
            if (!oldUser.getEmail().equals(user.getEmail())) {
                if (userRepository.findByEmail(user.getEmail()).isPresent()) {
                    throw new RuntimeException("Email already taken");
                }
                oldUser.setEmail(user.getEmail());
            }
        }
        if (user.getLastName() != null) {
            oldUser.setLastName(user.getLastName());
        }
        // Only update role if provided and user has permission (handled in controller)
        if (user.getRole() != null) {
            oldUser.setRole(user.getRole());
        }

        return userRepository.save(oldUser);
    }

    @Override
    public Optional<User> findUserByJwt(String jwt) {
        try {
            String email = JwtProvider.getEmailFromJwtToken(jwt);
            Optional<User> user = userRepository.findByEmail(email);
            return user;
        } catch (Exception e) {
            throw new RuntimeException("Invalid JWT token", e);
        }
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAllByOrderByIdAsc();
    }

    @Override
    public User updateUserRole(Integer userId, UserRole newRole) throws UserException {
        Optional<User> userOptional = userRepository.findById(userId); // FIXED: Remove Long.valueOf()

        if (userOptional.isEmpty()) {
            throw new UserException("User not exist with id " + userId);
        }

        User user = userOptional.get();
        user.setRole(newRole);

        return userRepository.save(user);
    }

    @Override
    public void deleteUser(Integer userId) throws UserException {
        Optional<User> userOptional = userRepository.findById(userId);

        if (userOptional.isEmpty()) {
            throw new UserException("User not exist with id " + userId);
        }

        User user = userOptional.get();

        // Handle tickets created by this user
        List<Ticket> ticketsCreated = ticketRepository.findByCreatedBy(user);
        if (!ticketsCreated.isEmpty()) {
            // Option A: Delete all tickets created by this user
            ticketRepository.deleteAll(ticketsCreated);

        }

        // Handle tickets assigned to this user
        List<Ticket> ticketsAssigned = ticketRepository.findByAssignedAgent(user);
        if (!ticketsAssigned.isEmpty()) {
            // Unassign this user from all tickets
            for (Ticket ticket : ticketsAssigned) {
                ticket.setAssignedAgent(null);
                ticketRepository.save(ticket);
            }
        }

        // Now hard delete the user
        userRepository.delete(user);
    }

    @Override
    public List<User> getUsersByRole(UserRole role) {
        return userRepository.findByRole(role);
    }

    @Override
    public List<User> searchUsers(String searchTerm) {
        return userRepository.findByFirstNameContainingOrLastNameContainingOrEmailContaining(
                searchTerm, searchTerm, searchTerm);
    }
}
