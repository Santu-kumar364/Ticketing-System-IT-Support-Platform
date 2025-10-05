import { configureStore } from '@reduxjs/toolkit';
import { ticketReducer } from './Ticket/ticket.reducer';
import { authReducer } from './Auth/auth.reducer';
 

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ticket: ticketReducer,
  },
});