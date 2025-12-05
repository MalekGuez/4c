"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { clashGauntletService, ClashGauntletRanking } from "../services/api";
import styles from "../event/event.module.css";

// Helper function to get class icon
const getClassIcon = (bClass: number): string => {
  const classMap: { [key: number]: string } = {
    0: "Warrior",
    1: "Nightwalker",
    2: "Archer",
    3: "Magician",
    4: "Priest",
  };
  return classMap[bClass] || "Unknown";
};

export default function ClashGauntletPage() {
  const [rankings, setRankings] = useState<ClashGauntletRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRankings = async () => {
    try {
      setError(null);
      const response = await clashGauntletService.getRankings();
      
      if (response.success && response.rankings) {
        // Sort by totalPoints descending
        const sorted = [...response.rankings].sort((a, b) => {
          return b.totalPoints - a.totalPoints;
        });
        
        // Assign ranks
        sorted.forEach((ranking, index) => {
          ranking.rank = index + 1;
        });
        
        setRankings(sorted);
      } else {
        setError(response.error || "Failed to load rankings");
      }
    } catch (err) {
      setError("An error occurred while loading rankings");
      console.error("Error fetching rankings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRankings();
    
    // Refresh rankings every 30 seconds
    const interval = setInterval(() => {
      fetchRankings();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Event dates
  const weekend1Start = new Date("2025-12-06T00:00:00+01:00"); // CET
  const weekend1End = new Date("2025-12-07T23:59:00+01:00");
  const weekend2Start = new Date("2025-12-13T00:00:00+01:00");
  const weekend2End = new Date("2025-12-14T23:59:00+01:00");

  const now = new Date();
  const isWeekend1Active = now >= weekend1Start && now <= weekend1End;
  const isWeekend2Active = now >= weekend2Start && now <= weekend2End;
  const isEventActive = isWeekend1Active || isWeekend2Active;
  const isEventEnded = now > weekend2End;
  const isEventWaiting = now < weekend1Start;

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Europe/Paris",
    });
  };

  if (loading) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading rankings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        {/* Event Description */}
        <div className={styles.eventDescription}>
          <h1 className={styles.eventTitle}>Ranked Event</h1>
          
          <div className={styles.eventText}>
            <p style={{ marginTop: "15px", color: "#ff8c00", fontStyle: "italic" }}>
              <strong>🔁 Event Reworked!</strong> We've improved the format while keeping all rewards exactly the same.
            </p>
            <p style={{ marginTop: "15px" }}>
              <strong>💰 300€ Cash Prize + Exclusive Rewards</strong>
            </p>
            <p style={{ marginTop: "15px" }}>
              <strong>🗓 Event Dates:</strong><br />
              <strong>Weekend 1:</strong> December 6–7<br />
              <strong>Weekend 2:</strong> December 13–14<br />
              <span style={{ fontSize: "0.9rem", fontStyle: "italic" }}>(Exact time slots will be announced before each weekend)</span>
            </p>
            <p style={{ marginTop: "15px" }}>
              <strong>🎮 Format:</strong><br />
              All ranked modes count for the event!
            </p>
            <p style={{ marginTop: "15px" }}>
              <strong>🧮 Scoring System:</strong><br />
              We track the total amount of ranked points you gain during both event weekends.<br />
              Final ranking is based on total ranked points gained per account.
            </p>
            <p style={{ marginTop: "15px" }}>
              <strong>📌 Important:</strong><br />
              Points are tracked per account, not per character.<br />
              Everything that happened before the event will NOT be counted for the final rankings.
            </p>
            <p style={{ marginTop: "15px" }}>
              <strong>🎁 Rewards:</strong><br />
              1st: 125€ | 2nd: 75€ | 3rd: 50€ | 4th: 30€ | 5th: 20€<br />
              6th: 🐹 Capybara mount | 7th: 🥋 Gon costume | 8th: 🧸 Companions of your choice
            </p>
          </div>

          {isEventEnded && (
            <div className={styles.eventWaitingSection}>
              <div className={styles.waitingMessage}>
                <h2 className={styles.waitingTitle}>Event Ended</h2>
                <p className={styles.waitingText}>
                  The event has ended. Thank you to all participants!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Rankings Section */}
        <div className={styles.rankingSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Ranking</h2>
              <button
                onClick={fetchRankings}
                className={styles.refreshButton}
                title="Refresh rankings"
              >
                refresh
              </button>
            </div>

            {error && (
              <div className={styles.errorMessage}>
                {error}
                <button onClick={fetchRankings} className={styles.retryButton}>
                  Retry
                </button>
              </div>
            )}

            {!error && rankings.length === 0 && (
              <div className={styles.noData}>
                No ranking available yet.
              </div>
            )}

            {!error && rankings.length > 0 && (
              <div className={styles.rankingTable}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Player</th>
                      <th>Class</th>
                      <th>Ranked Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rankings.map((player) => (
                      <tr
                        key={player.dwCharID}
                        className={player.rank <= 3 ? styles.topThree : ""}
                      >
                        <td className={styles.rankCell}>
                          {player.rank === 1 && "🥇"}
                          {player.rank === 2 && "🥈"}
                          {player.rank === 3 && "🥉"}
                          {player.rank > 3 && `#${player.rank}`}
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
                              width={24}
                              height={24}
                              style={{ imageRendering: "pixelated" }}
                            />
                            <span>{getClassIcon(player.bClass)}</span>
                          </div>
                        </td>
                        <td className={styles.pointsCell}>{player.totalPoints}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
      </div>
    </div>
  );
}

