import Image from 'next/image';
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
  return (
    <a href={link} className={styles.announcement}>
      <div className={styles.content}>
        <div className={styles.category}>
          {category}
        </div>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
        <div className={styles.bottomRow}>
          <span className={styles.readMoreBtn}>
            Click to read more
          </span>
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
    </a>
  );
}
