package com.TicketSystem.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.TicketSystem.model.Comment;
import com.TicketSystem.model.Ticket;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    
    // Find all comments for a specific ticket
    List<Comment> findByTicketOrderByCreatedAtAsc(Ticket ticket);
    
    // Find all comments for a specific ticket ID
    List<Comment> findByTicketIdOrderByCreatedAtAsc(Long ticketId);
    
    // Find comments by user
    List<Comment> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    // Find recent comments with pagination
    List<Comment> findTop10ByOrderByCreatedAtDesc();
    
    // Count comments for a ticket
    long countByTicketId(Long ticketId);
    
    // Find comments with user data eagerly fetched
    @Query("SELECT c FROM Comment c JOIN FETCH c.user WHERE c.ticket.id = :ticketId ORDER BY c.createdAt ASC")
    List<Comment> findByTicketIdWithUser(@Param("ticketId") Long ticketId);
    
    // Delete all comments for a ticket
    void deleteByTicketId(Long ticketId);
}