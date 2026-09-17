import React from 'react';

/**
 * Architectural Grid & Technical Overlay
 * Renders technical datum lines, corner crop marks, coordinates, and scale ticks.
 */
export function ArchitecturalGrid({ showAxes = true }) {
  return (
    <div className="architectural-grid-overlay" aria-hidden="true">
      {/* Background modular grid */}
      <div className="grid-lines" />

      {/* Technical corner crop marks */}
      <div className="crop-mark top-left" />
      <div className="crop-mark top-right" />
      <div className="crop-mark bottom-left" />
      <div className="crop-mark bottom-right" />

      {/* Geographic datum annotations */}
      {showAxes && (
        <div className="datum-markers">
          <span className="datum-axis x-axis">AXIS — X // 1:100</span>
          <span className="datum-axis y-axis">AXIS — Y // SECTION A-A'</span>
        </div>
      )}
    </div>
  );
}

export default ArchitecturalGrid;
