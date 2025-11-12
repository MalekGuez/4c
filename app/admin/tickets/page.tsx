'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { adminService, managerService } from '@/app/services/api';
import styles from './tickets.module.css';

export default function AdminTicketsPage() {
  const router = useRouter();
  const [tickets, setTickets] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [managerName, setManagerName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [escalating, setEscalating] = useState(false);
  const [selectedAuthorityLevel, setSelectedAuthorityLevel] = useState<number>(0);
  const [manager, setManager] = useState<any>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [filterAuthority, setFilterAuthority] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchId, setSearchId] = useState<string>('');
  const [deletingMessage, setDeletingMessage] = useState<number | null>(null);
  const [closingTicket, setClosingTicket] = useState(false);

  // Grade definitions and permissions (bAuthority values: 5=TGM, 4=GM, 3=SGM, 2=GA, 1=COMA)
  const GRADE_PERMISSIONS = {
    5: { // TGM
      name: 'TGM',
      color: '#4CAF50',
      canViewPlayers: false,
      canBan: false,
      maxBanDuration: 0,
      canViewBanHistory: false,
      canUnban: false,
      canAccessTickets: true,
      canEscalate: false,
      canCloseTickets: false
    },
    4: { // GM
      name: 'GM',
      color: '#FF9800',
      canViewPlayers: true,
      canBan: true,
      maxBanDuration: 30 * 24, // 30 days in hours
      canViewBanHistory: true,
      canUnban: false,
      canAccessTickets: true,
      canEscalate: false,
      canCloseTickets: true
    },
    3: { // SGM
      name: 'SGM',
      color: '#F44336',
      canViewPlayers: true,
      canBan: true,
      maxBanDuration: Infinity, // Permanent bans allowed
      canViewBanHistory: true,
      canUnban: true,
      canAccessTickets: true,
      canEscalate: true,
      canCloseTickets: true
    },
    2: { // GA
      name: 'GA',
      color: '#9C27B0',
      canViewPlayers: true,
      canBan: true,
      maxBanDuration: Infinity,
      canViewBanHistory: true,
      canUnban: true,
      canAccessTickets: true,
      canEscalate: false,
      canCloseTickets: true
    },
    1: { // COMA
      name: 'COMA',
      color: '#FF0000',
      canViewPlayers: true,
      canBan: true,
      maxBanDuration: Infinity,
      canViewBanHistory: true,
      canUnban: true,
      canAccessTickets: true,
      canEscalate: true,
      canCloseTickets: true
    }
  };

  const getGradeInfo = () => {
    if (!manager) return null;
    return GRADE_PERMISSIONS[manager.bAuthority as keyof typeof GRADE_PERMISSIONS] || null;
  };

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    const adminManager = localStorage.getItem('adminManager');
    
    if (!adminToken || !adminManager) {
      router.push('/admin/login');
      return;
    }

    try {
      const parsedManager = JSON.parse(adminManager);
      setManager(parsedManager);

      if (![1, 2, 3].includes(Number(parsedManager.bAuthority))) {
        setFilterStatus((prev) => (prev === 'closed' ? 'all' : prev));
      }
      
      // Check if user has access to tickets
      const gradeInfo = GRADE_PERMISSIONS[parsedManager.bAuthority as keyof typeof GRADE_PERMISSIONS];
      if (!gradeInfo?.canAccessTickets) {
        router.push('/admin/dashboard');
        return;
      }
    } catch (error) {
      router.push('/admin/login');
      return;
    }

    loadTickets();
  }, [router]);

  useEffect(() => {
    if (selectedTicket?.operatedBy) {
      loadManagerName(selectedTicket.operatedBy);
    }
  }, [selectedTicket]);

  useEffect(() => {
    if (!manager) return;

    if (![1, 2, 3].includes(Number(manager.bAuthority)) && filterStatus === 'closed') {
      setFilterStatus('all');
    }
  }, [manager, filterStatus]);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllTickets();
      
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

  const loadManagerName = async (managerId: string) => {
    try {
      const response = await managerService.getManagerName(managerId);
      if (response.success && response.name) {
        setManagerName(response.name);
      }
    } catch (err) {
      console.error('Failed to load manager name:', err);
    }
  };

  const loadTicketDetails = async (ticketId: number) => {
    try {
      const response = await adminService.getTicket(ticketId);
      if (response.success && response.ticket) {
        setSelectedTicket(response.ticket);
        
        if (response.ticket.operatedBy) {
          await loadManagerName(response.ticket.operatedBy);
        } else {
          setManagerName('');
        }
      } else {
        setError(response.error || 'Failed to load ticket details');
      }
    } catch (err) {
      setError('Failed to load ticket details');
    }
  };

  const getMessageTemplate = () => {
    const adminName = manager?.szName || 'Admin';
    return `Hello,\n\n\n\nBest Regards,\n${adminName}`;
  };

  const handleTicketClick = (ticket: any) => {
    setNewMessage(getMessageTemplate());
    loadTicketDetails(ticket.id);
  };

  const handleTextareaFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    // Positionner le curseur après "Hello,\n\n"
    const template = getMessageTemplate();
    const cursorPosition = template.indexOf('\n\n') + 2;
    e.target.setSelectionRange(cursorPosition, cursorPosition);
  };

  const handleSendMessage = async () => {
    if (!selectedTicket || !newMessage.trim()) return;

    setSendingMessage(true);
    setError(null);
    try {
      const response = await adminService.respondToTicket(selectedTicket.id, newMessage);
      
      if (response.success) {
        setNewMessage('');
        setSuccessMessage('Message sent successfully!');
        
        // Reload ticket details to show the new message
        await loadTicketDetails(selectedTicket.id);
        // Reload tickets list to update statuses
        await loadTickets();
        
        // Clear success message after 3 seconds (but stay on the ticket)
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      } else {
        setError(response.error || 'Failed to send message');
      }
    } catch (err) {
      setError('Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  };

  const handleEscalateTicket = async () => {
    if (!selectedTicket || !selectedAuthorityLevel) return;

    setEscalating(true);
    setError(null);
    try {
      const response = await adminService.escalateTicket(selectedTicket.id, selectedAuthorityLevel);
      
      if (response.success) {
        setSelectedAuthorityLevel(0);
        setSuccessMessage('Ticket escalated successfully!');
      
        await loadTickets();
        
        // Clear success message and redirect after 3 seconds
        setTimeout(() => {
          setSuccessMessage(null);
          setSelectedTicket(null);
        }, 3000);
      } else {
        setError(response.error || 'Failed to escalate ticket');
      }
    } catch (err) {
      setError('Failed to escalate ticket');
    } finally {
      setEscalating(false);
    }
  };

  const handleDeleteMessage = async (messageId: number) => {
    if (!selectedTicket) return;

    setDeletingMessage(messageId);
    setError(null);
    try {
      const response = await adminService.deleteMessage(messageId);
      
      if (response.success) {
        setSuccessMessage('Message deleted successfully!');
        
        await loadTicketDetails(selectedTicket.id);
        await loadTickets();
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      } else {
        setError(response.error || 'Failed to delete message');
      }
    } catch (err) {
      setError('Failed to delete message');
    } finally {
      setDeletingMessage(null);
    }
  };

  const handleCloseTicket = async () => {
    if (!selectedTicket) return;

    if (!confirm('Are you sure you want to close this ticket?')) {
      return;
    }

    setClosingTicket(true);
    setError(null);
    try {
      const response = await adminService.closeTicket(selectedTicket.id);
      
      if (response.success) {
        setSuccessMessage('Ticket closed successfully!');
        
        await loadTickets();
        
        // Clear success message and go back to list after 2 seconds
        setTimeout(() => {
          setSuccessMessage(null);
          setSelectedTicket(null);
        }, 2000);
      } else {
        setError(response.error || 'Failed to close ticket');
      }
    } catch (err) {
      setError('Failed to close ticket');
    } finally {
      setClosingTicket(false);
    }
  };

  const canDeleteMessage = (message: any) => {
    if (!message.isStaff || !manager) return false;
    
    // Check if it's the same user (always can delete own messages)
    if (String(message.userId) === String(manager.szID)) {
      return true;
    }
    
    // For different users, check authority levels
    // Higher authority = lower number (1 = COMA, 5 = TGM)
    // We can only delete messages from users with lower authority (higher number)
    if (message.senderAuthority && manager.bAuthority) {
      return manager.bAuthority < message.senderAuthority;
    }
    
    // If we don't have authority info, don't show the button
    return false;
  };

  const getAuthorityOptions = () => {
    if (!manager) return [];
    
    const authorityLevels = [
      { value: 1, label: 'COMA (1)' },
      { value: 2, label: 'GA (2)' },
      { value: 3, label: 'SGM (3)' },
      { value: 4, label: 'GM (4)' },
      { value: 5, label: 'TGM (5)' }
    ];
    
    // Filter out current authority level and higher levels
    return authorityLevels.filter(level => level.value < manager.bAuthority);
  };

  const getAuthorityLabel = (state: number) => {
    const labels = {
      1: 'COMA',
      2: 'GA', 
      3: 'SGM',
      4: 'GM',
      5: 'TGM'
    };
    return labels[state as keyof typeof labels] || 'Unassigned';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'opened': return '#4CAF50'; // Green
      case 'open': return '#4CAF50'; // Green
      case 'closed': return '#F44336'; // Red
      case 'pending': return '#FF9800'; // Orange
      default: return '#BDBDBD'; // Gray
    }
  };

  const getDisplayStatus = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'opened': return 'Opened';
      case 'closed': return 'Closed';
      case 'pending': return 'Pending';
      default:
        return status?.charAt(0).toUpperCase() + status?.slice(1) || 'Unknown';
    }
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

  const getAuthorityColor = (authority: number) => {
    switch (authority) {
      case 1: return '#FF0000'; // Red - COMA (Most Important)
      case 2: return '#FF6B35'; // Orange-Red - GA
      case 3: return '#FFD700'; // Gold - SGM
      case 4: return '#32CD32'; // Lime Green - GM
      case 5: return '#00BFFF'; // Deep Sky Blue - TGM
      default: return '#BDBDBD'; // Gray
    }
  };

  const canViewClosedTickets = manager ? [1, 2, 3].includes(Number(manager.bAuthority)) : false;

  const filteredTickets = tickets.filter(ticket => {
    if (!canViewClosedTickets && ticket.status?.toLowerCase() === 'closed') {
      return false;
    }

    // Search by ID
    if (searchId.trim()) {
      if (!ticket.id.toString().includes(searchId.trim())) {
        return false;
      }
    }

    // Filter by authority level
    if (filterAuthority !== 'all') {
      const targetAuthority = parseInt(filterAuthority);
      if (ticket.state !== targetAuthority && ticket.state !== null) {
        return false;
      }
    }

    // Filter by status
    if (filterStatus !== 'all') {
      let ticketStatus = ticket.status;
      
      // Map complex statuses to simplified ones
      if (ticket.status === 'waiting' || ticket.status === 'waiting for answer') {
        ticketStatus = 'pending';
      }
      
      if (ticketStatus !== filterStatus) {
        // For closed tickets, only show if last message is older than 7 days
        if (ticket.status === 'closed') {
          const lastMessageDate = new Date(ticket.lastMessageDate || ticket.createdAt);
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
          
          if (lastMessageDate > sevenDaysAgo) {
            return false;
          }
        } else {
          return false;
        }
      }
    }

    return true;
  });

  if (loading) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      {/* Header Bar */}
      <div className={styles.headerBar}>
        <Image
          src="/images/titles/Tickets.png"
          alt="Admin Tickets"
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
        {/* Grade Info */}
        {manager && (
          <div style={{ 
            marginBottom: '20px', 
            padding: '10px', 
            backgroundColor: 'rgba(0,0,0,0.8)', 
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <span style={{ color: '#999', fontSize: '14px' }}>Logged in as:</span>
              <span style={{ 
                color: getGradeInfo()?.color || '#999', 
                fontSize: '16px', 
                fontWeight: 'bold', 
                marginLeft: '8px' 
              }}>
                {getGradeInfo()?.name || 'Unknown'}
              </span>
              <span style={{ color: '#999', fontSize: '14px', marginLeft: '8px' }}>
                ({manager.szName})
              </span>
            </div>
            <div style={{ fontSize: '14px', color: '#999' }}>
              {getGradeInfo()?.canEscalate ? 'Can escalate tickets' : 'Cannot escalate tickets'}
              {getGradeInfo()?.canCloseTickets ? ' • Can close tickets' : ' • Cannot close tickets'}
            </div>
          </div>
        )}

        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        {successMessage && (
          <div className={styles.successMessage}>
            {successMessage}
          </div>
        )}

        {!selectedTicket ? (
          <div className={styles.ticketsList}>
            <div className={styles.ticketsHeader}>
              <h3>All Tickets ({filteredTickets.length})</h3>
              
              <div className={styles.headerRight}>
                {/* Search by ID */}
                <div className={styles.searchContainer}>
                  <label className={styles.searchLabel}>Search by ID</label>
                  <input
                    type="text"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    placeholder="Enter ticket ID..."
                    className={styles.searchInput}
                  />
                </div>
                
                {/* Filters */}
                <div className={styles.filtersContainer}>
                <div className={styles.filterGroup}>
                  <label>Authority Level:</label>
                  <select 
                    value={filterAuthority} 
                    onChange={(e) => setFilterAuthority(e.target.value)}
                    className={styles.filterSelect}
                  >
                    <option value="all">All Levels</option>
                    <option value="1">COMA</option>
                    <option value="2">GA</option>
                    <option value="3">SGM</option>
                    <option value="4">GM</option>
                    <option value="5">TGM</option>
                  </select>
                </div>
                
                <div className={styles.filterGroup}>
                  <label>Status:</label>
                  <select 
                    value={filterStatus} 
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className={styles.filterSelect}
                  >
                    <option value="all">All Status</option>
                    <option value="opened">Opened</option>
                    {canViewClosedTickets && (
                      <option value="closed">Closed</option>
                    )}
                  </select>
                </div>
                </div>
              </div>
            </div>
            
            {filteredTickets.length === 0 ? (
              <div className={styles.noTickets}>
                No tickets found
              </div>
            ) : (
              <div className={styles.ticketsGrid}>
                {filteredTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className={styles.ticketCard}
                    onClick={() => handleTicketClick(ticket)}
                  >
                    <div className={styles.ticketHeader}>
                      <div className={styles.ticketHeaderLeft}>
                        <div className={styles.ticketCategoryHeader}>
                          <div className={styles.ticketIdTag}>
                            #{ticket.id}
                          </div>
                          <span className={styles.categoryLabel}>
                            {ticket.category?.toUpperCase()}
                          </span>
                        </div>
                        <h4 className={styles.ticketTitle}>{ticket.title}</h4>
                      </div>
                      <div className={styles.ticketMeta}>
                        <span 
                          className={styles.ticketStatus}
                          style={{ color: getStatusColor(ticket.status) }}
                        >
                          {getDisplayStatus(ticket.status)}
                        </span>
                        <span 
                          className={styles.ticketAuthority}
                          style={{ color: getAuthorityColor(ticket.state || 0) }}
                        >
                          {getAuthorityName(ticket.state || 0)}
                        </span>
                      </div>
                    </div>
                    <div className={styles.ticketDescription}>
                      {ticket.description?.substring(0, 100)}...
                    </div>
                    <div className={styles.ticketFooter}>
                      <span className={styles.ticketDate}>
                        {formatDate(ticket.createdAt)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className={styles.ticketDetails}>
            <div className={styles.ticketDetailsHeader}>
              <button
                onClick={() => setSelectedTicket(null)}
                className={styles.backButton}
              >
                Back to List
              </button>
              <div className={styles.ticketDetailsRight}>
                <span 
                  className={styles.ticketStatus}
                  style={{ color: getStatusColor(selectedTicket.status) }}
                >
                  {getDisplayStatus(selectedTicket.status)}
                </span>
                {selectedTicket.state && (
                  <div className={styles.operatedBy}>
                    Operated by: {getAuthorityFullName(selectedTicket.state)}
                  </div>
                )}
              </div>
            </div>

            <div className={styles.ticketInfo}>
            <div className={styles.ticketInfoHeader}>
              <div className={styles.ticketIdTag}>
                TICKET ID: {selectedTicket.id}
              </div>
              <div className={styles.ticketCategoryHeader}>
                <span className={styles.categoryLabel}>
                  {selectedTicket.category?.toUpperCase()}
                </span>
              </div>
              <h2>{selectedTicket.title}</h2>
            </div>
            </div>

            <div className={styles.messagesContainer}>
              {selectedTicket.messages && selectedTicket.messages.length > 0 ? (
                <div className={styles.messagesList}>
                  {selectedTicket.messages.map((message: any, index: number) => (
                    <div key={index} className={styles.messageItem}>
                      <div className={styles.messageHeader}>
                        <span className={styles.messageUser}>
                          {message.isStaff 
                            ? (message.szUserID || 'Staff Member')
                            : (message.szEmail || message.szUserID || 'Unknown User')
                          }
                        </span>
                        {canDeleteMessage(message) && (
                          <button
                            onClick={() => handleDeleteMessage(message.id)}
                            disabled={deletingMessage === message.id}
                            className={styles.deleteMessageButton}
                            title="Delete message"
                          >
                            {deletingMessage === message.id ? (
                              <div className={styles.loadingSpinner}></div>
                            ) : (
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            )}
                          </button>
                        )}
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
                <div className={styles.noMessages}>
                  No messages yet
                </div>
              )}

              {/* Escalation Section */}
              {manager && getAuthorityOptions().length > 0 && (
                <div className={styles.escalationSection}>
                  <h4>Escalate Ticket</h4>
                  <div className={styles.escalationForm}>
                    <select
                      value={selectedAuthorityLevel}
                      onChange={(e) => setSelectedAuthorityLevel(parseInt(e.target.value))}
                      className={styles.authoritySelect}
                    >
                      <option value={0}>Select authority level...</option>
                      {getAuthorityOptions().map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handleEscalateTicket}
                      disabled={!selectedAuthorityLevel || escalating}
                      className={styles.escalateButton}
                    >
                      {escalating ? 'Escalating...' : 'Escalate Ticket'}
                    </button>
                  </div>
                </div>
              )}

              <div className={styles.addMessageForm}>
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onFocus={handleTextareaFocus}
                  placeholder="Type your response..."
                  className={styles.messageTextarea}
                />
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'space-between' }}>
                  {selectedTicket.status !== 'closed' && getGradeInfo()?.canCloseTickets && (
                    <button
                      onClick={handleCloseTicket}
                      disabled={closingTicket}
                      className={styles.sendButton}
                      style={{
                        backgroundColor: '#F44336'
                      }}
                    >
                      {closingTicket ? 'Closing...' : 'Close Ticket'}
                    </button>
                  )}
                  {selectedTicket.status !== 'closed' && !getGradeInfo()?.canCloseTickets && (
                    <div style={{ 
                      padding: '10px', 
                      backgroundColor: '#2a2a2a', 
                      borderRadius: '4px',
                      color: '#999',
                      fontSize: '14px'
                    }}>
                      Your grade ({getGradeInfo()?.name}) cannot close tickets
                    </div>
                  )}
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || sendingMessage}
                    className={styles.sendButton}
                    style={{
                      marginLeft: 'auto'
                    }}
                  >
                    {sendingMessage ? 'Sending...' : 'Send Response'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
