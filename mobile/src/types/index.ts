/**
 * Types cho Meme Maker App
 * Senior Rule: Định nghĩa rõ ràng các type để đảm bảo type safety
 */

export interface TextOverlay {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  strokeColor: string;
  strokeWidth: number;
  rotation: number;
}

export interface MemeConfig {
  imageUrl: string;
  textOverlays: TextOverlay[];
  filter?: string;
  preset?: PresetFrame;
}

export interface PresetFrame {
  name: string;
  aspectRatio: number; // e.g., 1 for square, 1.91 for landscape
  width: number;
  height: number;
}

export type FilterType = 
  | 'none'
  | 'grayscale'
  | 'sepia'
  | 'brightness'
  | 'contrast'
  | 'saturate'
  | 'blur';

export interface FilterConfig {
  type: FilterType;
  value: number;
}
