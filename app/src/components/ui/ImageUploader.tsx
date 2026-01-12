import { useCallback, useRef, useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import styles from './ImageUploader.module.css';

interface ImageUploaderProps {
  preview: string | null;
  onImageSelect: (file: File, preview: string) => void;
  onImageClear: () => void;
}

export function ImageUploader({
  preview,
  onImageSelect,
  onImageClear,
}: ImageUploaderProps) {
  const { t } = useLanguage();
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith('image/')) {
        alert(t.common.errors.uploadImageFile);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onImageSelect(file, result);
      };
      reader.readAsDataURL(file);
    },
    [onImageSelect, t.common.errors.uploadImageFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  if (preview) {
    return (
      <div className={styles.previewContainer}>
        <div className={styles.preview}>
          <img src={preview} alt="Uploaded product" className={styles.image} />
          <button
            type="button"
            className={styles.removeButton}
            onClick={onImageClear}
            aria-label="Remove image"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <p className={styles.previewHint}>{t.stepUpload.dropzone.previewHint}</p>
      </div>
    );
  }

  return (
    <div
      className={`${styles.dropzone} ${isDragging ? styles.dragging : ''}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className={styles.input}
      />
      <div className={styles.content}>
        <div className={styles.iconWrapper}>
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </div>
        <p className={styles.title}>{t.stepUpload.dropzone.title}</p>
        <p className={styles.subtitle}>{t.stepUpload.dropzone.subtitle}</p>
        <p className={styles.formats}>{t.stepUpload.dropzone.formats}</p>
      </div>
    </div>
  );
}
