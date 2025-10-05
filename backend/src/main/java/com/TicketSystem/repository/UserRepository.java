package com.TicketSystem.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.TicketSystem.model.User;
import com.TicketSystem.model.UserRole;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    
    Optional<User> findByEmail(String email);
    
    List<User> findAllByOrderByIdAsc();
    
    List<User> findByRole(UserRole role);
    
    List<User> findByActiveTrue();
    
    @Query("SELECT u FROM User u WHERE " +
           "LOWER(u.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(u.lastName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<User> findByFirstNameContainingOrLastNameContainingOrEmailContaining(
        @Param("searchTerm") String searchTerm);
    
    boolean existsByEmail(String email);
    
    long countByRole(UserRole role);
}