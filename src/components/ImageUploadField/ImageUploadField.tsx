'use client';
import { useCallback } from 'react';
import { useMultiImageUpload } from '@/hooks/useMultiImageUpload';
import styles from './ImageUploadField.module.scss';

interface Props {
  label: string;
  maxFiles?: number;
  folder?: string;
  onUrlsChange: (urls: string[]) => void;
}

export default function ImageUploadField({
  label,
  maxFiles = 5,
  folder = "masjid",
  onUrlsChange,
}: Props) {
  const { images, error, uploadFiles, removeImage, isUploading, isFull } =
    useMultiImageUpload(maxFiles, folder);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    e.target.value = "";

    const uploadedUrls = await uploadFiles(files);
    onUrlsChange(uploadedUrls);
  };

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove(styles.dragover);
    const files = Array.from(e.dataTransfer.files);

    const uploadedUrls = await uploadFiles(files);
    onUrlsChange(uploadedUrls);
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add(styles.dragover);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove(styles.dragover);
  };

  const handleRemove = (index: number) => {
    removeImage(index);
    const remaining = images
      .filter((_, i) => i !== index)
      .filter((img) => img.status === "done")
      .map((img) => img.url);
    onUrlsChange(remaining);
  };

  const doneCount = images.filter((i) => i.status === "done").length;

  return (
    <div className={styles.field}>
      {/* Label */}
      <p className={styles.label}>{label}</p>

      {/* Drop Zone */}
      {!isFull && (
        <label
          className={styles.dropzone}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className={styles.fileInput}
            onChange={handleChange}
            disabled={isUploading || isFull}
          />

          <div className={styles.dropzoneIcon}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 
                   18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
              />
            </svg>
          </div>

          <p className={styles.dropzoneTitle}>Tarik & lepas file di sini</p>
          <span className={styles.dropzoneBtn}>Pilih File</span>
          <p className={styles.dropzoneSub}>
            JPG, PNG, WebP · Maks. 5MB per file
          </p>
        </label>
      )}

      {error && <p className={styles.errorMsg}>❌ {error}</p>}

      {/* Preview Grid */}
      {images.length > 0 && (
        <div className={styles.previewGrid}>
          {images.map((img, index) => (
            <div key={index} className={styles.previewItem}>
              <img
                src={img.preview}
                alt={img.name}
                className={styles.previewImg}
                style={{ opacity: img.status === "uploading" ? 0.5 : 1 }}
              />

              <div className={styles.previewOverlay} />

              {/* Status */}
              <div className={styles.statusBadge}>
                {img.status === "uploading" && (
                  <span className={styles.spinner} />
                )}
                {img.status === "done" && (
                  <svg
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
                {img.status === "error" && (
                  <svg
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </div>

              {/* Tombol Hapus */}
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => handleRemove(index)}
                disabled={img.status === "uploading"}
                aria-label="Hapus gambar"
              >
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Counter */}
      <p className={styles.counter}>
        {doneCount} / {maxFiles} gambar terupload
      </p>
    </div>
  );
}