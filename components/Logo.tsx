
import React from 'react';

export const Logo = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2.5 12C2.5 12 5 6 12 6C19 6 21.5 12 21.5 12C21.5 12 19 18 12 18C5 18 2.5 12 2.5 12Z" />
    <circle cx="12" cy="12" r="3" fill="currentColor" />
    <path d="M12 2V3" />
    <path d="M12 21V22" />
    <path d="M4.92999 4.92999L5.63999 5.63999" />
    <path d="M18.36 18.36L19.07 19.07" />
    <path d="M2 12H3" />
    <path d="M21 12H22" />
    <path d="M4.92999 19.07L5.63999 18.36" />
    <path d="M18.36 5.63999L19.07 4.92999" />
  </svg>
);
