/**
 * MemeEditor Page
 * Senior Rule: Page component kết hợp các component nhỏ
 * Mobile-first: Full-screen editor với bottom sheet controls
 */

import React, { useState } from 'react';
import { useMemeEditor } from '../hooks/useMemeEditor';
import { ImageEditor } from '../components/ImageEditor';
import { TextControls } from '../components/TextControls';
import { FilterControls } from '../components/FilterControls';
import './MemeEditor.css';

export const MemeEditor: React.FC = () => {
  const {
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
    saveMeme,
    shareMeme,
    reset,
  } = useMemeEditor();

  const [activeTab, setActiveTab] = useState<'text' | 'filter'>('text');

  const selectedOverlayData = textOverlays.find((o) => o.id === selectedOverlay);

  return (
    <div className="meme-editor">
      {/* Header */}
      <header className="meme-editor-header">
        <h1>Meme Maker</h1>
        {imageUrl && (
          <button onClick={reset} className="reset-button">
            New
          </button>
        )}
      </header>

      {/* Main Content */}
      <main className="meme-editor-main">
        {!imageUrl ? (
          <div className="empty-state">
            <div className="empty-state-content">
              <h2>Create Your Meme</h2>
              <p>Start by selecting an image from your gallery</p>
              <button onClick={loadImage} className="primary-button" disabled={isLoading}>
                {isLoading ? 'Loading...' : 'Choose Image'}
              </button>
            </div>
          </div>
        ) : (
          <div className="editor-container">
            <ImageEditor
              imageUrl={imageUrl}
              textOverlays={textOverlays}
              filter={filter}
              selectedOverlay={selectedOverlay}
              onOverlayUpdate={updateTextOverlay}
              onOverlaySelect={selectOverlay}
            />
          </div>
        )}
      </main>

      {/* Bottom Controls */}
      {imageUrl && (
        <div className="meme-editor-bottom">
          {/* Action Buttons */}
          <div className="action-buttons">
            <button onClick={addTextOverlay} className="action-button">
              ➕ Add Text
            </button>
            <button onClick={saveMeme} className="action-button" disabled={isLoading}>
              💾 Save
            </button>
            <button onClick={shareMeme} className="action-button" disabled={isLoading}>
              📤 Share
            </button>
          </div>

          {/* Tabs */}
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'text' ? 'active' : ''}`}
              onClick={() => setActiveTab('text')}
            >
              Text
            </button>
            <button
              className={`tab ${activeTab === 'filter' ? 'active' : ''}`}
              onClick={() => setActiveTab('filter')}
            >
              Filter
            </button>
          </div>

          {/* Controls Panel */}
          <div className="controls-panel">
            {activeTab === 'text' && selectedOverlayData && (
              <TextControls
                overlay={selectedOverlayData}
                onUpdate={(updates) => updateTextOverlay(selectedOverlay!, updates)}
                onDelete={() => deleteTextOverlay(selectedOverlay!)}
              />
            )}

            {activeTab === 'text' && !selectedOverlayData && (
              <div className="empty-controls">
                <p>Tap on text to edit, or add new text</p>
              </div>
            )}

            {activeTab === 'filter' && (
              <FilterControls filter={filter} onFilterChange={setFilter} />
            )}
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner" />
        </div>
      )}

      {/* Error Toast */}
      {error && (
        <div className="error-toast">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};
