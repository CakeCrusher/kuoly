import { useSortable } from "@dnd-kit/sortable";
import React from "react";
import { IconButton } from "..";

import { X } from "../../assets";

import "./Label.less";

type LabelProps = {
  isEditing?: boolean;
  label: Label;
  faint?: boolean;
  deleteLabel?: (id: string) => void;
  onClick?: () => void;
  className?: string;
  hide?: boolean;
};

const Label: React.FC<LabelProps> = ({
  isEditing,
  faint,
  deleteLabel,
  label,
  onClick,
  hide,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: label.id,
      transition: {
        duration: 150,
        easing: "ease-in-out",
      },
      disabled: !isEditing,
    });
  const handleDeleteClick = () => {
    if (deleteLabel) {
      deleteLabel(label.id);
    }
  };
  const handleClick = () => {
    if (onClick) onClick();
  };
  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : "",
    transition,
  };

  return (
    <div
      onClick={handleClick}
      className={`label f-center ${
        isEditing && deleteLabel ? "show-delete" : ""
      } ${hide ? "hide" : faint && "faint"}`}
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
    >
      <span>{label.name}</span>

      <IconButton
        className="delete-label"
        src={X}
        onClick={handleDeleteClick}
      />
    </div>
  );
};

export default Label;
