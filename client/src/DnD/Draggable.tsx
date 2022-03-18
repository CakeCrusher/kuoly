import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

export const Draggable = (props: any) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: "draggable",
  });

  const style = transform
    ? {
        transform: CSS.Translate.toString(transform),
        width: "50px",
        height: "50px",
        backgroundColor: "blue",
      }
    : {
        width: "50px",
        height: "50px",
        backgroundColor: "blue",
      };

  return (
    <button ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <div>asd</div>
      {props.children}
    </button>
  );
};
