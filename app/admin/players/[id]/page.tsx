'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { adminService } from '@/app/services/api';
import styles from '../players.module.css';

// Grade definitions and permissions
const GRADE_PERMISSIONS = {
  5: { // TGM
    name: 'TGM',
    color: '#4CAF50',
    canViewPlayers: false,
    canBan: false,
    maxBanDuration: 0,
    canViewBanHistory: false,
    canUnban: false
  },
  4: { // GM
    name: 'GM',
    color: '#FF9800',
    canViewPlayers: true,
    canBan: true,
    maxBanDuration: 30 * 24, // 30 days in hours
    canViewBanHistory: true,
    canUnban: false
  },
  3: { // SGM
    name: 'SGM',
    color: '#F44336',
    canViewPlayers: true,
    canBan: true,
    maxBanDuration: Infinity, // Permanent bans allowed
    canViewBanHistory: true,
    canUnban: true
  },
  2: { // GA
    name: 'GA',
    color: '#9C27B0',
    canViewPlayers: true,
    canBan: true,
    maxBanDuration: Infinity,
    canViewBanHistory: true,
    canUnban: true
  },
  1: { // COMA
    name: 'COMA',
    color: '#FF0000',
    canViewPlayers: true,
    canBan: true,
    maxBanDuration: Infinity,
    canViewBanHistory: true,
    canUnban: true
  }
};

export default function PlayerDetailPage() {
  const router = useRouter();
  const params = useParams();
  const playerId = params.id as string;

  const [player, setPlayer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [userGrade, setUserGrade] = useState<any>(null);
  const [banStatus, setBanStatus] = useState<any>(null);
  const [loadingBanStatus, setLoadingBanStatus] = useState(false);
  const [warnings, setWarnings] = useState<any[]>([]);
  const [loadingWarnings, setLoadingWarnings] = useState(false);
  const [showWarningForm, setShowWarningForm] = useState(false);
  const [warningReason, setWarningReason] = useState('');
  const [addingWarning, setAddingWarning] = useState(false);
  const [deletingWarning, setDeletingWarning] = useState<string | null>(null);
  
  // Ban forms
  const [mainBanForm, setMainBanForm] = useState({
    bBlockType: 1,
    dwDuration: 0,
    szComment: '',
    szProofs: '',
    isHwidBan: false
  });
  const [modeBanForm, setModeBanForm] = useState({
    banDuration: 24
  });
  const [tradeBanForm, setTradeBanForm] = useState({
    banDuration: 24,
    szReason: ''
  });
  
  const [banning, setBanning] = useState(false);
  const [banType, setBanType] = useState<'main' | 'mode' | 'trade'>('main');
  const [hwidSessions, setHwidSessions] = useState<any[]>([]);
  const [selectedHWID, setSelectedHWID] = useState<any>(null);
  const [loadingHWID, setLoadingHWID] = useState(false);
  const [showBanForm, setShowBanForm] = useState(false);

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    const adminManager = localStorage.getItem('adminManager');
    
    if (!adminToken || !adminManager) {
      router.push('/admin/login');
      return;
    }
    
    try {
      const parsedAdminData = JSON.parse(adminManager);
      setUserGrade(parsedAdminData);
    } catch (e) {
      router.push('/admin/login');
      return;
    }
    
    loadPlayerDetails();
  }, [playerId]);

  // Load HWID sessions when HWID ban is enabled
  useEffect(() => {
    if (mainBanForm.isHwidBan && player) {
      loadHWIDSessions();
    } else {
      setHwidSessions([]);
      setSelectedHWID(null);
    }
  }, [mainBanForm.isHwidBan]);

  // Load ban status and warnings when player is loaded
  useEffect(() => {
    if (player && userGrade) {
      const gradePerms = GRADE_PERMISSIONS[userGrade.bAuthority as keyof typeof GRADE_PERMISSIONS];
      if (gradePerms?.canViewBanHistory) {
        loadBanStatus();
        loadWarnings();
      }
    }
  }, [player, userGrade]);

  const loadPlayerDetails = async () => {
    try {
      setLoading(true);
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

  const loadBanStatus = async () => {
    if (!player || !userGrade) return;
    
    const gradePerms = GRADE_PERMISSIONS[userGrade.bAuthority as keyof typeof GRADE_PERMISSIONS];
    if (!gradePerms?.canViewBanHistory) return;
    
    setLoadingBanStatus(true);
    setError(null);
    
    try {
      const response = await adminService.getUserBanStatus(player.dwUserID);
      if (response.success) {
        setBanStatus(response.banStatus);
      } else {
        console.error('Failed to load ban status:', response.error);
      }
    } catch (err) {
      console.error('Failed to load ban status:', err);
      setError('Failed to load ban status');
    } finally {
      setLoadingBanStatus(false);
    }
  };

  const loadWarnings = async () => {
    if (!player || !userGrade) return;
    
    const gradePerms = GRADE_PERMISSIONS[userGrade.bAuthority as keyof typeof GRADE_PERMISSIONS];
    if (!gradePerms?.canViewBanHistory) return;
    
    setLoadingWarnings(true);
    
    try {
      const response = await adminService.getUserWarnings(player.dwUserID);
      if (response.success) {
        setWarnings(response.warnings || []);
      } else {
        console.error('Failed to load warnings:', response.error);
      }
    } catch (err) {
      console.error('Failed to load warnings:', err);
    } finally {
      setLoadingWarnings(false);
    }
  };

  const handleAddWarning = async () => {
    if (!player) return;
    
    setError(null);
    setSuccessMessage(null);
    
    if (!warningReason.trim()) {
      setError('Please provide a reason for the warning');
      return;
    }

    setAddingWarning(true);
    
    try {
      const response = await adminService.addWarning(player.dwUserID, warningReason.trim());
      
      if (response.success) {
        setSuccessMessage(`Warning issued to ${player.szName} successfully!`);
        setShowWarningForm(false);
        setWarningReason('');
        loadWarnings();
      } else {
        setError(response.error || 'Failed to issue warning');
      }
    } catch (err) {
      console.error('Add warning error:', err);
      setError('An error occurred while issuing warning');
    } finally {
      setAddingWarning(false);
    }
  };

  const handleDeleteWarning = async (warningId: string) => {
    if (!player) return;
    
    setError(null);
    setSuccessMessage(null);
    
    if (!confirm('Are you sure you want to delete this warning?')) {
      return;
    }

    setDeletingWarning(warningId);
    
    try {
      const response = await adminService.deleteWarning(warningId, player.dwUserID);
      
      if (response.success) {
        setSuccessMessage('Warning deleted successfully!');
        loadWarnings();
      } else {
        setError(response.error || 'Failed to delete warning');
      }
    } catch (err) {
      console.error('Delete warning error:', err);
      setError('An error occurred while deleting warning');
    } finally {
      setDeletingWarning(null);
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

  const handleMainBanPlayer = async () => {
    if (!player || !userGrade?.canBan) return;
    
    if (!mainBanForm.szComment.trim()) {
      alert('Please provide a reason for the ban');
      return;
    }
    
    if (mainBanForm.isHwidBan && !selectedHWID) {
      alert('Please select a HWID session to ban');
      return;
    }

    // Check ban duration limits
    const gradePerms = GRADE_PERMISSIONS[userGrade.bAuthority as keyof typeof GRADE_PERMISSIONS];
    if (mainBanForm.dwDuration > 0 && mainBanForm.dwDuration > gradePerms.maxBanDuration) {
      alert(`Your grade (${gradePerms.name}) can only ban for a maximum of ${gradePerms.maxBanDuration} hours`);
      return;
    }

    setBanning(true);
    setError(null);
    
    try {
      let fullComment = mainBanForm.szComment.trim();
      if (mainBanForm.szProofs.trim()) {
        fullComment += `\n\nProofs:\n${mainBanForm.szProofs.trim()}`;
      }
      
      const response = await adminService.banPlayer(player.dwUserID, {
        bBlockType: mainBanForm.bBlockType,
        dwDuration: mainBanForm.dwDuration,
        szComment: fullComment,
        isHwidBan: mainBanForm.isHwidBan,
        selectedHWID: selectedHWID,
        dwCharID: player.dwCharID,
        szCharName: player.szName
      });
      
      if (response.success) {
        setSuccessMessage(`Player ${player.szName} banned successfully!`);
        setShowBanForm(false);
        resetBanForms();
        loadBanStatus();
      } else {
        setError(response.error || 'Failed to ban player');
      }
    } catch (err) {
      setError('An error occurred while banning player');
    } finally {
      setBanning(false);
    }
  };

  const handleModeBanPlayer = async () => {
    if (!player) return;
    
    setError(null);
    setSuccessMessage(null);
    
    const gradePerms = GRADE_PERMISSIONS[userGrade?.bAuthority as keyof typeof GRADE_PERMISSIONS];
    if (!gradePerms || !gradePerms.canBan) {
      setError('You do not have permission to ban players');
      return;
    }

    // Check ban duration limits
    if (modeBanForm.banDuration > gradePerms.maxBanDuration) {
      setError(`Your grade (${gradePerms.name}) can only ban for a maximum of ${gradePerms.maxBanDuration} hours`);
      return;
    }

    setBanning(true);
    
    try {
      const response = await adminService.banModePlayer(player.dwUserID, modeBanForm.banDuration);
      
      if (response.success) {
        setSuccessMessage(`Player ${player.szName} banned from game mode successfully!`);
        setShowBanForm(false);
        resetBanForms();
        loadBanStatus();
      } else {
        setError(response.error || 'Failed to ban player from game mode');
      }
    } catch (err) {
      console.error('Mode ban error:', err);
      setError('An error occurred while banning player from game mode');
    } finally {
      setBanning(false);
    }
  };

  const handleTradeBanPlayer = async () => {
    if (!player) return;
    
    setError(null);
    setSuccessMessage(null);
    
    const gradePerms = GRADE_PERMISSIONS[userGrade?.bAuthority as keyof typeof GRADE_PERMISSIONS];
    if (!gradePerms || !gradePerms.canBan) {
      setError('You do not have permission to ban players');
      return;
    }
    
    if (!tradeBanForm.szReason.trim()) {
      setError('Please provide a reason for the trade ban');
      return;
    }

    // Check ban duration limits
    if (tradeBanForm.banDuration > gradePerms.maxBanDuration) {
      setError(`Your grade (${gradePerms.name}) can only ban for a maximum of ${gradePerms.maxBanDuration} hours`);
      return;
    }

    setBanning(true);
    
    try {
      const response = await adminService.banTradePlayer(player.dwUserID, tradeBanForm.banDuration, tradeBanForm.szReason);
      
      if (response.success) {
        setSuccessMessage(`Player ${player.szName} banned from trading successfully!`);
        setShowBanForm(false);
        resetBanForms();
        loadBanStatus();
      } else {
        setError(response.error || 'Failed to ban player from trading');
      }
    } catch (err) {
      console.error('Trade ban error:', err);
      setError('An error occurred while banning player from trading');
    } finally {
      setBanning(false);
    }
  };

  const handleUnbanMode = async () => {
    if (!player || !userGrade) return;
    
    const gradePerms = GRADE_PERMISSIONS[userGrade.bAuthority as keyof typeof GRADE_PERMISSIONS];
    if (!gradePerms?.canUnban) return;
    
    setError(null);
    setSuccessMessage(null);
    
    if (!confirm(`Are you sure you want to unban ${player.szName} from game mode?`)) {
      return;
    }

    setBanning(true);
    
    try {
      const response = await adminService.unbanModePlayer(player.dwUserID);
      
      if (response.success) {
        setSuccessMessage(`Player ${player.szName} unbanned from game mode successfully!`);
        loadBanStatus();
      } else {
        setError(response.error || 'Failed to unban player from game mode');
      }
    } catch (err) {
      setError('An error occurred while unbanning player from game mode');
    } finally {
      setBanning(false);
    }
  };

  const handleUnbanTrade = async () => {
    if (!player || !userGrade) return;
    
    const gradePerms = GRADE_PERMISSIONS[userGrade.bAuthority as keyof typeof GRADE_PERMISSIONS];
    if (!gradePerms?.canUnban) return;
    
    setError(null);
    setSuccessMessage(null);
    
    if (!confirm(`Are you sure you want to unban ${player.szName} from trading?`)) {
      return;
    }

    setBanning(true);
    
    try {
      const response = await adminService.unbanTradePlayer(player.dwUserID);
      
      if (response.success) {
        setSuccessMessage(`Player ${player.szName} unbanned from trading successfully!`);
        loadBanStatus();
      } else {
        setError(response.error || 'Failed to unban player from trading');
      }
    } catch (err) {
      setError('An error occurred while unbanning player from trading');
    } finally {
      setBanning(false);
    }
  };

  const resetBanForms = () => {
    setMainBanForm({
      bBlockType: 1,
      dwDuration: 0,
      szComment: '',
      szProofs: '',
      isHwidBan: false
    });
    setModeBanForm({
      banDuration: 24
    });
    setTradeBanForm({
      banDuration: 24,
      szReason: ''
    });
    setHwidSessions([]);
    setSelectedHWID(null);
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

  const getGradeInfo = () => {
    if (!userGrade) return null;
    return GRADE_PERMISSIONS[userGrade.bAuthority as keyof typeof GRADE_PERMISSIONS] || null;
  };

  const isBanned = (banType: 'main' | 'mode' | 'trade') => {
    if (!banStatus) return false;
    
    switch (banType) {
      case 'main':
        return banStatus.main !== null;
      case 'mode':
        return banStatus.mode !== null;
      case 'trade':
        return banStatus.trade !== null;
      default:
        return false;
    }
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

  const gradeInfo = getGradeInfo();
  if (!gradeInfo) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.errorMessage}>
          Invalid admin permissions
        </div>
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
        {/* Grade Info */}
        <div style={{ 
          marginBottom: '20px', 
          padding: '10px', 
          backgroundColor: 'rgba(0,0,0,0.8)', 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <span style={{ color: '#999', fontSize: '14px' }}>Logged in as:</span>
            <span style={{ 
              color: gradeInfo.color, 
              fontSize: '16px', 
              fontWeight: 'bold', 
              marginLeft: '8px' 
            }}>
              {gradeInfo.name}
            </span>
          </div>
          <div style={{ fontSize: '14px', color: '#999' }}>
            Max ban duration: {gradeInfo.maxBanDuration === Infinity ? 'Unlimited' : `${gradeInfo.maxBanDuration}h`}
          </div>
        </div>

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

        {successMessage && (
          <div className={styles.successMessage}>
            {successMessage}
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
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px' }}>
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
              {/* Ban Status Badges */}
              {isBanned('main') && (
                <span 
                  className={styles.statusBadge}
                  style={{ 
                    color: '#F44336',
                    fontSize: '14px',
                    padding: '8px 16px'
                  }}
                >
                  Main Ban
                </span>
              )}
              {isBanned('mode') && (
                <span 
                  className={styles.statusBadge}
                  style={{ 
                    color: '#FF9800',
                    fontSize: '14px',
                    padding: '8px 16px'
                  }}
                >
                  Mode Ban
                </span>
              )}
              {isBanned('trade') && (
                <span 
                  className={styles.statusBadge}
                  style={{ 
                    color: '#2196F3',
                    fontSize: '14px',
                    padding: '8px 16px'
                  }}
                >
                  Trade Ban
                </span>
              )}
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
        {gradeInfo.canBan && (
          <div className={styles.actionsSection} style={{ marginTop: '30px' }}>
            <h3 style={{ marginBottom: '20px' }}>Player Actions</h3>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button 
                onClick={() => { setShowWarningForm(!showWarningForm); setShowBanForm(false); }}
                className={styles.sendButton}
                style={{ backgroundColor: showWarningForm ? '#555' : '#FFC107' }}
              >
                {showWarningForm ? 'Cancel Warning' : '⚠️ Warn Player'}
              </button>
              <button 
                onClick={() => { setBanType('main'); setShowBanForm(!showBanForm); setShowWarningForm(false); }}
                className={styles.sendButton}
                style={{ backgroundColor: showBanForm && banType === 'main' ? '#555' : '#F44336' }}
              >
                {showBanForm && banType === 'main' ? 'Cancel Main Ban' : '🔨 Main Ban'}
              </button>
              <button 
                onClick={() => { setBanType('mode'); setShowBanForm(!showBanForm); setShowWarningForm(false); }}
                className={styles.sendButton}
                style={{ backgroundColor: showBanForm && banType === 'mode' ? '#555' : '#FF9800' }}
              >
                {showBanForm && banType === 'mode' ? 'Cancel Mode Ban' : '🎮 Mode Ban'}
              </button>
              <button 
                onClick={() => { setBanType('trade'); setShowBanForm(!showBanForm); setShowWarningForm(false); }}
                className={styles.sendButton}
                style={{ backgroundColor: showBanForm && banType === 'trade' ? '#555' : '#2196F3' }}
              >
                {showBanForm && banType === 'trade' ? 'Cancel Trade Ban' : '💰 Trade Ban'}
              </button>
            </div>
          </div>
        )}

        {/* Warning Form */}
        {showWarningForm && gradeInfo.canBan && (
          <div style={{ marginTop: '20px', padding: '20px', backgroundColor: 'rgba(0,0,0,0.8)' }}>
            <h4 style={{ marginTop: 0 }}>Issue Warning to {player.szName}</h4>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px' }}>Reason: *</label>
              <textarea 
                value={warningReason}
                onChange={(e) => setWarningReason(e.target.value)}
                placeholder="Enter warning reason..."
                rows={3}
                className={styles.messageTextarea}
                style={{ width: '100%', minHeight: '80px' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => { setShowWarningForm(false); setWarningReason(''); }}
                className={styles.sendButton}
                style={{ backgroundColor: '#555' }}
              >
                Cancel
              </button>
              <button 
                onClick={handleAddWarning}
                disabled={addingWarning || !warningReason.trim()}
                className={styles.sendButton}
                style={{ backgroundColor: '#FFC107' }}
              >
                {addingWarning ? 'Issuing...' : 'Issue Warning'}
              </button>
            </div>
          </div>
        )}

        {/* Ban Forms */}
        {showBanForm && gradeInfo.canBan && (
          <div style={{ marginTop: '20px', padding: '20px', backgroundColor: 'rgba(0,0,0,0.8)', borderRadius: '8px' }}>
            <h4 style={{ marginTop: 0 }}>
              {banType === 'main' && 'Main Ban Player: '}
              {banType === 'mode' && 'Mode Ban Player: '}
              {banType === 'trade' && 'Trade Ban Player: '}
              {player.szName}
            </h4>
            
            {banType === 'main' && (
              <>
                {/* Ban Type */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px' }}>Ban Type:</label>
                  <select 
                    value={mainBanForm.bBlockType}
                    onChange={(e) => setMainBanForm({...mainBanForm, bBlockType: parseInt(e.target.value)})}
                    className={styles.filterSelect}
                  >
                    <option value={1}>Account Ban</option>
                  </select>
                </div>

                {/* Duration */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px' }}>Duration:</label>
                  <select 
                    value={mainBanForm.dwDuration}
                    onChange={(e) => setMainBanForm({...mainBanForm, dwDuration: parseInt(e.target.value)})}
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
                    value={mainBanForm.szComment}
                    onChange={(e) => setMainBanForm({...mainBanForm, szComment: e.target.value})}
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
                    value={mainBanForm.szProofs}
                    onChange={(e) => setMainBanForm({...mainBanForm, szProofs: e.target.value})}
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
                      checked={mainBanForm.isHwidBan}
                      onChange={(e) => setMainBanForm({...mainBanForm, isHwidBan: e.target.checked})}
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '14px', fontWeight: 500 }}>Include HWID Ban (Hardware Ban)</span>
                  </label>
                  <small style={{ color: '#999', marginLeft: '28px', display: 'block', marginTop: '4px' }}>
                    This will ban the player's hardware, preventing new accounts
                  </small>

                  {/* HWID Sessions List */}
                  {mainBanForm.isHwidBan && (
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
                          <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #444', padding: '8px' }}>
                            {hwidSessions.map((session, index) => (
                              <label 
                                key={index}
                                style={{ 
                                  display: 'block', 
                                  padding: '10px', 
                                  marginBottom: '8px',
                                  backgroundColor: selectedHWID === session ? '#3a3a3a' : '#1a1a1a',
                                  border: selectedHWID === session ? '1px solid #790801' : '1px solid #333',
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
                    onClick={handleMainBanPlayer}
                    disabled={banning || !mainBanForm.szComment.trim()}
                    className={styles.sendButton}
                    style={{ backgroundColor: '#F44336' }}
                  >
                    {banning ? 'Banning...' : 'Ban Player'}
                  </button>
                </div>
              </>
            )}

            {banType === 'mode' && (
              <>
                {/* Duration */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px' }}>Duration (hours):</label>
                  <input 
                    type="number"
                    min="1"
                    max={gradeInfo.maxBanDuration === Infinity ? undefined : gradeInfo.maxBanDuration}
                    value={modeBanForm.banDuration}
                    onChange={(e) => setModeBanForm({...modeBanForm, banDuration: parseInt(e.target.value) || 1})}
                    className={styles.filterSelect}
                    style={{ cursor: 'text' }}
                  />
                  <small style={{ color: '#999', fontSize: '12px', marginTop: '5px', display: 'block' }}>
                    This will prevent the player from playing the game for the specified duration
                  </small>
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
                    onClick={handleModeBanPlayer}
                    disabled={banning}
                    className={styles.sendButton}
                    style={{ backgroundColor: '#FF9800' }}
                  >
                    {banning ? 'Banning...' : 'Ban from Game Mode'}
                  </button>
                </div>
              </>
            )}

            {banType === 'trade' && (
              <>
                {/* Duration */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px' }}>Duration (hours):</label>
                  <input 
                    type="number"
                    min="1"
                    max={gradeInfo.maxBanDuration === Infinity ? undefined : gradeInfo.maxBanDuration}
                    value={tradeBanForm.banDuration}
                    onChange={(e) => setTradeBanForm({...tradeBanForm, banDuration: parseInt(e.target.value) || 1})}
                    className={styles.filterSelect}
                    style={{ cursor: 'text' }}
                  />
                </div>

                {/* Reason */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px' }}>Reason: *</label>
                  <input 
                    type="text"
                    value={tradeBanForm.szReason}
                    onChange={(e) => setTradeBanForm({...tradeBanForm, szReason: e.target.value})}
                    placeholder="Enter reason for trade ban"
                    required
                    className={styles.filterSelect}
                    style={{ cursor: 'text' }}
                  />
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
                    onClick={handleTradeBanPlayer}
                    disabled={banning || !tradeBanForm.szReason.trim()}
                    className={styles.sendButton}
                    style={{ backgroundColor: '#2196F3' }}
                  >
                    {banning ? 'Banning...' : 'Ban from Trading'}
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Warnings List */}
        {gradeInfo.canViewBanHistory && (
          <div style={{ marginTop: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0 }}>⚠️ Warnings ({warnings.length})</h3>
              <button 
                onClick={loadWarnings}
                className={styles.sendButton}
                style={{ backgroundColor: '#555', padding: '8px 16px' }}
                disabled={loadingWarnings}
              >
                {loadingWarnings ? 'Loading...' : 'Refresh'}
              </button>
            </div>
            
            {warnings.length === 0 ? (
              <div style={{ padding: '20px', backgroundColor: 'rgba(0,0,0,0.8)', textAlign: 'center' }}>
                <p style={{ color: '#999', margin: 0 }}>No warnings issued yet.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {warnings.map((warning, index) => (
                  <div 
                    key={warning.id || index}
                    style={{ 
                      padding: '15px', 
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      border: '1px solid #FFC107',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start'
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                        <span style={{ color: '#FFC107', fontWeight: 'bold' }}>⚠️ Warning #{index + 1}</span>
                        <span style={{ color: '#999', fontSize: '14px' }}>{formatDate(warning.dDate)}</span>
                      </div>
                      <p style={{ margin: '5px 0', color: '#BDBDBD' }}><strong>Reason:</strong> {warning.szReason}</p>
                      <p style={{ margin: '5px 0', color: '#999', fontSize: '14px' }}>
                        <strong>Issued by:</strong> {warning.szAdminName || warning.szAdminID}
                      </p>
                    </div>
                    {gradeInfo.canUnban && (
                      <button 
                        onClick={() => handleDeleteWarning(warning.id)}
                        disabled={deletingWarning === warning.id}
                        className={styles.sendButton}
                        style={{ 
                          backgroundColor: '#F44336', 
                          padding: '6px 12px',
                          fontSize: '12px'
                        }}
                      >
                        {deletingWarning === warning.id ? 'Deleting...' : 'Delete'}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Ban Status & History */}
        {gradeInfo.canViewBanHistory && (
          <div style={{ marginTop: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0 }}>Ban Status & History</h3>
              <button 
                onClick={loadBanStatus}
                className={styles.sendButton}
                style={{ backgroundColor: '#555', padding: '8px 16px' }}
                disabled={loadingBanStatus}
              >
                {loadingBanStatus ? 'Loading...' : 'Refresh'}
              </button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              {/* Account Ban Status */}
              <div style={{ padding: '20px', backgroundColor: 'rgba(0,0,0,0.8)' }}>
                <h4 style={{ color: '#F44336', marginTop: 0, marginBottom: '15px' }}>🔨 Account Ban</h4>
                {banStatus?.main ? (
                  <div>
                    <p style={{ margin: '5px 0', color: '#F44336' }}><strong>Status:</strong> BANNED</p>
                    <p style={{ margin: '5px 0', color: '#BDBDBD' }}><strong>Type:</strong> {banStatus.main.bBlockType === 1 ? 'Account' : 'Other'}</p>
                    <p style={{ margin: '5px 0', color: '#BDBDBD' }}><strong>Duration:</strong> {banStatus.main.bEternal ? 'Permanent' : `${banStatus.main.dwDuration} hours`}</p>
                    <p style={{ margin: '5px 0', color: '#BDBDBD' }}><strong>Reason:</strong> {banStatus.main.szComment}</p>
                    <p style={{ margin: '5px 0', color: '#BDBDBD' }}><strong>Admin:</strong> {banStatus.main.szGMID}</p>
                  </div>
                ) : (
                  <p style={{ color: '#4CAF50', margin: 0 }}>Not banned (account)</p>
                )}
              </div>

              {/* Mode Ban Status */}
              <div style={{ padding: '20px', backgroundColor: 'rgba(0,0,0,0.8)' }}>
                <h4 style={{ color: '#FF9800', marginTop: 0, marginBottom: '15px' }}>🎮 Mode Ban</h4>
                {banStatus?.mode ? (
                  <div>
                    <p style={{ margin: '5px 0', color: '#F44336' }}><strong>Status:</strong> BANNED</p>
                    <p style={{ margin: '5px 0', color: '#BDBDBD' }}><strong>Until:</strong> {formatDate(banStatus.mode.dDate)}</p>
                    {gradeInfo.canUnban && (
                      <button 
                        onClick={handleUnbanMode}
                        className={styles.sendButton}
                        style={{ backgroundColor: '#4CAF50', marginTop: '10px', padding: '6px 12px' }}
                        disabled={banning}
                      >
                        Unban from Mode
                      </button>
                    )}
                  </div>
                ) : (
                  <p style={{ color: '#4CAF50', margin: 0 }}>Not banned from game mode</p>
                )}
              </div>

              {/* Trade Ban Status */}
              <div style={{ padding: '20px', backgroundColor: 'rgba(0,0,0,0.8)' }}>
                <h4 style={{ color: '#2196F3', marginTop: 0, marginBottom: '15px' }}>💰 Trade Ban</h4>
                {banStatus?.trade ? (
                  <div>
                    <p style={{ margin: '5px 0', color: '#F44336' }}><strong>Status:</strong> BANNED</p>
                    <p style={{ margin: '5px 0', color: '#BDBDBD' }}><strong>Until:</strong> {formatDate(banStatus.trade.dDate)}</p>
                    <p style={{ margin: '5px 0', color: '#BDBDBD' }}><strong>Reason:</strong> {banStatus.trade.szReason}</p>
                    {gradeInfo.canUnban && (
                      <button 
                        onClick={handleUnbanTrade}
                        className={styles.sendButton}
                        style={{ backgroundColor: '#4CAF50', marginTop: '10px', padding: '6px 12px' }}
                        disabled={banning}
                      >
                        Unban from Trading
                      </button>
                    )}
                  </div>
                ) : (
                  <p style={{ color: '#4CAF50', margin: 0 }}>Not banned from trading</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}