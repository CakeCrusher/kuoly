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
    opacity: props.hide ? 0 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div {...listeners} {...attributes}>
        handle
      </div>
      {props.id}
    </div>
  );
};
