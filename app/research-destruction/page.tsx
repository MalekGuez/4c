"use client";

import Image from "next/image";
import styles from "./news.module.css";

export default function ResearchDestructionPage() {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerBar}>
        <Image
          src="/images/titles/News.png"
          alt="News"
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
            style={{ width: "100%", height: "auto" }}
          />
        </div>
      </div>

      <div className={styles.contentWrapper}>
        <div className={styles.heroImageWrapper}>
          <Image
            src="/images/news/SnD.png"
            alt="Research & Destruction — New 3v3 PvP Mode"
            width={900}
            height={506}
            className={styles.heroImage}
            priority
          />
        </div>

        <div className={styles.newsContent}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Patch Notes – Update</h2>
          </div>

          <div className={styles.section}>
            <h3 className={styles.subsectionTitle}>New Features</h3>

            <h4 className={styles.featureTitle}>Research & Destruction — New 3v3 PvP Mode</h4>
            <p style={{ marginBottom: "16px", color: "#BDBDBD" }}>
              A round-based tactical mode inspired by Search & Destroy. Two teams of 3 face off with 1 HP each — every shot is lethal.
            </p>
            <ul className={styles.patchList}>
              <li>
                One team attacks, the other defends. Attackers must plant the bomb, defenders must prevent it or defuse it within 30 seconds.
              </li>
              <li>
                If the bomb explodes, attackers win the round. If time runs out without a plant, defenders win.
              </li>
              <li>
                Eliminating the entire enemy team wins the round — unless the bomb is already planted, in which case defenders must still defuse.
              </li>
              <li>
                After 3 rounds, sides swap. First team to 4 round wins takes the match.
              </li>
              <li>All players share the same loadout: Flash, Dodge, and No-Target skills.</li>
              <li>Kill and multikill sound effects (Double Kill, Ace) play during the match.</li>
              <li>Bomb timer displayed when planted. Ticking sound accelerates as detonation approaches.</li>
              <li>Rewards are sent by mail at the end of the match: base chest amount + bonus per kill + bonus for winning.</li>
            </ul>

            <h4 className={styles.featureTitle}>Flying Mount System</h4>
            <p style={{ color: "#BDBDBD" }}>
              A new flying mount system has been introduced. Flying is currently only available in Eldoria.
            </p>
          </div>

          <div className={styles.section}>
            <h3 className={styles.subsectionTitle}>Fixes and Improvements</h3>
            <ul className={styles.patchList}>
              <li>Fixed &quot;Started!&quot; message appearing randomly during Clash Gauntlet rounds.</li>
              <li>Improved engine quality and lighting: objects and items should now appear noticeably higher quality than before.</li>
              <li>Added instant Exit Game and Character Selection while in Eldoria.</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h3 className={styles.subsectionTitle}>Gameplay Changes</h3>
            <ul className={styles.patchList}>
              <li>CTF now requires 5 points to win.</li>
              <li>During Mission War, you still gain points even after killing the same player more than 3 times.</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h3 className={styles.subsectionTitle}>Economy</h3>
            <ul className={styles.patchList}>
              <li>Removed upgrade costs for items under +19.</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h3 className={styles.subsectionTitle}>Cash-Shop</h3>
            <ul className={styles.patchList}>
              <li>Added 2 flying mounts: Atomic Rider and VX-00 Striker.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
