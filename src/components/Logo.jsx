import React from 'react';

/**
 * IVO Architectural Geometric Monogram & Wordmark
 * Derived from the modular construction principles in design.md:
 * Base unit u = 4, stroke = 6, sharp corners, controlled negative space.
 */
export function IvoMonogram({ size = 28, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 56 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`ivo-monogram ${className}`}
      aria-hidden="true"
    >
      {/* 'I' - Vertical column */}
      <rect x="0" y="2" width="8" height="36" fill="currentColor" />

      {/* 'V' - Sharp architectural angled blade */}
      <path
        d="M14 2H22.5L28 26L33.5 2H42L32.5 38H23.5L14 2Z"
        fill="currentColor"
      />

      {/* 'O' - Geometric frame with architectural inner counter */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M45 2H56V38H45V2ZM50.5 9.5H50.5C49.67 9.5 49 10.17 49 11V29C49 29.83 49.67 30.5 50.5 30.5C51.33 30.5 52 29.83 52 29V11C52 10.17 51.33 9.5 50.5 9.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function Logo({ variant = "horizontal", onClick, href = "#home" }) {
  const content = (
    <div className={`logo-lockup ${variant}`}>
      <span className="logo-art" role="img" aria-label="IVO logo" />
    </div>
  );

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="logo-btn"
        aria-label="IVO Studio — Back to home"
      >
        {content}
      </button>
    );
  }

  return (
    <a
      href={href}
      className="logo-link"
      aria-label="IVO Studio — Back to home"
    >
      {content}
    </a>
  );
}

export default Logo;
