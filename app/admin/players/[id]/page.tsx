'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { adminService } from '@/app/services/api';
import styles from '../players.module.css';

export default function PlayerDetailPage() {
  const router = useRouter();
  const params = useParams();
  const playerId = params.id as string;

  const [player, setPlayer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [banForm, setBanForm] = useState({
    bBlockType: 1,
    dwDuration: 0,
    szComment: '',
    szProofs: '',
    isHwidBan: false
  });
  const [banning, setBanning] = useState(false);
  const [hwidSessions, setHwidSessions] = useState<any[]>([]);
  const [selectedHWID, setSelectedHWID] = useState<any>(null);
  const [loadingHWID, setLoadingHWID] = useState(false);
  const [showBanForm, setShowBanForm] = useState(false);

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      router.push('/admin/login');
      return;
    }
    loadPlayerDetails();
  }, [playerId]);

  // Load HWID sessions when HWID ban is enabled
  useEffect(() => {
    if (banForm.isHwidBan && player) {
      loadHWIDSessions();
    } else {
      setHwidSessions([]);
      setSelectedHWID(null);
    }
  }, [banForm.isHwidBan]);

  const loadPlayerDetails = async () => {
    try {
      setLoading(true);
      // TODO: Create API endpoint to get single player details
      // For now, we'll use the players list and filter
      const response = await adminService.getPlayers('', 0, 1000);
      
      if (response.success && response.players) {
        const foundPlayer = response.players.find(p => p.dwCharID === parseInt(playerId));
        if (foundPlayer) {
          setPlayer(foundPlayer);
        } else {
          setError('Player not found');
        }
      } else {
        setError(response.error || 'Failed to load player');
      }
    } catch (err) {
      setError('An error occurred while loading player details');
    } finally {
      setLoading(false);
    }
  };

  const loadHWIDSessions = async () => {
    if (!player) return;
    
    setLoadingHWID(true);
    setError(null);
    
    try {
      const response = await adminService.getHWIDSessions(player.dwUserID);
      
      if (response.success && response.sessions) {
        setHwidSessions(response.sessions);
        if (response.sessions.length > 0) {
          setSelectedHWID(response.sessions[0]);
        }
      } else {
        setError(response.error || 'Failed to load HWID sessions');
      }
    } catch (err) {
      setError('An error occurred while loading HWID sessions');
    } finally {
      setLoadingHWID(false);
    }
  };

  const handleBanPlayer = async () => {
    if (!player) return;
    
    if (!banForm.szComment.trim()) {
      alert('Please provide a reason for the ban');
      return;
    }
    
    if (banForm.isHwidBan && !selectedHWID) {
      alert('Please select a HWID session to ban');
      return;
    }

    setBanning(true);
    setError(null);
    
    try {
      let fullComment = banForm.szComment.trim();
      if (banForm.szProofs.trim()) {
        fullComment += `\n\nProofs:\n${banForm.szProofs.trim()}`;
      }
      
      const response = await adminService.banPlayer(player.dwUserID, {
        bBlockType: banForm.bBlockType,
        dwDuration: banForm.dwDuration,
        szComment: fullComment,
        isHwidBan: banForm.isHwidBan,
        selectedHWID: selectedHWID,
        dwCharID: player.dwCharID,
        szCharName: player.szName
      });
      
      if (response.success) {
        alert(`Player ${player.szName} banned successfully!`);
        setShowBanForm(false);
        setBanForm({
          bBlockType: 1,
          dwDuration: 0,
          szComment: '',
          szProofs: '',
          isHwidBan: false
        });
        setHwidSessions([]);
        setSelectedHWID(null);
      } else {
        setError(response.error || 'Failed to ban player');
      }
    } catch (err) {
      setError('An error occurred while banning player');
    } finally {
      setBanning(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getClassIcon = (classId: number) => {
    const classNames: { [key: number]: string } = {
      0: 'Warrior',
      1: 'Nightwalker',
      2: 'Archer',
      3: 'Magician',
      4: 'Priest',
    };
    return classNames[classId] || 'Unknown';
  };

  if (loading) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading player details...</p>
        </div>
      </div>
    );
  }

  if (!player) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.errorMessage}>
          Player not found
        </div>
        <button onClick={() => router.push('/admin/players')} className={styles.sendButton}>
          Back to Players
        </button>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      {/* Header Bar */}
      <div className={styles.headerBar}>
        <Image
          src="/images/titles/Sanction.png"
          alt="Sanction Players"
          width={238}
          height={61}
          className={styles.titleImage}
          priority
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
        {/* Back Button */}
        <div style={{ marginBottom: '20px' }}>
          <button 
            onClick={() => router.push('/admin/players')}
            className={styles.sendButton}
            style={{ backgroundColor: '#555' }}
          >
            ← Back to Players
          </button>
        </div>

        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        {/* Player Info Card */}
        <div className={styles.playerInfoCard}>
          <div className={styles.playerHeader} style={{ gap: '12px', marginBottom: '20px' }}>
            <Image 
              src={`/images/icons/classes/${player.bClass}.png`}
              alt={getClassIcon(player.bClass)}
              width={32}
              height={32}
              style={{ imageRendering: 'pixelated' }}
            />
            <div>
              <h2 style={{ margin: 0, fontSize: '24px' }}>
                {player.szName}
                {player.bDelete === 1 && (
                  <span style={{ color: '#F44336', marginLeft: '12px', fontSize: '16px' }}>
                    (Deleted)
                  </span>
                )}
              </h2>
              <p style={{ margin: '5px 0 0 0', color: '#999' }}>
                Char ID: {player.dwCharID} | User ID: {player.dwUserID}
              </p>
            </div>
            <div style={{ marginLeft: 'auto' }}>
              <span 
                className={styles.statusBadge}
                style={{ 
                  color: player.bDelete === 1 ? '#F44336' : '#4CAF50',
                  fontSize: '16px',
                  padding: '8px 16px'
                }}
              >
                {player.bDelete === 1 ? 'Deleted' : 'Active'}
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Class:</span>
              <span className={styles.detailValue}>{getClassIcon(player.bClass)}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Account:</span>
              <span className={styles.detailValue}>{player.accountName || 'N/A'}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Email:</span>
              <span className={styles.detailValue}>{player.szEmail || 'N/A'}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Last Logout:</span>
              <span className={styles.detailValue}>{formatDate(player.dLogoutDate)}</span>
            </div>
          </div>
        </div>

        {/* Actions Section */}
        <div className={styles.actionsSection} style={{ marginTop: '30px' }}>
          <h3 style={{ marginBottom: '20px' }}>Player Actions</h3>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button 
              onClick={() => setShowBanForm(!showBanForm)}
              className={styles.sendButton}
              style={{ backgroundColor: showBanForm ? '#555' : '#F44336' }}
            >
              {showBanForm ? 'Cancel Ban' : '🔨 Ban Player'}
            </button>
            <button 
              className={styles.sendButton}
              style={{ backgroundColor: '#FF9800' }}
              disabled
            >
              🔇 Mute Player
            </button>
            <button 
              className={styles.sendButton}
              style={{ backgroundColor: '#2196F3' }}
              disabled
            >
              👢 Kick Player
            </button>
            <button 
              className={styles.sendButton}
              style={{ backgroundColor: '#FFC107' }}
              disabled
            >
              ⚠️ Warn Player
            </button>
          </div>
        </div>

        {/* Ban Form */}
        {showBanForm && (
          <div style={{ marginTop: '20px', padding: '20px', backgroundColor: 'rgba(0,0,0,0.8)', borderRadius: '8px' }}>
            <h4 style={{ marginTop: 0 }}>Ban Player: {player.szName}</h4>
            
            {/* Ban Type */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px' }}>Ban Type:</label>
              <select 
                value={banForm.bBlockType}
                onChange={(e) => setBanForm({...banForm, bBlockType: parseInt(e.target.value)})}
                className={styles.filterSelect}
              >
                <option value={1}>Account Ban</option>
                <option value={0}>Mute (Chat Ban)</option>
              </select>
            </div>

            {/* Duration */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px' }}>Duration:</label>
              <select 
                value={banForm.dwDuration}
                onChange={(e) => setBanForm({...banForm, dwDuration: parseInt(e.target.value)})}
                className={styles.filterSelect}
              >
                <option value={0}>Permanent</option>
                <option value={1}>1 Hour</option>
                <option value={24}>1 Day</option>
                <option value={168}>7 Days</option>
                <option value={720}>30 Days</option>
              </select>
            </div>

            {/* Reason */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px' }}>Reason: *</label>
              <input 
                type="text"
                value={banForm.szComment}
                onChange={(e) => setBanForm({...banForm, szComment: e.target.value})}
                placeholder="Enter ban reason (e.g., Hacking, Bot Usage, Harassment...)"
                required
                className={styles.filterSelect}
                style={{ cursor: 'text' }}
              />
            </div>

            {/* Proofs */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px' }}>Proofs (optional):</label>
              <textarea 
                value={banForm.szProofs}
                onChange={(e) => setBanForm({...banForm, szProofs: e.target.value})}
                placeholder="Add proof links (screenshots, videos, logs...)"
                rows={3}
                className={styles.messageTextarea}
                style={{ width: '100%', minHeight: '80px' }}
              />
              <small style={{ color: '#999', fontSize: '12px' }}>
                Examples: https://imgur.com/abc123, https://youtu.be/xyz789
              </small>
            </div>

            {/* HWID Ban */}
            <div style={{ marginBottom: '25px', padding: '12px', backgroundColor: '#2a2a2a', borderRadius: '4px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input 
                  type="checkbox"
                  checked={banForm.isHwidBan}
                  onChange={(e) => setBanForm({...banForm, isHwidBan: e.target.checked})}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '14px', fontWeight: 500 }}>Include HWID Ban (Hardware Ban)</span>
              </label>
              <small style={{ color: '#999', marginLeft: '28px', display: 'block', marginTop: '4px' }}>
                This will ban the player's hardware, preventing new accounts
              </small>

              {/* HWID Sessions List */}
              {banForm.isHwidBan && (
                <div style={{ marginTop: '15px', marginLeft: '28px' }}>
                  {loadingHWID ? (
                    <p style={{ color: '#999', fontSize: '14px' }}>Loading HWID sessions...</p>
                  ) : hwidSessions.length === 0 ? (
                    <p style={{ color: '#999', fontSize: '14px' }}>No HWID sessions found for this user</p>
                  ) : (
                    <div>
                      <p style={{ color: '#BDBDBD', fontSize: '13px', marginBottom: '10px', fontWeight: 500 }}>
                        Select which HWID to ban ({hwidSessions.length} session{hwidSessions.length > 1 ? 's' : ''} found):
                      </p>
                      <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #444', borderRadius: '4px', padding: '8px' }}>
                        {hwidSessions.map((session, index) => (
                          <label 
                            key={index}
                            style={{ 
                              display: 'block', 
                              padding: '10px', 
                              marginBottom: '8px',
                              backgroundColor: selectedHWID === session ? '#3a3a3a' : '#1a1a1a',
                              border: selectedHWID === session ? '1px solid #790801' : '1px solid #333',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                          >
                            <input 
                              type="radio"
                              name="hwidSession"
                              checked={selectedHWID === session}
                              onChange={() => setSelectedHWID(session)}
                              style={{ marginRight: '10px' }}
                            />
                            <div style={{ fontSize: '12px', color: '#BDBDBD', display: 'inline-block' }}>
                              <div><strong>IP:</strong> {session.IP} | <strong>Last seen:</strong> {formatDate(session.lastSeen)}</div>
                              <div style={{ marginTop: '4px', color: '#999' }}>
                                <strong>MAC:</strong> {session.MacAddr} | <strong>HWID:</strong> {session.HWAddr?.substring(0, 20)}...
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => setShowBanForm(false)}
                className={styles.sendButton}
                style={{ backgroundColor: '#555' }}
              >
                Cancel
              </button>
              <button 
                onClick={handleBanPlayer}
                disabled={banning || !banForm.szComment.trim()}
                className={styles.sendButton}
                style={{ backgroundColor: '#F44336' }}
              >
                {banning ? 'Banning...' : 'Ban Player'}
              </button>
            </div>
          </div>
        )}

        {/* Sanction History */}
        <div style={{ marginTop: '30px' }}>
          <h3 style={{ marginBottom: '20px' }}>Sanction History</h3>
          <div style={{ padding: '20px', backgroundColor: 'rgba(0,0,0,0.8)', borderRadius: '8px' }}>
            <p style={{ color: '#999', textAlign: 'center' }}>No sanctions recorded yet.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

