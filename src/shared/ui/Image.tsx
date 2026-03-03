import React from "react";

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
  const currentSrc = src?.trim() ? src : placeholder;

  return (
    <img
      {...rest}
      alt={alt}
      src={currentSrc}
      onError={(e) => {
        onError?.(e);
      }}
    />
  );
}
