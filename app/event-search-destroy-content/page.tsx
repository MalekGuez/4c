"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./news.module.css";

export default function EventSearchDestroyContentPage() {
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
            src="/images/news/Content-Event.png"
            alt="Search & Destroy Content Event"
            width={900}
            height={506}
            className={styles.heroImage}
            priority
          />
        </div>

        <div className={styles.newsContent}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>4Chaos – Search & Destroy Content Event</h2>
            <p style={{ marginBottom: "24px", color: "#BDBDBD" }}>
              We are pleased to announce a content creation event focused on <strong>Search & Destroy gameplay</strong> on the 4Chaos server. Participants can earn monetary rewards by creating and sharing qualifying video content during the event period.
            </p>
          </div>

          <div className={styles.section}>
            <h3 className={styles.subsectionTitle}>Event Period</h3>
            <ul className={styles.patchList}>
              <li><strong>Start date:</strong> Saturday, March 14</li>
              <li><strong>End date:</strong> Saturday, April 4</li>
              <li>All content must be <strong>submitted no later than April 6</strong>.</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h3 className={styles.subsectionTitle}>Rewards</h3>
            <ul className={styles.patchList}>
              <li><strong>YouTube videos:</strong> €10 per approved video</li>
              <li><strong>YouTube Shorts / TikTok:</strong> €5 per approved video</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h3 className={styles.subsectionTitle}>Content Requirements</h3>

            <h4 className={styles.featureTitle}>YouTube Videos</h4>
            <ul className={styles.patchList}>
              <li>Must feature <strong>Search & Destroy gameplay</strong> on 4Chaos</li>
              <li>Minimum duration: <strong>2 minutes</strong></li>
              <li>Minimum resolution: <strong>1080p</strong></li>
              <li>Must include the terms <strong>“4Chaos”</strong> and <strong>“Search & Destroy”</strong> in the title or description</li>
              <li>Must include the server link in the description: <a href="https://4chaos.com" target="_blank" rel="noopener noreferrer" style={{ color: "#790801" }}>https://4chaos.com</a></li>
            </ul>

            <h4 className={styles.featureTitle}>YouTube Shorts / TikTok</h4>
            <ul className={styles.patchList}>
              <li>Must feature <strong>Search & Destroy gameplay</strong> on 4Chaos</li>
              <li>Minimum duration: <strong>25 seconds</strong></li>
              <li>Minimum resolution: <strong>1080p</strong></li>
              <li>Must include the terms <strong>“4Chaos”</strong> and <strong>“Search & Destroy”</strong> in the title or description</li>
              <li>Must include the server link in the description: <a href="https://4chaos.com" target="_blank" rel="noopener noreferrer" style={{ color: "#790801" }}>https://4chaos.com</a></li>
            </ul>
          </div>

          <div className={styles.section}>
            <h3 className={styles.subsectionTitle}>Submission Rules</h3>
            <ul className={styles.patchList}>
              <li>Submitted content must <strong>exclusively display Search & Destroy gameplay</strong></li>
              <li>A <strong>minimum interval of 24 hours</strong> is required between each upload</li>
              <li>Maximum <strong>2 Shorts / TikToks per week</strong></li>
              <li>Maximum <strong>2 YouTube videos per week</strong></li>
            </ul>
            <p style={{ marginTop: "16px", color: "#BDBDBD" }}>
              Content uploaded during the event period must be submitted <strong>before April 6</strong> via:
            </p>
            <ul className={styles.patchList}>
              <li>Opening a <Link href="/tickets" style={{ color: "#790801" }}>ticket on our website</Link>, or</li>
              <li>Directly contacting a staff member</li>
            </ul>
            <p style={{ marginTop: "16px", marginBottom: "8px", color: "#BDBDBD" }}>
              Each submission must include:
            </p>
            <ul className={styles.patchList}>
              <li>Video link</li>
              <li>Discord username</li>
              <li>PayPal email address</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h3 className={styles.subsectionTitle}>Reward Distribution</h3>
            <p style={{ color: "#BDBDBD", marginBottom: "12px" }}>
              Rewards will be distributed <strong>within 7 days after the event concludes</strong>.
            </p>
            <p style={{ color: "#BDBDBD" }}>
              A valid <strong>PayPal address</strong> is required to receive monetary rewards. If PayPal is not available, an <strong>equivalent value may be granted in in-game currency</strong>.
            </p>
          </div>

          <div className={styles.section}>
            <h3 className={styles.subsectionTitle}>Additional Information</h3>
            <ul className={styles.patchList}>
              <li>All gameplay styles are accepted, including content created by newer players.</li>
              <li>Submissions may be rejected if they contain <strong>low-effort or non-meaningful content</strong> (e.g. AFK gameplay, black screens, spam uploads), attempt to <strong>exploit or abuse the reward system</strong>, include <strong>repetitive or substantially similar content</strong>, or do not <strong>clearly demonstrate Search & Destroy gameplay</strong>.</li>
              <li>Only <strong>genuine and authentic gameplay content</strong> will be eligible for rewards.</li>
              <li>The organizers reserve the right to <strong>disqualify any participant at their sole discretion</strong>, without obligation to provide justification.</li>
            </ul>
            <div className={styles.highlightBlock}>
              <p style={{ margin: 0, color: "#BDBDBD" }}>
                Thanks to <strong>Ashura</strong> who agreed to sponsor this event.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
