import styles from "./loading.module.scss";

export default function Loading() {
  return (
    <div className={styles.loadingPage} aria-label="Memuat halaman..." role="status">
      <div className={styles.loadingCard}>
        {/* Spinner */}
        <div className={styles.spinnerWrapper}>
          <div className={styles.spinnerOuter} />
          <div className={styles.spinnerInner} />
          <div className={styles.spinnerDot} />
        </div>

        {/* Text */}
        <div className={styles.loadingText}>
          <p className={styles.loadingLabel}>Memuat halaman</p>
          <div className={styles.loadingDots}>
            <span />
            <span />
            <span />
          </div>
        </div>

        {/* Skeleton bars */}
        <div className={styles.skeletonGroup}>
          <div className={`${styles.skeletonBar} ${styles.skeletonBarLong}`} />
          <div className={`${styles.skeletonBar} ${styles.skeletonBarMedium}`} />
          <div className={`${styles.skeletonBar} ${styles.skeletonBarShort}`} />
        </div>
      </div>
    </div>
  );
}