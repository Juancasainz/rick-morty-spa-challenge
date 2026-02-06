import React, { useState } from "react";
import placeholder from "../assets/placeholder.jpg";

export function Image({ src, alt, onError, ...rest }: React.ImgHTMLAttributes<HTMLImageElement>){
  const [currentSrc, setCurrentSrc] = useState(src);

  return (
    <img
      {...rest}
      src={currentSrc}
      onError={(e) => {
        if (currentSrc !== placeholder) setCurrentSrc(placeholder);
        onError?.(e);
      }}
    />
  );
}