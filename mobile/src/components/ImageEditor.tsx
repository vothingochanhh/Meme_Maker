/**
 * ImageEditor Component
 * Senior Rule: Component nhỏ, tập trung vào UI, logic ở hook
 * Mobile-first: Touch-friendly, responsive
 */

import React, { useRef, useEffect, useState } from 'react';
import type { TextOverlay, FilterConfig } from '../types';
import { drawImageOnCanvas, drawTextOverlays } from '../utils/canvas';
import './ImageEditor.css';

interface ImageEditorProps {
  imageUrl: string;
  textOverlays: TextOverlay[];
  filter: FilterConfig;
  selectedOverlay: string | null;
  onOverlayUpdate: (id: string, updates: Partial<TextOverlay>) => void;
  onOverlaySelect: (id: string | null) => void;
}

export const ImageEditor: React.FC<ImageEditorProps> = ({
  imageUrl,
  textOverlays,
  filter,
  selectedOverlay,
  onOverlayUpdate,
  onOverlaySelect,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Render canvas khi có thay đổi
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageUrl) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // Tính scale để fit vào container
      const container = containerRef.current;
      if (container) {
        const containerWidth = container.clientWidth;
        const scaleRatio = containerWidth / img.naturalWidth;
        setScale(scaleRatio);
      }

      drawImageOnCanvas(canvas, img, filter);
      drawTextOverlays(canvas, textOverlays);
    };
    img.src = imageUrl;
  }, [imageUrl, textOverlays, filter]);

  // Handle touch/mouse events cho drag text
  const handlePointerDown = (e: React.PointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;

    // Kiểm tra xem có click vào text overlay nào không
    const clickedOverlay = textOverlays.find((overlay) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return false;

      ctx.font = `${overlay.fontSize}px ${overlay.fontFamily}`;
      const metrics = ctx.measureText(overlay.text);
      const width = metrics.width;
      const height = overlay.fontSize;

      return (
        x >= overlay.x - width / 2 &&
        x <= overlay.x + width / 2 &&
        y >= overlay.y - height / 2 &&
        y <= overlay.y + height / 2
      );
    });

    if (clickedOverlay) {
      setIsDragging(true);
      setDragStart({ x, y });
      onOverlaySelect(clickedOverlay.id);
    } else {
      onOverlaySelect(null);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !selectedOverlay) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;

    const dx = x - dragStart.x;
    const dy = y - dragStart.y;

    const overlay = textOverlays.find((o) => o.id === selectedOverlay);
    if (overlay) {
      onOverlayUpdate(selectedOverlay, {
        x: overlay.x + dx,
        y: overlay.y + dy,
      });
      setDragStart({ x, y });
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  return (
    <div ref={containerRef} className="image-editor-container">
      <canvas
        ref={canvasRef}
        className="image-editor-canvas"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      />
    </div>
  );
};
