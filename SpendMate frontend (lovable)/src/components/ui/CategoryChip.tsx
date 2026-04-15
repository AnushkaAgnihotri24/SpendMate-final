import React from 'react';

interface CategoryChipProps {
  icon: string;
  label: string;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

export const CategoryChip: React.FC<CategoryChipProps> = ({
  icon,
  label,
  selected = false,
  onClick,
  className = '',
}) => {
  return (
    <button
      onClick={onClick}
      className={`category-chip flex items-center gap-2 ${selected ? 'selected' : ''} ${className}`}
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </button>
  );
};
