"use client";
import { useState, useMemo } from 'react';
import Image from 'next/image';
import Announcement from "./components/Announcement";
import Pagination from "./components/Pagination";
import styles from "./styles/page.module.css";

const announcements = [
  {
    id: 9,
    category: "UPDATE",
    title: "Patch Notes – Latest Update",
    description: "Bug fixes, Dummy Training improvements, Valentine's Cash Shop rotation, and exciting weekend events!<br><br><strong>A new game mode arrives SOON.</strong><br><br><strong>Click to read the full patch notes.</strong>",
    image: "/images/news/valentine.png",
    link: "/valentine-update",
    date: "14. Feb. 2026"
  },
  {
    id: 1,
    category: "NEWS",
    title: "4Chaos is coming.",
    description: "Prepare yourself for the next evolution of chaos! 4Chaos is launching soon with new features, reworked mechanics and a world unlike anything you've seen before. Stay tuned and be ready to join us!",
    image: "/images/news/4Chaos.png",
    link: "/",
    date: "30 Sept. 2025"
  },
  {
    id: 2,
    category: "NEWS",
    title: "Welcome to 4Chaos.",
    description: "Welcome to 4Chaos, the next evolution of chaos! Our gates are open, come join us in the chaos!",
    image: "/images/news/4Chaos.png",
    link: "/",
    date: "11. Oct. 2025"
  },
  {
    id: 3,
    category: "FEATURE",
    title: "Introducing Our New Exclusive Class Switching System!",
    description: "We're thrilled to unveil a brand-new Class Switching Mode System — a revolutionary feature that lets you master every class in the game and prove your true versatility as a player. Show your skill. Conquer every class. Become unstoppable.",
    image: "/images/news/switch-class.png",
    link: "/",
    date: "13. Oct. 2025"
  },
  {
    id: 4,
    category: "FEATURE",
    title: "Rapid Fire System",
    description: "Experience lightning-fast combat with our new Rapid Fire System! Simply enable the checkbox next to your key skills and hold down the key to automatically spam the skill. Perfect your timing and make your combat experience smoother than ever.",
    image: "/images/news/rapid-fire.png",
    link: "/",
    date: "15. Oct. 2025"
  },
  {
    id: 5,
    category: "EVENT",
    title: "Domination Week-end - Event",
    description: "Prepare yourselves for an all-out war! Throughout the entire weekend, Valorian and Derion will clash endlessly across Iberia. Every kill and assist counts toward your final ranking. Only the fiercest fighters will reach the top!<br><br>More information on Discord.",
    image: "/images/news/domination-weekend.png",
    link: "https://discord.gg/4Chaos",
    date: "18. Oct. 2025"
  },
  // {
  //   id: 6,
  //   category: "EVENT",
  //   title: "Clash Gauntlet - 300€ Cash Prize",
  //   description: "Participate in the Clash Gauntlet event and compete for a 300€ cash prize plus exclusive rewards! Win rounds to earn points and climb the rankings. <br><br>Check the event page for full details and schedule.",
  //   image: "/images/news/cgthumb.png",
  //   link: "/event",
  //   date: "29. Nov. 2025"
  // },
  {
    id: 7,
    category: "NEWS",
    title: "Security Clarification",
    description: "False information has been circulating claiming our launcher or client contains a virus. To address these concerns, we submitted both 4Chaos.exe and TClient.exe to VirusTotal: <strong>1 detection out of 72 antivirus engines</strong> (which is not a real threat, and just a false positive). <br>The server has been open for almost 2 months with thousands of active players, and no legitimate security issues have been reported. You can verify this yourself by scanning the files or uploading them to VirusTotal. <br><strong>More information on Discord.</strong>",
    image: "/images/news/worker.png",
    link: "https://discord.gg/4Chaos",
    date: "1. Dec. 2025"
  },
  {
    id: 8,
    category: "NEWS",
    title: "Server Returns December 26th at 20:00!",
    description: "The server returns on December 26th at 20:00 with major changes! Prepare yourself for a completely reimagined experience with new features, improved mechanics, and much more. Stay tuned for more information!",
    image: "/images/news/worker.png",
    link: "/",
    date: "26. Dec. 2025"
  },
  // {
  //   id: 8,
  //   category: "EVENT",
  //   title: "Clash Gauntlet Event - Reworked!",
  //   description: "🔁 Event reworked! All ranked modes now count. Scoring based on ranked points gained during both weekends (Dec 6-7 & 13-14).<br><br>💰 Rewards unchanged: 300€ + exclusive rewards.<br><br><strong>Check event page for more info.</strong>",
  //   image: "/images/news/cgthumb.png",
  //   link: "/event",
  //   date: "2. Dec. 2025"
  // },
];

export default function Home() {
  const [currentPage, setCurrentPage] = useState(1);
  const announcementsPerPage = 5;
  
  const { totalPages, currentAnnouncements } = useMemo(() => {
    // Trier par ID décroissant (plus grand ID en premier)
    const sortedAnnouncements = [...announcements].sort((a, b) => b.id - a.id);
    
    const totalPages = Math.ceil(sortedAnnouncements.length / announcementsPerPage);
    const startIndex = (currentPage - 1) * announcementsPerPage;
    const endIndex = startIndex + announcementsPerPage;
    const currentAnnouncements = sortedAnnouncements.slice(startIndex, endIndex);
    return { totalPages, currentAnnouncements };
  }, [currentPage, announcementsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={styles.page}>
      <div className={styles.homeSection}>
        <div className={styles.newsBar}>
          <Image
            src="/images/titles/News.png"
            alt="News"
            width={169}
            height={60}
            className={styles.newsTitle}
            priority
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          />
          <div className={styles.bar}>
            <Image
              src="/images/titles/Bar.png"
              alt="Bar"
              width={991}
              height={8}
              className={styles.barImage}
              style={{ width: '100%', height: 'auto' }}
            />
          </div>
        </div>

        <div className={styles.contentContainer}>
          <div className={styles.announcementsGrid}>
            {currentAnnouncements.map((announcement) => (
              <Announcement
                key={announcement.id}
                category={announcement.category}
                title={announcement.title}
                description={announcement.description}
                image={announcement.image}
                link={announcement.link}
                date={announcement.date}
              />
            ))}
          </div>
          
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </div>
  );
}
