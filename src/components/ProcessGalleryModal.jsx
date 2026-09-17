import React, { useState } from 'react';
import { X, ZoomIn, ArrowLeft, ArrowRight } from 'lucide-react';

/**
 * ProcessGalleryModal
 * Modal and Lightbox for physical study models, hand sketches, and structural tests.
 */
export function ProcessGalleryModal({ items = [], isOpen, onClose, initialIndex = 0 }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  if (!isOpen || items.length === 0) return null;

  const current = items[currentIndex] || items[0];

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label="Process Gallery Lightbox">
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-index">
            <span>PLATE {String(currentIndex + 1).padStart(2, '0')} // {String(items.length).padStart(2, '0')}</span>
            <span className="modal-title">{current.title}</span>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close process gallery">
            <X size={20} />
          </button>
        </div>

        <div className="modal-image-stage">
          <img src={current.url} alt={current.title} className="modal-image" />
          {items.length > 1 && (
            <>
              <button className="modal-nav prev" onClick={handlePrev} aria-label="Previous plate">
                <ArrowLeft size={20} />
              </button>
              <button className="modal-nav next" onClick={handleNext} aria-label="Next plate">
                <ArrowRight size={20} />
              </button>
            </>
          )}
        </div>

        <div className="modal-footer">
          <p className="modal-notes">{current.notes || current.caption || 'Archival study documentation.'}</p>
          <span className="modal-meta">IVO STUDIO // PHYSICAL ARCHIVE</span>
        </div>
      </div>
    </div>
  );
}

export default ProcessGalleryModal;
