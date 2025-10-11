"use client";
import { useState, useMemo } from 'react';
import Image from 'next/image';
import Announcement from "./components/Announcement";
import Pagination from "./components/Pagination";
import styles from "./styles/page.module.css";

const announcements = [
  {
    id: 1,
    category: "NEWS",
    title: "4Chaos is coming.",
    description: "Prepare yourself for the next evolution of chaos! 4Chaos is launching soon with epic adventures, new features, and a world unlike anything you've seen before. Stay tuned and be ready to join us!",
    image: "/images/news/4Chaos.png",
    link: "/",
    date: "30 Sept. 2025"
  },
  {
    id: 2,
    category: "NEWS",
    title: "WELCOME TO 4CHAOS!",
    description: "Our doors are now open! Join us in the chaos and experience the new pvp era - Reborn.",
    image: "/images/news/4Chaos.png",
    link: "/",
    date: "11 Oct. 2025"
  }
];

export default function Home() {
  const [currentPage, setCurrentPage] = useState(1);
  const announcementsPerPage = 5;
  
  const { totalPages, currentAnnouncements } = useMemo(() => {
    const totalPages = Math.ceil(announcements.length / announcementsPerPage);
    const startIndex = (currentPage - 1) * announcementsPerPage;
    const endIndex = startIndex + announcementsPerPage;
    const currentAnnouncements = announcements.slice(startIndex, endIndex);
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
