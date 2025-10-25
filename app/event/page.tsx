"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./event.module.css";

export default function EventPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to home page - event is ended
    router.push('/');
  }, [router]);

  // Show loading message while redirecting
  return (
    <div className={styles.pageContainer}>
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Event ended. Redirecting...</p>
      </div>
    </div>
  );
}
