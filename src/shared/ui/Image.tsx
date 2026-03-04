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
  loading = "lazy",
  decoding = "async",
  ...rest
}: ImageProps) {
  const currentSrc = src?.trim() ? src : placeholder;

  return (
    <img
      {...rest}
      alt={alt}
      src={currentSrc}
      loading={loading}
      decoding={decoding}
      onError={(e) => {
        onError?.(e);
      }}
    />
  );
}
