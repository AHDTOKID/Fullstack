import { useState } from 'react';

export default function StarRating({ value, onChange, readOnly = false }) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors
            ${
              readOnly
                ? 'cursor-default'
                : 'bg-surface-container-low hover:bg-surface-container-high cursor-pointer'
            }`}
          onClick={() => !readOnly && onChange(star)}
          onMouseEnter={() => !readOnly && setHovered(star)}
          onMouseLeave={() => !readOnly && setHovered(0)}
        >
          <span
            className="material-symbols-outlined text-on-tertiary-container"
            style={{
              fontVariationSettings: `'FILL' ${(hovered || value) >= star ? 1 : 0}`,
            }}
          >
            star
          </span>
        </button>
      ))}
    </div>
  );
}
