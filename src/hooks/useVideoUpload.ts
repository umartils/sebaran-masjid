'use client';
import { useState, useRef } from 'react';

export interface UploadedVideo {
  url: string;
  publicId: string;
  preview: string;
  name: string;
  status: 'uploading' | 'done' | 'error';
  progress: number;
}

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
const ALLOWED_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];
const MAX_SIZE = 50 * 1024 * 1024; // 50MB, sesuaikan sama limit preset Cloudinary

export function useMultiVideoUpload(maxFiles = 5, folder = 'masjid-video', existingCount = 0) {
  const [videos, setVideos] = useState<UploadedVideo[]>([]);
  const [error, setError] = useState('');

  const videosRef = useRef<UploadedVideo[]>([]);

  const updateVideos = (
    updater: (prev: UploadedVideo[]) => UploadedVideo[]
  ) => {
    setVideos((prev) => {
      const next = updater(prev);
      videosRef.current = next;
      return next;
    });
  };

  const uploadOne = (file: File, stateIndex: number): Promise<string | null> => {
    return new Promise((resolve) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', UPLOAD_PRESET!);
      formData.append('folder', folder);

      const xhr = new XMLHttpRequest();
      xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const pct = Math.round((e.loaded / e.total) * 100);
          updateVideos((prev) =>
            prev.map((v, i) => (i === stateIndex ? { ...v, progress: pct } : v))
          );
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const data = JSON.parse(xhr.responseText);
          updateVideos((prev) =>
            prev.map((v, i) =>
              i === stateIndex
                ? { ...v, url: data.secure_url, publicId: data.public_id, status: 'done', progress: 100 }
                : v
            )
          );
          resolve(data.secure_url as string);
        } else {
          updateVideos((prev) =>
            prev.map((v, i) => (i === stateIndex ? { ...v, status: 'error' } : v))
          );
          resolve(null);
        }
      };

      xhr.onerror = () => {
        updateVideos((prev) =>
          prev.map((v, i) => (i === stateIndex ? { ...v, status: 'error' } : v))
        );
        resolve(null);
      };

      xhr.send(formData);
    });
  };

  const uploadFiles = async (files: File[]): Promise<string[]> => {
    const current = videosRef.current;

    if (existingCount + current.length + files.length > maxFiles) {
      setError(`Maksimal ${maxFiles} video`);
      return current.filter((v) => v.status === 'done').map((v) => v.url);
    }

    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      setError('Konfigurasi Cloudinary belum lengkap');
      return current.filter((v) => v.status === 'done').map((v) => v.url);
    }

    setError('');
    const startIndex = current.length;

    const newEntries: UploadedVideo[] = files.map((file) => ({
      url: '',
      publicId: '',
      preview: URL.createObjectURL(file),
      name: file.name,
      status: 'uploading',
      progress: 0,
    }));

    updateVideos((prev) => [...prev, ...newEntries]);

    const results = await Promise.all(
      files.map((file, index) => {
        const stateIndex = startIndex + index;

        if (!ALLOWED_TYPES.includes(file.type) || file.size > MAX_SIZE) {
          updateVideos((prev) =>
            prev.map((v, i) => (i === stateIndex ? { ...v, status: 'error' } : v))
          );
          return Promise.resolve(null);
        }

        return uploadOne(file, stateIndex);
      })
    );

    // const existingUrls = current.filter((v) => v.status === 'done').map((v) => v.url);
    // const newUrls = results.filter((url): url is string => url !== null);

    // return [...existingUrls, ...newUrls];

    return results.filter((url): url is string => url !== null);
  };

  const removeVideo = (index: number) => {
    updateVideos((prev) => prev.filter((_, i) => i !== index));
  };

  const clearDone = () => {
    updateVideos((prev) => prev.filter((v) => v.status !== 'done'))
  }

  const isUploading = videos.some((v) => v.status === 'uploading');
  const isFull = existingCount + videos.length >= maxFiles;

  return { videos, error, uploadFiles, removeVideo, clearDone, isUploading, isFull };
}