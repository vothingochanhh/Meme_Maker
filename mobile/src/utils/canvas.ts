/**
 * Canvas Utils
 * Senior Rule: Tách biệt logic xử lý canvas để dễ test và maintain
 */

import type { TextOverlay, FilterConfig } from '../types';

/**
 * Vẽ ảnh lên canvas với các filter
 */
export const drawImageOnCanvas = (
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  filter?: FilterConfig
): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Set canvas size theo image
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;

  // Apply filter nếu có
  if (filter && filter.type !== 'none') {
    ctx.filter = getFilterCSSValue(filter);
  }

  // Vẽ image
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  ctx.filter = 'none'; // Reset filter
};

/**
 * Vẽ text overlays lên canvas
 */
export const drawTextOverlays = (
  canvas: HTMLCanvasElement,
  textOverlays: TextOverlay[]
): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  textOverlays.forEach((overlay) => {
    ctx.save();
    
    // Apply transformation
    ctx.translate(overlay.x, overlay.y);
    ctx.rotate((overlay.rotation * Math.PI) / 180);

    // Set font style
    ctx.font = `${overlay.fontSize}px ${overlay.fontFamily}`;
    ctx.fillStyle = overlay.color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Draw stroke
    if (overlay.strokeWidth > 0) {
      ctx.strokeStyle = overlay.strokeColor;
      ctx.lineWidth = overlay.strokeWidth;
      ctx.strokeText(overlay.text, 0, 0);
    }

    // Draw fill text
    ctx.fillText(overlay.text, 0, 0);
    
    ctx.restore();
  });
};

/**
 * Convert filter config sang CSS filter value
 */
const getFilterCSSValue = (filter: FilterConfig): string => {
  switch (filter.type) {
    case 'grayscale':
      return `grayscale(${filter.value}%)`;
    case 'sepia':
      return `sepia(${filter.value}%)`;
    case 'brightness':
      return `brightness(${filter.value}%)`;
    case 'contrast':
      return `contrast(${filter.value}%)`;
    case 'saturate':
      return `saturate(${filter.value}%)`;
    case 'blur':
      return `blur(${filter.value}px)`;
    default:
      return 'none';
  }
};

/**
 * Export canvas sang Blob để lưu hoặc chia sẻ
 */
export const canvasToBlob = (canvas: HTMLCanvasElement): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Failed to convert canvas to blob'));
      }
    }, 'image/jpeg', 0.95);
  });
};

/**
 * Resize canvas theo preset frame
 */
export const resizeCanvas = (
  canvas: HTMLCanvasElement,
  targetWidth: number,
  targetHeight: number
): HTMLCanvasElement => {
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = targetWidth;
  tempCanvas.height = targetHeight;

  const ctx = tempCanvas.getContext('2d');
  if (!ctx) return canvas;

  ctx.drawImage(canvas, 0, 0, targetWidth, targetHeight);
  return tempCanvas;
};
