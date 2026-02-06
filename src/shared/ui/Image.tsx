import React, { useEffect, useState } from "react";

type ImageProps = Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src?: string | null;
  placeholder?: string;
};

export function Image({
  src,
  alt,
  onError,
  placeholder = '../assets/CharacterPlaceHolder.png',
  ...rest
}: ImageProps) {
  const initial = src && src.trim() ? src : placeholder;
  const [currentSrc, setCurrentSrc] = useState<string>(initial);

  useEffect(() => {
    setCurrentSrc(src && src.trim() ? src : placeholder);
  }, [src, placeholder]);

  return (
    <img
      {...rest}
      alt={alt}
      src={currentSrc}
      onError={(e) => {
        if (currentSrc !== placeholder) setCurrentSrc(placeholder);
        onError?.(e);
      }}
    />
  );
}
