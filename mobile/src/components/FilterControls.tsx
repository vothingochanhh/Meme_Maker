/**
 * FilterControls Component
 * Senior Rule: Component tái sử dụng, độc lập
 * Mobile-first: Touch-friendly filter selection
 */

import React from 'react';
import type { FilterConfig, FilterType } from '../types';
import './FilterControls.css';

interface FilterControlsProps {
  filter: FilterConfig;
  onFilterChange: (filter: FilterConfig) => void;
}

const FILTER_OPTIONS: { type: FilterType; label: string }[] = [
  { type: 'none', label: 'None' },
  { type: 'grayscale', label: 'Grayscale' },
  { type: 'sepia', label: 'Sepia' },
  { type: 'brightness', label: 'Brightness' },
  { type: 'contrast', label: 'Contrast' },
  { type: 'saturate', label: 'Saturate' },
  { type: 'blur', label: 'Blur' },
];

export const FilterControls: React.FC<FilterControlsProps> = ({
  filter,
  onFilterChange,
}) => {
  const getDefaultValue = (type: FilterType): number => {
    if (type === 'none') return 0;
    if (type === 'blur') return 5;
    return 100;
  };

  const getMaxValue = (type: FilterType): number => {
    if (type === 'blur') return 20;
    return 200;
  };

  return (
    <div className="filter-controls">
      <div className="filter-controls-section">
        <label htmlFor="filter-type">Filter:</label>
        <select
          id="filter-type"
          value={filter.type}
          onChange={(e) => {
            const newType = e.target.value as FilterType;
            onFilterChange({
              type: newType,
              value: getDefaultValue(newType),
            });
          }}
          className="filter-select"
        >
          {FILTER_OPTIONS.map((option) => (
            <option key={option.type} value={option.type}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {filter.type !== 'none' && (
        <div className="filter-controls-section">
          <label htmlFor="filter-value">
            Intensity: {filter.value}
            {filter.type === 'blur' ? 'px' : '%'}
          </label>
          <input
            id="filter-value"
            type="range"
            min="0"
            max={getMaxValue(filter.type)}
            value={filter.value}
            onChange={(e) =>
              onFilterChange({
                ...filter,
                value: Number(e.target.value),
              })
            }
            className="slider"
          />
        </div>
      )}
    </div>
  );
};
