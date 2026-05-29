'use client';
import { useState, useRef } from 'react';

export interface UploadedImage {
  url: string;
  publicId: string;
  preview: string;
  name: string;
  status: 'uploading' | 'done' | 'error';
}

export function useMultiImageUpload(maxFiles = 5, folder = "masjid") {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [error, setError] = useState("");

  // ✅ Ref selalu menyimpan nilai images terkini, tidak stale
  const imagesRef = useRef<UploadedImage[]>([]);

  const updateImages = (
    updater: (prev: UploadedImage[]) => UploadedImage[]
  ) => {
    setImages((prev) => {
      const next = updater(prev);
      imagesRef.current = next;
      return next;
    });
  };

  const uploadFiles = async (files: File[]): Promise<string[]> => {
    const current = imagesRef.current; // ✅ baca dari ref, bukan dari images

    if (current.length + files.length > maxFiles) {
      setError(`Maksimal ${maxFiles} gambar`);
      return current.filter((i) => i.status === "done").map((i) => i.url);
    }

    setError("");
    const startIndex = current.length;

    const newEntries: UploadedImage[] = files.map((file) => ({
      url: "",
      publicId: "",
      preview: URL.createObjectURL(file),
      name: file.name,
      status: "uploading",
    }));

    updateImages((prev) => [...prev, ...newEntries]);

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    const results = await Promise.all(
      files.map(async (file, index) => {
        const stateIndex = startIndex + index;

        if (!allowedTypes.includes(file.type) || file.size > 5 * 1024 * 1024) {
          updateImages((prev) =>
            prev.map((img, i) =>
              i === stateIndex ? { ...img, status: "error" } : img
            )
          );
          return null;
        }

        try {
          const formData = new FormData();
          formData.append("image", file);
          formData.append("folder", folder);

          const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error);

          updateImages((prev) =>
            prev.map((img, i) =>
              i === stateIndex
                ? {
                    ...img,
                    url: data.url,
                    publicId: data.public_id,
                    status: "done",
                  }
                : img
            )
          );

          return data.url as string;
        } catch {
          updateImages((prev) =>
            prev.map((img, i) =>
              i === stateIndex ? { ...img, status: "error" } : img
            )
          );
          return null;
        }
      })
    );

    const existingUrls = current
      .filter((img) => img.status === "done")
      .map((img) => img.url);

    const newUrls = results.filter((url): url is string => url !== null);

    return [...existingUrls, ...newUrls];
  };

  const removeImage = (index: number) => {
    updateImages((prev) => prev.filter((_, i) => i !== index));
  };

  const isUploading = images.some((img) => img.status === "uploading");
  const isFull = images.length >= maxFiles;

  return { images, error, uploadFiles, removeImage, isUploading, isFull };
}