package com.TicketSystem.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.TicketSystem.exceptions.TicketException;
import com.TicketSystem.model.Comment;
import com.TicketSystem.model.Ticket;
import com.TicketSystem.model.TicketPriority;
import com.TicketSystem.model.TicketStatus;
import com.TicketSystem.model.User;
import com.TicketSystem.model.UserRole;
import com.TicketSystem.repository.CommentRepository;
import com.TicketSystem.repository.TicketRepository;
import com.TicketSystem.repository.UserRepository;

@Service
public class TicketServiceImplementation implements TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Override
    public Ticket createTicket(Ticket ticket, User createdBy) {
        try {
            // Set basic ticket information
            ticket.setCreatedBy(createdBy);
            ticket.setStatus(TicketStatus.OPEN);
            ticket.setCreatedAt(LocalDateTime.now());
            ticket.setUpdatedAt(LocalDateTime.now());

            // If no priority specified, set default
            if (ticket.getPriority() == null) {
                ticket.setPriority(TicketPriority.MEDIUM);
            }

            // For regular users, don't auto-assign agents
            // Admins can assign during creation if needed
            if (createdBy.getRole() == UserRole.USER) {
                ticket.setAssignedAgent(null); // No auto-assignment for user-created tickets
            }

            return ticketRepository.save(ticket);
        } catch (Exception e) {
            throw new TicketException("Failed to create ticket: " + e.getMessage());
        }
    }

    @Override
    public Ticket updateTicket(Long ticketId, Ticket ticketUpdates, User user) {
        try {
            Optional<Ticket> optionalTicket = ticketRepository.findById(ticketId);
            if (optionalTicket.isEmpty()) {
                throw new TicketException("Ticket not found with id: " + ticketId);
            }

            Ticket existingTicket = optionalTicket.get();

            // Check permissions
            if (!hasEditPermission(existingTicket, user)) {
                throw new TicketException("You don't have permission to update this ticket");
            }

            // Update fields if provided
            if (ticketUpdates.getSubject() != null) {
                existingTicket.setSubject(ticketUpdates.getSubject());
            }
            if (ticketUpdates.getDescription() != null) {
                existingTicket.setDescription(ticketUpdates.getDescription());
            }
            if (ticketUpdates.getPriority() != null) {
                existingTicket.setPriority(ticketUpdates.getPriority());
            }

            existingTicket.setUpdatedAt(LocalDateTime.now());

            return ticketRepository.save(existingTicket);
        } catch (TicketException e) {
            throw e;
        } catch (Exception e) {
            throw new TicketException("Failed to update ticket: " + e.getMessage());
        }
    }

    @Override
    public Ticket assignTicket(Long ticketId, Long agentId, User admin) {
        try {
            // Verify admin permissions
            if (admin.getRole() != UserRole.ADMIN) {
                throw new TicketException("Only admins can assign tickets to agents");
            }

            Optional<Ticket> optionalTicket = ticketRepository.findById(ticketId);
            if (optionalTicket.isEmpty()) {
                throw new TicketException("Ticket not found with id: " + ticketId);
            }

            // Convert Long agentId to Integer for User repository
            Integer agentIdInt = agentId.intValue();
            Optional<User> optionalAgent = userRepository.findById(agentIdInt);
            if (optionalAgent.isEmpty()) {
                throw new TicketException("Agent not found with id: " + agentId);
            }

            User agent = optionalAgent.get();
            if (agent.getRole() != UserRole.SUPPORT_AGENT) {
                throw new TicketException("User with id " + agentId + " is not a support agent");
            }

            Ticket ticket = optionalTicket.get();
            ticket.setAssignedAgent(agent);

            // If ticket was OPEN, change to IN_PROGRESS when assigned
            if (ticket.getStatus() == TicketStatus.OPEN) {
                ticket.setStatus(TicketStatus.IN_PROGRESS);
            }

            ticket.setUpdatedAt(LocalDateTime.now());

            return ticketRepository.save(ticket);
        } catch (TicketException e) {
            throw e;
        } catch (Exception e) {
            throw new TicketException("Failed to assign ticket: " + e.getMessage());
        }
    }

    @Override
    public Ticket updateStatus(Long ticketId, TicketStatus status, User user) {
        try {
            Optional<Ticket> optionalTicket = ticketRepository.findById(ticketId);
            if (optionalTicket.isEmpty()) {
                throw new TicketException("Ticket not found with id: " + ticketId);
            }

            Ticket ticket = optionalTicket.get();

            // Check permissions for status update
            if (!hasStatusUpdatePermission(ticket, user, status)) {
                throw new TicketException("You don't have permission to update the status of this ticket");
            }

            // Validate status transitions
            validateStatusTransition(ticket.getStatus(), status, user);

            ticket.setStatus(status);
            ticket.setUpdatedAt(LocalDateTime.now());

            return ticketRepository.save(ticket);
        } catch (TicketException e) {
            throw e;
        } catch (Exception e) {
            throw new TicketException("Failed to update ticket status: " + e.getMessage());
        }
    }

    @Override
    public void deleteTicket(Long ticketId, User user) {
        try {
            Optional<Ticket> optionalTicket = ticketRepository.findById(ticketId);
            if (optionalTicket.isEmpty()) {
                throw new TicketException("Ticket not found with id: " + ticketId);
            }

            Ticket ticket = optionalTicket.get();

            // Only admins or ticket creators can delete tickets
            if (user.getRole() != UserRole.ADMIN
                    && !ticket.getCreatedBy().getId().equals(user.getId())) {
                throw new TicketException("You don't have permission to delete this ticket");
            }

            ticketRepository.delete(ticket);
        } catch (TicketException e) {
            throw e;
        } catch (Exception e) {
            throw new TicketException("Failed to delete ticket: " + e.getMessage());
        }
    }

    @Override
    public List<Ticket> getUserTickets(User user) {
        try {
            // Users see their own created tickets
            if (user.getRole() == UserRole.USER) {
                return ticketRepository.findByCreatedBy(user);
            } // Support agents see tickets assigned to them
            else if (user.getRole() == UserRole.SUPPORT_AGENT) {
                return ticketRepository.findByAssignedAgent(user);
            } // Admins see all tickets (handled by getAllTickets)
            else {
                return ticketRepository.findAll();
            }
        } catch (Exception e) {
            throw new TicketException("Failed to get user tickets: " + e.getMessage());
        }
    }

    @Override
    public List<Ticket> getAssignedTickets(User agent) {
        try {
            if (agent.getRole() != UserRole.SUPPORT_AGENT) {
                throw new TicketException("Only support agents can view assigned tickets");
            }
            return ticketRepository.findByAssignedAgent(agent);
        } catch (TicketException e) {
            throw e;
        } catch (Exception e) {
            throw new TicketException("Failed to get assigned tickets: " + e.getMessage());
        }
    }

    @Override
    public List<Ticket> getAllTickets(User user) {
        try {
            // Only admins and support agents can see all tickets
            if (user.getRole() == UserRole.USER) {
                throw new TicketException("Regular users cannot view all tickets");
            }
            return ticketRepository.findAll();
        } catch (TicketException e) {
            throw e;
        } catch (Exception e) {
            throw new TicketException("Failed to get all tickets: " + e.getMessage());
        }
    }

    @Override
    public List<Ticket> getTicketsByStatus(String status) {
        try {
            TicketStatus ticketStatus = TicketStatus.valueOf(status.toUpperCase());
            return ticketRepository.findByStatus(ticketStatus);
        } catch (IllegalArgumentException e) {
            throw new TicketException("Invalid status: " + status);
        } catch (Exception e) {
            throw new TicketException("Failed to get tickets by status: " + e.getMessage());
        }
    }

    // Helper method to check edit permissions
    private boolean hasEditPermission(Ticket ticket, User user) {
        return user.getRole() == UserRole.ADMIN
                || ticket.getCreatedBy().getId().equals(user.getId())
                || (user.getRole() == UserRole.SUPPORT_AGENT
                && ticket.getAssignedAgent() != null
                && ticket.getAssignedAgent().getId().equals(user.getId()));
    }

    // Helper method to check status update permissions
    private boolean hasStatusUpdatePermission(Ticket ticket, User user, TicketStatus newStatus) {
        // Admins can do anything
        if (user.getRole() == UserRole.ADMIN) {
            return true;
        }

        // Ticket creator can only close resolved tickets
        if (ticket.getCreatedBy().getId().equals(user.getId())) {
            return newStatus == TicketStatus.CLOSED && ticket.getStatus() == TicketStatus.RESOLVED;
        }

        // Assigned agent can update status for their tickets
        if (user.getRole() == UserRole.SUPPORT_AGENT
                && ticket.getAssignedAgent() != null
                && ticket.getAssignedAgent().getId().equals(user.getId())) {
            return true;
        }

        return false;
    }

    // Helper method to validate status transitions
    private void validateStatusTransition(TicketStatus currentStatus, TicketStatus newStatus, User user) {
        // Admins can make any transitions
        if (user.getRole() == UserRole.ADMIN) {
            return;
        }

        // Regular users can only close resolved tickets
        if (user.getRole() == UserRole.USER) {
            if (!(currentStatus == TicketStatus.RESOLVED && newStatus == TicketStatus.CLOSED)) {
                throw new TicketException("Users can only close resolved tickets");
            }
            return;
        }

        // Support agents have specific allowed transitions
        if (user.getRole() == UserRole.SUPPORT_AGENT) {
            switch (currentStatus) {
                case OPEN:
                    if (newStatus != TicketStatus.IN_PROGRESS) {
                        throw new TicketException("Can only move from OPEN to IN_PROGRESS");
                    }
                    break;
                case IN_PROGRESS:
                    if (newStatus != TicketStatus.RESOLVED) {
                        throw new TicketException("Can only move from IN_PROGRESS to RESOLVED");
                    }
                    break;
                case RESOLVED:
                    throw new TicketException("Cannot modify RESOLVED tickets");
                case CLOSED:
                    throw new TicketException("Cannot modify CLOSED tickets");
            }
        }
    }

    // Additional helper methods for statistics
    public long getTicketCountByStatus(TicketStatus status) {
        return ticketRepository.countByStatus(status);
    }

    public long getAssignedTicketCountByStatus(User agent, TicketStatus status) {
        return ticketRepository.countByAssignedAgentAndStatus(agent, status);
    }

    public List<Ticket> getAccessibleTickets(User user) {
        if (user.getRole() == UserRole.ADMIN) {
            return ticketRepository.findAll();
        } else if (user.getRole() == UserRole.SUPPORT_AGENT) {
            return ticketRepository.findAccessibleTickets(user, user);
        } else {
            return ticketRepository.findByCreatedBy(user);
        }
    }

    @Override
    public Ticket getTicketById(Long ticketId) {
        try {
            Optional<Ticket> ticket = ticketRepository.findByIdWithComments(ticketId);
            if (ticket.isEmpty()) {
                throw new TicketException("Ticket not found with id: " + ticketId);
            }
            return ticket.get();
        } catch (TicketException e) {
            throw e;
        } catch (Exception e) {
            throw new TicketException("Failed to get ticket: " + e.getMessage());
        }
    }

    @Override
    public Ticket addCommentToTicket(Long ticketId, String content, User user) {
        try {
            Optional<Ticket> optionalTicket = ticketRepository.findById(ticketId);
            if (optionalTicket.isEmpty()) {
                throw new TicketException("Ticket not found with id: " + ticketId);
            }

            Ticket ticket = optionalTicket.get();

            // Check if user has permission to comment
            if (!hasCommentPermission(ticket, user)) {
                throw new TicketException("You don't have permission to comment on this ticket");
            }

            // Create and save comment
            Comment comment = new Comment();
            comment.setContent(content);
            comment.setUser(user);
            comment.setTicket(ticket);

            ticket.getComments().add(comment);
            ticket.setUpdatedAt(LocalDateTime.now());

            return ticketRepository.save(ticket);

        } catch (TicketException e) {
            throw e;
        } catch (Exception e) {
            throw new TicketException("Failed to add comment: " + e.getMessage());
        }
    }

    @Override
    public List<Comment> getTicketComments(Long ticketId, User user) {
        try {
            Optional<Ticket> optionalTicket = ticketRepository.findById(ticketId);
            if (optionalTicket.isEmpty()) {
                throw new TicketException("Ticket not found with id: " + ticketId);
            }

            Ticket ticket = optionalTicket.get();

            // Check if user has permission to view comments
            if (!hasViewPermission(ticket, user)) {
                throw new TicketException("You don't have permission to view comments for this ticket");
            }

            return commentRepository.findByTicketIdWithUser(ticketId);

        } catch (TicketException e) {
            throw e;
        } catch (Exception e) {
            throw new TicketException("Failed to get comments: " + e.getMessage());
        }
    }

// Helper method for comment permission
    private boolean hasCommentPermission(Ticket ticket, User user) {
        if (user.getRole() == UserRole.ADMIN) {
            return true;
        }
        if (user.getRole() == UserRole.SUPPORT_AGENT) {
            return ticket.getAssignedAgent() != null
                    && ticket.getAssignedAgent().getId().equals(user.getId());
        }
        return ticket.getCreatedBy().getId().equals(user.getId());
    }

// Helper method for view permission
    private boolean hasViewPermission(Ticket ticket, User user) {
        if (user.getRole() == UserRole.ADMIN) {
            return true;
        }
        if (user.getRole() == UserRole.SUPPORT_AGENT) {
            return ticket.getAssignedAgent() != null
                    && ticket.getAssignedAgent().getId().equals(user.getId());
        }
        return ticket.getCreatedBy().getId().equals(user.getId());
    }
}
