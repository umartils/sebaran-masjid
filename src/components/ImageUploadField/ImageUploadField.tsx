'use client';
import { useCallback } from "react";
import { useMultiImageUpload } from "@/hooks/useMultiImageUpload";
import styles from "./ImageUploadField.module.scss";

interface Props {
  label: string;
  maxFiles?: number;
  folder?: string;
  onUrlsChange: (urls: string[]) => void;
  existingUrls?: string[];
}

export default function ImageUploadField({
  label,
  maxFiles = 5,
  folder = "masjid",
  onUrlsChange,
  existingUrls = [],
}: Props) {
  const { images, error, uploadFiles, removeImage, clearDone, isUploading, isFull } =
    useMultiImageUpload(maxFiles, folder, existingUrls.length); // ✅ kasih tahu hook jumlah foto lama

  const syncUploaded = (newUrls: string[]) => {
    if (!newUrls.length) return;
    onUrlsChange([...existingUrls, ...newUrls]); // ✅ selalu tambah, jangan replace
    clearDone(); // ✅ bersihkan dari state hook karena sudah pindah ke existingUrls
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    e.target.value = "";
    syncUploaded(await uploadFiles(files));
  };

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.currentTarget.classList.remove(styles.dragover);
      const files = Array.from(e.dataTransfer.files);
      if (!files.length) return;
      syncUploaded(await uploadFiles(files));
    },
    [existingUrls, uploadFiles] // eslint: syncUploaded pakai existingUrls terbaru tiap render
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add(styles.dragover);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove(styles.dragover);
  };

  // Hapus foto yang sudah final (ada di existingUrls) — TIDAK menyentuh images sama sekali
  const handleRemoveExisting = (index: number) => {
    onUrlsChange(existingUrls.filter((_, i) => i !== index));
  };

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
            accept="image/jpeg,image/png,image/webp"
            multiple
            className={styles.fileInput}
            onChange={handleChange}
            disabled={isUploading || isFull}
          />
          <div className={styles.dropzoneIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
          </div>
          <p className={styles.dropzoneTitle}>Tarik & lepas file di sini</p>
          <span className={styles.dropzoneBtn}>Pilih File</span>
          <p className={styles.dropzoneSub}>JPG, PNG, WebP · Maks. 5MB per file</p>
        </label>
      )}

      {error && <p className={styles.errorMsg}>❌ {error}</p>}

      {(existingUrls.length > 0 || images.length > 0) && (
        <div className={styles.previewGrid}>
          {existingUrls.map((url, index) => (
            <div key={`existing-${index}`} className={styles.previewItem}>
              <img src={url} alt={`existing-${index}`} className={styles.previewImg} />
              <button type="button" className={styles.removeBtn} onClick={() => handleRemoveExisting(index)}>
                ✕
              </button>
            </div>
          ))}

          {/* Setelah clearDone(), array ini praktis hanya berisi item uploading/error */}
          {images.map((img, index) => (
            <div key={index} className={styles.previewItem}>
              <img
                src={img.preview}
                alt={img.name}
                className={styles.previewImg}
                style={{ opacity: img.status === "uploading" ? 0.5 : 1 }}
              />
              <div className={styles.previewOverlay} />
              <div className={styles.statusBadge}>
                {img.status === "uploading" && <span className={styles.spinner} />}
                {img.status === "error" && (
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => removeImage(index)}
                disabled={img.status === "uploading"}
                aria-label="Hapus gambar"
              >
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      <p className={styles.counter}>
        {existingUrls.length} / {maxFiles} gambar terupload
      </p>
    </div>
  );
}