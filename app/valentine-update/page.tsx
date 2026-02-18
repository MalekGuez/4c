"use client";

import Image from 'next/image';
import styles from './patchNotes.module.css';

export default function ValentineUpdatePage() {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerBar}>
        <Image
          src="/images/titles/News.png"
          alt="Patch Notes"
          width={169}
          height={60}
          className={styles.titleImage}
        />
        <div className={styles.bar}>
          <Image
            src="/images/titles/Bar.png"
            alt="Bar"
            width={991}
            height={8}
            className={styles.barImage}
            priority
            style={{ width: '100%', height: 'auto' }}
          />
        </div>
      </div>

      <div className={styles.contentWrapper}>
        <div className={styles.patchNotesContent}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>🛠️ Patch Notes – Latest Update</h2>
          </div>

          <div className={styles.section}>
            <h3 className={styles.subsectionTitle}>🐞 Bug Fixes & Improvements</h3>
            <ul className={styles.patchList}>
              <li>You can now correctly sell Xbows and Bows dropped in Chaotic Hills.</li>
              <li>Fixed a baby fox visual glitch that caused square artifacts.</li>
              <li>You can now ping item cooldowns (e.g. Speed Potion) directly from your bag.</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h3 className={styles.subsectionTitle}>🎯 Dummy Training Improvements</h3>
            <ul className={styles.patchList}>
              <li>You can now right-click training dummies in Eldoria to open a new configuration interface.</li>
              <li>Choose which skill the dummy will use:
                <ul className={styles.nestedList}>
                  <li>Flash</li>
                  <li>Debuff</li>
                  <li>Axe Throw</li>
                  <li>Random Skill (randomly selects between the three)</li>
                </ul>
              </li>
              <li>Skill activation timing can be set to:
                <ul className={styles.nestedList}>
                  <li>Random</li>
                  <li>Static: 1 / 2 / 3 / 4 / 5 seconds</li>
                </ul>
              </li>
            </ul>
          </div>

          <div className={styles.section}>
            <h3 className={styles.subsectionTitle}>🧹 Sell Trash Improvement</h3>
            <p style={{ marginBottom: '15px', color: '#BDBDBD' }}>
              The Sell All Trash feature has been updated. It will now keep items with stronger options. Below are the minimum values kept per option:
            </p>
            <div className={styles.valueTable}>
              <div className={styles.valueRow}>
                <span className={styles.valueLabel}>Attack Rate</span>
                <span className={styles.valueArrow}>→</span>
                <span className={styles.valueNumber}>47</span>
              </div>
              <div className={styles.valueRow}>
                <span className={styles.valueLabel}>Attack Speed</span>
                <span className={styles.valueArrow}>→</span>
                <span className={styles.valueNumber}>12</span>
              </div>
              <div className={styles.valueRow}>
                <span className={styles.valueLabel}>Long Range Attack Speed</span>
                <span className={styles.valueArrow}>→</span>
                <span className={styles.valueNumber}>12</span>
              </div>
              <div className={styles.valueRow}>
                <span className={styles.valueLabel}>Magic Attack Speed</span>
                <span className={styles.valueArrow}>→</span>
                <span className={styles.valueNumber}>12</span>
              </div>
              <div className={styles.valueRow}>
                <span className={styles.valueLabel}>Critical Hit</span>
                <span className={styles.valueArrow}>→</span>
                <span className={styles.valueNumber}>12</span>
              </div>
              <div className={styles.valueRow}>
                <span className={styles.valueLabel}>Critical Magic Hit</span>
                <span className={styles.valueArrow}>→</span>
                <span className={styles.valueNumber}>36</span>
              </div>
              <div className={styles.valueRow}>
                <span className={styles.valueLabel}>Concentration</span>
                <span className={styles.valueArrow}>→</span>
                <span className={styles.valueNumber}>20</span>
              </div>
              <div className={styles.valueRow}>
                <span className={styles.valueLabel}>Magic Hit Chance</span>
                <span className={styles.valueArrow}>→</span>
                <span className={styles.valueNumber}>80</span>
              </div>
              <div className={styles.valueRow}>
                <span className={styles.valueLabel}>Shield Block Rate</span>
                <span className={styles.valueArrow}>→</span>
                <span className={styles.valueNumber}>25</span>
              </div>
              <div className={styles.valueRow}>
                <span className={styles.valueLabel}>Evade</span>
                <span className={styles.valueArrow}>→</span>
                <span className={styles.valueNumber}>63</span>
              </div>
              <div className={styles.valueRow}>
                <span className={styles.valueLabel}>Resistance</span>
                <span className={styles.valueArrow}>→</span>
                <span className={styles.valueNumber}>63</span>
              </div>
              <div className={styles.valueRow}>
                <span className={styles.valueLabel}>Assistances Extra Honor</span>
                <span className={styles.valueArrow}>→</span>
                <span className={styles.valueNumber}>17</span>
              </div>
            </div>
            <p style={{ marginTop: '15px', color: '#BDBDBD' }}>
              Items below these values will be sold automatically. Items at or above these thresholds are considered valuable and will be protected from the sell action.
            </p>
          </div>

          <div className={styles.section}>
            <h3 className={styles.subsectionTitle}>💖 Valentine's Cash Shop Rotation</h3>
            <ul className={styles.patchList}>
              <li>Valentine-themed items are now available in the Cash Shop rotation.</li>
              <li>Akatsuki Robe</li>
              <li>Behemoth Whelp Mount</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h3 className={styles.subsectionTitle}>🎉 Events Schedule</h3>
            
            <div className={styles.eventBlock}>
              <h4 className={styles.eventDateTitle}>📅 Saturdays – 14/02 & 21/02</h4>
              <ul className={styles.patchList}>
                <li><strong>18:00 – 19:00</strong>
                  <ul className={styles.nestedList}>
                    <li>Double drop chance in Chaotic Hills</li>
                    <li>Applies to trash items and upgrades</li>
                  </ul>
                </li>
                <li><strong>19:00 – 20:00</strong>
                  <ul className={styles.nestedList}>
                    <li>+50% Magic Grade</li>
                    <li>Increased chance for better blue jewels</li>
                  </ul>
                </li>
              </ul>
            </div>

            <div className={styles.eventBlock}>
              <h4 className={styles.eventDateTitle}>📅 Sundays – 15/02 & 22/02</h4>
              <ul className={styles.patchList}>
                <li><strong>18:00 – 19:00</strong>
                  <ul className={styles.nestedList}>
                    <li>+50% luck when opening higher runes with Arcane Reagents</li>
                  </ul>
                </li>
                <li><strong>19:00 – 20:00</strong>
                  <ul className={styles.nestedList}>
                    <li>+50% Rare Magic Grade</li>
                    <li>Improved chance to upgrade blue → yellow jewels</li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.subsectionTitle}>🚧 Upcoming Content</h3>
            <ul className={styles.patchList}>
              <li>A new game mode arrives SOON.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

