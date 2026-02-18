import Image from 'next/image';
import Link from 'next/link';
import styles from './announcement.module.css';

interface AnnouncementProps {
  category: string;
  title: string;
  description: string;
  image: string;
  link: string;
  date?: string;
}

export default function Announcement({
  category,
  title,
  description,
  image,
  link,
  date
}: AnnouncementProps) {
  const isInternalLink = link.startsWith('/');
  
  const content = (
    <>
      <div className={styles.content}>
        <div className={styles.category}>
          {category}
        </div>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description} dangerouslySetInnerHTML={{ __html: description }}></p>
        <div className={styles.bottomRow}>
          {/* TODO: Implémenter plus tard */}
          {/* <span className={styles.readMoreBtn}>
            Click to read more
          </span> */}
          {date && (
            <span className={styles.date}>{date}</span>
          )}
        </div>
      </div>
      
      <div className={styles.imageContainer}>
        <Image
          src={image}
          alt={title}
          width={400}
          height={300}
          className={styles.image}
          quality={95}
          priority={image.includes('4Chaos.png')}
          unoptimized={false}
        />
      </div>
    </>
  );

  if (isInternalLink) {
    return (
      <Link href={link} className={styles.announcement}>
        {content}
      </Link>
    );
  }

  return (
    <a href={link} className={styles.announcement} target="_blank" rel="noopener noreferrer">
      {content}
    </a>
  );
}
