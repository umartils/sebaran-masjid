'use client';
import { useState, useRef } from 'react';

export interface UploadedImage {
  url: string;
  publicId: string;
  preview: string;
  name: string;
  status: 'uploading' | 'done' | 'error';
}

export function useMultiImageUpload(
  maxFiles = 5,
  folder = "masjid",
  existingCount = 0 // ✅ jumlah foto yang SUDAH final (dari existingUrls di parent)
) {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [error, setError] = useState("");
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
    const current = imagesRef.current;

    // ✅ batas dihitung dari total: existing + pending sesi ini + file baru
    if (existingCount + current.length + files.length > maxFiles) {
      setError(`Maksimal ${maxFiles} gambar`);
      return [];
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
            prev.map((img, i) => (i === stateIndex ? { ...img, status: "error" } : img))
          );
          return null;
        }

        try {
          const formData = new FormData();
          formData.append("image", file);
          formData.append("folder", folder);

          const res = await fetch("/api/upload", { method: "POST", body: formData });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error);

          updateImages((prev) =>
            prev.map((img, i) =>
              i === stateIndex
                ? { ...img, url: data.url, publicId: data.public_id, status: "done" }
                : img
            )
          );

          return data.url as string;
        } catch {
          updateImages((prev) =>
            prev.map((img, i) => (i === stateIndex ? { ...img, status: "error" } : img))
          );
          return null;
        }
      })
    );

    // ✅ hanya kembalikan URL baru dari batch ini — bukan digabung dengan yang lama
    return results.filter((url): url is string => url !== null);
  };

  const removeImage = (index: number) => {
    updateImages((prev) => prev.filter((_, i) => i !== index));
  };

  // ✅ buang entry yang sudah "done" & sudah disinkronkan ke parent,
  // supaya images tidak menumpuk jadi log permanen
  const clearDone = () => {
    updateImages((prev) => prev.filter((img) => img.status !== "done"));
  };

  const isUploading = images.some((img) => img.status === "uploading");
  const isFull = existingCount + images.length >= maxFiles;

  return { images, error, uploadFiles, removeImage, clearDone, isUploading, isFull };
}