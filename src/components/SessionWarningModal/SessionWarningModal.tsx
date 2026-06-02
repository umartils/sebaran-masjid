"use client";

import styles from "./SessionWarningModal.module.scss";

interface Props {
  remainingSeconds: number;
  onStayLoggedIn: () => void;
}

export function SessionWarningModal({ remainingSeconds, onStayLoggedIn }: Props) {
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const formatted = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.icon}>⏱️</div>
        <h2 className={styles.title}>Sesi Akan Berakhir</h2>
        <p className={styles.description}>
          Anda tidak aktif. Sesi akan otomatis berakhir dalam:
        </p>
        <div className={styles.countdown}>{formatted}</div>
        <button className={styles.button} onClick={onStayLoggedIn}>
          Tetap Login
        </button>
      </div>
    </div>
  );
}