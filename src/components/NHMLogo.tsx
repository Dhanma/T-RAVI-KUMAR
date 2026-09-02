import React from 'react';

interface NHMLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const NHMLogo: React.FC<NHMLogoProps> = ({ 
  className = '', 
  size = 'md',
  showText = true 
}) => {
  const sizeMap = {
    sm: { imgClass: 'w-12 h-12', title: 'text-xs', sub: 'text-[9px]' },
    md: { imgClass: 'w-16 h-16', title: 'text-sm', sub: 'text-[10px]' },
    lg: { imgClass: 'w-24 h-24', title: 'text-base', sub: 'text-xs' },
    xl: { imgClass: 'w-32 h-32', title: 'text-lg', sub: 'text-xs' },
  };

  const selectedSize = sizeMap[size] || sizeMap.md;

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Official NHM Logo Image */}
      <img
        src="/nhm-logo.svg"
        alt="National Health Mission - राष्ट्रीय स्वास्थ्य मिशन"
        className={`${selectedSize.imgClass} object-contain flex-shrink-0 drop-shadow-xs`}
        loading="eager"
      />

      {showText && (
        <div className="flex flex-col text-left leading-tight">
          <span className="font-extrabold text-slate-900 tracking-tight font-display text-sm sm:text-base">
            राष्ट्रीय स्वास्थ्य मिशन
          </span>
          <span className="font-bold text-red-600 text-[11px] sm:text-xs tracking-wider uppercase">
            NATIONAL HEALTH MISSION
          </span>
          <span className="text-[9.5px] sm:text-[10px] text-slate-500 font-medium">
            Ministry of Health & Family Welfare &bull; Govt. of India
          </span>
        </div>
      )}
    </div>
  );
};
