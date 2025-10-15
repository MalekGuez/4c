'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { adminService } from '@/app/services/api';
import styles from './players.module.css';

export default function AdminPlayersPage() {
  const router = useRouter();
  const [players, setPlayers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [userGrade, setUserGrade] = useState<any>(null);
  const loadingMoreRef = useRef(false);
  const offsetRef = useRef(0);

  // Grade definitions and permissions (bAuthority values: 5=TGM, 4=GM, 3=SGM, 2=GA, 1=COMA)
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

  const getGradeInfo = () => {
    if (!userGrade) return null;
    return GRADE_PERMISSIONS[userGrade.bAuthority as keyof typeof GRADE_PERMISSIONS] || null;
  };

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
      
      // Check if user has access to players
      const gradeInfo = GRADE_PERMISSIONS[parsedAdminData.bAuthority as keyof typeof GRADE_PERMISSIONS];
      if (!gradeInfo?.canViewPlayers) {
        router.push('/admin/dashboard');
        return;
      }
    } catch (e) {
      router.push('/admin/login');
      return;
    }
  }, [router]);

  useEffect(() => {
    // Debounce search - reset and reload when search term changes
    const timeoutId = setTimeout(() => {
      setOffset(0);
      offsetRef.current = 0;
      setHasMore(true);
      loadPlayers(searchTerm, 0);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (loadingMoreRef.current || !hasMore) return;
      
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;
      
      // Charger plus quand on arrive à 80% du bas
      if (scrollTop + clientHeight >= scrollHeight * 0.8) {
        loadMorePlayers();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore]);

  const loadPlayers = async (search?: string, currentOffset = 0) => {
    try {
      setLoading(true);
      loadingMoreRef.current = false;
      console.log(`🔄 Loading players: search="${search}", offset=${currentOffset}`);
      const response = await adminService.getPlayers(search, currentOffset, 50);
      
      if (response.success && response.players) {
        console.log(`✅ Loaded ${response.players.length} players, hasMore=${response.hasMore}`);
        setPlayers(response.players);
        setHasMore(response.hasMore || false);
        const newOffset = currentOffset + 50;
        setOffset(newOffset);
        offsetRef.current = newOffset;
      } else {
        setError(response.error || 'Failed to load players');
      }
    } catch (err) {
      setError('An error occurred while loading players');
    } finally {
      setLoading(false);
    }
  };

  const loadMorePlayers = async () => {
    if (loadingMore || !hasMore || loadingMoreRef.current) return;
    
    loadingMoreRef.current = true;
    setLoadingMore(true);
    
    const currentOffset = offsetRef.current;
    
    try {
      console.log(`🔄 Loading MORE players: search="${searchTerm}", offset=${currentOffset}`);
      const response = await adminService.getPlayers(searchTerm || '', currentOffset, 50);
      
      if (response.success && response.players) {
        console.log(`✅ Loaded ${response.players.length} more players`);
        setPlayers(prev => [...prev, ...(response.players || [])]);
        setHasMore(response.hasMore || false);
        const newOffset = currentOffset + 50;
        setOffset(newOffset);
        offsetRef.current = newOffset;
      }
    } catch (err) {
      console.error('Failed to load more players:', err);
    } finally {
      setLoadingMore(false);
      loadingMoreRef.current = false;
    }
  };

  const handlePlayerClick = (player: any) => {
    router.push(`/admin/players/${player.dwCharID}`);
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
          <p>Loading characters...</p>
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
          width={320}
          height={82}
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
        {userGrade && (
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
            </div>
            <div style={{ fontSize: '14px', color: '#999' }}>
              Max ban duration: {getGradeInfo()?.maxBanDuration === Infinity ? 'Unlimited' : `${getGradeInfo()?.maxBanDuration}h`}
            </div>
          </div>
        )}

        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        {/* Search Section */}
        <div className={styles.searchSection}>
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="Search characters by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <div className={styles.resultsCount}>
            Showing {players.length} character(s) {hasMore && '(scroll for more)'}
          </div>
        </div>

        {/* Players List */}
        <div className={styles.playersList}>
          {players.length === 0 ? (
            <div className={styles.noPlayers}>
              {searchTerm ? 'No characters found matching your search.' : 'No characters found.'}
            </div>
          ) : (
            <div className={styles.playersGrid}>
              {players.map((player) => (
                <div
                  key={player.dwCharID}
                  className={styles.playerCard}
                  onClick={() => handlePlayerClick(player)}
                >
                  <div className={styles.playerHeader} style={{ gap: '8px' }}>
                    <Image 
                      src={`/images/icons/classes/${player.bClass}.png`}
                      alt={getClassIcon(player.bClass)}
                      width={32}
                      height={32}
                      style={{ imageRendering: 'pixelated' }}
                    />
                    <div className={styles.playerInfo}>
                      <h4 className={styles.playerName}>
                        {player.szName}
                        {player.bDelete === 1 && (
                          <span style={{ color: '#F44336', marginLeft: '8px', fontSize: '12px' }}>
                            (Deleted)
                          </span>
                        )}
                      </h4>
                      <span className={styles.playerId}>Char ID: {player.dwCharID} | User ID: {player.dwUserID}</span>
                    </div>
                    <div className={styles.playerStatus}>
                      <span 
                        className={styles.statusBadge}
                        style={{ color: player.bDelete === 1 ? '#F44336' : '#4CAF50' }}
                      >
                        {player.bDelete === 1 ? 'Deleted' : 'Active'}
                      </span>
                    </div>
                  </div>
                  
                  <div className={styles.playerDetails}>
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
              ))}
            </div>
          )}
          
          {/* Loading more indicator */}
          {loadingMore && (
            <div className={styles.loadingMore} style={{ textAlign: 'center', padding: '20px' }}>
              <div className={styles.loadingSpinner}></div>
              <p>Loading more characters...</p>
            </div>
          )}
          
          {/* End of results */}
          {!loading && !loadingMore && !hasMore && players.length > 0 && (
            <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
              No more characters to load
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
