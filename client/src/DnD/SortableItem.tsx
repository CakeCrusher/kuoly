import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Item } from "./Item";

export const SortableItem = (props: any) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: props.id,
      transition: {
        duration: 150,
        easing: "ease-in-out",
      },
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    width: "400px",
    height: "100px",
    border: "1px solid blue",
    display: props.hide ? "none" : "block",
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {props.id}
    </div>
  );
};
