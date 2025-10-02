/**
 * Custom Hook: useMemeEditor
 * Senior Rule: Tách business logic ra khỏi UI component
 * Quản lý state và logic của meme editor
 */

import { useState, useCallback } from 'react';
import type { TextOverlay, FilterConfig } from '../types';
import { drawImageOnCanvas, drawTextOverlays, canvasToBlob } from '../utils/canvas';
import { pickImageFromGallery, saveImageToDevice, shareImage } from '../utils/capacitor';

interface UseMemeEditorReturn {
  // State
  imageUrl: string | null;
  textOverlays: TextOverlay[];
  selectedOverlay: string | null;
  filter: FilterConfig;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadImage: () => Promise<void>;
  addTextOverlay: () => void;
  updateTextOverlay: (id: string, updates: Partial<TextOverlay>) => void;
  deleteTextOverlay: (id: string) => void;
  selectOverlay: (id: string | null) => void;
  setFilter: (filter: FilterConfig) => void;
  exportMeme: () => Promise<Blob | null>;
  saveMeme: () => Promise<void>;
  shareMeme: () => Promise<void>;
  reset: () => void;
}

export const useMemeEditor = (): UseMemeEditorReturn => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [textOverlays, setTextOverlays] = useState<TextOverlay[]>([]);
  const [selectedOverlay, setSelectedOverlay] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterConfig>({ type: 'none', value: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load image từ gallery
   */
  const loadImage = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const url = await pickImageFromGallery();
      setImageUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load image');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Thêm text overlay mới
   */
  const addTextOverlay = useCallback(() => {
    const newOverlay: TextOverlay = {
      id: `overlay-${Date.now()}`,
      text: 'Tap to edit',
      x: 200,
      y: 100,
      fontSize: 48,
      fontFamily: 'Impact, sans-serif',
      color: '#FFFFFF',
      strokeColor: '#000000',
      strokeWidth: 3,
      rotation: 0,
    };
    
    setTextOverlays((prev) => [...prev, newOverlay]);
    setSelectedOverlay(newOverlay.id);
  }, []);

  /**
   * Update text overlay
   */
  const updateTextOverlay = useCallback((id: string, updates: Partial<TextOverlay>) => {
    setTextOverlays((prev) =>
      prev.map((overlay) =>
        overlay.id === id ? { ...overlay, ...updates } : overlay
      )
    );
  }, []);

  /**
   * Xóa text overlay
   */
  const deleteTextOverlay = useCallback((id: string) => {
    setTextOverlays((prev) => prev.filter((overlay) => overlay.id !== id));
    if (selectedOverlay === id) {
      setSelectedOverlay(null);
    }
  }, [selectedOverlay]);

  /**
   * Select overlay để edit
   */
  const selectOverlay = useCallback((id: string | null) => {
    setSelectedOverlay(id);
  }, []);

  /**
   * Export meme sang Blob
   */
  const exportMeme = useCallback(async (): Promise<Blob | null> => {
    if (!imageUrl) {
      setError('No image loaded');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Create canvas
      const canvas = document.createElement('canvas');
      const img = new Image();
      img.crossOrigin = 'anonymous';

      // Load image
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = imageUrl;
      });

      // Draw image with filter
      drawImageOnCanvas(canvas, img, filter);

      // Draw text overlays
      drawTextOverlays(canvas, textOverlays);

      // Convert to blob
      const blob = await canvasToBlob(canvas);
      return blob;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export meme');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [imageUrl, textOverlays, filter]);

  /**
   * Lưu meme vào device
   */
  const saveMeme = useCallback(async () => {
    const blob = await exportMeme();
    if (!blob) return;

    setIsLoading(true);
    
    try {
      const filename = `meme_${Date.now()}.jpg`;
      await saveImageToDevice(blob, filename);
      alert('Meme saved successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save meme');
    } finally {
      setIsLoading(false);
    }
  }, [exportMeme]);

  /**
   * Share meme
   */
  const shareMeme = useCallback(async () => {
    const blob = await exportMeme();
    if (!blob) return;

    setIsLoading(true);
    
    try {
      await shareImage(blob, 'Check out my meme!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to share meme');
    } finally {
      setIsLoading(false);
    }
  }, [exportMeme]);

  /**
   * Reset editor
   */
  const reset = useCallback(() => {
    setImageUrl(null);
    setTextOverlays([]);
    setSelectedOverlay(null);
    setFilter({ type: 'none', value: 0 });
    setError(null);
  }, []);

  return {
    imageUrl,
    textOverlays,
    selectedOverlay,
    filter,
    isLoading,
    error,
    loadImage,
    addTextOverlay,
    updateTextOverlay,
    deleteTextOverlay,
    selectOverlay,
    setFilter,
    exportMeme,
    saveMeme,
    shareMeme,
    reset,
  };
};
