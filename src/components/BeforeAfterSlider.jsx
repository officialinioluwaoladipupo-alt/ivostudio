import React, { useState, useRef, useCallback, useEffect } from 'react';

/**
 * BeforeAfterSlider
 * Interactive split-image comparison slider for architectural evolution:
 * ideation sketches/simulations vs. final built resolution.
 * Supports mouse drag, touch drag, keyboard arrows, and responsive resizing.
 */
export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = "Concept / Simulation",
  afterLabel = "Resolved Render",
  aspectRatio = "16/9"
}) {
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleMove = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percentage);
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (isDragging && e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  }, [isDragging, handleMove]);

  const handleMouseMove = useCallback((e) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  }, [isDragging, handleMove]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      setSliderPos((prev) => Math.max(0, prev - 5));
    } else if (e.key === 'ArrowRight') {
      setSliderPos((prev) => Math.min(100, prev + 5));
    }
  };

  return (
    <div className="comparison-wrapper">
      <div
        ref={containerRef}
        className="comparison-container"
        onMouseDown={(e) => {
          setIsDragging(true);
          handleMove(e.clientX);
        }}
        onTouchStart={(e) => {
          if (e.touches[0]) {
            setIsDragging(true);
            handleMove(e.touches[0].clientX);
          }
        }}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        role="slider"
        aria-label="Before and after comparison slider"
        aria-valuenow={Math.round(sliderPos)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        {/* 'After' Image (Base Layer) */}
        <img
          src={afterImage}
          alt={afterLabel}
          className="comparison-img after-img"
          loading="lazy"
        />

        {/* 'Before' Image (Clipped Overlay Layer) */}
        <div
          className="comparison-overlay"
          style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
        >
          <img
            src={beforeImage}
            alt={beforeLabel}
            className="comparison-img before-img"
            loading="lazy"
          />
        </div>

        {/* Divider Handle */}
        <div
          className="comparison-divider"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="divider-line" />
          <div className="divider-handle">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M8 7l-5 5 5 5V7zm8 0v10l5-5-5-5z" />
            </svg>
          </div>
          <div className="divider-line" />
        </div>

        {/* Floating Labels */}
        <div className="comparison-label before-tag" style={{ opacity: sliderPos > 15 ? 1 : 0 }}>
          <span>01 // {beforeLabel}</span>
        </div>
        <div className="comparison-label after-tag" style={{ opacity: sliderPos < 85 ? 1 : 0 }}>
          <span>02 // {afterLabel}</span>
        </div>
      </div>
      <div className="comparison-helper">
        <span>DRAG DIVIDER OR USE ARROW KEYS TO SCRUB EVOLUTION</span>
      </div>
    </div>
  );
}

export default BeforeAfterSlider;
