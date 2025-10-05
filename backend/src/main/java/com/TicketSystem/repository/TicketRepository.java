package com.TicketSystem.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.TicketSystem.model.Ticket;
import com.TicketSystem.model.TicketStatus;
import com.TicketSystem.model.User;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    
    // Existing methods...
     List<Ticket> findByCreatedBy(User user);
    List<Ticket> findByAssignedAgent(User user);
    void deleteByCreatedBy(User user);
     
    List<Ticket> findByStatus(TicketStatus status);
    
    @Query("SELECT t FROM Ticket t WHERE t.assignedAgent = :agent OR t.createdBy = :user")
    List<Ticket> findAccessibleTickets(@Param("user") User user, @Param("agent") User agent);
    
    long countByStatus(TicketStatus status);
    long countByAssignedAgentAndStatus(User agent, TicketStatus status);
    
    // NEW: Fetch ticket with comments and users
    @Query("SELECT t FROM Ticket t LEFT JOIN FETCH t.comments c LEFT JOIN FETCH c.user WHERE t.id = :id")
    Optional<Ticket> findByIdWithComments(@Param("id") Long id);
    
    // Fetch all tickets with comments for a user
    @Query("SELECT DISTINCT t FROM Ticket t LEFT JOIN FETCH t.comments WHERE t.createdBy = :user")
    List<Ticket> findByCreatedByWithComments(@Param("user") User user);
    
    // Fetch all tickets with comments for an assigned agent
    @Query("SELECT DISTINCT t FROM Ticket t LEFT JOIN FETCH t.comments WHERE t.assignedAgent = :agent")
    List<Ticket> findByAssignedAgentWithComments(@Param("agent") User agent);
}