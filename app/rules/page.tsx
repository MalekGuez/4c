"use client";

import Image from 'next/image';
import styles from './rules.module.css';

export default function RulesPage() {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerBar}>
        <Image
          src="/images/titles/Rules.png"
          alt="Rules"
          width={178}
          height={73}
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
        <div className={styles.rulesContent}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>1 - In-Game Behavior</h2>
            <ul className={styles.rulesList}>
              <li>Farming credits via secondary account or PC is prohibited.</li>
              <li>Spamming is forbidden. This includes repetitive messages, all caps, or anything that disrupts gameplay.</li>
              <li>Discussion of hacks, exploits, or other harmful topics is prohibited.</li>
              <li>Encouraging other players to break rules is punishable to the same extent as the person breaking the rules.</li>
              <li>Scamming is prohibited. Any attempt to steal another player for personal gain will be punished.</li>
              <li>Lending items to others is at your own risk. 4Chaos will not recover lost items.</li>
              <li>Disrupting GM events, trolling, or violating event rules is forbidden.</li>
              <li>Treat other players with respect. Insults, trolling, or offensive comments are strictly forbidden.</li>
              <li>Farming rewards simultaneously in battle modes using secondary PC/account is banned.</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>2 - Hacking & Bug Abuse</h2>
            <ul className={styles.rulesList}>
              <li>Using software or devices to hide your identity or bypass restrictions is forbidden (VPN excepted).</li>
              <li>Abruptly disconnecting to avoid death or escape a fight is strictly prohibited.</li>
              <li>Exploiting bugs or glitches is forbidden. You may report them as soon as possible via ticket system.</li>
              <li>Bots or macros for farming are not allowed.</li>
              <li>Virtual machines or similar environments are strictly prohibited.</li>
              <li>Hacking is strictly forbidden, any violations will be permanently banned.</li>
              <li>Using bugs or cheats is prohibited.</li>
              <li>Modifying the client or using external tools is forbidden.</li>
              <li>The 4Chaos staff reserves the right to immediately block any new account if the person has previously committed a major rule violation.</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>3 - Punishments</h2>
            <ul className={styles.rulesList}>
              <li>If you break a rule using your secondary account and it gets banned, your main account can be banned as well.</li>
              <li>Providing false evidence (screenshots/videos) to get someone banned or to prove your own innocence is strictly forbidden and will result in a permanent ban.</li>
              <li>Ban appeals must be handled exclusively through the ticket system. You are allowed to ask a GM on Discord's private chat to review the ticket if it is taking too long to get a response.</li>
              <li>If a player is banned, you are not allowed to ask for explanations, the account owner is the only one able to ask.</li>
              <li>If you want to report a player, you must provide a screenshot or a video.</li>
              <li>Chat bans can be temporary or permanently.</li>
              <li>Account can be banned temporary or permanently depending on the situation.</li>
              <li>The more bans you accumulate, the harsher the punishment will become, ranging from a simple warning to a temporary ban, and up to a permanent ban depending on the situation.</li>
              <li>Spending money does not grant special privileges. You donate to help the server.</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>4 - General</h2>
            <ul className={styles.rulesList}>
              <li>Any suspicious situation will be judged at the discretion of the staff.</li>
              <li>These rules cannot cover every possible situation. Use common sense and do not try to exploit loopholes. Rules will be updated to address new situations as they arise.</li>
              <li>Decisions made by staff members are final. Attempting to contact another staff member for a different outcome may result in an extended ban.</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>5 - Guild Rules</h2>
            <ul className={styles.rulesList}>
              <li>Abusing deputy rights is forbidden and may result in account bans and compensation.</li>
              <li>Logging into another player's account to assign yourself as guild leader or to kick members is strictly forbidden.</li>
              <li>Offensive guild names are forbidden.</li>
              <li>Offensive guild names are banned (racist, religious, sexist, etc..).</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>6 - Character Names</h2>
            <ul className={styles.rulesList}>
              <li>Names with overly-lengthy or incomprehensible letter configurations are forbidden</li>
              <li>Using the names of 4Chaos staff on a character is forbidden. Said character will be deleted upon discovery with no warning.</li>
              <li>Offensive names are banned (racist, religious, sexist, etc..).</li>
              <li>Advertising in names is forbidden.</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>7 - Reporting Players</h2>
            <ul className={styles.rulesList}>
              <li>Videos/Screenshots only.</li>
              <li>Requesting an update on a ban for another player you reported is not allowed. It's none of your business.</li>
              <li>When reporting a player, indicate the exact time in the video when the rule was broken to save us time. Also, make sure to include the date and time of the incident.</li>
              <li>Screenshots must be full-screen.</li>
              <li>Reports must go through tickets.</li>
              <li>Do not modify evidence.</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>8 - 4Chaos Staff</h2>
            <ul className={styles.rulesList}>
              <li>Staff have the following tags → [TGM, GM, SGM, GA, COMA]</li>
              <li>Impersonating staff is prohibited.</li>
              <li>Impersonating a staff member is strictly prohibited.</li>
              <li>Staff will never ask for personnal account informations.</li>
              <li>Player must follow instructions and decisions made by 4Chaos team immediately upon issuance.</li>
              <li>Game masters are not allowed to give any player any advantage over other players.</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>9 - Staff Support</h2>
            <ul className={styles.rulesList}>
              <li>Any sanction must be supported by video or screenshot evidence. If a staff member issues a ban without proper proof, it may result in the ban being extended.</li>
              <li>Disputes about bans must be submitted via ticket within 3 days. Requests after this period will not be considered.</li>
              <li>If a player is dissatisfied with a staff response, they may request a review from a higher rank staff member.</li>
              <li>Tickets should generally be written in English.</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>10 - Game Modes</h2>
            <ul className={styles.rulesList}>
              <li>Going AFK or leaving a battle mode is prohibited.</li>
              <li>Deliberate sabotage, griefing, throwing of your team is not allowed.</li>
              <li>Teaming with other players is prohibited.</li>
              <li>Targeting a single player is prohibited. Intentionally dying repeatedly to annoy another player is strictly prohibited.</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>11 - Real World Trading</h2>
            <ul className={styles.rulesList}>
              <li>Selling/Buying for real money is striclty prohibited.</li>
              <li>The first offense of selling for real money results in a 90-day ban and the suppression of the items. If the player repeats the offense, all items will be removed and you will be permanently trade ban.</li>
              <li>Submitting false evidence to get someone banned is strictly prohibited.</li>
              <li>Rules may be added at our discretion in exceptional cases.</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>12 - Donations</h2>
            <ul className={styles.rulesList}>
              <li>All donations are final and non-refundable. Filing a dispute on Paypal may result in a permanent ban of your account.</li>
              <li>4Chaos does not guarantee any rewards (Credits or Moonstones) for donations.</li>
              <li>Any issues with the donation system must be reported immediately.</li>
              <li>4Chaos is a private server, all donations are used exclusively to maintain and improve the server.</li>
              <li>Exploiting any donation mechanics will result in a permanent ban of your account.</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>13 - Legal Notice</h2>
            <ul className={styles.rulesList}>
              <li>Players do not own any virtual goods in 4Chaos, including those obtained with Moonstones. Virtual goods have no monetary value and cannot be redeemed for cash.</li>
              <li>Refunds for Moonstones are not possible except certain cases.</li>
              <li>4Chaos reserves the right to modify, remove, transfer, or delete any game content, including virtual goods, at any time, for any reason, with or without notice, without liability.</li>
              <li>Rules can be added or removed at any time, and it is your responsibility to stay informed.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
