/**
 * TextControls Component
 * Senior Rule: Component nhỏ, focused, reusable
 * Mobile-friendly controls cho text editing
 */

import React from 'react';
import type { TextOverlay } from '../types';
import './TextControls.css';

interface TextControlsProps {
  overlay: TextOverlay;
  onUpdate: (updates: Partial<TextOverlay>) => void;
  onDelete: () => void;
}

export const TextControls: React.FC<TextControlsProps> = ({
  overlay,
  onUpdate,
  onDelete,
}) => {
  return (
    <div className="text-controls">
      <div className="text-controls-section">
        <label htmlFor="text-input">Text:</label>
        <input
          id="text-input"
          type="text"
          value={overlay.text}
          onChange={(e) => onUpdate({ text: e.target.value })}
          className="text-input"
          placeholder="Enter text..."
        />
      </div>

      <div className="text-controls-section">
        <label htmlFor="font-size">Font Size: {overlay.fontSize}px</label>
        <input
          id="font-size"
          type="range"
          min="20"
          max="120"
          value={overlay.fontSize}
          onChange={(e) => onUpdate({ fontSize: Number(e.target.value) })}
          className="slider"
        />
      </div>

      <div className="text-controls-section">
        <label htmlFor="text-color">Text Color:</label>
        <input
          id="text-color"
          type="color"
          value={overlay.color}
          onChange={(e) => onUpdate({ color: e.target.value })}
          className="color-input"
        />
      </div>

      <div className="text-controls-section">
        <label htmlFor="stroke-color">Stroke Color:</label>
        <input
          id="stroke-color"
          type="color"
          value={overlay.strokeColor}
          onChange={(e) => onUpdate({ strokeColor: e.target.value })}
          className="color-input"
        />
      </div>

      <div className="text-controls-section">
        <label htmlFor="stroke-width">Stroke Width: {overlay.strokeWidth}px</label>
        <input
          id="stroke-width"
          type="range"
          min="0"
          max="10"
          value={overlay.strokeWidth}
          onChange={(e) => onUpdate({ strokeWidth: Number(e.target.value) })}
          className="slider"
        />
      </div>

      <div className="text-controls-section">
        <label htmlFor="rotation">Rotation: {overlay.rotation}°</label>
        <input
          id="rotation"
          type="range"
          min="-180"
          max="180"
          value={overlay.rotation}
          onChange={(e) => onUpdate({ rotation: Number(e.target.value) })}
          className="slider"
        />
      </div>

      <button onClick={onDelete} className="delete-button">
        Delete Text
      </button>
    </div>
  );
};
