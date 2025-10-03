'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuthContext } from '@/app/contexts/AuthContext';
import { ticketService, managerService, Ticket, CreateTicketRequest } from '@/app/services/api';
import AuthGuard from '../components/AuthGuard';
import styles from './tickets.module.css';

const TICKET_CATEGORIES = [
  'Report',
  'Technical Problem',
  'Payment problem',
  'Cash-Shop Problem',
  'Account related problem',
  'Item Recovery',
  'Ban Complaint',
  'GM complaint',
  'Team Application',
  'No specific subject'
];

export default function TicketsPage() {
  const { user, isAuthenticated } = useAuthContext();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [managerName, setManagerName] = useState<string | null>(null);

  // Create ticket form state
  const [createForm, setCreateForm] = useState<CreateTicketRequest>({
    title: '',
    description: '',
    category: 'Report'
  });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadTickets();
    }
  }, [isAuthenticated]);

  // Reset manager name when selectedTicket changes
  useEffect(() => {
    if (!selectedTicket) {
      setManagerName(null);
    }
  }, [selectedTicket]);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const response = await ticketService.getTickets();
      
      if (response.success && response.tickets) {
        setTickets(response.tickets);
      } else {
        setError(response.error || 'Failed to load tickets');
      }
    } catch (err) {
      setError('An error occurred while loading tickets');
    } finally {
      setLoading(false);
    }
  };

  const loadTicketDetails = async (ticketId: number) => {
    try {
      const response = await ticketService.getTicket(ticketId);
      
      if (response.success && response.ticket) {
        setSelectedTicket(response.ticket);
        
        // Load manager name if operatedBy exists
        if (response.ticket.operatedBy) {
          try {
            // If the ticket is a staff message, fetch the user's szName using operatedBy (userId)
            if (response.ticket.operatedBy) {
              const userResponse = await managerService.getManagerName(response.ticket.operatedBy.toString());
              if (userResponse.success && userResponse.name) {
                console.log(userResponse.name);
                setManagerName(userResponse.name);
              } else {
                setManagerName(null);
              }
            } else {
              setManagerName(null);
            }
          } catch (err) {
            setManagerName(null);
          }
        } else {
          setManagerName(null);
        }
      } else {
        setError(response.error || 'Failed to load ticket details');
      }
    } catch (err) {
      setError('An error occurred while loading ticket details');
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!createForm.title.trim() || !createForm.description.trim()) {
      setError('Title and description are required');
      return;
    }

    try {
      setCreating(true);
      setError(null);
      
      const response = await ticketService.createTicket(createForm);
      
      if (response.success) {
        setCreateForm({ title: '', description: '', category: 'Report' });
        setShowCreateForm(false);
        await loadTickets(); // Reload tickets
      } else {
        setError(response.error || 'Failed to create ticket');
      }
    } catch (err) {
      setError('An error occurred while creating ticket');
    } finally {
      setCreating(false);
    }
  };

  const handleAddMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !selectedTicket) {
      return;
    }

    try {
      const response = await ticketService.addMessage(selectedTicket.id, {
        message: newMessage.trim()
      });
      
      if (response.success) {
        setNewMessage('');
        // Reload ticket details to show the new message
        await loadTicketDetails(selectedTicket.id);
        // Reload tickets list to update statuses
        await loadTickets();
      } else {
        setError(response.error || 'Failed to add message');
      }
    } catch (err) {
      setError('An error occurred while adding message');
    }
  };


  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getAuthorityName = (authority: number) => {
    switch (authority) {
      case 1: return 'COMA';
      case 2: return 'GA';
      case 3: return 'SGM';
      case 4: return 'GM';
      case 5: return 'TGM';
      default: return 'Unknown';
    }
  };

  const getAuthorityFullName = (authority: number) => {
    switch (authority) {
      case 1: return 'Community Manager';
      case 2: return 'Game Administrator';
      case 3: return 'Super Game Master';
      case 4: return 'Game Master';
      case 5: return 'Team Game Master';
      default: return 'Unknown';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'opened' ? '#4CAF50' : '#F44336';
  };

  const canUserSendMessage = (ticket: any) => {
    if (!ticket || !ticket.messages) return false;
    
    // Si pas de messages, on peut envoyer le premier
    if (ticket.messages.length === 0) return true;
    
    // Compter les messages de l'utilisateur actuel (non-staff)
    const currentUserMessages = ticket.messages.filter((msg: any) => 
      msg.userId === parseInt(user?.id || '0') && !msg.isStaff
    );
    
    // Si l'utilisateur n'a jamais envoyé de message, il peut en envoyer un
    if (currentUserMessages.length === 0) return true;
    
    // Trouver le dernier message de l'utilisateur
    const lastUserMessage = currentUserMessages[currentUserMessages.length - 1];
    
    // Vérifier s'il y a eu une réponse du staff après le dernier message utilisateur
    const hasStaffResponseAfterLastUserMessage = ticket.messages.some((msg: any) => 
      msg.isStaff && new Date(msg.date) > new Date(lastUserMessage.date)
    );
    
    return hasStaffResponseAfterLastUserMessage;
  };

  return (
    <AuthGuard>
      <div className={styles.pageContainer}>
      {/* Header Bar - Outside the content wrapper */}
      <div className={styles.headerBar}>
          <Image
            src="/images/titles/Tickets.png"
            alt="Tickets"
            width={238}
            height={61}
            className={styles.titleImage}
          />
        <div className={styles.bar}>
          <Image
            src="/images/titles/Bar.png"
            alt="Bar"
            width={500}
            height={50}
            className={styles.barImage}
            priority
            style={{ width: '100%', height: 'auto' }}
          />
        </div>
      </div>

      <div className={styles.contentWrapper}>
        {/* Error Message */}
        {error && (
          <div className={styles.errorMessage}>
            {error}
            <button onClick={() => setError(null)} className={styles.closeError}>
              ×
            </button>
          </div>
        )}

        {/* Action Button */}
        <div className={styles.actions}>
          {selectedTicket && !showCreateForm && (
            <button 
              onClick={() => setSelectedTicket(null)}
              className={styles.createButton}
            >
              Back to List
            </button>
          )}
          {!selectedTicket && !showCreateForm && (
            <button 
              onClick={() => setShowCreateForm(true)}
              className={styles.createButton}
            >
              Create New Ticket
            </button>
          )}
          {showCreateForm && (
            <button 
              onClick={() => setShowCreateForm(false)}
              className={styles.createButton}
            >
              Cancel
            </button>
          )}
        </div>

        {/* Create Ticket Form */}
        {showCreateForm && (
          <div className={styles.createForm}>
            <h3>Create New Ticket</h3>
            <form onSubmit={handleCreateTicket}>
              <div className={styles.formGroup}>
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  value={createForm.category}
                  onChange={(e) => setCreateForm({ ...createForm, category: e.target.value })}
                >
                  {TICKET_CATEGORIES.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="title">Title *</label>
                <input
                  type="text"
                  id="title"
                  value={createForm.title}
                  onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                  placeholder="Brief description of your issue"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  placeholder="Please provide detailed information about your issue..."
                  rows={6}
                  required
                />
              </div>

              <div className={styles.formActions}>
                <button type="submit" disabled={creating} className={styles.submitButton}>
                  {creating ? 'Creating...' : 'Create Ticket'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowCreateForm(false)}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tickets List - Hidden when viewing ticket details */}
        {!selectedTicket && (
          <div className={styles.ticketsContainer}>
            <h3>Your Tickets ({tickets.length})</h3>
            
            {loading ? (
              <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}></div>
                <p className={styles.loadingText}>Loading tickets...</p>
              </div>
            ) : tickets.length === 0 ? (
              <div className={styles.noTickets}>
                <p>You don't have any tickets yet.</p>
                <p>Create your first ticket to get help with any issues!</p>
              </div>
            ) : (
              <div className={styles.ticketsList}>
                {tickets.map((ticket) => (
                  <div 
                    key={ticket.id} 
                    className={styles.ticketItem}
                    onClick={() => loadTicketDetails(ticket.id)}
                  >
                    <div className={styles.ticketHeader}>
                      <div className={styles.ticketHeaderLeft}>
                        <div className={styles.ticketCategoryHeader}>
                          <span className={styles.categoryLabel}>{ticket.category}</span>
                        </div>
                        <h4 className={styles.ticketTitle}>{ticket.title}</h4>
                      </div>
                      <div className={styles.ticketMeta}>
                        <span 
                          className={styles.ticketStatus}
                          style={{ color: getStatusColor(ticket.status) }}
                        >
                          {ticket.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Ticket Details */}
        {selectedTicket && (
          <div className={styles.ticketDetails}>
            <div className={styles.ticketDetailsHeader}>
              <div className={styles.ticketDetailsLeft}>
                <div className={styles.ticketCategoryHeader}>
                  <span className={styles.categoryLabel}>{selectedTicket.category}</span>
                </div>
                <h3>{selectedTicket.title}</h3>
              </div>
              <div className={styles.ticketDetailsRight}>
                <span 
                  className={styles.ticketStatus}
                  style={{ color: getStatusColor(selectedTicket.status) }}
                >
                  {selectedTicket.status.toUpperCase()}
                </span>
                {selectedTicket.state && (
                  <p className={styles.operatedBy}><strong>Operated by:</strong> {getAuthorityFullName(selectedTicket.state)}</p>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className={styles.messagesContainer}>
              {selectedTicket.messages && selectedTicket.messages.length > 0 ? (
                <div className={styles.messagesList}>
                  {selectedTicket.messages.map((message) => (
                    <div key={message.id} className={styles.messageItem}>
                      <div className={styles.messageHeader}>
                        <span className={styles.messageUser}>
                          {message.isStaff ? (managerName || 'Staff Member') : (message.userId === parseInt(user?.id || '0') ? 'You' : message.szUserID || `User ${message.userId}`)}
                        </span>
                      </div>
                      <div className={styles.messageContent}>
                        {message.message}
                      </div>
                      <div className={styles.messageDateContainer}>
                        <span className={styles.messageDate}>
                          {formatDate(message.date)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={styles.noMessages}>No messages yet.</p>
              )}

              {/* Add Message Form */}
              {selectedTicket.status === 'opened' && canUserSendMessage(selectedTicket) && (
                <form onSubmit={handleAddMessage} className={styles.addMessageForm}>
                  <div className={styles.formGroup}>
                    <label htmlFor="newMessage">Your answer:</label>
                    <textarea
                      id="newMessage"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message here..."
                      rows={3}
                    />
                  </div>
                  <button type="submit" className={styles.addMessageButton}>
                    Send Message
                  </button>
                </form>
              )}
              
              {/* Message limit info */}
              {selectedTicket.status === 'opened' && !canUserSendMessage(selectedTicket) && selectedTicket.messages && selectedTicket.messages.length > 0 && (
                <div className={styles.messageLimitInfo}>
                  <p>You can only send one message at a time. Please wait for a staff response before sending another message.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
    </AuthGuard>
  );
}
