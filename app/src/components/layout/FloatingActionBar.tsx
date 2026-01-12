import type { ReactNode } from 'react';
import styles from './FloatingActionBar.module.css';

interface FloatingActionBarProps {
  children: ReactNode;
}

export function FloatingActionBar({ children }: FloatingActionBarProps) {
  return (
    <>
      {/* Spacer to prevent content overlap */}
      <div className={styles.spacer} />
      {/* Fixed bar */}
      <div className={styles.container}>
        <div className={styles.bar}>
          {children}
        </div>
      </div>
    </>
  );
}
