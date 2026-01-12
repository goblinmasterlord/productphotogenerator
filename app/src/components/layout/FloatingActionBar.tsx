import type { ReactNode } from 'react';
import styles from './FloatingActionBar.module.css';

interface FloatingActionBarProps {
  children: ReactNode;
}

export function FloatingActionBar({ children }: FloatingActionBarProps) {
  return (
    <div className={styles.container}>
      <div className={styles.bar}>
        {children}
      </div>
    </div>
  );
}
