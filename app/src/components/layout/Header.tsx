import styles from './Header.module.css';

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <span className={styles.logoIcon}>🍌</span>
        <span className={styles.logoText}>Nano Banana</span>
        <span className={styles.logoBadge}>Pro</span>
      </div>
      <p className={styles.tagline}>Professional Product Creatives</p>
    </header>
  );
}
