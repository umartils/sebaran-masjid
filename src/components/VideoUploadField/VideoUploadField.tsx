'use client';
import { useCallback } from "react";
import { useMultiVideoUpload } from "@/hooks/useVideoUpload";
import styles from "./VideoUploadField.module.scss"; // bisa copy dari ImageUploadField.module.scss, class name-nya generic

interface Props {
  label: string;
  maxFiles?: number;
  folder?: string;
  onUrlsChange: (urls: string[]) => void;
  existingUrls?: string[];
}

export default function VideoUploadField({
  label,
  maxFiles = 2,
  folder = "masjid-video",
  onUrlsChange,
  existingUrls = [],
}: Props) {
  const { videos, error, uploadFiles, removeVideo, isUploading, isFull } =
    useMultiVideoUpload(maxFiles, folder);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    e.target.value = "";

    const uploadedUrls = await uploadFiles(files);
    onUrlsChange([...existingUrls, ...uploadedUrls]);
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
    removeVideo(index);
    const remaining = videos
      .filter((_, i) => i !== index)
      .filter((v) => v.status === "done")
      .map((v) => v.url);
    onUrlsChange(remaining);
  };

  const doneCount = videos.filter((v) => v.status === "done").length;

  return (
    <div className={styles.field}>
      <p className={styles.label}>{label}</p>

      {!isFull && (
        <label
          className={styles.dropzone}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="video/mp4,video/webm,video/quicktime"
            multiple
            className={styles.fileInput}
            onChange={handleChange}
            disabled={isUploading || isFull}
          />
          <div className={styles.dropzoneIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-2.72a.75.75 0 011.28.53v7.38a.75.75 0 01-1.28.53l-4.72-2.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-7.5A2.25 2.25 0 0013.5 6.75h-9A2.25 2.25 0 002.25 9v7.5a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <p className={styles.dropzoneTitle}>Tarik & lepas video di sini</p>
          <span className={styles.dropzoneBtn}>Pilih Video</span>
          <p className={styles.dropzoneSub}>MP4, WebM, MOV · Maks. 50MB per file</p>
        </label>
      )}

      {error && <p className={styles.errorMsg}>❌ {error}</p>}

      {(existingUrls.length > 0 || videos.length > 0) && (
        <div className={styles.previewGrid}>
          {existingUrls.map((url, index) => (
            <div key={`existing-${index}`} className={styles.previewItem}>
              <video src={url} className={styles.previewImg} muted />
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => {
                  const updated = existingUrls.filter((_, i) => i !== index);
                  const uploadedUrls = videos.filter((v) => v.status === "done").map((v) => v.url);
                  onUrlsChange([...updated, ...uploadedUrls]);
                }}
              >
                ✕
              </button>
            </div>
          ))}
          {videos.map((v, index) => (
            <div key={index} className={styles.previewItem}>
              <video
                src={v.preview}
                className={styles.previewImg}
                style={{ opacity: v.status === "uploading" ? 0.5 : 1 }}
                muted
              />
              <div className={styles.previewOverlay} />
              <div className={styles.statusBadge}>
                {v.status === "uploading" && <span>{v.progress}%</span>}
                {v.status === "done" && (
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {v.status === "error" && (
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => handleRemove(index)}
                disabled={v.status === "uploading"}
                aria-label="Hapus video"
              >
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      <p className={styles.counter}>{doneCount} / {maxFiles} video terupload</p>
    </div>
  );
}