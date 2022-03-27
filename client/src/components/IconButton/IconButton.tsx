import React from "react";

import "./IconButton.less";

type Props = {
  className?: string;
  label?: string;
  onClick?: (args: any) => void;
  src: string;
};

const IconButton: React.FC<Props> = ({ className, onClick, src, label }) => {
  if (!onClick) {
    return (
      <div className={`icon-button ${className ? className : ""}`}>
        <img src={src} />
        <span>{label}</span>
      </div>
    );
  }
  return (
    <button
      className={`icon-button ${className ? className : ""}`}
      onClick={onClick}
    >
      <img src={src} />
      <span>{label}</span>
    </button>
  );
};

export default IconButton;
