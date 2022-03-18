import React from "react";
import { useDroppable } from "@dnd-kit/core";

export const Droppable = (props: any) => {
  const { isOver, setNodeRef } = useDroppable({
    id: "droppable",
  });

  const style = {
    backgroundColor: isOver ? "red" : "black",
    width: "100px",
    height: "100px",
  };

  return (
    <div ref={setNodeRef} style={style}>
      {props.children}
    </div>
  );
};
