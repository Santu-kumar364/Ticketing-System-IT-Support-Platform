package com.TicketSystem.service;

import java.util.List;

import com.TicketSystem.model.Ticket;
import com.TicketSystem.model.TicketStatus;
import com.TicketSystem.model.User;

public interface TicketService {
    Ticket createTicket(Ticket ticket, User createdBy);
    Ticket updateTicket(Long ticketId, Ticket ticket, User user);
    Ticket assignTicket(Long ticketId, Long agentId, User admin);
    Ticket updateStatus(Long ticketId, TicketStatus status, User user);
    void deleteTicket(Long ticketId, User user);
    Ticket getTicketById(Long ticketId);
    List<Ticket> getUserTickets(User user);
    List<Ticket> getAssignedTickets(User agent);
    List<Ticket> getAllTickets(User user);
    List<Ticket> getTicketsByStatus(String status);
}