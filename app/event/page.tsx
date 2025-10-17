"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./event.module.css";
import { API_CONFIG } from "../config/api";

interface EventPlayer {
  dwCharID: number;
  szName: string;
  bClass: number;
  dwKills: number;
  dwAssists: number;
  totalPoints: number;
}

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

export default function EventPage() {
  const [ranking, setRanking] = useState<EventPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchEventRanking();
  }, []);

  const fetchEventRanking = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_CONFIG.BASE_URL}/event-ranking`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setRanking(data.ranking || []);
      } else {
        throw new Error(data.error || 'Failed to fetch ranking data');
      }
    } catch (error) {
      console.error('Error fetching event ranking:', error);
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading event ranking...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.errorMessage}>
          <h2>Error Loading Ranking</h2>
          <p>{error}</p>
          <button onClick={fetchEventRanking} className={styles.retryButton}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.eventDescription}>
          <h2 className={styles.eventTitle}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
              <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/>
              <line x1="13" x2="19" y1="19" y2="13"/>
              <line x1="16" x2="20" y1="16" y2="20"/>
              <line x1="19" x2="21" y1="21" y2="19"/>
              <polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5"/>
              <line x1="5" x2="9" y1="14" y2="18"/>
              <line x1="7" x2="4" y1="17" y2="20"/>
              <line x1="3" x2="5" y1="19" y2="21"/>
            </svg>
            Domination Week-end - Event
          </h2>
          <p className={styles.eventText}>
            Prepare yourselves for an all-out war! Throughout the entire weekend, Valorian and Derion will clash endlessly across Iberia. 
            Every kill and assist counts toward your final ranking. Only the fiercest fighters will reach the top!
          </p>
          <div className={styles.eventDetails}>
            <div className={styles.eventDuration}>
              <div className={styles.durationHeader}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#790801" style={{ marginRight: '8px', verticalAlign: 'middle' }}>
                  <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                </svg>
                <span className={styles.durationTitle}>Event Duration</span>
              </div>
              <div className={styles.datesContainer}>
                <div className={styles.dateItem}>
                  <span className={styles.dateLabel}>Start:</span>
                  <span className={styles.dateValue}>Saturday, October 18th at 12:00</span>
                </div>
                <div className={styles.dateItem}>
                  <span className={styles.dateLabel}>End:</span>
                  <span className={styles.dateValue}>Sunday, October 19th at 23:59</span>
                </div>
              </div>
            </div>
            <p>
              <strong>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '6px', verticalAlign: 'middle' }}>
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                How it works:
              </strong> Kills and assists grant points based on your class. The top 3 players will receive exclusive rewards!
            </p>
            <div className={styles.warningInfo}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', verticalAlign: 'middle' }}>
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                <path d="M12 9v4"/>
                <path d="M12 17h.01"/>
              </svg>
              <span>Switching class in a battlemode won't affect the points gained</span>
            </div>
          </div>
        </div>

        {ranking.length > 0 && (
          <div className={styles.rankingSection}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>Ranking</h3>
              <button 
                className={styles.infoIcon}
                onClick={() => setShowModal(true)}
                type="button"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                </svg>
              </button>
            </div>
            
            <div className={styles.rankingTable}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Character</th>
                    <th>Class</th>
                    <th>Kills</th>
                    <th>Assists</th>
                    <th>Total Points</th>
                  </tr>
                </thead>
                <tbody>
                  {ranking.map((player, index) => (
                    <tr key={player.dwCharID} className={index < 3 ? styles.topThree : ''}>
                      <td className={styles.rankCell}>
                        {index + 1}
                      </td>
                      <td className={styles.playerCell}>
                        <div className={styles.playerInfo}>
                          <span>{player.szName}</span>
                        </div>
                      </td>
                      <td className={styles.classCell}>
                        <div className={styles.classInfo}>
                          <Image 
                            src={`/images/icons/classes/${player.bClass}.png`}
                            alt={getClassIcon(player.bClass)}
                            width={32}
                            height={32}
                            style={{ 
                              imageRendering: 'auto',
                              filter: 'contrast(1.1) saturate(1.1)'
                            }}
                          />
                        </div>
                      </td>
                      <td>{player.dwKills}</td>
                      <td>{player.dwAssists}</td>
                      <td className={styles.pointsCell}>{player.totalPoints}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Points System</h3>
              <button 
                className={styles.closeButton}
                onClick={() => setShowModal(false)}
                type="button"
              >
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.pointsGrid}>
                <div className={styles.pointItem}>
                  <Image src="/images/icons/classes/0.png" alt="Warrior" width={24} height={24} />
                  <span>Warrior: 15 points/kill, 2 points/assist</span>
                </div>
                <div className={styles.pointItem}>
                  <Image src="/images/icons/classes/1.png" alt="Nightwalker" width={24} height={24} />
                  <span>Nightwalker: 12 points/kill, 2 points/assist</span>
                </div>
                <div className={styles.pointItem}>
                  <Image src="/images/icons/classes/2.png" alt="Archer" width={24} height={24} />
                  <span>Archer: 10 points/kill, 0 points/assist</span>
                </div>
                <div className={styles.pointItem}>
                  <Image src="/images/icons/classes/3.png" alt="Magician" width={24} height={24} />
                  <span>Magician: 10 points/kill, 0 points/assist</span>
                </div>
                <div className={styles.pointItem}>
                  <Image src="/images/icons/classes/4.png" alt="Priest" width={24} height={24} />
                  <span>Priest: 5 points/kill, 7 points/assist</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
