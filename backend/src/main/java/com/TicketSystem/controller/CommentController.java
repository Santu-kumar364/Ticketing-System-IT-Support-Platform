package com.TicketSystem.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.TicketSystem.model.Comment;
import com.TicketSystem.model.Ticket;
import com.TicketSystem.model.User;
import com.TicketSystem.model.UserRole;
import com.TicketSystem.repository.CommentRepository;
import com.TicketSystem.repository.TicketRepository;
import com.TicketSystem.service.UserService;

@RestController
@RequestMapping("/api/tickets/{ticketId}/comments")
@CrossOrigin(origins = "http://localhost:5173")
public class CommentController {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private UserService userService;
 
    @PostMapping
    public ResponseEntity<?> addComment(
            @PathVariable Long ticketId,
            @RequestBody Comment comment,
            @RequestHeader("Authorization") String jwt) {
        try {
            Optional<User> user = userService.findUserByJwt(jwt);
            if (user.isEmpty()) {
                return ResponseEntity.badRequest().body("User not found");
            }

            Optional<Ticket> ticket = ticketRepository.findById(ticketId);
            if (ticket.isEmpty()) {
                return ResponseEntity.badRequest().body("Ticket not found with id: " + ticketId);
            }

            Ticket existingTicket = ticket.get();
            User currentUser = user.get();

          
            if (!hasCommentPermission(existingTicket, currentUser)) {
                return ResponseEntity.badRequest().body("You don't have permission to comment on this ticket");
            }

            // Set comment properties
            comment.setUser(currentUser);
            comment.setTicket(existingTicket);
            
            // Save the comment
            Comment savedComment = commentRepository.save(comment);
            
            // Return the updated ticket with all comments
            Ticket updatedTicket = ticketRepository.findByIdWithComments(ticketId)
                    .orElseThrow(() -> new RuntimeException("Ticket not found after comment creation"));
            
            return ResponseEntity.ok(updatedTicket);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to add comment: " + e.getMessage());
        }
    }

   
    @GetMapping
    public ResponseEntity<?> getTicketComments(
            @PathVariable Long ticketId,
            @RequestHeader("Authorization") String jwt) {
        try {
            Optional<User> user = userService.findUserByJwt(jwt);
            if (user.isEmpty()) {
                return ResponseEntity.badRequest().body("User not found");
            }

            Optional<Ticket> ticket = ticketRepository.findById(ticketId);
            if (ticket.isEmpty()) {
                return ResponseEntity.badRequest().body("Ticket not found with id: " + ticketId);
            }

            Ticket existingTicket = ticket.get();
            User currentUser = user.get();

        
            if (!hasViewPermission(existingTicket, currentUser)) {
                return ResponseEntity.badRequest().body("You don't have permission to view comments for this ticket");
            }

          
            List<Comment> comments = commentRepository.findByTicketIdWithUser(ticketId);
            
            return ResponseEntity.ok(comments);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to get comments: " + e.getMessage());
        }
    }

  
    @DeleteMapping("/{commentId}")
    public ResponseEntity<?> deleteComment(
            @PathVariable Long ticketId,
            @PathVariable Long commentId,
            @RequestHeader("Authorization") String jwt) {
        try {
            Optional<User> user = userService.findUserByJwt(jwt);
            if (user.isEmpty()) {
                return ResponseEntity.badRequest().body("User not found");
            }

            Optional<Comment> comment = commentRepository.findById(commentId);
            if (comment.isEmpty()) {
                return ResponseEntity.badRequest().body("Comment not found with id: " + commentId);
            }

            Comment existingComment = comment.get();
            User currentUser = user.get();

          
            if (!hasDeletePermission(existingComment, currentUser)) {
                return ResponseEntity.badRequest().body("You don't have permission to delete this comment");
            }

            commentRepository.delete(existingComment);
            
            return ResponseEntity.ok("Comment deleted successfully");

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to delete comment: " + e.getMessage());
        }
    }
 
    private boolean hasCommentPermission(Ticket ticket, User user) {
        // Admins can comment on any ticket
        if (user.getRole() == UserRole.ADMIN) {
            return true;
        }
        
        // Support agents can comment on assigned tickets
        if (user.getRole() == UserRole.SUPPORT_AGENT) {
            return ticket.getAssignedAgent() != null && 
                   ticket.getAssignedAgent().getId().equals(user.getId());
        }
        
        // Regular users can only comment on their own tickets
        return ticket.getCreatedBy().getId().equals(user.getId());
    }

    // Helper method to check view permission
    private boolean hasViewPermission(Ticket ticket, User user) {
        // Admins can view any ticket comments
        if (user.getRole() == UserRole.ADMIN) {
            return true;
        }
        
        // Support agents can view comments on assigned tickets
        if (user.getRole() == UserRole.SUPPORT_AGENT) {
            return ticket.getAssignedAgent() != null && 
                   ticket.getAssignedAgent().getId().equals(user.getId());
        }
        
        // Regular users can only view comments on their own tickets
        return ticket.getCreatedBy().getId().equals(user.getId());
    }

    // Helper method to check delete permission
    private boolean hasDeletePermission(Comment comment, User user) {
        // Admins can delete any comment
        if (user.getRole() == UserRole.ADMIN) {
            return true;
        }
        
        // Users can only delete their own comments
        return comment.getUser().getId().equals(user.getId());
    }
}