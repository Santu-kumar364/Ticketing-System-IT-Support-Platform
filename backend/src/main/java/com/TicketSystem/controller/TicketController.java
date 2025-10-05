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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.TicketSystem.model.Ticket;
import com.TicketSystem.model.TicketStatus;
import com.TicketSystem.model.User;
import com.TicketSystem.service.TicketService;
import com.TicketSystem.service.UserService;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "http://localhost:5173")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<?> createTicket(@RequestBody Ticket ticket,
            @RequestHeader("Authorization") String jwt) {
        try {
            Optional<User> user = userService.findUserByJwt(jwt);
            if (user.isEmpty()) {
                return ResponseEntity.badRequest().body("User not found");
            }
            Ticket createdTicket = ticketService.createTicket(ticket, user.get());
            return ResponseEntity.ok(createdTicket);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/my-tickets")
    public ResponseEntity<?> getUserTickets(@RequestHeader("Authorization") String jwt) {
        try {
            Optional<User> user = userService.findUserByJwt(jwt);
            if (user.isEmpty()) {
                return ResponseEntity.badRequest().body("User not found");
            }
            List<Ticket> tickets = ticketService.getUserTickets(user.get());
            return ResponseEntity.ok(tickets);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/assigned")
    public ResponseEntity<?> getAssignedTickets(@RequestHeader("Authorization") String jwt) {
        try {
            Optional<User> user = userService.findUserByJwt(jwt);
            if (user.isEmpty()) {
                return ResponseEntity.badRequest().body("User not found");
            }

            // This should return only tickets assigned to the current user
            List<Ticket> tickets = ticketService.getAssignedTickets(user.get());

            System.out.println("Assigned tickets for user " + user.get().getEmail() + ": " + tickets.size()); // Debug

            return ResponseEntity.ok(tickets);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllTickets(@RequestHeader("Authorization") String jwt) {
        try {
            Optional<User> user = userService.findUserByJwt(jwt);
            if (user.isEmpty()) {
                return ResponseEntity.badRequest().body("User not found");
            }
            List<Ticket> tickets = ticketService.getAllTickets(user.get());
            return ResponseEntity.ok(tickets);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{ticketId}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long ticketId,
            @RequestBody TicketStatus status,
            @RequestHeader("Authorization") String jwt) {
        try {
            Optional<User> user = userService.findUserByJwt(jwt);
            if (user.isEmpty()) {
                return ResponseEntity.badRequest().body("User not found");
            }
            Ticket ticket = ticketService.updateStatus(ticketId, status, user.get());
            return ResponseEntity.ok(ticket);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{ticketId}/assign/{agentId}")
    public ResponseEntity<?> assignTicket(@PathVariable Long ticketId,
            @PathVariable Long agentId,
            @RequestHeader("Authorization") String jwt) {
        try {
            Optional<User> admin = userService.findUserByJwt(jwt);
            if (admin.isEmpty()) {
                return ResponseEntity.badRequest().body("User not found");
            }
            Ticket ticket = ticketService.assignTicket(ticketId, agentId, admin.get());
            return ResponseEntity.ok(ticket);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{ticketId}")
    public ResponseEntity<?> deleteTicket(@PathVariable Long ticketId,
            @RequestHeader("Authorization") String jwt) {
        try {
            Optional<User> user = userService.findUserByJwt(jwt);
            if (user.isEmpty()) {
                return ResponseEntity.badRequest().body("User not found");
            }
            ticketService.deleteTicket(ticketId, user.get());
            return ResponseEntity.ok("Ticket deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
