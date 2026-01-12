import styles from './ResourcesPanel.module.css';

interface Resource {
  title: string;
  description: string;
  url: string;
  icon: string;
  tag?: string;
}

const resources: Resource[] = [
  {
    title: 'Nano Banana Prompting Guide',
    description: 'Master the art of prompting Gemini for stunning image generation',
    url: 'https://x.com/googleaistudio/status/1994480371061469306',
    icon: '🍌',
    tag: 'Guide',
  },
  {
    title: 'Generate Ad Creatives',
    description: 'Learn how to create professional ad creatives with AI',
    url: 'https://x.com/azed_ai/status/2000845183257292883',
    icon: '✨',
    tag: 'Tutorial',
  },
];

export function ResourcesPanel() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.icon}>📚</span>
        <h3 className={styles.title}>Resources</h3>
      </div>

      <div className={styles.list}>
        {resources.map((resource, index) => (
          <a
            key={index}
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.card}
          >
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>{resource.icon}</span>
              {resource.tag && (
                <span className={styles.tag}>{resource.tag}</span>
              )}
            </div>
            <h4 className={styles.cardTitle}>{resource.title}</h4>
            <p className={styles.cardDescription}>{resource.description}</p>
            <div className={styles.linkIndicator}>
              <span>Read on X</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17L17 7" />
                <path d="M7 7h10v10" />
              </svg>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
