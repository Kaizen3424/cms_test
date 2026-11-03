import React, { useState } from 'react';

// Reliable high-resolution expedition photographs matching the destinations
export const DESTINATION_FALLBACKS: Record<string, string> = {
  ladakh:
    'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1600&q=80',
  lofoten:
    'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1600&q=80',
  'wadi-rum':
    'https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=1600&q=80',
  kyoto:
    'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=80',
  oaxaca:
    'https://images.unsplash.com/photo-1518638150340-f706e86654de?auto=format&fit=crop&w=1600&q=80',
  'faroe-islands':
    'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1600&q=80',
  iceland:
    'https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=1600&q=80',
  scotland:
    'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1600&q=80',
  italy:
    'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1600&q=80',
  morocco:
    'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&w=1600&q=80',
  chile:
    'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?auto=format&fit=crop&w=1600&q=80',
  'new-zealand':
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1600&q=80',
};

interface AtlasImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  placeId?: string;
  fallbackUrl?: string;
}

export const AtlasImage: React.FC<AtlasImageProps> = ({
  src,
  alt = 'Expedition photograph',
  placeId,
  fallbackUrl,
  className = '',
  ...props
}) => {
  const [currentSrc, setCurrentSrc] = useState<string>(src || '');
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      const fallback =
        fallbackUrl ||
        (placeId ? DESTINATION_FALLBACKS[placeId] : '') ||
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80';
      setCurrentSrc(fallback);
    }
  };

  return (
    <img
      src={currentSrc}
      alt={alt}
      onError={handleError}
      referrerPolicy="no-referrer"
      crossOrigin="anonymous"
      loading="lazy"
      className={className}
      {...props}
    />
  );
};
