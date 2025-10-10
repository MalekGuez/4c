'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { adminService } from '@/app/services/api';
import styles from './players.module.css';

export default function AdminPlayersPage() {
  const router = useRouter();
  const [players, setPlayers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [showSanctions, setShowSanctions] = useState(false);

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      router.push('/admin/login');
      return;
    }

    loadPlayers();
  }, [router]);

  useEffect(() => {
    if (searchTerm) {
      const timeoutId = setTimeout(() => {
        loadPlayers(searchTerm);
      }, 500);
      return () => clearTimeout(timeoutId);
    } else {
      loadPlayers();
    }
  }, [searchTerm]);

  const loadPlayers = async (search?: string) => {
    try {
      setLoading(true);
      const response = await adminService.getPlayers(search);
      
      if (response.success && response.players) {
        setPlayers(response.players);
      } else {
        setError(response.error || 'Failed to load players');
      }
    } catch (err) {
      setError('An error occurred while loading players');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayerClick = (player: any) => {
    setSelectedPlayer(player);
    setShowSanctions(true);
  };

  const handleSanction = (type: string) => {
    if (!selectedPlayer) return;
    
    // TODO: Implement sanction API calls
    console.log(`Applying ${type} to player ${selectedPlayer.szID}`);
    alert(`${type} applied to ${selectedPlayer.szID}`);
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

  const getStatusColor = (verified: number) => {
    return verified === 1 ? '#4CAF50' : '#F44336';
  };

  const getStatusText = (verified: number) => {
    return verified === 1 ? 'Verified' : 'Unverified';
  };

  if (loading) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading players...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      {/* Header Bar */}
      <div className={styles.headerBar}>
        <Image
          src="/images/titles/Ranking.png"
          alt="Player Management"
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
              placeholder="Search players by ID, name, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <div className={styles.resultsCount}>
            Found {players.length} players
          </div>
        </div>

        {/* Players List */}
        <div className={styles.playersList}>
          {players.length === 0 ? (
            <div className={styles.noPlayers}>
              {searchTerm ? 'No players found matching your search.' : 'No players found.'}
            </div>
          ) : (
            <div className={styles.playersGrid}>
              {players.map((player) => (
                <div
                  key={player.szID}
                  className={styles.playerCard}
                  onClick={() => handlePlayerClick(player)}
                >
                  <div className={styles.playerHeader}>
                    <div className={styles.playerInfo}>
                      <h4 className={styles.playerName}>{player.szName}</h4>
                      <span className={styles.playerId}>ID: {player.szID}</span>
                    </div>
                    <div className={styles.playerStatus}>
                      <span 
                        className={styles.statusBadge}
                        style={{ color: getStatusColor(player.bVerified) }}
                      >
                        {getStatusText(player.bVerified)}
                      </span>
                    </div>
                  </div>
                  
                  <div className={styles.playerDetails}>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Level:</span>
                      <span className={styles.detailValue}>{player.bLevel || 'N/A'}</span>
                    </div>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Email:</span>
                      <span className={styles.detailValue}>{player.szEmail || 'N/A'}</span>
                    </div>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Last Login:</span>
                      <span className={styles.detailValue}>{formatDate(player.dtLastLogin)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sanctions Modal */}
      {showSanctions && selectedPlayer && (
        <div className={styles.modalOverlay} onClick={() => setShowSanctions(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Player Sanctions</h3>
              <button 
                className={styles.closeButton}
                onClick={() => setShowSanctions(false)}
              >
                ×
              </button>
            </div>
            
            <div className={styles.playerInfo}>
              <h4>{selectedPlayer.szName}</h4>
              <p>ID: {selectedPlayer.szID}</p>
            </div>

            <div className={styles.sanctionsGrid}>
              <button 
                className={styles.sanctionButton}
                onClick={() => handleSanction('Mute')}
              >
                Mute Player
              </button>
              <button 
                className={styles.sanctionButton}
                onClick={() => handleSanction('Ban')}
              >
                Ban Player
              </button>
              <button 
                className={styles.sanctionButton}
                onClick={() => handleSanction('Kick')}
              >
                Kick Player
              </button>
              <button 
                className={styles.sanctionButton}
                onClick={() => handleSanction('Warn')}
              >
                Warning
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
